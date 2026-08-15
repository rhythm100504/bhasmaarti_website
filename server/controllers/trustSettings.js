/**
 * TrustSettings Controller
 *
 * Handles fetching headers + features list publicly,
 * and authenticated CRUD operations on feature cards.
 */

const TrustSettings = require("../models/TrustSettings");

// GET /api/trust - Public
const getTrustData = async (req, res) => {
  try {
    const settings = await TrustSettings.getSettings();
    const features = await TrustSettings.getFeatures();
    return res.status(200).json({ success: true, settings, features });
  } catch (err) {
    console.error("[getTrustData error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PUT /api/trust - Protected (Admin only)
const updateTrustHeaders = async (req, res) => {
  try {
    const { eyebrow, title } = req.body;
    if (!eyebrow || !title) {
      return res.status(400).json({ success: false, message: "Eyebrow and Title are required." });
    }
    const updated = await TrustSettings.updateSettings({ eyebrow, title });
    return res.status(200).json({ success: true, settings: updated });
  } catch (err) {
    console.error("[updateTrustHeaders error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/trust/features - Protected (Admin only)
const addFeature = async (req, res) => {
  try {
    const { title, description, image_url, status } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required." });
    }
    const feature = await TrustSettings.createFeature({ title, description, image_url, status });
    return res.status(201).json({ success: true, feature });
  } catch (err) {
    console.error("[addFeature error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PUT /api/trust/features/:id - Protected (Admin only)
const editFeature = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, image_url, status } = req.body;
    const updated = await TrustSettings.updateFeature(id, { title, description, image_url, status });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Feature card not found." });
    }
    return res.status(200).json({ success: true, feature: updated });
  } catch (err) {
    console.error("[editFeature error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PATCH /api/trust/features/:id/toggle - Protected (Admin only)
const toggleFeature = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await TrustSettings.toggleFeatureStatus(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Feature card not found." });
    }
    return res.status(200).json({ success: true, feature: updated });
  } catch (err) {
    console.error("[toggleFeature error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// DELETE /api/trust/features/:id - Protected (Admin only)
const deleteFeature = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await TrustSettings.deleteFeature(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Feature card not found." });
    }
    return res.status(200).json({ success: true, message: "Feature card deleted successfully." });
  } catch (err) {
    console.error("[deleteFeature error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/trust/reset - Protected (Admin only)
const resetTrustData = async (req, res) => {
  try {
    const reset = await TrustSettings.resetToDefaults();
    return res.status(200).json({ success: true, settings: reset.settings, features: reset.features });
  } catch (err) {
    console.error("[resetTrustData error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getTrustData,
  updateTrustHeaders,
  addFeature,
  editFeature,
  toggleFeature,
  deleteFeature,
  resetTrustData
};
