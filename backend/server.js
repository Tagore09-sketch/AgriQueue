const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB, getDb } = require("./config/db");

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

const fs = require("fs");

const statusResponse = (req, res) => {
  res.json({
    success: true,
    message: "🌾 AgriQueue Full-Stack Server is Live & Operational!",
    status: "Healthy",
    timestamp: new Date(),
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      bookings: "/api/bookings",
      queue: "/api/queue",
      procurement: "/api/procurement",
      payments: "/api/payments"
    }
  });
};

app.get("/api", statusResponse);
app.get("/api/", statusResponse);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "AgriQueue Backend API Running", timestamp: new Date() });
});

// Serve Frontend Static Files & SPA Fallback Route if frontend/dist exists
const frontendDistPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", statusResponse);
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Seed initial required backend data
const seedInitialData = async () => {
  try {
    const db = getDb();
    const users = db.collection("users");

    // Check & Seed Demo Officer
    const officer = await users.findOne({ mobile: "9000000000" });
    if (!officer) {
      await users.insertOne({
        name: "Procurement Officer",
        mobile: "9000000000",
        role: "officer",
        otp: "123456",
        bankName: "State Bank of India",
        accountNumber: "554433221100",
        ifscCode: "SBIN0001000",
        createdAt: new Date()
      });
      console.log("🌱 Demo Officer account seeded (Mobile: 9000000000)");
    }

    // Check & Seed Demo Farmer
    const farmer = await users.findOne({ mobile: "9876543210" });
    if (!farmer) {
      await users.insertOne({
        name: "Ravi Kumar",
        mobile: "9876543210",
        aadhaarLast4: "9012",
        village: "Vadlamudi",
        district: "Guntur",
        cropName: "Paddy",
        landArea: 3.5,
        expectedQuantity: 2500,
        bankName: "State Bank of India",
        accountNumber: "98765432101234",
        ifscCode: "SBIN0004123",
        upiId: "ravikumar@upi",
        role: "farmer",
        otp: "123456",
        createdAt: new Date()
      });
      console.log("🌱 Demo Farmer account seeded (Mobile: 9876543210)");
    }
  } catch (err) {
    console.error("Error seeding initial data:", err);
  }
};

connectDB().then(async () => {
  await seedInitialData();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 AgriQueue Backend Server running on port ${PORT}`);
  });
});

