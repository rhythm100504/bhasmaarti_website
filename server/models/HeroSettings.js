/**
 * HeroSettings Entity / Model
 *
 * Table: hero_settings
 * Database: bhasmaarti_db
 *
 * Columns:
 *   id              INT PRIMARY KEY DEFAULT 1
 *   eyebrow         TEXT NOT NULL,
 *   title           TEXT NOT NULL,
 *   subtitle        TEXT NOT NULL,
 *   cta_primary     TEXT NOT NULL,
 *   cta_secondary   TEXT NOT NULL,
 *   updated_at      TIMESTAMPTZ DEFAULT NOW()
 */

const pool = require("../config/database");

const DEFAULTS = {
  eyebrow: "Shri Mahakaleshwar Jyotirlinga, Ujjain",
  title: "Experience the Divine Presence of Mahakal",
  subtitle: "Discover the sacred world of Shri Mahakaleshwar Jyotirlinga through recorded Bhasma Aarti videos, devotional archives, temple information, spiritual resources, and festival celebrations from the holy city of Ujjain.",
  cta_primary: "Watch Latest Bhasma Aarti",
  cta_secondary: "Explore Archive"
};

/** Ensure table exists and has exactly one row of settings initialized */
const createTable = async () => {
  // Create table with check constraint to enforce exactly one row (id = 1)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hero_settings (
      id INT PRIMARY KEY CHECK (id = 1) DEFAULT 1,
      eyebrow TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      cta_primary TEXT NOT NULL,
      cta_secondary TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Insert default values if table is empty
  const { rows } = await pool.query("SELECT 1 FROM hero_settings WHERE id = 1");
  if (rows.length === 0) {
    await pool.query(
      `INSERT INTO hero_settings (id, eyebrow, title, subtitle, cta_primary, cta_secondary)
       VALUES (1, $1, $2, $3, $4, $5)`,
      [DEFAULTS.eyebrow, DEFAULTS.title, DEFAULTS.subtitle, DEFAULTS.cta_primary, DEFAULTS.cta_secondary]
    );
  }
};

/** Get the current hero settings */
const getSettings = async () => {
  const { rows } = await pool.query("SELECT eyebrow, title, subtitle, cta_primary, cta_secondary FROM hero_settings WHERE id = 1 LIMIT 1");
  return rows[0] || DEFAULTS;
};

/** Update settings */
const updateSettings = async ({ eyebrow, title, subtitle, cta_primary, cta_secondary }) => {
  const { rows } = await pool.query(
    `UPDATE hero_settings
     SET eyebrow = $1,
         title = $2,
         subtitle = $3,
         cta_primary = $4,
         cta_secondary = $5,
         updated_at = NOW()
     WHERE id = 1
     RETURNING eyebrow, title, subtitle, cta_primary, cta_secondary`,
    [eyebrow, title, subtitle, cta_primary, cta_secondary]
  );
  return rows[0];
};

/** Reset settings to default values */
const resetSettings = async () => {
  const { rows } = await pool.query(
    `UPDATE hero_settings
     SET eyebrow = $1,
         title = $2,
         subtitle = $3,
         cta_primary = $4,
         cta_secondary = $5,
         updated_at = NOW()
     WHERE id = 1
     RETURNING eyebrow, title, subtitle, cta_primary, cta_secondary`,
    [DEFAULTS.eyebrow, DEFAULTS.title, DEFAULTS.subtitle, DEFAULTS.cta_primary, DEFAULTS.cta_secondary]
  );
  return rows[0];
};

module.exports = {
  createTable,
  getSettings,
  updateSettings,
  resetSettings,
  DEFAULTS
};
