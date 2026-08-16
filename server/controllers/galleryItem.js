const multer = require("multer");
const path = require("path");
const fs = require("fs");
const GalleryItem = require("../models/GalleryItem");
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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Single image file field named "image"
const uploadSingle = upload.single("image");

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

/** POST /api/gallery - Create a gallery item (Admin only) */
const createItem = async (req, res) => {
  try {
    const { title, description, date, status, created_at } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ success: false, message: "Title, description, and date are required." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "An image file upload is required." });
    }

    const image_url = `http://localhost:5001/uploads/${req.file.filename}`;

    // Register image file in Media Library
    await Media.insertMedia({
      name: req.file.originalname,
      filename: req.file.filename,
      file_type: "image",
      file_url: image_url,
      file_size: req.file.size
    });

    let dbCreatedAt = created_at || null;
    if (dbCreatedAt && /^\d{4}-\d{2}-\d{2}$/.test(dbCreatedAt)) {
      dbCreatedAt = `${dbCreatedAt}T00:00:00+05:30`;
    }

    const item = await GalleryItem.insertGalleryItem({
      title,
      description,
      date,
      image_url,
      status: status || "Published",
      created_at: dbCreatedAt
    });

    return res.status(201).json({ success: true, item });
  } catch (err) {
    console.error("[createItem error]", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to create gallery item." });
  }
};

/** GET /api/gallery - Retrieve all items (Public) */
const listItems = async (req, res) => {
  try {
    const list = await GalleryItem.getGalleryItemsList();
    return res.status(200).json({ success: true, items: list });
  } catch (err) {
    console.error("[listItems error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/** GET /api/gallery/:id - Retrieve single item (Public) */
const getItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await GalleryItem.getGalleryItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Gallery item not found." });
    }
    return res.status(200).json({ success: true, item });
  } catch (err) {
    console.error("[getItem error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/** PUT /api/gallery/:id - Edit an existing item (Admin only) */
const editItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await GalleryItem.getGalleryItemById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Gallery item not found." });
    }

    const { title, description, date, status, created_at } = req.body;
    let image_url = existing.image_url;

    if (req.file) {
      // Delete old file
      await deleteLocalFile(existing.image_url);
      image_url = `http://localhost:5001/uploads/${req.file.filename}`;
      // Register new file in media
      await Media.insertMedia({
        name: req.file.originalname,
        filename: req.file.filename,
        file_type: "image",
        file_url: image_url,
        file_size: req.file.size
      });
    }

    let dbCreatedAt = created_at || null;
    if (dbCreatedAt && /^\d{4}-\d{2}-\d{2}$/.test(dbCreatedAt)) {
      dbCreatedAt = `${dbCreatedAt}T00:00:00+05:30`;
    }

    const updated = await GalleryItem.updateGalleryItem(id, {
      title: title || existing.title,
      description: description || existing.description,
      date: date || existing.date,
      image_url,
      status: status || existing.status,
      created_at: dbCreatedAt || existing.created_at
    });

    return res.status(200).json({ success: true, item: updated });
  } catch (err) {
    console.error("[editItem error]", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to edit gallery item." });
  }
};

/** DELETE /api/gallery/:id - Delete a gallery item (Admin only) */
const removeItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await GalleryItem.getGalleryItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Gallery item not found." });
    }

    // Delete local files
    await deleteLocalFile(item.image_url);

    const deleted = await GalleryItem.deleteGalleryItem(id);
    if (!deleted) {
      return res.status(500).json({ success: false, message: "Database deletion failed." });
    }

    return res.status(200).json({ success: true, message: "Gallery item deleted successfully." });
  } catch (err) {
    console.error("[removeItem error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  uploadSingle,
  createItem,
  listItems,
  getItem,
  editItem,
  removeItem
};
