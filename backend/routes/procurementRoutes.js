const express = require("express");
const router = express.Router();
const procurementController = require("../controllers/procurementController");
const { authMiddleware, requireOfficer } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, requireOfficer, procurementController.completeProcurement);
router.put("/:id", authMiddleware, requireOfficer, procurementController.updateProcurementStatus);
router.get("/:bookingId", authMiddleware, procurementController.getProcurementByBookingId);

module.exports = router;
