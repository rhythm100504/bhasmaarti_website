/**
 * PostgreSQL Connection Pool
 * Database: bhasmaarti_db
 * User: postgres
 * Host: localhost:5432
 */

require("dotenv").config();
const { Pool } = require("pg");

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Render Postgres
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "bhasmaarti_db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

// Test connection at startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌  PostgreSQL connection failed:", err.message);
    if (!process.env.DATABASE_URL) {
      console.error("    Make sure bhasmaarti_db exists locally or DATABASE_URL is set");
    }
    process.exit(1);
  }
  release();
  
  if (process.env.DATABASE_URL) {
    console.log("✅  PostgreSQL connected → Render Database");
  } else {
    console.log("✅  PostgreSQL connected → Local Database");
  }
});

module.exports = pool;
