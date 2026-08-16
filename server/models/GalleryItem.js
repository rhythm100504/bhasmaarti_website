const pool = require("../config/database");

/** Create gallery_items table if it does not exist */
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date VARCHAR(100) NOT NULL,
      image_url TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

/** Insert a new gallery item */
const insertGalleryItem = async ({
  title,
  description,
  date,
  image_url,
  status = "Published",
  created_at = null
}) => {
  const { rows } = await pool.query(
    `INSERT INTO gallery_items (title, description, date, image_url, status, created_at)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, NOW()))
     RETURNING id, title, description, date, image_url, status, created_at`,
    [title, description, date, image_url, status, created_at]
  );
  return rows[0];
};

/** Update an existing gallery item */
const updateGalleryItem = async (
  id,
  { title, description, date, image_url, status, created_at = null }
) => {
  const { rows } = await pool.query(
    `UPDATE gallery_items
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         date = COALESCE($4, date),
         image_url = COALESCE($5, image_url),
         status = COALESCE($6, status),
         created_at = COALESCE($7, created_at),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, description, date, image_url, status, created_at`,
    [id, title, description, date, image_url, status, created_at]
  );
  return rows[0] || null;
};

/** Get list of all gallery items sorted by creation descending */
const getGalleryItemsList = async () => {
  const { rows } = await pool.query(
    `SELECT id, title, description, date, image_url, status, created_at
     FROM gallery_items
     ORDER BY created_at DESC`
  );
  return rows;
};

/** Get details of a single gallery item by ID */
const getGalleryItemById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, title, description, date, image_url, status, created_at
     FROM gallery_items
     WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

/** Delete a gallery item by ID */
const deleteGalleryItem = async (id) => {
  const { rowCount } = await pool.query(
    `DELETE FROM gallery_items WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
};

module.exports = {
  createTable,
  insertGalleryItem,
  updateGalleryItem,
  getGalleryItemsList,
  getGalleryItemById,
  deleteGalleryItem
};
