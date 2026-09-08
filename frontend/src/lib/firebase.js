import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase configuration
// User needs to place their Firebase config from console here
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermissionAndGetToken = async () => {
   try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
         // Replace with your VAPID key from Firebase Console -> Cloud Messaging -> Web configuration
         const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
         if (!vapidKey) {
            console.warn("VITE_FIREBASE_VAPID_KEY is missing, push notifications won't work locally easily without it unless using deprecated legacy keys.");
         }
         
         // Register service worker with config in query params so it can use .env values
         const swUrl = `/firebase-messaging-sw.js?apiKey=${firebaseConfig.apiKey}&authDomain=${firebaseConfig.authDomain}&projectId=${firebaseConfig.projectId}&storageBucket=${firebaseConfig.storageBucket}&messagingSenderId=${firebaseConfig.messagingSenderId}&appId=${firebaseConfig.appId}`;
         const registration = await navigator.serviceWorker.register(swUrl, {
            scope: "/firebase-cloud-messaging-push-scope",
         });

         const currentToken = await getToken(messaging, { 
            vapidKey,
            serviceWorkerRegistration: registration,
         });
         if (currentToken) {
            return currentToken;
         } else {
            console.log('No registration token available. Request permission to generate one.');
            return null;
         }
      } else {
         console.log('Notification permission user-denied.');
         return null;
      }
   } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
      return null;
   }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
