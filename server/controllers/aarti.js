const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Aarti = require("../models/Aarti");
const Media = require("../models/Media");

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
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 250 * 1024 * 1024 // 250MB limit
  }
});

// Support both 'video' and 'thumbnail' file inputs in a single form
const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]);

const getCategoryFallbackImage = (category) => {
  switch (category) {
    case "Bhasma Aarti":
      return "/bhasma-aarti-preview.png";
    case "Dadyodak Aarti (Bal Bhog)":
    case "Bhog Aarti":
      return "/aarti-diya-thumb.png";
    case "Sandhya Aarti":
      return "/temple-bell-thumb.png";
    case "Shayan Aarti":
      return "/mahakal-temple.png";
    case "Festival Special":
    case "Festival Specials":
      return "/rudrashtakam.jpeg";
    default:
      return "/bhasma-aarti-preview.png";
  }
};

const deleteLocalFile = async (fileUrl) => {
  if (fileUrl && fileUrl.startsWith("http://localhost:5001/uploads/")) {
    const filename = fileUrl.split("/uploads/")[1];
    if (filename) {
      const filePath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error("Failed to delete physical file:", filePath, err.message);
        }
      }
    }
  }
};

const AARTI_CATEGORIES = [
  "Bhasma Aarti",
  "Dadyodak Aarti (Bal Bhog)",
  "Bhog Aarti",
  "Sandhya Aarti",
  "Shayan Aarti",
  "Festival Special"
];

/** POST /api/aartis - Protected (Admin only) */
const createAarti = async (req, res) => {
  try {
    const { title, category, duration, status, created_at } = req.body;
    if (!title || !category || !duration) {
      return res.status(400).json({ success: false, message: "Title, category, and duration are required." });
    }

    if (!AARTI_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: `Invalid category. Must be one of: ${AARTI_CATEGORIES.join(", ")}` });
    }

    const videoFile = req.files && req.files.video ? req.files.video[0] : null;
    const thumbnailFile = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;

    if (!videoFile) {
      return res.status(400).json({ success: false, message: "A video file upload is required." });
    }

    const video_url = `http://localhost:5001/uploads/${videoFile.filename}`;
    let thumbnail_url = null;

    // Register video file in Media Library
    await Media.insertMedia({
      name: videoFile.originalname,
      filename: videoFile.filename,
      file_type: "video",
      file_url: video_url,
      file_size: videoFile.size,
      duration: duration
    });

    if (thumbnailFile) {
      thumbnail_url = `http://localhost:5001/uploads/${thumbnailFile.filename}`;
      // Register custom thumbnail file in Media Library
      await Media.insertMedia({
        name: thumbnailFile.originalname,
        filename: thumbnailFile.filename,
        file_type: "image",
        file_url: thumbnail_url,
        file_size: thumbnailFile.size
      });
    } else {
      thumbnail_url = getCategoryFallbackImage(category);
    }

    let dbCreatedAt = created_at || null;
    if (dbCreatedAt && /^\d{4}-\d{2}-\d{2}$/.test(dbCreatedAt)) {
      dbCreatedAt = `${dbCreatedAt}T00:00:00+05:30`;
    }

    const aarti = await Aarti.insertAarti({
      title,
      category,
      duration,
      video_url,
      thumbnail_url,
      status: status || "Published",
      created_at: dbCreatedAt
    });

    return res.status(201).json({ success: true, aarti });
  } catch (err) {
    console.error("[createAarti error]", err);
    return res.status(500).json({ success: false, message: "Failed to upload Aarti recording." });
  }
};

/** GET /api/aartis - Public */
const listAartis = async (req, res) => {
  try {
    const list = await Aarti.getAartisList();
    return res.status(200).json({ success: true, aartis: list });
  } catch (err) {
    console.error("[listAartis error]", err);
    return res.status(500).json({ success: false, message: "Failed to retrieve Aarti archives." });
  }
};

/** PUT /api/aartis/:id - Protected (Admin only) */
const editAarti = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await Aarti.getAartiById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Aarti recording not found." });
    }

    const { title, category, duration, status, created_at } = req.body;
    if (category && !AARTI_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: `Invalid category. Must be one of: ${AARTI_CATEGORIES.join(", ")}` });
    }
    const videoFile = req.files && req.files.video ? req.files.video[0] : null;
    const thumbnailFile = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;

    let updatedVideoUrl = item.video_url;
    let updatedThumbnailUrl = item.thumbnail_url;

    if (videoFile) {
      updatedVideoUrl = `http://localhost:5001/uploads/${videoFile.filename}`;
      await deleteLocalFile(item.video_url);

      // Register video file in Media Library
      await Media.insertMedia({
        name: videoFile.originalname,
        filename: videoFile.filename,
        file_type: "video",
        file_url: updatedVideoUrl,
        file_size: videoFile.size,
        duration: duration || item.duration
      });
    }

    if (thumbnailFile) {
      updatedThumbnailUrl = `http://localhost:5001/uploads/${thumbnailFile.filename}`;
      // Clean up old custom thumbnail if it was uploaded locally (not a default placeholder)
      if (item.thumbnail_url && !item.thumbnail_url.startsWith("/")) {
        await deleteLocalFile(item.thumbnail_url);
      }

      // Register custom thumbnail file in Media Library
      await Media.insertMedia({
        name: thumbnailFile.originalname,
        filename: thumbnailFile.filename,
        file_type: "image",
        file_url: updatedThumbnailUrl,
        file_size: thumbnailFile.size
      });
    } else if (category && category !== item.category && item.thumbnail_url && item.thumbnail_url.startsWith("/")) {
      // If category changed and it was using a default matching cover, swap to the new category default
      updatedThumbnailUrl = getCategoryFallbackImage(category);
    }

    let dbCreatedAt = created_at || null;
    if (dbCreatedAt && /^\d{4}-\d{2}-\d{2}$/.test(dbCreatedAt)) {
      dbCreatedAt = `${dbCreatedAt}T00:00:00+05:30`;
    }

    const updated = await Aarti.updateAarti(id, {
      title,
      category,
      duration,
      video_url: updatedVideoUrl,
      thumbnail_url: updatedThumbnailUrl,
      status,
      created_at: dbCreatedAt
    });

    return res.status(200).json({ success: true, aarti: updated });
  } catch (err) {
    console.error("[editAarti error]", err);
    return res.status(500).json({ success: false, message: "Failed to update Aarti recording." });
  }
};

/** DELETE /api/aartis/:id - Protected (Admin only) */
const removeAarti = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await Aarti.getAartiById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Aarti recording not found." });
    }

    // Physically delete files from filesystem
    await deleteLocalFile(item.video_url);
    if (item.thumbnail_url && !item.thumbnail_url.startsWith("/")) {
      await deleteLocalFile(item.thumbnail_url);
    }

    // Delete database entry
    await Aarti.deleteAarti(id);

    return res.status(200).json({ success: true, message: "Aarti recording deleted successfully." });
  } catch (err) {
    console.error("[removeAarti error]", err);
    return res.status(500).json({ success: false, message: "Failed to delete Aarti recording." });
  }
};

module.exports = {
  uploadFields,
  createAarti,
  listAartis,
  editAarti,
  removeAarti
};
