const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOnboardingEmail(candidate) {
  return transporter.sendMail({
    from: `"Vizualytic HR" <${process.env.SMTP_FROM}>`,
    to: candidate.email,
    subject: `Welcome to Vizualytic Data Solution - ${candidate.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Vizualytic Data Solution!</h2>
        <p>Dear <strong>${candidate.name}</strong>,</p>
        <p>You have been selected for the role of <strong>${candidate.role}</strong>.</p>
        <p>Employee ID: ${candidate.empId}</p>
        <p>Start date: ${candidate.startDate || "To be confirmed"}</p>
        <hr />
        <p>Vizualytic Data Solution HR Operations</p>
      </div>
    `,
  });
}

module.exports = { sendOnboardingEmail };
