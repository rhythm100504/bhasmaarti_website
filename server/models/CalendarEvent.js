const pool = require("../config/database");

/** Create calendar_events table if it does not exist */
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date VARCHAR(100) NOT NULL,
      image_url TEXT NOT NULL,
      more_info TEXT,
      aartis_count INTEGER NOT NULL DEFAULT 5,
      status VARCHAR(50) NOT NULL DEFAULT 'Published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

/** Insert a new Calendar event */
const insertCalendarEvent = async ({
  title,
  description,
  date,
  image_url,
  more_info = null,
  aartis_count = 5,
  status = "Published",
  created_at = null
}) => {
  const { rows } = await pool.query(
    `INSERT INTO calendar_events (title, description, date, image_url, more_info, aartis_count, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, NOW()))
     RETURNING id, title, description, date, image_url, more_info, aartis_count, status, created_at`,
    [title, description, date, image_url, more_info, aartis_count, status, created_at]
  );
  return rows[0];
};

/** Update an existing Calendar event */
const updateCalendarEvent = async (
  id,
  { title, description, date, image_url, more_info, aartis_count, status, created_at = null }
) => {
  const { rows } = await pool.query(
    `UPDATE calendar_events
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         date = COALESCE($4, date),
         image_url = COALESCE($5, image_url),
         more_info = COALESCE($6, more_info),
         aartis_count = COALESCE($7, aartis_count),
         status = COALESCE($8, status),
         created_at = COALESCE($9, created_at),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, description, date, image_url, more_info, aartis_count, status, created_at`,
    [id, title, description, date, image_url, more_info, aartis_count, status, created_at]
  );
  return rows[0] || null;
};

/** Get list of all calendar events sorted by date or creation descending */
const getCalendarEventsList = async () => {
  const { rows } = await pool.query(
    `SELECT id, title, description, date, image_url, more_info, aartis_count, status, created_at
     FROM calendar_events
     ORDER BY created_at DESC`
  );
  return rows;
};

/** Get details of a single calendar event by ID */
const getCalendarEventById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, title, description, date, image_url, more_info, aartis_count, status, created_at
     FROM calendar_events
     WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

/** Delete a calendar event by ID */
const deleteCalendarEvent = async (id) => {
  const { rowCount } = await pool.query(
    `DELETE FROM calendar_events WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
};

module.exports = {
  createTable,
  insertCalendarEvent,
  updateCalendarEvent,
  getCalendarEventsList,
  getCalendarEventById,
  deleteCalendarEvent
};
