const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");
const { authMiddleware, requireOfficer } = require("../middleware/authMiddleware");

router.get("/officer/list", authMiddleware, requireOfficer, queueController.getOfficerDashboardData);
router.get("/:bookingId", authMiddleware, queueController.getQueueStatus);
router.post("/check-in/:bookingId", authMiddleware, requireOfficer, queueController.checkInFarmer);
router.post("/call-next", authMiddleware, requireOfficer, queueController.callNextFarmer);

module.exports = router;
