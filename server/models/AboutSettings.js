/**
 * AboutSettings Entity / Model
 *
 * Table: about_settings
 * Database: bhasmaarti_db
 *
 * Columns:
 *   id              INT PRIMARY KEY DEFAULT 1
 *   eyebrow         TEXT NOT NULL,
 *   title           TEXT NOT NULL,
 *   subtitle        TEXT NOT NULL,
 *   text_1          TEXT NOT NULL,
 *   text_2          TEXT NOT NULL,
 *   stats           JSONB NOT NULL,
 *   updated_at      TIMESTAMPTZ DEFAULT NOW()
 */

const pool = require("../config/database");

const DEFAULTS = {
  eyebrow: "The Sacred Legend",
  title: "Shri Mahakaleshwar Jyotirlinga",
  subtitle: "One of the Twelve Sacred Jyotirlingas of India",
  text_1: "Located in the ancient city of Ujjain, Shri Mahakaleshwar Jyotirlinga is one of the most powerful manifestations of Lord Shiva on earth — a sacred flame of divine consciousness that has burned continuously since the dawn of cosmic time.",
  text_2: "Known as the only Dakshinamukhi Jyotirlinga — the one that faces south — Mahakaleshwar represents the supreme force of time itself. As Mahakal, Lord Shiva is the master of death and liberation, transcending the boundaries of past, present, and future.",
  stats: [
    { id: 1, label: "Sacred Jyotirlingas", value: "12" },
    { id: 2, label: "Years of History", value: "5000+" },
    { id: 3, label: "Daily Aartis", value: "6" },
    { id: 4, label: "Divine Blessings", value: "∞" }
  ]
};

/** Ensure table exists and has exactly one row of settings initialized */
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS about_settings (
      id INT PRIMARY KEY CHECK (id = 1) DEFAULT 1,
      eyebrow TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      text_1 TEXT NOT NULL,
      text_2 TEXT NOT NULL,
      stats JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Insert default values if table is empty
  const { rows } = await pool.query("SELECT 1 FROM about_settings WHERE id = 1");
  if (rows.length === 0) {
    await pool.query(
      `INSERT INTO about_settings (id, eyebrow, title, subtitle, text_1, text_2, stats)
       VALUES (1, $1, $2, $3, $4, $5, $6)`,
      [DEFAULTS.eyebrow, DEFAULTS.title, DEFAULTS.subtitle, DEFAULTS.text_1, DEFAULTS.text_2, JSON.stringify(DEFAULTS.stats)]
    );
  }
};

/** Get the current about settings */
const getSettings = async () => {
  const { rows } = await pool.query("SELECT eyebrow, title, subtitle, text_1, text_2, stats FROM about_settings WHERE id = 1 LIMIT 1");
  return rows[0] || DEFAULTS;
};

/** Update settings */
const updateSettings = async ({ eyebrow, title, subtitle, text_1, text_2, stats }) => {
  const { rows } = await pool.query(
    `UPDATE about_settings
     SET eyebrow = $1,
         title = $2,
         subtitle = $3,
         text_1 = $4,
         text_2 = $5,
         stats = $6,
         updated_at = NOW()
     WHERE id = 1
     RETURNING eyebrow, title, subtitle, text_1, text_2, stats`,
    [eyebrow, title, subtitle, text_1, text_2, JSON.stringify(stats)]
  );
  return rows[0];
};

/** Reset settings to default values */
const resetSettings = async () => {
  const { rows } = await pool.query(
    `UPDATE about_settings
     SET eyebrow = $1,
         title = $2,
         subtitle = $3,
         text_1 = $4,
         text_2 = $5,
         stats = $6,
         updated_at = NOW()
     WHERE id = 1
     RETURNING eyebrow, title, subtitle, text_1, text_2, stats`,
    [DEFAULTS.eyebrow, DEFAULTS.title, DEFAULTS.subtitle, DEFAULTS.text_1, DEFAULTS.text_2, JSON.stringify(DEFAULTS.stats)]
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
