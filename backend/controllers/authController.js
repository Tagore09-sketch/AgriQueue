const jwt = require("jsonwebtoken");
const { getDb } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "agriqueue_super_secret_jwt_key_2026";

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, mobile, aadhaar, village, district, cropName, landArea, expectedQuantity, bankName, accountNumber, ifscCode, upiId } = req.body;

    if (!name || !mobile || !aadhaar || !village || !district || !cropName || !landArea || !expectedQuantity) {
      return res.status(400).json({ success: false, message: "All personal and crop fields are required" });
    }

    // Validate mobile number: 10 digits
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ success: false, message: "Invalid Indian mobile number (must be 10 digits starting with 6-9)" });
    }

    // Validate Aadhaar number: exactly 12 digits
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(aadhaar)) {
      return res.status(400).json({ success: false, message: "Invalid Aadhaar number. Must be exactly 12 numeric digits." });
    }

    const numericLand = parseFloat(landArea);
    if (isNaN(numericLand) || numericLand <= 0) {
      return res.status(400).json({ success: false, message: "Land area must be a positive number" });
    }

    const numericQty = parseFloat(expectedQuantity);
    if (isNaN(numericQty) || numericQty <= 0) {
      return res.status(400).json({ success: false, message: "Expected quantity must be a positive number" });
    }

    const db = getDb();
    const users = db.collection("users");

    const existingUser = await users.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Farmer with this mobile number is already registered. Please login." });
    }

    // Convert Aadhaar to last 4 digits only
    const aadhaarLast4 = aadhaar.slice(-4);

    const newUser = {
      name,
      mobile,
      aadhaarLast4,
      village,
      district,
      cropName,
      landArea: numericLand,
      expectedQuantity: numericQty,
      bankName: bankName || "State Bank of India",
      accountNumber: accountNumber || "98765432101234",
      ifscCode: (ifscCode || "SBIN0004123").toUpperCase(),
      upiId: upiId || `${name.toLowerCase().replace(/\s+/g, '')}@upi`,
      role: "farmer",
      createdAt: new Date()
    };

    const result = await users.insertOne(newUser);
    const createdUser = { ...newUser, _id: result.insertedId };

    return res.status(201).json({
      success: true,
      message: "Farmer registration successful! Please login using mobile OTP.",
      user: {
        _id: createdUser._id,
        name: createdUser.name,
        mobile: createdUser.mobile,
        aadhaarLast4: createdUser.aadhaarLast4,
        role: createdUser.role
      }
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    const db = getDb();
    const users = db.collection("users");
    let user = await users.findOne({ mobile });

    // Auto-create officer account if officer login mobile used
    if (!user && mobile === "9000000000") {
      const newOfficer = {
        name: "Procurement Officer",
        mobile: "9000000000",
        role: "officer",
        bankName: "State Bank of India",
        accountNumber: "554433221100",
        ifscCode: "SBIN0001000",
        createdAt: new Date()
      };
      const resOfficer = await users.insertOne(newOfficer);
      user = { ...newOfficer, _id: resOfficer.insertedId };
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Mobile number not registered. Please register first." });
    }

    // Generate dynamic 6-digit OTP
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    await users.updateOne(
      { _id: user._id },
      { $set: { otp: generatedOtp, otpGeneratedAt: new Date() } }
    );

    return res.json({
      success: true,
      message: `OTP generated for +91 ${mobile}`,
      otp: generatedOtp // Return generated OTP so user can type it in
    });
  } catch (err) {
    console.error("Send OTP Error:", err);
    return res.status(500).json({ success: false, message: "Server error sending OTP" });
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
    }

    const db = getDb();
    const users = db.collection("users");
    let user = await users.findOne({ mobile });

    if (!user && mobile === "9000000000") {
      const newOfficer = {
        name: "Procurement Officer",
        mobile: "9000000000",
        role: "officer",
        createdAt: new Date()
      };
      const resOfficer = await users.insertOne(newOfficer);
      user = { ...newOfficer, _id: resOfficer.insertedId };
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found. Please register." });
    }

    // Verify OTP matching user's stored generated OTP
    if (!user.otp || String(user.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP. Please check the OTP sent to your mobile." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: String(user._id), role: user.role, mobile: user.mobile },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      success: true,
      message: "Authentication successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        aadhaarLast4: user.aadhaarLast4,
        village: user.village,
        district: user.district,
        cropName: user.cropName,
        landArea: user.landArea,
        expectedQuantity: user.expectedQuantity,
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        ifscCode: user.ifscCode,
        upiId: user.upiId,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({ success: false, message: "Server error during OTP verification" });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const db = getDb();
    const users = db.collection("users");
    const user = await users.findOne({ _id: req.user.userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        aadhaarLast4: user.aadhaarLast4,
        village: user.village,
        district: user.district,
        cropName: user.cropName,
        landArea: user.landArea,
        expectedQuantity: user.expectedQuantity,
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        ifscCode: user.ifscCode,
        upiId: user.upiId,
        role: user.role
      }
    });
  } catch (err) {
    console.error("GetMe Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching user profile" });
  }
};
