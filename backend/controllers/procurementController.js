const { getDb } = require("../config/db");

// POST /api/procurement (Officer Only)
exports.completeProcurement = async (req, res) => {
  try {
    const { bookingId, quantityBrought, acceptedQuantity, quality, pricePerKg, remarks } = req.body;

    if (!bookingId || quantityBrought === undefined || acceptedQuantity === undefined || !quality || !pricePerKg) {
      return res.status(400).json({ success: false, message: "Missing required procurement fields" });
    }

    const numBrought = parseFloat(quantityBrought);
    const numAccepted = parseFloat(acceptedQuantity);
    const numPrice = parseFloat(pricePerKg);

    if (numAccepted > numBrought) {
      return res.status(400).json({ success: false, message: "Accepted quantity cannot be greater than quantity brought" });
    }

    if (numPrice <= 0) {
      return res.status(400).json({ success: false, message: "Price per Kg must be greater than zero" });
    }

    const grossAmount = numAccepted * numPrice;
    const mandiCess = grossAmount * 0.01; // 1% APMC User Cess
    const handlingFee = 250.0;
    const unloadingFee = 150.0;
    const netPayable = grossAmount - mandiCess - handlingFee - unloadingFee;

    const db = getDb();
    const bookings = db.collection("bookings");
    const procurements = db.collection("procurements");
    const payments = db.collection("payments");
    const users = db.collection("users");

    let booking = await bookings.findOne({ bookingId });
    if (!booking) {
      booking = await bookings.findOne({ _id: bookingId });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const farmer = await users.findOne({ _id: booking.userId }) || {};

    const totalProcCount = await procurements.countDocuments();
    const procurementId = `PR-2026-${1001 + totalProcCount}`;

    const newProcurement = {
      procurementId,
      bookingId: booking.bookingId,
      userId: booking.userId,
      crop: booking.crop,
      quantityBrought: numBrought,
      acceptedQuantity: numAccepted,
      quality,
      pricePerKg: numPrice,
      grossAmount,
      mandiCess,
      handlingFee,
      unloadingFee,
      netPayable,
      status: "COMPLETED",
      remarks: remarks || "Standard procurement completed",
      createdAt: new Date(),
      completedAt: new Date()
    };

    const resProc = await procurements.insertOne(newProcurement);

    // Update booking status to COMPLETED
    await bookings.updateOne(
      { _id: booking._id },
      { $set: { status: "COMPLETED", completedAt: new Date() } }
    );

    // Generate Payment Invoice Record
    const totalPayCount = await payments.countDocuments();
    const paymentId = `PAY-2026-${10001 + totalPayCount}`;
    const invoiceNo = `AQ-INV-2026-${9000 + totalPayCount}`;
    const transactionReference = `UTR-SBIN2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPayment = {
      paymentId,
      invoiceNo,
      bookingId: booking.bookingId,
      userId: booking.userId,
      farmerName: farmer.name || "Ravi Kumar",
      farmerMobile: farmer.mobile || "9876543210",
      farmerAadhaarLast4: farmer.aadhaarLast4 || "9012",
      bankName: farmer.bankName || "State Bank of India",
      accountNumber: farmer.accountNumber || "98765432101234",
      ifscCode: farmer.ifscCode || "SBIN0004123",
      upiId: farmer.upiId || "farmer@upi",
      mandiName: booking.centre || "Main Procurement Centre",
      crop: booking.crop,
      quantityBrought: numBrought,
      acceptedQuantity: numAccepted,
      quality,
      pricePerKg: numPrice,
      grossAmount,
      mandiCess,
      handlingFee,
      unloadingFee,
      amount: netPayable, // Net payable
      status: "PENDING",
      transactionReference,
      createdAt: new Date(),
      paymentDate: null
    };

    await payments.insertOne(newPayment);

    return res.status(201).json({
      success: true,
      message: "Procurement completed and official payment invoice generated!",
      procurement: { ...newProcurement, _id: resProc.insertedId },
      payment: newPayment
    });
  } catch (err) {
    console.error("Complete Procurement Error:", err);
    return res.status(500).json({ success: false, message: "Server error completing procurement" });
  }
};

// PUT /api/procurement/:id (Start procurement - update status to IN_PROGRESS)
exports.updateProcurementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDb();
    const bookings = db.collection("bookings");

    let booking = await bookings.findOne({ bookingId: id });
    if (!booking) {
      booking = await bookings.findOne({ _id: id });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    await bookings.updateOne(
      { _id: booking._id },
      { $set: { status: status || "IN_PROGRESS" } }
    );

    return res.json({
      success: true,
      message: `Procurement status updated to ${status || "IN_PROGRESS"}`,
      status: status || "IN_PROGRESS"
    });
  } catch (err) {
    console.error("Update Procurement Status Error:", err);
    return res.status(500).json({ success: false, message: "Server error updating status" });
  }
};

// GET /api/procurement/:bookingId
exports.getProcurementByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const db = getDb();
    const procurements = db.collection("procurements");
    const bookings = db.collection("bookings");

    let proc = await procurements.findOne({ bookingId });
    
    if (!proc) {
      const bk = await bookings.findOne({ bookingId });
      if (bk) {
        return res.json({
          success: true,
          procurementStatus: bk.status,
          procurement: null
        });
      }
      return res.status(404).json({ success: false, message: "Procurement details not found" });
    }

    return res.json({
      success: true,
      procurementStatus: proc.status,
      procurement: proc
    });
  } catch (err) {
    console.error("Get Procurement Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching procurement" });
  }
};
