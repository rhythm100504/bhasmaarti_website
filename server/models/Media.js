const pool = require("../config/database");

/** Create media_items table if it does not exist */
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS media_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'pdf'
      file_url TEXT NOT NULL,
      file_size BIGINT NOT NULL,
      duration VARCHAR(50),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Run database migration to ensure duration column exists if table was created previously
  await pool.query(`
    ALTER TABLE media_items ADD COLUMN IF NOT EXISTS duration VARCHAR(50);
  `);
};

/** Insert a new uploaded media item */
const insertMedia = async ({ name, filename, file_type, file_url, file_size, duration = null }) => {
  const { rows } = await pool.query(
    `INSERT INTO media_items (name, filename, file_type, file_url, file_size, duration)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, filename, file_type, file_url, file_size, duration, created_at`,
    [name, filename, file_type, file_url, file_size, duration]
  );
  return rows[0];
};

/** Get list of all media items sorted by date descending */
const getMediaList = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, filename, file_type, file_url, file_size, duration, created_at
     FROM media_items
     ORDER BY created_at DESC`
  );
  return rows;
};

/** Find a media item by ID */
const getMediaById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, name, filename, file_type, file_url, file_size, duration, created_at
     FROM media_items
     WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

/** Delete a media item record by ID */
const deleteMedia = async (id) => {
  const { rowCount } = await pool.query(
    `DELETE FROM media_items WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
};

module.exports = {
  createTable,
  insertMedia,
  getMediaList,
  getMediaById,
  deleteMedia
};
