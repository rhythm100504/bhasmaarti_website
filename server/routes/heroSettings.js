const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getHeroSettings,
  updateHeroSettings,
  resetHeroSettings,
} = require("../controllers/heroSettings");

// GET /api/hero — public (landing page fetches hero text)
router.get("/", getHeroSettings);

// PUT /api/hero — protected (saving hero updates)
router.put("/", authenticate, updateHeroSettings);

// POST /api/hero/reset — protected (reset to system default values)
router.post("/reset", authenticate, resetHeroSettings);

module.exports = router;
