/**
 * HeroSettings Controller
 *
 * Handles public fetching, and authenticated administrative updating
 * and resetting of homepage hero section content.
 */

const HeroSettings = require("../models/HeroSettings");

// GET /api/hero - Public
const getHeroSettings = async (req, res) => {
  try {
    const settings = await HeroSettings.getSettings();
    return res.status(200).json({ success: true, settings });
  } catch (err) {
    console.error("[getHeroSettings error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PUT /api/hero - Protected (Admin only)
const updateHeroSettings = async (req, res) => {
  try {
    const { eyebrow, title, subtitle, cta_primary, cta_secondary } = req.body;

    if (!eyebrow || !title || !subtitle || !cta_primary || !cta_secondary) {
      return res.status(400).json({
        success: false,
        message: "All hero settings fields are required.",
      });
    }

    const updated = await HeroSettings.updateSettings({
      eyebrow: eyebrow.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      cta_primary: cta_primary.trim(),
      cta_secondary: cta_secondary.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Hero settings updated successfully.",
      settings: updated,
    });
  } catch (err) {
    console.error("[updateHeroSettings error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/hero/reset - Protected (Admin only)
const resetHeroSettings = async (req, res) => {
  try {
    const reset = await HeroSettings.resetSettings();
    return res.status(200).json({
      success: true,
      message: "Hero settings reset to system defaults.",
      settings: reset,
    });
  } catch (err) {
    console.error("[resetHeroSettings error]", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getHeroSettings,
  updateHeroSettings,
  resetHeroSettings
};
