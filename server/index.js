const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const employeeRoutes = require("./routes/employees");
const payrollRoutes = require("./routes/payroll");
const recruitmentRoutes = require("./routes/recruitment");
const attendanceRoutes = require("./routes/attendance");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Serve Frontend
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(
    `🚀 Vizualytic Data Solution EMS running at http://localhost:${PORT}`,
  );
});
