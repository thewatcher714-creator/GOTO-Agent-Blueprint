import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Initialize Firebase Admin SDK
  // For Hostinger/Production: Provide service account details via env vars
  if (!admin.apps.length) {
    try {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
        : {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          };

      if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
        });
        console.log("Firebase Admin initialized successfully");
      } else {
        console.warn("Firebase Admin credentials missing. Email API will be restricted.");
      }
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
    }
  }

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // Email Sending API
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, html } = req.body;
    const authHeader = req.headers.authorization;

    // 1. Verify Authorization Header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
      // 2. Verify Firebase ID Token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const email = decodedToken.email;

      // 3. Verify Admin Status
      let isAdmin = false;

      // Fallback admin email check
      if (email === "thewatcher714@gmail.com") {
        isAdmin = true;
      } else {
        // Check Firestore for admin role
        const userDoc = await admin.firestore().collection("users").doc(uid).get();
        if (userDoc.exists && userDoc.data()?.role === "admin") {
          isAdmin = true;
        }
      }

      if (!isAdmin) {
        console.error(`Non-admin attempt: ${email} (${uid})`);
        return res.status(403).json({ error: "Forbidden: Admin access required" });
      }

      // 4. Validate Request Body
      if (!to || !subject || !html) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // 5. Send Email via Nodemailer
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
      console.log(`Email sent by ${email}: ${info.messageId}`);
      res.json({ success: true, messageId: info.messageId });

    } catch (error) {
      console.error("Auth or Email error:", error);
      const status = error.code?.startsWith("auth/") ? 401 : 500;
      res.status(status).json({ 
        error: status === 401 ? "Unauthorized: Invalid token" : "Failed to send email", 
        details: error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("/*", (req, res) =>
      res.sendFile(path.join(__dirname, "dist", "index.html"))
    );
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
