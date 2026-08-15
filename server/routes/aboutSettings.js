const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getAboutSettings,
  updateAboutSettings,
  resetAboutSettings,
} = require("../controllers/aboutSettings");

// GET /api/about — public (landing page fetches about section text)
router.get("/", getAboutSettings);

// PUT /api/about — protected (saving about updates)
router.put("/", authenticate, updateAboutSettings);

// POST /api/about/reset — protected (reset to defaults)
router.post("/reset", authenticate, resetAboutSettings);

module.exports = router;
