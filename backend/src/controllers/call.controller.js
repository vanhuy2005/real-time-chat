import CallLog from "../models/callLog.model.js";

let cachedIceServers = null;
let cacheExpiry = 0;

export const getIceServers = async (req, res) => {
  try {
    // Return cached if still valid (5 min cache)
    if (cachedIceServers && Date.now() < cacheExpiry) {
      return res.status(200).json(cachedIceServers);
    }

    const meteredDomain = process.env.METERED_DOMAIN || "openrelayproject.metered.ca";
    const meteredApiKey = process.env.METERED_API_KEY;
    
    if (!meteredApiKey) {
      // No API key → use free public STUN only
      return res.status(200).json([
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ]);
    }

    const response = await fetch(
      `https://${meteredDomain}/api/v1/turn/credentials?apiKey=${meteredApiKey}`,
      { signal: AbortSignal.timeout(5000) } // 5s timeout to prevent hanging
    );
    
    if (!response.ok) throw new Error(`Metered API Error: ${response.status}`);
    
    cachedIceServers = await response.json();
    cacheExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    
    res.status(200).json(cachedIceServers);
  } catch (error) {
    console.error("ICE Server fetch failed:", error.message);
    // Fallback: return cached (even expired) or STUN
    res.status(200).json(cachedIceServers || [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]);
  }
};

export const getCallHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await CallLog.find({ 
       $or: [{ callerId: userId }, { calleeId: userId }] 
    })
      .populate("callerId", "fullName profilePic")
      .populate("calleeId", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(30);
      
    res.status(200).json(logs);
  } catch (error) {
    console.log("Error in getCallHistory controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
