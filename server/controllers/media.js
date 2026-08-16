const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Media = require("../models/Media");

// Ensure uploads directory exists in the server root
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Use fieldname + unique suffix + original extension
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to restrict uploads to images, videos, audio, and PDFs
const fileFilter = (req, file, cb) => {
  const mime = file.mimetype;
  if (
    mime.startsWith("image/") ||
    mime.startsWith("video/") ||
    mime.startsWith("audio/") ||
    mime === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, videos, audio, and PDFs are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for video/audio support
  }
});

/** POST /api/media/upload - Protected (Admin only) */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const mime = req.file.mimetype;
    let file_type = "pdf";
    if (mime.startsWith("image/")) {
      file_type = "image";
    } else if (mime.startsWith("video/")) {
      file_type = "video";
    } else if (mime.startsWith("audio/")) {
      file_type = "audio";
    }

    // Public URL matching static folder serving on port 5001
    const file_url = `${process.env.BASE_URL || "http://localhost:5001"}/uploads/${req.file.filename}`;
    const duration = req.body.duration || null;

    const media = await Media.insertMedia({
      name: req.file.originalname,
      filename: req.file.filename,
      file_type,
      file_url,
      file_size: req.file.size,
      duration
    });

    return res.status(201).json({ success: true, media });
  } catch (err) {
    console.error("[uploadFile error]", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to upload file." });
  }
};

/** GET /api/media - Public */
const getMedia = async (req, res) => {
  try {
    const list = await Media.getMediaList();
    return res.status(200).json({ success: true, media: list });
  } catch (err) {
    console.error("[getMedia error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/** DELETE /api/media/:id - Protected (Admin only) */
const deleteMedia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await Media.getMediaById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Media item not found." });
    }

    // Delete physical file from filesystem
    const filePath = path.join(UPLOAD_DIR, item.filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    // Delete record from database
    await Media.deleteMedia(id);

    return res.status(200).json({ success: true, message: "Media item deleted successfully." });
  } catch (err) {
    console.error("[deleteMedia error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  upload,
  uploadFile,
  getMedia,
  deleteMedia
};
