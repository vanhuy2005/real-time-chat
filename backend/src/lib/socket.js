import { Server } from "socket.io";
import http from "http";
import express from "express";
import { registerCallHandlers } from "./call.socket.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import { getAllowedOrigins } from "./cors.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    credentials: true,
  },
});

// Redis adapter for multi-instance Socket.IO (transparent for single instance)
if (process.env.REDIS_URL) {
  try {
    const pubClient = new Redis(process.env.REDIS_URL);
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    console.log("✅ Socket.IO Redis adapter connected (multi-instance ready)");
  } catch (e) {
    console.warn("⚠️ Socket.IO Redis adapter failed, running single-instance:", e.message);
  }
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Register WebRTC Call Handlers
  registerCallHandlers(io, socket, userSocketMap);

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
