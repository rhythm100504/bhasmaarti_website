/**
 * Admin Management Controller
 *
 * All CRUD operations on the admins table.
 * Every route here is protected by the `authenticate` middleware.
 *
 * Routes:
 *   GET    /api/admins          — list all admins
 *   POST   /api/admins          — create a new admin
 *   PATCH  /api/admins/:id/toggle — toggle is_active
 *   DELETE /api/admins/:id      — permanently delete an admin
 */

const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// ── GET /api/admins ──────────────────────────────────────────────────────────
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    return res.status(200).json({ success: true, admins });
  } catch (err) {
    console.error("[getAllAdmins error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── POST /api/admins ─────────────────────────────────────────────────────────
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role = "administrator" } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are all required.",
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    // Password strength: at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check for duplicate email
    const existing = await Admin.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `An admin with email "${email}" already exists.`,
      });
    }

    // Hash the password before storing
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: passwordHash,
      role,
    });

    return res.status(201).json({
      success: true,
      message: `Admin "${admin.name}" created successfully.`,
      admin,
    });
  } catch (err) {
    // PostgreSQL unique_violation error code
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An admin with this email already exists.",
      });
    }
    console.error("[createAdmin error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── PATCH /api/admins/:id/toggle ─────────────────────────────────────────────
const toggleAdmin = async (req, res) => {
  try {
    const targetId = parseInt(req.params.id, 10);

    // Prevent self-deactivation
    if (targetId === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }

    // Ensure admin exists
    const target = await Admin.findById(targetId);
    if (!target) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    // Protect main admin from deactivation
    if (target.email === "admin@bhasmaarti.com") {
      return res.status(400).json({
        success: false,
        message: "The main admin account (admin@bhasmaarti.com) cannot be deactivated.",
      });
    }

    const updated = await Admin.toggleActive(targetId);
    const state = updated.is_active ? "activated" : "deactivated";

    return res.status(200).json({
      success: true,
      message: `Admin "${updated.name}" has been ${state}.`,
      admin: updated,
    });
  } catch (err) {
    console.error("[toggleAdmin error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── DELETE /api/admins/:id ───────────────────────────────────────────────────
const deleteAdmin = async (req, res) => {
  try {
    const targetId = parseInt(req.params.id, 10);

    // Prevent self-deletion
    if (targetId === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // Prevent deleting the last admin
    const total = await Admin.count();
    if (total <= 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the last admin account. Create another admin first.",
      });
    }

    const target = await Admin.findById(targetId);
    if (!target) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    // Protect main admin from deletion
    if (target.email === "admin@bhasmaarti.com") {
      return res.status(400).json({
        success: false,
        message: "The main admin account (admin@bhasmaarti.com) cannot be deleted under any circumstances.",
      });
    }

    await Admin.deleteById(targetId);

    return res.status(200).json({
      success: true,
      message: `Admin "${target.name}" has been permanently deleted.`,
    });
  } catch (err) {
    console.error("[deleteAdmin error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getAllAdmins, createAdmin, toggleAdmin, deleteAdmin };
