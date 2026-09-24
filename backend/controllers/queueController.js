const { getDb } = require("../config/db");

// GET /api/queue/:bookingId
exports.getQueueStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const db = getDb();
    const bookings = db.collection("bookings");

    let booking = await bookings.findOne({ bookingId });
    if (!booking) {
      booking = await bookings.findOne({ _id: bookingId });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Currently CALLED token in the same centre
    const currentCalled = await bookings.findOne({
      centre: booking.centre,
      status: "CALLED"
    });

    let farmersAhead = 0;
    if (["BOOKED", "CHECKED_IN", "WAITING"].includes(booking.status)) {
      farmersAhead = await bookings.countDocuments({
        centre: booking.centre,
        date: booking.date,
        createdAt: { $lt: booking.createdAt },
        status: { $in: ["BOOKED", "CHECKED_IN", "WAITING"] }
      });
    }

    const queuePosition = ["BOOKED", "CHECKED_IN", "WAITING"].includes(booking.status) ? farmersAhead + 1 : 0;
    const estimatedWaitingTime = farmersAhead * 10;

    return res.json({
      success: true,
      queueStatus: {
        bookingId: booking.bookingId,
        tokenNumber: booking.tokenNumber,
        centre: booking.centre,
        crop: booking.crop,
        quantity: booking.quantity,
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: booking.status,
        queuePosition,
        farmersAhead,
        estimatedWaitingTime,
        currentToken: currentCalled ? currentCalled.tokenNumber : "None"
      }
    });
  } catch (err) {
    console.error("Get Queue Status Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching queue status" });
  }
};

// POST /api/queue/check-in/:bookingId (Officer Only)
exports.checkInFarmer = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const db = getDb();
    const bookings = db.collection("bookings");

    let booking = await bookings.findOne({ bookingId });
    if (!booking) {
      booking = await bookings.findOne({ _id: bookingId });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Change BOOKED -> CHECKED_IN -> WAITING
    await bookings.updateOne(
      { _id: booking._id },
      { $set: { status: "WAITING", checkedInAt: new Date() } }
    );

    return res.json({
      success: true,
      message: `Farmer ${booking.tokenNumber} checked in successfully and moved to WAITING queue!`,
      status: "WAITING"
    });
  } catch (err) {
    console.error("Check In Error:", err);
    return res.status(500).json({ success: false, message: "Server error during check in" });
  }
};

// POST /api/queue/call-next (Officer Only)
exports.callNextFarmer = async (req, res) => {
  try {
    const db = getDb();
    const bookings = db.collection("bookings");
    const users = db.collection("users");

    // Find first waiting farmer (or checked-in farmer)
    let nextFarmerBooking = await bookings.findOne({
      status: "WAITING"
    });

    if (!nextFarmerBooking) {
      nextFarmerBooking = await bookings.findOne({
        status: { $in: ["CHECKED_IN", "BOOKED"] }
      });
    }

    if (!nextFarmerBooking) {
      return res.status(404).json({
        success: false,
        message: "No waiting farmers available in queue."
      });
    }

    // Update status to CALLED
    await bookings.updateOne(
      { _id: nextFarmerBooking._id },
      { $set: { status: "CALLED", calledAt: new Date() } }
    );

    const farmerUser = await users.findOne({ _id: nextFarmerBooking.userId }) || {};

    return res.json({
      success: true,
      message: `Now calling Token ${nextFarmerBooking.tokenNumber}!`,
      calledFarmer: {
        bookingId: nextFarmerBooking.bookingId,
        tokenNumber: nextFarmerBooking.tokenNumber,
        farmerName: farmerUser.name || "Farmer",
        mobile: farmerUser.mobile || "N/A",
        crop: nextFarmerBooking.crop,
        quantity: nextFarmerBooking.quantity,
        timeSlot: nextFarmerBooking.timeSlot,
        status: "CALLED"
      }
    });
  } catch (err) {
    console.error("Call Next Farmer Error:", err);
    return res.status(500).json({ success: false, message: "Server error calling next farmer" });
  }
};

// GET /api/queue/officer/list (Officer Only)
exports.getOfficerDashboardData = async (req, res) => {
  try {
    const db = getDb();
    const bookingsCollection = db.collection("bookings");
    const usersCollection = db.collection("users");
    const paymentsCollection = db.collection("payments");

    const allBookings = await bookingsCollection.find({}).sort({ createdAt: -1 }).toArray();

    // Enrich with farmer name
    const enrichedBookings = await Promise.all(
      allBookings.map(async (bk) => {
        const farmer = await usersCollection.findOne({ _id: bk.userId }) || {};
        return {
          ...bk,
          farmerName: farmer.name || "Ravi Kumar",
          farmerMobile: farmer.mobile || "9876543210"
        };
      })
    );

    const totalBookings = enrichedBookings.length;
    const waitingCount = enrichedBookings.filter(b => ["BOOKED", "CHECKED_IN", "WAITING"].includes(b.status)).length;
    const calledCount = enrichedBookings.filter(b => b.status === "CALLED").length;
    const completedCount = enrichedBookings.filter(b => b.status === "COMPLETED").length;
    const pendingPaymentsCount = await paymentsCollection.countDocuments({ status: { $ne: "COMPLETED" } });

    return res.json({
      success: true,
      stats: {
        totalBookings,
        waitingCount,
        calledCount,
        completedCount,
        pendingPaymentsCount
      },
      queue: enrichedBookings
    });
  } catch (err) {
    console.error("Officer Dashboard Data Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching officer dashboard data" });
  }
};
