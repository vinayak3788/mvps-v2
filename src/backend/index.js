
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import enquiryRoutes from './routes/enquiryRoutes.js';

import stationeryRoutes from "./routes/stationeryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { initDB } from "./setupDb.js";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
await initDB();

const app = express();

// 1️⃣ General middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2️⃣ Request logging
app.use((req, res, next) => {
  console.log(
    `→ ${req.method} ${req.path}`,
    "query:", req.query,
    "body:", req.body
  );
  next();
});
// enquiry route form

app.use('/api', enquiryRoutes);

// 3️⃣ Content Security Policy (CSP) header
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com",
      "connect-src 'self' https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
      "frame-src 'self' blob: https://apis.google.com https://mvps-7adb0.firebaseapp.com",
      "style-src 'self' 'unsafe-inline'",
      // Allow all HTTPS images during troubleshooting
      "img-src 'self' data: blob: https://*"
    ].join("; ")
  );
  next();
});

// 4️⃣ API routes
app.use("/api", stationeryRoutes);
app.use("/api", userRoutes);
app.use("/api", otpRoutes);
app.use("/api", orderRoutes);

// 5️⃣ Serve uploads
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../../data/uploads"))
);

// 6️⃣ Serve the front-end
const distPath = path.resolve(__dirname, "../../dist");
app.use(express.static(distPath));

// 7️⃣ Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// 8️⃣ Start server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
