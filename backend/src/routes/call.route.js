import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getIceServers, getCallHistory } from "../controllers/call.controller.js";

const router = express.Router();

// Fetch ICE Servers (STUN/TURN) for WebRTC Connection
router.get("/ice-servers", protectRoute, getIceServers);

// Fetch Call History
router.get("/history", protectRoute, getCallHistory);

export default router;
