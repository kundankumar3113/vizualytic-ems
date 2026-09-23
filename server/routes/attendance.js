const express = require("express");
const router = express.Router();
const database = require("../database");

router.get("/", (req, res) => {
  const attendance = database.prepare("SELECT * FROM attendance").all();

  res.json(attendance);
});

router.post("/", (req, res) => {
  const { employee_id, attendance_date, status, check_in, check_out } =
    req.body;

  if (!attendance_date || !status) {
    return res.status(400).json({
      error: "attendance_date and status are required",
    });
  }

  const result = database
    .prepare(
      `
      INSERT INTO attendance
      (employee_id, attendance_date, status, check_in, check_out)
      VALUES (?, ?, ?, ?, ?)
    `,
    )
    .run(
      employee_id || null,
      attendance_date,
      status,
      check_in || null,
      check_out || null,
    );

  res.status(201).json({
    id: result.lastInsertRowid,
    employee_id,
    attendance_date,
    status,
    check_in,
    check_out,
  });
});

router.patch("/clock-out", (req, res) => {
  const { employee_id, attendance_date, check_out } = req.body;

  if (!employee_id || !attendance_date || !check_out) {
    return res.status(400).json({
      error: "employee_id, attendance_date, and check_out are required",
    });
  }

  const result = database
    .prepare(
      `
      UPDATE attendance
      SET check_out = ?
      WHERE employee_id = ?
        AND attendance_date = ?
        AND check_out IS NULL
    `,
    )
    .run(check_out, employee_id, attendance_date);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "No open attendance record found",
    });
  }

  res.json({ success: true, check_out });
});

module.exports = router;
