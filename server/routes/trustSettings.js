const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getTrustData,
  updateTrustHeaders,
  addFeature,
  editFeature,
  toggleFeature,
  deleteFeature,
  resetTrustData,
} = require("../controllers/trustSettings");

// GET /api/trust — public (landing page fetches trust settings + list)
router.get("/", getTrustData);

// PUT /api/trust — protected (saving settings headers)
router.put("/", authenticate, updateTrustHeaders);

// POST /api/trust/features — protected (creating a feature card)
router.post("/features", authenticate, addFeature);

// PUT /api/trust/features/:id — protected (updating a feature card)
router.put("/features/:id", authenticate, editFeature);

// PATCH /api/trust/features/:id/toggle — protected (toggling status)
router.patch("/features/:id/toggle", authenticate, toggleFeature);

// DELETE /api/trust/features/:id — protected (deleting a feature card)
router.delete("/features/:id", authenticate, deleteFeature);

// POST /api/trust/reset — protected (reset to defaults)
router.post("/reset", authenticate, resetTrustData);

module.exports = router;
