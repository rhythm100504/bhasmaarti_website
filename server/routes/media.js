const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  upload,
  uploadFile,
  getMedia,
  deleteMedia
} = require("../controllers/media");

// GET /api/media - Public endpoint to retrieve media items
router.get("/", getMedia);

// POST /api/media/upload - Protected (Admin only) multipart upload
// The field name in multipart form-data must be "file"
router.post("/upload", authenticate, upload.single("file"), uploadFile);

// DELETE /api/media/:id - Protected (Admin only) media deletion
router.delete("/:id", authenticate, deleteMedia);

module.exports = router;
