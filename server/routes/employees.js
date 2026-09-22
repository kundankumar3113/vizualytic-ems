const express = require("express");
const router = express.Router();
const database = require("../database");

router.get("/", (req, res) => {
  const employees = database.prepare("SELECT * FROM employees").all();

  res.json(employees);
});
router.post("/", (req, res) => {
  const { name, email, role, department, status = "Active" } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      error: "name, email, and role are required",
    });
  }

  try {
    const result = database
      .prepare(
        `
        INSERT INTO employees
        (name, email, role, department, status)
        VALUES (?, ?, ?, ?, ?)
      `,
      )
      .run(name, email, role, department || null, status);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
      role,
      department,
      status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
