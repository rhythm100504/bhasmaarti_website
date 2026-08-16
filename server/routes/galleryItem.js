const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  uploadSingle,
  createItem,
  listItems,
  getItem,
  editItem,
  removeItem
} = require("../controllers/galleryItem");

// GET /api/gallery - Public endpoint to retrieve gallery moments
router.get("/", listItems);

// GET /api/gallery/:id - Public endpoint to retrieve a single moment
router.get("/:id", getItem);

// POST /api/gallery - Protected (Admin only) moment creation with image upload
router.post("/", authenticate, uploadSingle, createItem);

// PUT /api/gallery/:id - Protected (Admin only) moment editing
router.put("/:id", authenticate, uploadSingle, editItem);

// DELETE /api/gallery/:id - Protected (Admin only) moment deletion
router.delete("/:id", authenticate, removeItem);

module.exports = router;
