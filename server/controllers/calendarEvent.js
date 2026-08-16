const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CalendarEvent = require("../models/CalendarEvent");
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

/** POST /api/calendar - Create a calendar event (Admin only) */
const createEvent = async (req, res) => {
  try {
    const { title, description, date, more_info, aartis_count, status, created_at } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ success: false, message: "Title, description, and date are required." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "A thumbnail image file upload is required." });
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

    const event = await CalendarEvent.insertCalendarEvent({
      title,
      description,
      date,
      image_url,
      more_info,
      aartis_count: aartis_count ? parseInt(aartis_count, 10) : 5,
      status: status || "Published",
      created_at: dbCreatedAt
    });

    return res.status(201).json({ success: true, event });
  } catch (err) {
    console.error("[createEvent error]", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to create calendar event." });
  }
};

/** GET /api/calendar - Retrieve all events (Public) */
const listEvents = async (req, res) => {
  try {
    const list = await CalendarEvent.getCalendarEventsList();
    return res.status(200).json({ success: true, events: list });
  } catch (err) {
    console.error("[listEvents error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/** GET /api/calendar/:id - Retrieve single event (Public) */
const getEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const event = await CalendarEvent.getCalendarEventById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Calendar event not found." });
    }
    return res.status(200).json({ success: true, event });
  } catch (err) {
    console.error("[getEvent error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/** PUT /api/calendar/:id - Edit an existing event (Admin only) */
const editEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await CalendarEvent.getCalendarEventById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Calendar event not found." });
    }

    const { title, description, date, more_info, aartis_count, status, created_at } = req.body;
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

    const updated = await CalendarEvent.updateCalendarEvent(id, {
      title: title || existing.title,
      description: description || existing.description,
      date: date || existing.date,
      image_url,
      more_info: more_info !== undefined ? more_info : existing.more_info,
      aartis_count: aartis_count ? parseInt(aartis_count, 10) : existing.aartis_count,
      status: status || existing.status,
      created_at: dbCreatedAt || existing.created_at
    });

    return res.status(200).json({ success: true, event: updated });
  } catch (err) {
    console.error("[editEvent error]", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to edit calendar event." });
  }
};

/** DELETE /api/calendar/:id - Delete a calendar event (Admin only) */
const removeEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const event = await CalendarEvent.getCalendarEventById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Calendar event not found." });
    }

    // Delete local files
    await deleteLocalFile(event.image_url);

    const deleted = await CalendarEvent.deleteCalendarEvent(id);
    if (!deleted) {
      return res.status(500).json({ success: false, message: "Database deletion failed." });
    }

    return res.status(200).json({ success: true, message: "Calendar event deleted successfully." });
  } catch (err) {
    console.error("[removeEvent error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  uploadSingle,
  createEvent,
  listEvents,
  getEvent,
  editEvent,
  removeEvent
};
