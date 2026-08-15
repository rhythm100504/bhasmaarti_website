/**
 * Seed Script — inserts the default admin account.
 *
 * Database : bhasmaarti_db
 * User     : postgres
 * Host     : localhost:5432
 *
 * Admin credentials seeded:
 *   email    → admin@bhasmaarti.com
 *   password → admin123  (stored as bcrypt hash)
 *
 * Run: node scripts/seed.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const pool = require("../config/database");

const seed = async () => {
  try {
    console.log("\n🌱  Running seed for bhasmaarti_db …\n");

    // 1. Ensure the table exists
    await Admin.createTable();

    // 2. Skip if an admin already exists
    const hasAdmin = await Admin.exists();
    if (hasAdmin) {
      console.log("⚠️   Admin already exists — skipping seed.");
      process.exit(0);
    }

    // 3. Hash the password
    const passwordHash = await bcrypt.hash("admin123", 12);

    // 4. Insert the admin row
    const admin = await Admin.create({
      name: "Temple Admin",
      email: "admin@bhasmaarti.com",
      password: passwordHash,
      role: "administrator",
    });

    console.log("✅  Admin seeded successfully:");
    console.log(`    ID    : ${admin.id}`);
    console.log(`    Name  : ${admin.name}`);
    console.log(`    Email : ${admin.email}`);
    console.log(`    Role  : ${admin.role}`);
    console.log("\n    Login with:");
    console.log("    Email    → admin@bhasmaarti.com");
    console.log("    Password → admin123\n");

    process.exit(0);
  } catch (err) {
    console.error("❌  Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
