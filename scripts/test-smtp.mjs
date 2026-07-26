import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: { user: "hmohsinkhan5@gmail.com", pass: "fxcy kuwl rfez gazf" },
});

try {
  await transporter.verify();
  console.log("✓ SMTP connection verified");
} catch (e) {
  console.log("✗ SMTP verify failed:", e.message);
  process.exit(1);
}

const info = await transporter.sendMail({
  from: '"Mohsin Raza" <hmohsinkhan5@gmail.com>',
  to: "hmohsinkhan5@gmail.com",
  subject: "Direct Test from Terminal",
  text: "If you see this, SMTP is fully working.",
});

console.log("✓ Email sent! Message ID:", info.messageId);
console.log("  Check hmohsinkhan5@gmail.com inbox");
