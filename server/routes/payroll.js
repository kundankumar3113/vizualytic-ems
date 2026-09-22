const express = require("express");
const router = express.Router();

// Calculate Salary Breakdown Endpoint
router.post("/calculate", (req, res) => {
  const {
    baseSalary = 0,
    hra = 0,
    allowances = 0,
    taxPercent = 10,
    pfPercent = 12,
  } = req.body;

  const base = parseFloat(baseSalary);
  const houseRent = parseFloat(hra);
  const allow = parseFloat(allowances);

  const grossSalary = base + houseRent + allow;
  const taxDeduction = (grossSalary * parseFloat(taxPercent)) / 100;
  const pfDeduction = (base * parseFloat(pfPercent)) / 100;
  const totalDeductions = taxDeduction + pfDeduction;
  const netTakeHome = grossSalary - totalDeductions;

  res.json({
    baseSalary: base,
    hra: houseRent,
    allowances: allow,
    grossSalary,
    taxDeduction,
    pfDeduction,
    totalDeductions,
    netTakeHome,
  });
});

module.exports = router;
