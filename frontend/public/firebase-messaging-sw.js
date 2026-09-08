// Scripts for firebase and firebase messaging
// We need to import the scripts from CDN natively in the ServiceWorker
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing config 
// (Wait, we can't use import.meta.env here since it's not bundled by Vite by default in the public folder)
// The user will need to hardcode or inject this. For now we use placeholders that the user must fill
// if they want push to work properly in production.
// Extract config from query parameters
const urlParams = new URLSearchParams(self.location.search);
const firebaseConfig = {
  apiKey: urlParams.get("apiKey"),
  authDomain: urlParams.get("authDomain"),
  projectId: urlParams.get("projectId"),
  storageBucket: urlParams.get("storageBucket"),
  messagingSenderId: urlParams.get("messagingSenderId"),
  appId: urlParams.get("appId"),
};

// Initialize Firebase
try {
   const app = firebase.initializeApp(firebaseConfig);
   const messaging = firebase.messaging(app);

   messaging.onBackgroundMessage((payload) => {
      console.log("[firebase-messaging-sw.js] Received background message via Firebase SDK ", payload);
      const notificationTitle = payload.data?.title || "Cuộc gọi đến ChatHub";
      const notificationOptions = {
         body: `📞 ${payload.data?.callerName || 'Ai đó'} đang gọi cho bạn!`,
         icon: payload.data?.callerAvatar || '/vite.svg',
         vibrate: [200, 100, 200, 100, 200, 100, 200],
         requireInteraction: true, // IMPORTANT: Keeps the notification on screen until user clicks
         data: {
            url: `/?callId=${payload.data?.callId || ''}`
         },
         actions: [
            { action: "answer", title: "Trả lời cuộc gọi" },
            { action: "reject", title: "Từ chối" }
         ]
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
   });
} catch(e) {
   console.log("Firebase SW init failed", e);
}

// Fallback manual push listener in case Firebase SDK is slow to boot
self.addEventListener('push', function(event) {
   if (!event.data) return;
   
   // Firebase data payloads are wrapped in `{ data: { ... } }` internally but event.data.json() might yield the raw FCM structure.
   try {
      const payload = event.data.json();
      
      // If it has notification object, browser will handle it automatically. we only care about data-only pushes.
      if (payload.notification) return; 
      if (!payload.data || payload.data.type !== 'INCOMING_CALL') return;

      console.log("[firebase-messaging-sw.js] Manual Push Fallback Received", payload);

      const notificationTitle = "Cuộc gọi đến ChatHub";
      const notificationOptions = {
         body: `📞 ${payload.data?.callerName || 'Ai đó'} đang gọi cho bạn!`,
         icon: payload.data?.callerAvatar || '/vite.svg',
         vibrate: [200, 100, 200, 100, 200, 100, 200],
         requireInteraction: true, // Forces notification to stay until interacted
         data: {
            url: `/?callId=${payload.data?.callId || ''}`
         },
         actions: [
            { action: "answer", title: "Trả lời cuộc gọi" },
            { action: "reject", title: "Từ chối" }
         ]
      };

      event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
   } catch (err) {
      console.error("Error parsing push payload manually", err);
   }
});

// Notification click listener
self.addEventListener('notificationclick', function(event) {
   console.log('[firebase-messaging-sw.js] On notification click: ', event);
   event.notification.close();
   
   const action = event.action; // 'answer', 'reject', or empty
   const targetUrl = event.notification.data.url || '/';

   event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
         // Check if there is already a window/tab open with the target URL or domain
         for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            
            // If the app is already open, focus it
            if (client.url && 'focus' in client) {
               client.focus();
               
               // Optionally, you can send a message to the client to trigger internal routing
               client.postMessage({
                  type: 'NOTIFICATION_CLICK',
                  action: action,
                  url: targetUrl,
                  callData: event.notification.data
               });
               return;
            }
         }
         
         // If no window is open, open a new one
         if (clients.openWindow) {
            // Append action to URL if needed for handling on fresh load
            const urlToOpen = action ? `${targetUrl}&action=${action}` : targetUrl;
            return clients.openWindow(urlToOpen);
         }
      })
   );
});
