const express = require("express");
const router = express.Router();
const database = require("../database");
const { sendOnboardingEmail } = require("../utils/mailer");

router.get("/", (req, res) => {
  const candidates = database
    .prepare("SELECT * FROM candidates ORDER BY rowid DESC")
    .all();

  res.json(candidates);
});

router.post("/", (req, res) => {
  const { name, role, stage = "Screening", email, department } = req.body;

  if (!name || !role || !email) {
    return res.status(400).json({
      error: "name, role, and email are required",
    });
  }

  const id = `C-${Date.now()}`;

  database
    .prepare(
      `
      INSERT INTO candidates
      (id, name, role, stage, email, department)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    )
    .run(id, name, role, stage, email, department || null);

  res.status(201).json({
    id,
    name,
    role,
    stage,
    email,
    department,
  });
});

router.post("/hire", async (req, res) => {
  const { candidateId, email, name, role, department } = req.body;

  try {
    const empId = `VDS-${Math.floor(1000 + Math.random() * 9000)}`;

    await sendOnboardingEmail({
      name,
      email,
      role,
      empId,
      startDate: "2026-10-01",
    });

    database
      .prepare(
        `
        UPDATE candidates
        SET stage = 'Hired'
        WHERE id = ?
      `,
      )
      .run(candidateId);

    res.json({
      success: true,
      message: `Successfully hired ${name}!`,
      employee: {
        empId,
        name,
        role,
        department,
        email,
        status: "Active",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
router.patch("/:candidateId/stage", (req, res) => {
  const { stage } = req.body;
  const { candidateId } = req.params;

  const allowedStages = ["Screening", "Interview", "Offer", "Hired"];

  if (!allowedStages.includes(stage)) {
    return res.status(400).json({
      error: "Invalid recruitment stage",
    });
  }

  const result = database
    .prepare(
      `
      UPDATE candidates
      SET stage = ?
      WHERE id = ?
    `,
    )
    .run(stage, candidateId);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Candidate not found",
    });
  }

  const candidate = database
    .prepare("SELECT * FROM candidates WHERE id = ?")
    .get(candidateId);

  res.json(candidate);
});

module.exports = router;
