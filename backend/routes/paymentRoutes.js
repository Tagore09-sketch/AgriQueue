const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authMiddleware, requireOfficer } = require("../middleware/authMiddleware");

router.get("/:bookingId", authMiddleware, paymentController.getPaymentByBookingId);
router.put("/:bookingId", authMiddleware, requireOfficer, paymentController.updatePaymentStatus);

module.exports = router;
