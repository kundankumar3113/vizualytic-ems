const express = require("express");
const router = express.Router();
const { sendOnboardingEmail } = require("../utils/mailer");

// Simulated candidate database
let candidates = [
  {
    id: "C-101",
    name: "Aarav Sharma",
    role: "Data Engineer",
    stage: "Screening",
    email: "aarav@example.com",
  },
  {
    id: "C-102",
    name: "Neha Gupta",
    role: "Frontend Developer",
    stage: "Hired",
    email: "neha@example.com",
  },
];

// Hire candidate and send automated email
router.post("/hire", async (req, res) => {
  const { candidateId, email, name, role, department } = req.body;

  try {
    const empId = `VDS-${Math.floor(1000 + Math.random() * 9000)}`;

    // Trigger automated hiring email
    await sendOnboardingEmail({
      name,
      email,
      role,
      empId,
      startDate: "2026-10-01",
    });

    res.status(200).json({
      success: true,
      message: `Successfully hired ${name}! Automated welcome email sent to ${email}.`,
      employee: { empId, name, role, department, email, status: "Active" },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
