const nodemailer = require("nodemailer");

// Configure SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || "demo@vizualytic.com",
    pass: process.env.SMTP_PASS || "password",
  },
});

async function sendOnboardingEmail(candidate) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
      <h2 style="color: #2563eb;">Welcome to Vizualytic Data Solution!</h2>
      <p>Dear <strong>${candidate.name}</strong>,</p>
      <p>We are thrilled to offer you the position of <strong>${candidate.role}</strong> starting on <strong>${candidate.startDate || "Next Monday"}</strong>.</p>
      <p>Your portal credentials:</p>
      <ul>
        <li><strong>Employee ID:</strong> ${candidate.empId}</li>
        <li><strong>Work Email:</strong> ${candidate.email}</li>
      </ul>
      <p><a href="https://portal.vizualytic.com/login" style="background: #2563eb; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px;">Activate Account</a></p>
      <hr />
      <p style="font-size: 12px; color: #64748b;">Vizualytic Data Solution HR Operations</p>
    </div>
  `;

  return await transporter.sendMail({
    from: '"Vizualytic HR" <hr@vizualytic.com>',
    to: candidate.email,
    subject: `Welcome to Vizualytic Data Solution - ${candidate.name}!`,
    html: emailContent,
  });
}

module.exports = { sendOnboardingEmail };
