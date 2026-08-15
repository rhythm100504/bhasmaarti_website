/**
 * Auth Controller
 *
 * All admin authentication logic lives here.
 * Uses the Admin model (entity) which queries bhasmaarti_db → admins table.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "bhasmaarti_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// ── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Fetch admin from the database (bhasmaarti_db → admins table)
    const admin = await Admin.findByEmail(email.trim().toLowerCase());

    if (!admin) {
      // Do NOT reveal whether the email exists
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Verify password against the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Check account is still active
    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        message: "This admin account has been deactivated. Contact support.",
      });
    }

    // Record last_login timestamp
    await Admin.updateLastLogin(admin.id);

    // Sign a JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("[login error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/auth/verify ─────────────────────────────────────────────────────
const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        valid: false,
        message: "Token is invalid or expired. Please log in again.",
      });
    }

    // Cross-check the admin still exists and is active in the DB
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.is_active) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: "Admin account not found or deactivated.",
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        last_login: admin.last_login,
      },
    });
  } catch (err) {
    console.error("[verify error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── POST /api/auth/logout ────────────────────────────────────────────────────
const logout = (_req, res) => {
  // JWT is stateless — the client discards the token.
  // Future enhancement: add token to a blacklist table if needed.
  return res.status(200).json({ success: true, message: "Logged out successfully." });
};

module.exports = { login, verify, logout };
