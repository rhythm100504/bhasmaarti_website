/**
 * TrustSettings Entity / Model
 *
 * Tables:
 *   1. trust_settings (single-row configuration for section headers)
 *   2. trust_features (CRUD table for feature cards)
 *
 * Database: bhasmaarti_db
 */

const pool = require("../config/database");

const DEFAULTS = {
  eyebrow: "Why BhasmaArti.com",
  title: "Sacred. Authentic. Devotional."
};

const DEFAULT_FEATURES = [
  {
    title: "Daily Updated Archive",
    description: "Fresh Bhasma Aarti recordings added regularly to our growing collection",
    image_url: "/aarti-diya-thumb.png",
    status: "Active"
  },
  {
    title: "Temple Information",
    description: "Accurate, curated details about Mahakaleshwar Jyotirlinga and its sacred history",
    image_url: "/temple-bell-thumb.png",
    status: "Active"
  },
  {
    title: "Festival Coverage",
    description: "Immersive coverage of Mahashivratri, Shravan Maas, and other sacred occasions",
    image_url: "/bhasma-aarti-preview.png",
    status: "Active"
  },
  {
    title: "Devotional Library",
    description: "Stotras, mantras, bhajans, and sacred texts in one curated spiritual resource",
    image_url: "/temple-bell-thumb.png",
    status: "Active"
  },
  {
    title: "Mobile Optimized",
    description: "Seamless devotional experience across all your devices, anytime",
    image_url: "/aarti-diya-thumb.png",
    status: "Active"
  },
  {
    title: "Live Streaming Ready",
    description: "Infrastructure in place for future live Bhasma Aarti streaming experiences",
    image_url: "/bhasma-aarti-preview.png",
    status: "Active"
  }
];

/** Ensure tables exist and default data is seeded */
const createTable = async () => {
  // 1. Headers table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trust_settings (
      id INT PRIMARY KEY CHECK (id = 1) DEFAULT 1,
      eyebrow TEXT NOT NULL,
      title TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // 2. Features table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trust_features (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'Active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Seed settings headers if empty
  const settingsCheck = await pool.query("SELECT 1 FROM trust_settings WHERE id = 1");
  if (settingsCheck.rows.length === 0) {
    await pool.query(
      `INSERT INTO trust_settings (id, eyebrow, title) VALUES (1, $1, $2)`,
      [DEFAULTS.eyebrow, DEFAULTS.title]
    );
  }

  // Seed features list if empty
  const featuresCheck = await pool.query("SELECT 1 FROM trust_features LIMIT 1");
  if (featuresCheck.rows.length === 0) {
    for (const f of DEFAULT_FEATURES) {
      await pool.query(
        `INSERT INTO trust_features (title, description, image_url, status)
         VALUES ($1, $2, $3, $4)`,
        [f.title, f.description, f.image_url, f.status]
      );
    }
  }
};

/** Get settings headers */
const getSettings = async () => {
  const { rows } = await pool.query("SELECT eyebrow, title FROM trust_settings WHERE id = 1 LIMIT 1");
  return rows[0] || DEFAULTS;
};

/** Update settings headers */
const updateSettings = async ({ eyebrow, title }) => {
  const { rows } = await pool.query(
    `UPDATE trust_settings
     SET eyebrow = $1,
         title = $2,
         updated_at = NOW()
     WHERE id = 1
     RETURNING eyebrow, title`,
    [eyebrow, title]
  );
  return rows[0];
};

/** Get all features */
const getFeatures = async () => {
  const { rows } = await pool.query(
    `SELECT id, title, description, image_url, status, created_at, updated_at
     FROM trust_features
     ORDER BY id ASC`
  );
  return rows;
};

/** Create a new feature */
const createFeature = async ({ title, description, image_url, status = "Active" }) => {
  const { rows } = await pool.query(
    `INSERT INTO trust_features (title, description, image_url, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, image_url, status, created_at`,
    [title, description, image_url, status]
  );
  return rows[0];
};

/** Update a feature */
const updateFeature = async (id, { title, description, image_url, status }) => {
  const { rows } = await pool.query(
    `UPDATE trust_features
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         image_url = COALESCE($4, image_url),
         status = COALESCE($5, status),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, description, image_url, status, updated_at`,
    [id, title, description, image_url, status]
  );
  return rows[0] || null;
};

/** Toggle status active/inactive */
const toggleFeatureStatus = async (id) => {
  const { rows } = await pool.query(
    `UPDATE trust_features
     SET status = CASE WHEN status = 'Active' THEN 'Inactive' ELSE 'Active' END,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, description, image_url, status, updated_at`,
    [id]
  );
  return rows[0] || null;
};

/** Delete a feature by ID */
const deleteFeature = async (id) => {
  const { rowCount } = await pool.query(
    `DELETE FROM trust_features WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
};

/** Reset settings and features back to system defaults */
const resetToDefaults = async () => {
  // Update settings back to DEFAULTS
  await pool.query(
    `UPDATE trust_settings
     SET eyebrow = $1,
         title = $2,
         updated_at = NOW()
     WHERE id = 1`,
    [DEFAULTS.eyebrow, DEFAULTS.title]
  );

  // Clear features and re-insert defaults
  await pool.query("TRUNCATE TABLE trust_features RESTART IDENTITY");
  for (const f of DEFAULT_FEATURES) {
    await pool.query(
      `INSERT INTO trust_features (title, description, image_url, status)
       VALUES ($1, $2, $3, $4)`,
      [f.title, f.description, f.image_url, f.status]
    );
  }

  // Return reset settings and features
  const settings = await getSettings();
  const features = await getFeatures();
  return { settings, features };
};

module.exports = {
  createTable,
  getSettings,
  updateSettings,
  getFeatures,
  createFeature,
  updateFeature,
  toggleFeatureStatus,
  deleteFeature,
  resetToDefaults,
  DEFAULTS,
  DEFAULT_FEATURES
};
