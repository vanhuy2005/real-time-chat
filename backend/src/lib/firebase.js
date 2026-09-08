import admin from "firebase-admin";

// Initialize Firebase Admin SDK
// You would typically use a service account key JSON file in production.
// For now, we will wrap it in a try-catch to not crash the app if credentials are not fully set.
export let firebaseInitialized = false;

try {
  // If FIREBASE_SERVICE_ACCOUNT is provided via env var as a JSON string
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    let serviceAccount;
    try {
       // Attempt to parse natively first (works if the .env string is perfectly formatted JSON)
       serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
       // If native fails, try to fix escaped newlines
       const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, '\n');
       serviceAccount = JSON.parse(rawServiceAccount);
    }
    
    // Crucial fix: Depending on how .env is loaded, the private_key might still have literal '\n' characters or hidden carriage returns '\r'.
    // We must replace these literal slash-n strings with actual real newline characters for the PEM format to be valid, and strip \r.
    if (serviceAccount.private_key) {
       serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n').replace(/\r/g, '').trim();
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin initialized securely");
      firebaseInitialized = true;
    } catch (certError) {
      console.warn("⚠️ Firebase Admin initialization failed (Invalid Credentials). Push Notifications disabled.");
    }
  } else {
    console.warn("⚠️ Firebase Admin initialized without Service Account (Push Notifications will not work)");
    try {
      admin.initializeApp();
    } catch (err) {
      console.log("   Firebase Admin default initialization skipped (no credentials found).");
    }
  }
} catch (error) {
  console.error("❌ Firebase Admin initialization error:", error);
}

export const sendCallPushNotification = async (tokens, payload) => {
  if (!firebaseInitialized || !tokens || tokens.length === 0) return;

  const message = {
    data: payload,
    notification: {
       title: "Cuộc gọi đến ChatHub",
       body: `📞 ${payload.callerName || 'Ai đó'} đang gọi cho bạn!`,
    },
    webpush: {
       notification: {
          icon: payload.callerAvatar || '/vite.svg',
          requireInteraction: true,
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          actions: [
             { action: "answer", title: "Trả lời cuộc gọi" },
             { action: "reject", title: "Từ chối" }
          ],
          data: {
             url: `/?callId=${payload.callId || ''}`
          }
       }
    },
    tokens: tokens, 
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(
      `Push notification sent. Success count: ${response.successCount}, Failure count: ${response.failureCount}`
    );
     // Clean up unused/failed tokens...
     if (response.failureCount > 0) {
        // Find failed tokens and potentially delete them from DB (handled later if needed)
        // const failedTokens = [];
        // response.responses.forEach((resp, idx) => {
        //   if (!resp.success) {
        //     failedTokens.push(tokens[idx]);
        //   }
        // });
     }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

export default admin;
