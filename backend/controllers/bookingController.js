const { getDb } = require("../config/db");

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { centre, crop, quantity, date, timeSlot } = req.body;
    const userId = req.user.userId;

    if (!centre || !crop || !quantity || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive number" });
    }

    const db = getDb();
    const bookings = db.collection("bookings");

    // Prevent duplicate booking for the same farmer and same slot/date
    const duplicateBooking = await bookings.findOne({
      userId,
      date,
      timeSlot,
      status: { $ne: "CANCELLED" }
    });

    if (duplicateBooking) {
      return res.status(400).json({
        success: false,
        message: `You already have an active booking (${duplicateBooking.bookingId}) for ${date} at ${timeSlot}`
      });
    }

    // Check full slot (Max 5 bookings per slot)
    const slotCount = await bookings.countDocuments({
      centre,
      date,
      timeSlot,
      status: { $ne: "CANCELLED" }
    });

    if (slotCount >= 5) {
      return res.status(400).json({
        success: false,
        message: `The selected time slot (${timeSlot}) at ${centre} is full. Please choose another date or time slot.`
      });
    }

    // Generate Unique IDs
    const totalCount = await bookings.countDocuments();
    const bookingId = `AQ-BK-${1001 + totalCount}`;
    const tokenNumber = `AQ-${1025 + totalCount}`;

    // Queue position calculation
    const activeAhead = await bookings.countDocuments({
      centre,
      date,
      status: { $in: ["BOOKED", "CHECKED_IN", "WAITING", "CALLED", "IN_PROGRESS"] }
    });

    const queuePosition = activeAhead + 1;
    const estimatedWaitingTime = queuePosition * 10; // in minutes

    const newBooking = {
      bookingId,
      userId,
      centre,
      crop,
      quantity: numQty,
      date,
      timeSlot,
      tokenNumber,
      queuePosition,
      estimatedWaitingTime,
      status: "BOOKED",
      createdAt: new Date()
    };

    const result = await bookings.insertOne(newBooking);
    const createdBooking = { ...newBooking, _id: result.insertedId };

    return res.status(201).json({
      success: true,
      message: "Slot booked successfully!",
      booking: createdBooking
    });
  } catch (err) {
    console.error("Create Booking Error:", err);
    return res.status(500).json({ success: false, message: "Server error creating booking" });
  }
};

// GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const db = getDb();
    const bookings = db.collection("bookings");
    const userBookings = await bookings.find({ userId: req.user.userId }).sort({ createdAt: -1 }).toArray();

    return res.json({
      success: true,
      bookings: userBookings
    });
  } catch (err) {
    console.error("Get My Bookings Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching bookings" });
  }
};

// GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const bookings = db.collection("bookings");
    
    let booking = await bookings.findOne({ bookingId: id });
    if (!booking) {
      booking = await bookings.findOne({ _id: id });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Update real-time queue position and farmers ahead
    if (["BOOKED", "CHECKED_IN", "WAITING"].includes(booking.status)) {
      const activeAhead = await bookings.countDocuments({
        centre: booking.centre,
        date: booking.date,
        createdAt: { $lt: booking.createdAt },
        status: { $in: ["BOOKED", "CHECKED_IN", "WAITING", "CALLED", "IN_PROGRESS"] }
      });
      booking.farmersAhead = activeAhead;
      booking.queuePosition = activeAhead + 1;
      booking.estimatedWaitingTime = activeAhead * 10;
    } else {
      booking.farmersAhead = 0;
      booking.estimatedWaitingTime = 0;
    }

    return res.json({
      success: true,
      booking
    });
  } catch (err) {
    console.error("Get Booking By Id Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching booking" });
  }
};
