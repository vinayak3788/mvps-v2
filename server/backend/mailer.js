// src/backend/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const isEmailConfigured = Boolean(EMAIL_USER && EMAIL_PASS);

// create a single transporter instance for reuse
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// verify once at startup (optional)
if (isEmailConfigured) {
  transporter
    .verify()
    .then(() => console.log("✉️ Mailer is configured and ready"))
    .catch((err) => console.error("✉️ Mailer verification failed:", err));
} else {
  console.warn(
    "⚠️ Missing EMAIL_USER or EMAIL_PASS in environment. Email features disabled.",
  );
  console.warn(
    "📌 Tip: Set EMAIL_USER and EMAIL_PASS in your .env file to enable emails.",
  );
}

/**
 * Send an order confirmation email
 *
 * @param {string} toEmail   Recipient email address
 * @param {string} subject   Email subject line
 * @param {string} htmlContent  HTML body content
 */
export const sendOrderConfirmation = async (toEmail, subject, htmlContent) => {
  if (!isEmailConfigured) return;

  try {
    await transporter.sendMail({
      from: `"MVPS Printing Services" <${EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
    console.log("📧 Order confirmation email sent to", toEmail);
  } catch (err) {
    console.error("❌ Failed to send order confirmation:", err);
  }
};
