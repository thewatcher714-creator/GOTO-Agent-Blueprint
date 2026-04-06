import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// Email Sending API
app.post("/api/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  const adminSecret = process.env.ADMIN_API_SECRET;
  const incomingSecret = req.headers["x-admin-secret"];

  // SECURITY: Minimal but real protection against open relay.
  // Tradeoff: The secret is shared with the client. It prevents blind relaying
  // but is visible to anyone inspecting the client-side JS bundle.
  if (!adminSecret || incomingSecret !== adminSecret) {
    console.error("Unauthorized email attempt from:", req.ip);
    return res.status(401).json({ error: "Unauthorized: Missing or invalid admin secret" });
  }

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "The Go-To Agent Blueprint"}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

app.get(/.*/, (req, res) =>
 res.sendFile(path.join(__dirname, "dist", "index.html"))
);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
