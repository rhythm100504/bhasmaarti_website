const multer = require("multer");
const path = require("path");
const fs = require("fs");
const LibraryItem = require("../models/LibraryItem");
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
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Support both 'audio' and 'thumbnail' files in a single form
const uploadFields = upload.fields([
  { name: "audio", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]);

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

/** POST /api/library - Create a library item (Admin only) */
const createItem = async (req, res) => {
  try {
    const { title, description, category, duration, lyrics, translation, status, created_at } = req.body;
    if (!title || !category || !duration) {
      return res.status(400).json({ success: false, message: "Title, category, and duration are required." });
    }

    const audioFile = req.files && req.files.audio ? req.files.audio[0] : null;
    const thumbnailFile = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;

    if (!audioFile) {
      return res.status(400).json({ success: false, message: "An audio file upload is required." });
    }

    const audio_url = `http://localhost:5001/uploads/${audioFile.filename}`;
    let thumbnail_url = null;

    // Register audio file in Media Library
    await Media.insertMedia({
      name: audioFile.originalname,
      filename: audioFile.filename,
      file_type: "audio",
      file_url: audio_url,
      file_size: audioFile.size,
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
      thumbnail_url = "/rudrashtakam.jpeg"; // Fallback image path
    }

    let dbCreatedAt = created_at || null;
    if (dbCreatedAt && /^\d{4}-\d{2}-\d{2}$/.test(dbCreatedAt)) {
      dbCreatedAt = `${dbCreatedAt}T00:00:00+05:30`;
    }

    const item = await LibraryItem.insertLibraryItem({
      title,
      description,
      category,
      duration,
      lyrics,
      translation,
      audio_url,
      thumbnail_url,
      status: status || "Published",
      created_at: dbCreatedAt
    });

    return res.status(201).json({ success: true, item });
  } catch (err) {
    console.error("[createItem error]", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to create library item." });
  }
};

/** GET /api/library - Retrieve all items (Public) */
const listItems = async (req, res) => {
  try {
    const list = await LibraryItem.getLibraryItemsList();
    return res.status(200).json({ success: true, items: list });
  } catch (err) {
    console.error("[listItems error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/** GET /api/library/:id - Retrieve single item (Public) */
const getItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await LibraryItem.getLibraryItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Library item not found." });
    }
    return res.status(200).json({ success: true, item });
  } catch (err) {
    console.error("[getItem error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/** PUT /api/library/:id - Edit an existing item (Admin only) */
const editItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await LibraryItem.getLibraryItemById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Library item not found." });
    }

    const { title, description, category, duration, lyrics, translation, status, created_at } = req.body;

    const audioFile = req.files && req.files.audio ? req.files.audio[0] : null;
    const thumbnailFile = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;

    let audio_url = existing.audio_url;
    let thumbnail_url = existing.thumbnail_url;

    if (audioFile) {
      // Delete old file
      await deleteLocalFile(existing.audio_url);
      audio_url = `http://localhost:5001/uploads/${audioFile.filename}`;
      // Register new file in media
      await Media.insertMedia({
        name: audioFile.originalname,
        filename: audioFile.filename,
        file_type: "audio",
        file_url: audio_url,
        file_size: audioFile.size,
        duration: duration || existing.duration
      });
    }

    if (thumbnailFile) {
      if (existing.thumbnail_url && !existing.thumbnail_url.includes("rudrashtakam.jpeg")) {
        await deleteLocalFile(existing.thumbnail_url);
      }
      thumbnail_url = `http://localhost:5001/uploads/${thumbnailFile.filename}`;
      await Media.insertMedia({
        name: thumbnailFile.originalname,
        filename: thumbnailFile.filename,
        file_type: "image",
        file_url: thumbnail_url,
        file_size: thumbnailFile.size
      });
    }

    let dbCreatedAt = created_at || null;
    if (dbCreatedAt && /^\d{4}-\d{2}-\d{2}$/.test(dbCreatedAt)) {
      dbCreatedAt = `${dbCreatedAt}T00:00:00+05:30`;
    }

    const updated = await LibraryItem.updateLibraryItem(id, {
      title: title || existing.title,
      description: description !== undefined ? description : existing.description,
      category: category || existing.category,
      duration: duration || existing.duration,
      lyrics: lyrics !== undefined ? lyrics : existing.lyrics,
      translation: translation !== undefined ? translation : existing.translation,
      audio_url,
      thumbnail_url,
      status: status || existing.status,
      created_at: dbCreatedAt || existing.created_at
    });

    return res.status(200).json({ success: true, item: updated });
  } catch (err) {
    console.error("[editItem error]", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to edit library item." });
  }
};

/** DELETE /api/library/:id - Delete a library item (Admin only) */
const removeItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await LibraryItem.getLibraryItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Library item not found." });
    }

    // Delete local files
    await deleteLocalFile(item.audio_url);
    if (item.thumbnail_url && !item.thumbnail_url.includes("rudrashtakam.jpeg")) {
      await deleteLocalFile(item.thumbnail_url);
    }

    const deleted = await LibraryItem.deleteLibraryItem(id);
    if (!deleted) {
      return res.status(500).json({ success: false, message: "Database deletion failed." });
    }

    return res.status(200).json({ success: true, message: "Library item deleted successfully." });
  } catch (err) {
    console.error("[removeItem error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  uploadFields,
  createItem,
  listItems,
  getItem,
  editItem,
  removeItem
};
