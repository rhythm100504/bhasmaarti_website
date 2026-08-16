require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");


// ── Database connection ───────────
// Importing this module immediately opens the connection pool and validates
// the connection. If the DB is unreachable, the process exits with code 1.
const pool = require("./config/database");

// ── Models & Routes ──────────────────────────────────────────────────────────
const Admin = require("./models/Admin");
const HeroSettings = require("./models/HeroSettings");
const AboutSettings = require("./models/AboutSettings");
const TrustSettings = require("./models/TrustSettings");
const Media = require("./models/Media");
const Aarti = require("./models/Aarti");
const LibraryItem = require("./models/LibraryItem");
const CalendarEvent = require("./models/CalendarEvent");
const GalleryItem = require("./models/GalleryItem");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminManagement");
const heroRoutes = require("./routes/heroSettings");
const aboutRoutes = require("./routes/aboutSettings");
const trustRoutes = require("./routes/trustSettings");
const mediaRoutes = require("./routes/media");
const aartiRoutes = require("./routes/aarti");
const libraryRoutes = require("./routes/libraryItem");
const calendarRoutes = require("./routes/calendarEvent");
const galleryRoutes = require("./routes/galleryItem");



const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowedLocals = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001"
    ];

    // 1. Allow localhost development
    if (allowedLocals.includes(origin)) return callback(null, true);

    // 2. Allow exact Vercel production domain
    if (origin === "https://bhasmaarti-website.vercel.app") return callback(null, true);

    // 3. Allow Vercel preview/deployment URLs for this specific project
    if (origin.startsWith("https://bhasmaarti-website") && origin.endsWith(".vercel.app")) return callback(null, true);

    // 4. Allow explicitly configured environment variable URL
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);

    // 5. Reject everything else
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically so files are accessible publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS db_time");
    res.status(200).json({
      status: "ok",
      service: "BhasmaArti Admin API",
      database_connected: true,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({ status: "error", message: "Database unreachable." });
  }
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/trust", trustRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/aartis", aartiRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/gallery", galleryRoutes);


// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[server error]", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ── Bootstrap: run migrations then start the server ─────────────────────────
const start = async () => {
  try {
    // Create tables if they do not exist
    await Admin.createTable();
    await HeroSettings.createTable();
    await AboutSettings.createTable();
    await TrustSettings.createTable();
    await Media.createTable();
    await Aarti.createTable();
    await LibraryItem.createTable();
    await CalendarEvent.createTable();
    await GalleryItem.createTable();


    // ── Auto Seed ────────────────────────────────────────────────────────────
    const bcrypt = require("bcryptjs");
    const hasAdmin = await Admin.exists();
    if (!hasAdmin) {
      console.log("🌱 No admins found. Seeding default admin...");
      const passwordHash = await bcrypt.hash("admin", 12); // Password is 'admin' to match previous tests
      await Admin.create({
        name: "Temple Admin",
        email: "admin@bhasmaarti.com",
        password: passwordHash,
        role: "administrator",
      });
      console.log("✅ Default admin seeded successfully. (email: admin@bhasmaarti.com, password: admin)");
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🔥  BhasmaArti Admin API running on port ${PORT}`);
      console.log(`    Health   : GET  /health`);
      console.log(`    Login    : POST /api/auth/login`);
      console.log(`    Verify   : GET  /api/auth/verify\n`);
    });
  } catch (err) {
    console.error("❌  Failed to start server:", err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
