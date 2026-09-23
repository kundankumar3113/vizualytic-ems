const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../database");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Name, email, and password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = database
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({
      error: "Email is already registered",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = database
    .prepare(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
    )
    .run(name.trim(), normalizedEmail, passwordHash, "employee");

  const user = {
    id: result.lastInsertRowid,
    name: name.trim(),
    email: normalizedEmail,
    role: "employee",
  };

  res.status(201).json({
    token: createToken(user),
    user,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const user = database
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({
    token: createToken(publicUser),
    user: publicUser,
  });
});

module.exports = router;
