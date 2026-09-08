import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useCallStore } from "./store/useCallStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import CallOverlay from "./components/CallOverlay";
import DeviceLobby from "./components/DeviceLobby";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const { deviceError, clearDeviceError, callStatus } = useCallStore();
  const navigate = useNavigate();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Warn user before refresh if in an active call
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (callStatus !== 'idle' && callStatus !== 'ended' && callStatus !== 'reconnecting') {
        event.preventDefault();
        // Modern browsers require returnValue to be an empty string to show the native prompt
        event.returnValue = '';
        return '';
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [callStatus]);

  // Listen to Service Worker messages (e.g. from Push Notification click)
  useEffect(() => {
     if ('serviceWorker' in navigator) {
        const handleMessage = (event) => {
           console.log("Received message from SW:", event.data);
           if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
              // Navigate to the target URL that the notification specified
              if (event.data.url) {
                 navigate(event.data.url);
              }
           }
        };
        navigator.serviceWorker.addEventListener('message', handleMessage);
        return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
     }
  }, [navigate]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      {deviceError && <DeviceLobby errorType={deviceError} onRetry={clearDeviceError} />}
      <CallOverlay />
      <Toaster />
    </div>
  );
};
export default App;
