const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, bookingController.createBooking);
router.get("/my", authMiddleware, bookingController.getMyBookings);
router.get("/:id", authMiddleware, bookingController.getBookingById);

module.exports = router;
