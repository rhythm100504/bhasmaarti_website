const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getAllAdmins,
  createAdmin,
  toggleAdmin,
  deleteAdmin,
} = require("../controllers/adminManagement");

// All admin management routes are protected — must be logged in
router.use(authenticate);

// GET    /api/admins           — list all admins
router.get("/", getAllAdmins);

// POST   /api/admins           — create a new admin
router.post("/", createAdmin);

// PATCH  /api/admins/:id/toggle — activate / deactivate
router.patch("/:id/toggle", toggleAdmin);

// DELETE /api/admins/:id       — permanently remove an admin
router.delete("/:id", deleteAdmin);

module.exports = router;
