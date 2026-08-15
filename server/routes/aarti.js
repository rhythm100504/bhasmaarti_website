const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  uploadFields,
  createAarti,
  listAartis,
  editAarti,
  removeAarti
} = require("../controllers/aarti");

// GET /api/aartis - Retrieve list of Bhasma Aarti recordings (public)
router.get("/", listAartis);

// POST /api/aartis - Upload a new Aarti video & thumbnail (Admin only)
router.post("/", authenticate, uploadFields, createAarti);

// PUT /api/aartis/:id - Edit an existing Aarti recording details or swap files (Admin only)
router.put("/:id", authenticate, uploadFields, editAarti);

// DELETE /api/aartis/:id - Permanently delete an Aarti recording (Admin only)
router.delete("/:id", authenticate, removeAarti);

module.exports = router;
