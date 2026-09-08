import cron from "node-cron";
import CallLog from "../models/callLog.model.js";

// Run every 10 minutes to cleanup ghost calls
export function initGhostCallCleanupCron() {
    cron.schedule("*/10 * * * *", async () => {
        try {
            console.log("[Cron] Running Ghost Call Cleanup...");
            
            // If a call is stuck in these states for more than 15 minutes, it's definitely a ghost/failed call
            const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
            
            const ghostCalls = await CallLog.find({
                status: { $in: ["calling", "ringing", "connecting", "connected"] },
                startedAt: { $lt: fifteenMinutesAgo }
            });

            if (ghostCalls.length > 0) {
                console.log(`[Cron] Found ${ghostCalls.length} ghost calls. Cleaning up...`);
                
                for (const call of ghostCalls) {
                    call.status = "failed";
                    call.endedAt = call.updatedAt || new Date(); // Use updatedAt if available, else now
                    const durationInSeconds = Math.floor((call.endedAt - call.startedAt) / 1000);
                    // Cap the duration realistically to 15 mins (900s) if it got stuck, so it doesn't show insane numbers
                    call.duration = Math.min(durationInSeconds, 900);
                    await call.save();
                }
                
                console.log("[Cron] Ghost Call Cleanup finished.");
            }
        } catch (error) {
            console.error("[Cron] Error cleaning up ghost calls:", error);
        }
    });
}

// Self-ping every 14 minutes to prevent Render free tier cold start
export function initSelfPing() {
   const appUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL;
   if (!appUrl || process.env.NODE_ENV !== "production") {
      console.log("[Cron] Self-ping disabled (not production or no APP_URL)");
      return;
   }

   cron.schedule("*/14 * * * *", async () => {
      try {
         await fetch(`${appUrl}/api/health`);
         console.log("[Cron] Self-ping OK");
      } catch (e) {
         console.error("[Cron] Self-ping failed:", e.message);
      }
   });
   console.log(`[Cron] Self-ping enabled → ${appUrl}/api/health every 14 min`);
}
