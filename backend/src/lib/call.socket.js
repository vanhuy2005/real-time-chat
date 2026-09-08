import redisClient, { isUserBusy, setUserBusy, setUserIdle, getActiveCallId } from "./redis.js";
import CallLog from "../models/callLog.model.js";
import User from "../models/user.model.js";
import { sendCallPushNotification } from "./firebase.js";

export function registerCallHandlers(io, socket, userSocketMap) {
  const userId = socket.handshake.query.userId;
  if (!userId) return;

  // Helpers
  const getSocketId = (id) => userSocketMap[id];

  // Auto-deliver cached offer if user reconnects (e.g., woke up from Push Notification)
  (async () => {
     try {
        const activeCallId = await getActiveCallId(userId);
        if (activeCallId) {
            const offerDataStr = await redisClient.get(`call:offer:${activeCallId}`);
            if (offerDataStr) {
                const offerData = JSON.parse(offerDataStr);
                // If this connecting user is the intended callee
                if (offerData.to === userId) {
                   console.log(`[Call] Auto-delivering cached offer to woken-up user: ${userId}`);
                   socket.emit("call:incoming", {
                     from: offerData.from,
                     type: offerData.type,
                     offer: offerData.offer,
                     callId: activeCallId
                   });
                }
            }
        }
     } catch (err) {
        console.error("Error checking cached active call on connection:", err);
     }
  })();

  // 1. INITIATE CALL
  socket.on("call:initiate", async ({ to, type, offer }) => {
    try {
      // Prevent calling self
      if (to === userId) return;

      // Rate limit: Max 5 calls per 60 seconds per user
      const callRateKey = `call:rate:${userId}`;
      const callCount = await redisClient.incr(callRateKey);
      if (callCount === 1) await redisClient.expire(callRateKey, 60);
      if (callCount > 5) {
         socket.emit("call:rejected", { reason: "rate_limited" });
         return;
      }

      // Edge-Case Fix: Prevent 3rd person calls, or caller making a new call while busy
      const [callerBusy, calleeBusy] = await Promise.all([
          isUserBusy(userId),
          isUserBusy(to)
      ]);

      if (callerBusy) {
          socket.emit("call:rejected", { reason: "You are already in a call" });
          return;
      }
      if (calleeBusy) {
          socket.emit("call:rejected", { reason: "busy" });
          return;
      }

      const targetSocketId = getSocketId(to);
      
      // Create a new temporary pending CallLog
      const newLog = new CallLog({
        callerId: userId,
        calleeId: to,
        type: type || "voice"
      });
      await newLog.save();
      const callId = newLog._id.toString();

      // Database ID is created but we set Redis busy flags in parallel
      await Promise.all([
          setUserBusy(userId, callId),
          setUserBusy(to, callId),
          // Cache the offer for 60s. So if the callee is offline, they have time to reconnect.
          redisClient.set(`call:offer:${callId}`, JSON.stringify({ from: userId, to, type, offer }), "EX", 60)
      ]);

      // Target is offline
      if (!targetSocketId) {
        // QUICK REJECT FOR WEB: Stop ringing, clear states
        await setUserIdle(userId);
        await setUserIdle(to);
        
        await CallLog.findByIdAndUpdate(callId, {
           status: "missed",
           endedAt: new Date()
        }).catch(console.error);

        socket.emit("call:rejected", { reason: "offline" });
        return;
      } else {
        // Forward offer to Callee immediately
        io.to(targetSocketId).emit("call:incoming", {
          from: userId,
          type,
          offer,
          callId
        });
      }

    } catch (error) {
      console.error("Error in call:initiate:", error);
      socket.emit("call:ended", { reason: "failed_to_initiate" });
    }
  });

  // 2. ACCEPT CALL
  socket.on("call:accept", async ({ to, answer }) => {
    try {
      const targetSocketId = getSocketId(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call:accepted", { answer });
      } else {
         // If caller dropped while we were answering
         await setUserIdle(userId);
         await setUserIdle(to);
      }
    } catch (error) {
      console.error("Error in call:accept:", error);
    }
  });

  // 3. REJECT CALL
  socket.on("call:reject", async ({ to, reason }) => {
    try {
      const callId = await getActiveCallId(userId);
      
      await setUserIdle(userId);
      await setUserIdle(to);

      if (callId) {
         await CallLog.findByIdAndUpdate(callId, { 
             status: reason === "timeout" ? "missed" : "rejected",
             endedAt: new Date()
         }).catch(console.error);
      }
      
      const targetSocketId = getSocketId(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call:rejected", { reason: reason || "declined" });
      }
    } catch (error) {
       console.error("Error in call:reject:", error);
    }
  });

  // 4. ICE CANDIDATES EXCHANGE
  socket.on("call:ice-candidate", ({ to, candidate }) => {
    const targetSocketId = getSocketId(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("call:ice-candidate", { candidate, from: userId });
    }
  });

  // 5. END CALL (either side)
  socket.on("call:end", async ({ to }) => {
    try {
      const callId = await getActiveCallId(userId);
      
      await setUserIdle(userId);
      await setUserIdle(to);

      let finalDuration = 0;

      if (callId) {
         const log = await CallLog.findById(callId).catch(console.error);
         if (log) {
            const endedAt = new Date();
            finalDuration = Math.floor((endedAt - log.startedAt) / 1000);
            log.endedAt = endedAt;
            log.duration = finalDuration;
            log.status = "completed";
            await log.save();
         }
      }

      // Notify the target that the call ended by the user
      const targetSocketId = getSocketId(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call:ended", { reason: "ended_by_user", duration: finalDuration });
      }

      // Acknowledge back to the caller who ended it, so they have the duration too
      socket.emit("call:ended", { reason: "ended_by_user", duration: finalDuration });

    } catch (error) {
       console.error("Error in call:end:", error);
    }
  });

  // 6. TOGGLE MEDIA (inform remote — per-media event)
  socket.on("call:toggle-media", ({ to, ...mediaState }) => {
     const targetSocketId = getSocketId(to);
     if (targetSocketId) {
        io.to(targetSocketId).emit("call:toggle-media", { from: userId, ...mediaState });
     }
  });

  // 7. HANDLE DISCONNECT (cleanup)
  socket.on("disconnect", async () => {
    try {
       const activeCallTargetId = await getActiveCallId(userId); 
       
       if (activeCallTargetId) {
          const callId = activeCallTargetId;
          
          // GRACE PERIOD (3s) to allow F5 refresh or mobile network switch to reconnect
          setTimeout(async () => {
             // Check if user has reconnected (socket exists in map)
             if (userSocketMap[userId]) {
                console.log(`[Call] User ${userId} reconnected within grace period. Ignoring disconnect.`);
                return;
             }

             console.log(`[Call] User ${userId} did not reconnect. Cleaning up call.`);
             const log = await CallLog.findById(callId).catch(console.error);
             
             if (log) {
                const endedAt = new Date();
                const duration = Math.floor((endedAt - log.startedAt) / 1000);
                log.endedAt = endedAt;
                log.duration = duration;
                if(log.status !== "rejected" && log.status !== "missed" && log.status !== "completed") {
                    log.status = "failed"; // Dropped
                }
                await log.save();

                // clear for both users.
                await setUserIdle(log.callerId.toString());
                await setUserIdle(log.calleeId.toString());
                
                // Notify the other person if online
                const targetId = log.callerId.toString() === userId ? log.calleeId.toString() : log.callerId.toString();
                const targetSocketId = getSocketId(targetId);
                
                if (targetSocketId) {
                   io.to(targetSocketId).emit("call:ended", { reason: "disconnected", duration: duration });
                }
             } else {
                await setUserIdle(userId);
             }
          }, 3000); // 3 seconds grace period
       }
    } catch (error) {
       console.error("Error in disconnect call cleanup:", error);
    }
  });
}
