const { getDb } = require("../config/db");
const { sendPaymentProcessingSms } = require("../services/smsService");

// GET /api/payments/:bookingId
exports.getPaymentByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const db = getDb();
    const payments = db.collection("payments");
    const bookings = db.collection("bookings");

    let payment = await payments.findOne({ bookingId });

    if (!payment) {
      const bk = await bookings.findOne({ bookingId });
      if (bk) {
        return res.json({
          success: true,
          payment: null,
          message: "Payment record will be generated once procurement is completed by officer."
        });
      }
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    return res.json({
      success: true,
      payment
    });
  } catch (err) {
    console.error("Get Payment Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching payment details" });
  }
};

// PUT /api/payments/:bookingId (Officer Only)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "PROCESSING", "COMPLETED"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid payment status. Must be PENDING, PROCESSING, or COMPLETED." });
    }

    const db = getDb();
    const payments = db.collection("payments");

    const payment = await payments.findOne({ bookingId });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found for this booking" });
    }

    const updateFields = {
      status,
      ...(status === "COMPLETED" ? { paymentDate: new Date() } : {})
    };

    await payments.updateOne(
      { _id: payment._id },
      { $set: updateFields }
    );

    const updatedPayment = await payments.findOne({ _id: payment._id });

    // Send real-time payment SMS notification with 24-hour credit guarantee & helpline info
    const smsRes = await sendPaymentProcessingSms(
      updatedPayment.farmerMobile || "9876543210",
      updatedPayment.farmerName || "Farmer",
      updatedPayment.amount || updatedPayment.grossAmount || 0,
      updatedPayment.transactionReference || updatedPayment.invoiceNo || "UTR-2026-APMC",
      status
    );

    return res.json({
      success: true,
      message: `Payment status updated to ${status}. ${status === 'PROCESSING' ? 'Amount will be credited within 24 hours (Helpline: 1800-425-1555).' : 'Payment transferred.'}`,
      payment: updatedPayment,
      smsNotification: smsRes.smsText || smsRes.message
    });
  } catch (err) {
    console.error("Update Payment Status Error:", err);
    return res.status(500).json({ success: false, message: "Server error updating payment status" });
  }
};
