import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 5) return null;
    return Math.min(times * 200, 2000);
  },
  enableReadyCheck: true,
  lazyConnect: true, // Don't crash immediately if Redis is unreachable on start
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err.message));

// connect manually 
redis.connect().catch(err => console.error("Could not connect to Redis", err.message));

// === Call Status Utilities ===
const CALL_TTL = 300; // 5 phút TTL tự động xoá 

export async function setUserBusy(userId, callId) {
  try {
    await redis.set(`call:status:${userId}`, callId, "EX", CALL_TTL);
  } catch (error) {
     console.error("Redis setUserBusy error:", error);
  }
}

export async function setUserIdle(userId) {
  try {
    await redis.del(`call:status:${userId}`);
  } catch (error) {
     console.error("Redis setUserIdle error:", error);
  }
}

export async function isUserBusy(userId) {
  try {
    const status = await redis.get(`call:status:${userId}`);
    return status !== null;
  } catch (error) {
     console.error("Redis isUserBusy error:", error);
     return false; // Fallback to not busy on error
  }
}

export async function getActiveCallId(userId) {
  try {
    return await redis.get(`call:status:${userId}`);
  } catch (error) {
     console.error("Redis getActiveCallId error:", error);
     return null;
  }
}

export default redis;
