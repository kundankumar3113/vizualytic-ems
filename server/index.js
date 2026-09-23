const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const requireAuth = require("./middleware/auth");

const employeeRoutes = require("./routes/employees");
const payrollRoutes = require("./routes/payroll");
const recruitmentRoutes = require("./routes/recruitment");
const attendanceRoutes = require("./routes/attendance");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Login and registration do not require authentication
app.use("/api/auth", authRoutes);

// All application data requires a valid JWT
app.use("/api/employees", requireAuth, employeeRoutes);
app.use("/api/payroll", requireAuth, payrollRoutes);
app.use("/api/recruitment", requireAuth, recruitmentRoutes);
app.use("/api/attendance", requireAuth, attendanceRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(
    `Vizualytic Data Solution EMS running at http://localhost:${PORT}`,
  );
});
