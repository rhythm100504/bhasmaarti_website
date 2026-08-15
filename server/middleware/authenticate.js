/**
 * JWT Auth Middleware
 *
 * Protects routes that require an authenticated admin session.
 * Reads the Bearer token from the Authorization header,
 * verifies it, and attaches the decoded admin payload to req.admin.
 *
 * Usage:
 *   const authenticate = require("../middleware/authenticate");
 *   router.get("/protected", authenticate, handler);
 */

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "bhasmaarti_secret";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Token invalid or expired. Please log in again.",
      });
    }

    // Cross-check admin still exists in the DB and is active
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.is_active) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found or deactivated.",
      });
    }

    // Attach to request so downstream handlers can use it
    req.admin = admin;
    next();
  } catch (err) {
    console.error("[authenticate middleware error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = authenticate;
