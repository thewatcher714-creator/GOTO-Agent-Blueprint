import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      : {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        };

    if (
      serviceAccount.projectId &&
      serviceAccount.clientEmail &&
      serviceAccount.privateKey
    ) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized successfully");
    } else {
      console.warn("Firebase Admin credentials missing");
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

initFirebaseAdmin();

const distPath = path.join(__dirname, "dist");

app.use(express.json());

// GET /robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(distPath, "robots.txt"), (error) => {
    if (error) {
      console.error("robots.txt not found:", error);
      res.status(404).send("robots.txt not found");
    }
  });
});

// GET /sitemap.xml
// Generated directly by Express to avoid file-path/runtime serving issues.
app.get("/sitemap.xml", (req, res) => {
  const baseUrl = "https://gotoagentblueprint.com";

  const pages = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/framework", priority: "0.9", changefreq: "monthly" },
    { path: "/services", priority: "0.9", changefreq: "monthly" },
    { path: "/booking", priority: "0.8", changefreq: "monthly" },
    { path: "/resources", priority: "0.8", changefreq: "monthly" },
    { path: "/contact", priority: "0.7", changefreq: "monthly" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.type("application/xml");
  res.send(sitemap);
});

// GET /api/health
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// GET /server-test
app.get("/server-test", (req, res) => {
  res.type("text").send("Express server is live");
});

app.post("/api/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized: Missing token",
    });
  }

  if (!admin.apps.length) {
    return res.status(500).json({
      error: "Server auth not configured",
    });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    let isAdmin = false;

    if (email === "thewatcher714@gmail.com") {
      isAdmin = true;
    } else {
      const userDoc = await admin.firestore().collection("users").doc(uid).get();

      if (userDoc.exists && userDoc.data()?.role === "admin") {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      return res.status(403).json({
        error: "Forbidden: Admin access required",
      });
    }

    if (!to || !subject || !html) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || "The Go-To Agent Blueprint"}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent by ${email}: ${info.messageId}`);

    return res.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Auth or Email error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      error: "Failed to send email",
      details: message,
    });
  }
});

// Serve built React/Vite files from /dist.
// This comes AFTER robots, sitemap, and API routes.
app.use(express.static(distPath));

// API 404 handler.
// Keeps bad API routes from falling through to the React frontend.
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API route not found",
  });
});

// SPA fallback.
// Every non-API, non-file route serves the React/Vite app.
// This fixes direct visits/refreshes on routes like:
// /framework, /services, /booking, /resources
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});