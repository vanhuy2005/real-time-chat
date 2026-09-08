import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import callRoutes from "./routes/call.route.js";
import { app, server } from "./lib/socket.js";
import "./lib/redis.js";
import { initGhostCallCleanupCron, initSelfPing } from "./lib/cron.js";

dotenv.config();
initGhostCallCleanupCron();
initSelfPing();

const PORT = process.env.PORT;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : []
    : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (same-origin, server-to-server, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/calls", callRoutes);

// Health check endpoint (prevents Render cold start, used by self-ping)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: Math.floor(process.uptime()) });
});

if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(projectRoot, "frontend", "dist");

  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Trigger nodemon restart 1

// Global error handler — catches unhandled errors from routes/middleware.
// CORS headers are provided by the cors() middleware registered above.
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message || "Internal server error"
      : "Internal server error";
  res.status(status).json({ message });
});

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
