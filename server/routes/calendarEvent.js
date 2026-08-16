const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  uploadSingle,
  createEvent,
  listEvents,
  getEvent,
  editEvent,
  removeEvent
} = require("../controllers/calendarEvent");

// GET /api/calendar - Public endpoint to retrieve calendar occasions
router.get("/", listEvents);

// GET /api/calendar/:id - Public endpoint to retrieve a single calendar occasion
router.get("/:id", getEvent);

// POST /api/calendar - Protected (Admin only) occasion creation with thumbnail image
router.post("/", authenticate, uploadSingle, createEvent);

// PUT /api/calendar/:id - Protected (Admin only) occasion editing
router.put("/:id", authenticate, uploadSingle, editEvent);

// DELETE /api/calendar/:id - Protected (Admin only) occasion deletion
router.delete("/:id", authenticate, removeEvent);

module.exports = router;
