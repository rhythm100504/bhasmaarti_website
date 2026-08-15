/**
 * Admin Entity / Model
 *
 * Table: admins
 * Database: bhasmaarti_db
 * User: postgres @ localhost:5432
 *
 * Columns:
 *   id          SERIAL PRIMARY KEY
 *   name        VARCHAR(100) NOT NULL
 *   email       VARCHAR(255) UNIQUE NOT NULL
 *   password    VARCHAR(255) NOT NULL        ← bcrypt hash, never plaintext
 *   role        VARCHAR(50)  DEFAULT 'administrator'
 *   is_active   BOOLEAN      DEFAULT true
 *   last_login  TIMESTAMPTZ
 *   created_at  TIMESTAMPTZ  DEFAULT NOW()
 *   updated_at  TIMESTAMPTZ  DEFAULT NOW()
 */

const pool = require("../config/database");

// ── DDL: Create table if it does not exist ───────────────────────────────────
const createTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS admins (
      id          SERIAL       PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      email       VARCHAR(255) UNIQUE NOT NULL,
      password    VARCHAR(255) NOT NULL,
      role        VARCHAR(50)  NOT NULL DEFAULT 'administrator',
      is_active   BOOLEAN      NOT NULL DEFAULT true,
      last_login  TIMESTAMPTZ,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    -- Auto-update updated_at on every row change
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_admins_updated_at ON admins;
    CREATE TRIGGER trg_admins_updated_at
      BEFORE UPDATE ON admins
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `;
  await pool.query(sql);
  console.log("✅  admins table ready");
};

// ── READ ─────────────────────────────────────────────────────────────────────

/** Find admin by email (includes password hash — used only for auth). */
const findByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT * FROM admins WHERE email = $1 AND is_active = true LIMIT 1`,
    [email.toLowerCase()]
  );
  return rows[0] || null;
};

/** Find admin by id — sanitised (no password). */
const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, is_active, last_login, created_at, updated_at
     FROM admins WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

/**
 * Return all admins — sanitised (no password).
 * Ordered by created_at ascending so the original admin appears first.
 */
const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, is_active, last_login, created_at, updated_at
     FROM admins
     ORDER BY created_at ASC`
  );
  return rows;
};

/** Total count of admin rows. */
const count = async () => {
  const { rows } = await pool.query(`SELECT COUNT(*) AS total FROM admins`);
  return parseInt(rows[0].total, 10);
};

/** Check whether at least one admin row exists (used by seed script). */
const exists = async () => {
  const { rows } = await pool.query(`SELECT 1 FROM admins LIMIT 1`);
  return rows.length > 0;
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Create a new admin record.
 * `password` MUST be a bcrypt hash — never pass a plaintext string here.
 */
const create = async ({ name, email, password, role = "administrator" }) => {
  const { rows } = await pool.query(
    `INSERT INTO admins (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, is_active, created_at`,
    [name, email.toLowerCase(), password, role]
  );
  return rows[0];
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/** Record the timestamp of the most recent successful login. */
const updateLastLogin = async (id) => {
  await pool.query(
    `UPDATE admins SET last_login = NOW() WHERE id = $1`,
    [id]
  );
};

/**
 * Toggle is_active between true ↔ false.
 * Returns the updated row (sanitised).
 * Prevents deactivating yourself — caller must enforce this.
 */
const toggleActive = async (id) => {
  const { rows } = await pool.query(
    `UPDATE admins
     SET is_active = NOT is_active
     WHERE id = $1
     RETURNING id, name, email, role, is_active, created_at`,
    [id]
  );
  return rows[0] || null;
};

/**
 * Update name, email, and/or role.
 * Only the provided fields are changed; password is managed separately.
 */
const updateProfile = async (id, { name, email, role }) => {
  // Protect main admin from email updates
  const current = await findById(id);
  if (current && current.email === "admin@bhasmaarti.com") {
    if (email && email.trim().toLowerCase() !== "admin@bhasmaarti.com") {
      throw new Error("The main admin email address (admin@bhasmaarti.com) cannot be updated.");
    }
  }

  const { rows } = await pool.query(
    `UPDATE admins
     SET name  = COALESCE($2, name),
         email = COALESCE($3, email),
         role  = COALESCE($4, role)
     WHERE id = $1
     RETURNING id, name, email, role, is_active, created_at`,
    [id, name, email ? email.toLowerCase() : null, role]
  );
  return rows[0] || null;
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Permanently delete an admin by id.
 * Returns true if a row was deleted, false if id not found.
 * Caller must ensure you cannot delete yourself or the last remaining admin.
 */
const deleteById = async (id) => {
  const { rowCount } = await pool.query(
    `DELETE FROM admins WHERE id = $1`,
    [id]
  );
  return rowCount > 0;
};

// ── EXPORTS ───────────────────────────────────────────────────────────────────
module.exports = {
  createTable,
  // Read
  findByEmail,
  findById,
  findAll,
  count,
  exists,
  // Create
  create,
  // Update
  updateLastLogin,
  toggleActive,
  updateProfile,
  // Delete
  deleteById,
};
