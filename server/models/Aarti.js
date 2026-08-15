const pool = require("../config/database");

/** Create aartis table if it does not exist */
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS aartis (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'Published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

/** Insert a new Aarti recording */
const insertAarti = async ({ title, category, duration, video_url, thumbnail_url = null, status = "Published", created_at = null }) => {
  const { rows } = await pool.query(
    `INSERT INTO aartis (title, category, duration, video_url, thumbnail_url, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, NOW()))
     RETURNING id, title, category, duration, video_url, thumbnail_url, status, created_at`,
    [title, category, duration, video_url, thumbnail_url, status, created_at]
  );
  return rows[0];
};

/** Update an existing Aarti recording */
const updateAarti = async (id, { title, category, duration, video_url, thumbnail_url, status, created_at = null }) => {
  const { rows } = await pool.query(
    `UPDATE aartis
     SET title = COALESCE($2, title),
         category = COALESCE($3, category),
         duration = COALESCE($4, duration),
         video_url = COALESCE($5, video_url),
         thumbnail_url = COALESCE($6, thumbnail_url),
         status = COALESCE($7, status),
         created_at = COALESCE($8, created_at),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, category, duration, video_url, thumbnail_url, status, created_at`,
    [id, title, category, duration, video_url, thumbnail_url, status, created_at]
  );
  return rows[0] || null;
};

/** Get list of all recordings sorted by creation date descending */
const getAartisList = async () => {
  const { rows } = await pool.query(
    `SELECT id, title, category, duration, video_url, thumbnail_url, status, created_at
     FROM aartis
     ORDER BY created_at DESC`
  );
  return rows;
};

/** Get details of a single Aarti by ID */
const getAartiById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, title, category, duration, video_url, thumbnail_url, status, created_at
     FROM aartis
     WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

/** Delete an Aarti recording by ID */
const deleteAarti = async (id) => {
  const { rowCount } = await pool.query(
    `DELETE FROM aartis WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
};

module.exports = {
  createTable,
  insertAarti,
  updateAarti,
  getAartisList,
  getAartiById,
  deleteAarti
};
