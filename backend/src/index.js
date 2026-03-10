import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

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
