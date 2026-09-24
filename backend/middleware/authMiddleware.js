const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "agriqueue_super_secret_jwt_key_2026";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized: Missing or invalid token header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains { userId, role, mobile }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

const requireOfficer = (req, res, next) => {
  if (!req.user || req.user.role !== "officer") {
    return res.status(403).json({ success: false, message: "Forbidden: Officer access required" });
  }
  next();
};

module.exports = { authMiddleware, requireOfficer };
