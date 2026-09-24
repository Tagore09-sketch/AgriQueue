const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB } = require("./config/db");

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const queueRoutes = require("./routes/queueRoutes");
const procurementRoutes = require("./routes/procurementRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "AgriQueue Backend API Running", timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🌾 AgriQueue Backend Server running on http://localhost:${PORT}`);
  });
});
