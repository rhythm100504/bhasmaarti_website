const express = require("express");
const router = express.Router();
const { login, verify, logout } = require("../controllers/auth");

// POST   /api/auth/login   — authenticate and receive JWT
router.post("/login", login);

// GET    /api/auth/verify  — validate a bearer token
router.get("/verify", verify);

// POST   /api/auth/logout  — client-side only; server acknowledges
router.post("/logout", logout);

module.exports = router;
