/**
 * AboutSettings Controller
 *
 * Handles public fetching, and authenticated administrative updating
 * and resetting of About & Legends section content.
 */

const AboutSettings = require("../models/AboutSettings");

// GET /api/about - Public
const getAboutSettings = async (req, res) => {
  try {
    const settings = await AboutSettings.getSettings();
    return res.status(200).json({ success: true, settings });
  } catch (err) {
    console.error("[getAboutSettings error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PUT /api/about - Protected (Admin only)
const updateAboutSettings = async (req, res) => {
  try {
    const { eyebrow, title, subtitle, text_1, text_2, stats } = req.body;

    if (!eyebrow || !title || !subtitle || !text_1 || !text_2 || !stats) {
      return res.status(400).json({
        success: false,
        message: "All about settings fields are required.",
      });
    }

    const updated = await AboutSettings.updateSettings({
      eyebrow: eyebrow.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      text_1: text_1.trim(),
      text_2: text_2.trim(),
      stats
    });

    return res.status(200).json({
      success: true,
      message: "About Section settings updated successfully.",
      settings: updated,
    });
  } catch (err) {
    console.error("[updateAboutSettings error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/about/reset - Protected (Admin only)
const resetAboutSettings = async (req, res) => {
  try {
    const reset = await AboutSettings.resetSettings();
    return res.status(200).json({
      success: true,
      message: "About Section settings reset to defaults.",
      settings: reset,
    });
  } catch (err) {
    console.error("[resetAboutSettings error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getAboutSettings,
  updateAboutSettings,
  resetAboutSettings
};
