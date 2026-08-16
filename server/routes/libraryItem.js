const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  uploadFields,
  createItem,
  listItems,
  getItem,
  editItem,
  removeItem
} = require("../controllers/libraryItem");

// GET /api/library - Public endpoint to retrieve all library items
router.get("/", listItems);

// GET /api/library/:id - Public endpoint to retrieve a single library item
router.get("/:id", getItem);

// POST /api/library - Protected (Admin only) creation with audio/thumbnail fields upload
router.post("/", authenticate, uploadFields, createItem);

// PUT /api/library/:id - Protected (Admin only) edit with audio/thumbnail fields upload
router.put("/:id", authenticate, uploadFields, editItem);

// DELETE /api/library/:id - Protected (Admin only) item deletion
router.delete("/:id", authenticate, removeItem);

module.exports = router;
