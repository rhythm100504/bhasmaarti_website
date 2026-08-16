const pool = require("../config/database");

/** Create library_items table if it does not exist */
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS library_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category VARCHAR(100) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      lyrics TEXT,
      translation TEXT,
      audio_url TEXT NOT NULL,
      thumbnail_url TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'Published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

/** Insert a new Library resource */
const insertLibraryItem = async ({
  title,
  description = null,
  category,
  duration,
  lyrics = null,
  translation = null,
  audio_url,
  thumbnail_url = null,
  status = "Published",
  created_at = null
}) => {
  const { rows } = await pool.query(
    `INSERT INTO library_items (title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, NOW()))
     RETURNING id, title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at`,
    [title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at]
  );
  return rows[0];
};

/** Update an existing Library resource */
const updateLibraryItem = async (
  id,
  { title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at = null }
) => {
  const { rows } = await pool.query(
    `UPDATE library_items
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         category = COALESCE($4, category),
         duration = COALESCE($5, duration),
         lyrics = COALESCE($6, lyrics),
         translation = COALESCE($7, translation),
         audio_url = COALESCE($8, audio_url),
         thumbnail_url = COALESCE($9, thumbnail_url),
         status = COALESCE($10, status),
         created_at = COALESCE($11, created_at),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at`,
    [id, title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at]
  );
  return rows[0] || null;
};

/** Get list of all library items sorted by creation date descending */
const getLibraryItemsList = async () => {
  const { rows } = await pool.query(
    `SELECT id, title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at
     FROM library_items
     ORDER BY created_at DESC`
  );
  return rows;
};

/** Get details of a single library item by ID */
const getLibraryItemById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at
     FROM library_items
     WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

/** Delete a library item by ID */
const deleteLibraryItem = async (id) => {
  const { rowCount } = await pool.query(
    `DELETE FROM library_items WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
};

module.exports = {
  createTable,
  insertLibraryItem,
  updateLibraryItem,
  getLibraryItemsList,
  getLibraryItemById,
  deleteLibraryItem
};
