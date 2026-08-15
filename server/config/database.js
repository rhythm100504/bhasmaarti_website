/**
 * PostgreSQL Connection Pool
 * Database: bhasmaarti_db
 * User: postgres
 * Host: localhost:5432
 */

require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "bhasmaarti_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  // Keep connections alive; max 10 concurrent
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection at startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌  PostgreSQL connection failed:", err.message);
    console.error("    Make sure bhasmaarti_db exists on postgres@localhost:5432");
    process.exit(1);
  }
  release();
  console.log("✅  PostgreSQL connected → bhasmaarti_db @ localhost:5432 (user: postgres)");
});

module.exports = pool;
