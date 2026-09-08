import { create } from "zustand";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { fetchIceServers, createPeerConnection, createOffer, createAnswer, getUserMediaSafe, cleanupConnection } from "../lib/webrtc";

export const useCallStore = create((set, get) => ({
  callStatus: "idle", // idle, calling, ringing, connecting, connected, ended
  callType: null, // 'voice' or 'video'
  remoteUser: null, // The other person in the call { _id, email, fullName, profilePic }
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  isMuted: false,
  isVideoMuted: false,
  isRemoteVideoMuted: false,
  isRemoteAudioMuted: false,
  callStartTime: null,

  // Connect socket event listeners
  subscribeToCallEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("call:incoming", get().handleIncomingCall);
    socket.on("call:accepted", get().handleCallAccepted);
    socket.on("call:rejected", get().handleCallRejected);
    socket.on("call:ended", get().handleCallEnded);
    socket.on("call:busy", get().handleCallBusy);
    socket.on("call:ice-candidate", get().handleRemoteIceCandidate);
    socket.on("call:toggle-media", get().handleRemoteMediaToggle);
  },

  unsubscribeFromCallEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("call:incoming", get().handleIncomingCall);
    socket.off("call:accepted", get().handleCallAccepted);
    socket.off("call:rejected", get().handleCallRejected);
    socket.off("call:ended", get().handleCallEnded);
    socket.off("call:busy", get().handleCallBusy);
    socket.off("call:ice-candidate", get().handleRemoteIceCandidate);
    socket.off("call:toggle-media", get().handleRemoteMediaToggle);
  },

  // === Caller Actions ===

  initiateCall: async (targetUser, type = "voice") => {
    try {
      if (get().callStatus !== "idle") {
        return toast.error("Bạn đang trong một cuộc gọi khác.");
      }

      set({ callStatus: "calling", remoteUser: targetUser, callType: type });

      // 1. Get Meida Stream early
      const stream = await getUserMediaSafe({ audio: true, video: type === 'video' });
      set({ localStream: stream });

      // 2. Fetch ICE Servers & Setup WebRTC
      const iceServers = await fetchIceServers();
      const pc = get().setupPeerConnection(iceServers, targetUser._id);
      
      // 3. Add local tracks to PC
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // 4. Create Offer
      const offer = await createOffer(pc);

      // 5. Send to signaling server
      const socket = useAuthStore.getState().socket;
      socket.emit("call:initiate", { to: targetUser._id, type, offer });

    } catch (error) {
      console.error("Failed to initiate call:", error);
      if (error && error.name) {
         set({ deviceError: error.name });
      }
      get().resetCallState();
    }
  },

  // === Callee Actions ===

  handleIncomingCall: async (data) => {
    const { from, callerUser, type, offer } = data; // Assuming backend sends callerUser info, otherwise we fetch it
    
    // Auto-reject if already in a call (should be handled by backend Redis ideally, but safe check)
    if (get().callStatus !== "idle") {
      const socket = useAuthStore.getState().socket;
      socket.emit("call:busy", { to: from });
      return;
    }

    // Trigger Notification if on different tab
    if (Notification.permission === "granted" && document.visibilityState === "hidden") {
       const notif = new Notification(`Cuộc gọi ${type === 'video' ? 'Video' : 'Thoại'} đến`, {
          body: `Bạn có cuộc gọi từ ai đó!`,
          requireInteraction: true,
          icon: "/vite.svg"
       });
       notif.onclick = () => {
          window.focus();
          notif.close();
       };
    }

    // We store the remote user ID and the offer SDP so we can answer later
    set({ 
      callStatus: "ringing", 
      remoteUser: { _id: from, fullName: "Incoming Call..." }, // Placeholder, in real app we look up the user
      callType: type,
      _pendingOffer: offer 
    });
  },

  acceptCall: async () => {
    try {
      const { remoteUser, callType, _pendingOffer } = get();
      if (!remoteUser || !_pendingOffer) return;

      set({ callStatus: "connecting" });

      // 1. Get Media Stream
      const stream = await getUserMediaSafe({ audio: true, video: callType === "video" });
      set({ localStream: stream });

      // 2. Setup PC
      const iceServers = await fetchIceServers();
      const pc = get().setupPeerConnection(iceServers, remoteUser._id);

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // 3. Create Answer using the pending offer
      const answer = await createAnswer(pc, _pendingOffer);

      // 4. Send back to caller
      const socket = useAuthStore.getState().socket;
      socket.emit("call:accept", { to: remoteUser._id, answer });
      
      // We are connected now (from our perspective)
      set({ callStatus: "connected", callStartTime: Date.now(), _pendingOffer: null });

    } catch (error) {
      console.error("Failed to accept call:", error);
      if (error && error.name) {
         set({ deviceError: error.name });
      }
      get().resetCallState();
    }
  },

  rejectCall: () => {
    const { remoteUser } = get();
    const socket = useAuthStore.getState().socket;
    
    if (socket && remoteUser) {
      socket.emit("call:reject", { to: remoteUser._id, reason: "declined" });
    }
    
    get().resetCallState();
  },

  // === Negotiation Callbacks ===

  handleCallAccepted: async ({ answer }) => {
    try {
      const { peerConnection } = get();
      if (!peerConnection) return;

      // Caller sets the remote description when callee accepts
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      set({ callStatus: "connected", callStartTime: Date.now() });
    } catch (error) {
      console.error("Error handling call accepted:", error);
      get().endCall(); // Abort if negotiate fails
    }
  },

  handleRemoteIceCandidate: async ({ candidate }) => {
     const { peerConnection } = get();
     if (peerConnection && candidate) {
        try {
           await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
           console.error("Error adding received ice candidate", e);
        }
     }
  },

  handleCallRejected: ({ reason }) => {
    if (reason === "offline") {
       toast.error("Người dùng đang ngoại tuyến, không thể nhận cuộc gọi.", { icon: '🚫' });
    } else if (reason === "rate_limited") {
       toast.error("Bạn đang gọi quá nhiều. Vui lòng chờ 1 phút.", { icon: '⏳' });
    } else if (reason === "busy") {
       toast.error("Người này đang bận trong một cuộc gọi khác.", { icon: '☎️' });
    } else {
       toast(`Cuộc gọi bị từ chối (${reason}).`, { icon: '✖️' });
    }
    get().resetCallState();
  },

  handleCallBusy: () => {
    toast("Người dùng đang bận trong một cuộc gọi khác.", { icon: '⏳' });
    get().resetCallState();
  },

  handleCallEnded: ({ reason, duration }) => {
    // If already idle (endCall resets immediately), just show toast
    if (get().callStatus === "idle") {
      if (duration !== undefined) {
        const mins = String(Math.floor(duration / 60)).padStart(2, '0');
        const secs = String(duration % 60).padStart(2, '0');
        toast(`Cuộc gọi kết thúc (${mins}:${secs})`);
      }
      return;
    }
    // Still in call (the other side ended it)
    if (duration !== undefined) {
      const mins = String(Math.floor(duration / 60)).padStart(2, '0');
      const secs = String(duration % 60).padStart(2, '0');
      toast(`Cuộc gọi kết thúc (${mins}:${secs})`);
    } else {
      toast("Cuộc gọi đã kết thúc.");
    }
    get().resetCallState();
  },

  handleRemoteMediaToggle: ({ mediaType, muted }) => {
    if (mediaType === "audio") {
      set({ isRemoteAudioMuted: muted });
    } else if (mediaType === "video") {
      set({ isRemoteVideoMuted: muted });
    }
  },

  // === In-Call Controls ===

  endCall: () => {
    const { remoteUser } = get();
    const socket = useAuthStore.getState().socket;
    
    if (socket && remoteUser) {
      socket.emit("call:end", { to: remoteUser._id });
    }
    
    get().resetCallState();
  },

  toggleAudio: () => {
    const { localStream, isMuted } = get();
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        const newMuted = !isMuted;
        audioTrack.enabled = !newMuted;
        set({ isMuted: newMuted });
        
        // Signal remote — per-media event, no coupling
        const socket = useAuthStore.getState().socket;
        const remoteUser = get().remoteUser;
        if (socket && remoteUser) {
           socket.emit("call:toggle-media", { to: remoteUser._id, mediaType: "audio", muted: newMuted });
        }
      }
    }
  },

  toggleVideo: async () => {
    if (get()._isTogglingVideo) return; // Debounce lock
    const { localStream, isVideoMuted, peerConnection, callType } = get();
    if (!localStream || callType !== 'video') return;

    set({ _isTogglingVideo: true });
    try {
       // Find the video sender — may have null track if previously muted
       const sender = peerConnection?.getSenders().find(
          s => (s.track?.kind === 'video') || s._replacedKind === 'video'
       );

       if (!isVideoMuted) {
          // MUTE: stop hardware camera + replaceTrack(null) to keep sender alive
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
             videoTrack.stop();
             localStream.removeTrack(videoTrack);
          }
          if (sender) {
             await sender.replaceTrack(null);
             sender._replacedKind = 'video'; // Tag so we can find it later
          }
          set({ isVideoMuted: true });
       } else {
          // UNMUTE: get fresh camera track + inject into sender
          const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const newVideoTrack = newStream.getVideoTracks()[0];
          if (newVideoTrack) {
             localStream.addTrack(newVideoTrack);
             if (sender) {
                await sender.replaceTrack(newVideoTrack);
                delete sender._replacedKind;
             }
             set({
                isVideoMuted: false,
                localStream: new MediaStream([localStream.getAudioTracks()[0], newVideoTrack].filter(Boolean))
             });
          }
       }

       // Signal remote — per-media event, no coupling
       const socket = useAuthStore.getState().socket;
       const remoteUser = get().remoteUser;
       if (socket && remoteUser) {
          socket.emit("call:toggle-media", { to: remoteUser._id, mediaType: "video", muted: get().isVideoMuted });
       }
    } catch (error) {
       console.error("Failed to toggle camera:", error);
       toast.error("Không thể bật/tắt Camera.");
    } finally {
       set({ _isTogglingVideo: false });
    }
  },

  switchCamera: async () => {
     const { localStream, peerConnection } = get();
     if (localStream && get().callType === 'video') {
        const videoTrack = localStream.getVideoTracks()[0];
        if (!videoTrack) return;

        try {
           const currentFacingMode = videoTrack.getSettings()?.facingMode || 'user';
           const nextFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

           const newStream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: nextFacingMode }
           });
           
           const newVideoTrack = newStream.getVideoTracks()[0];

           if (peerConnection) {
              const sender = peerConnection.getSenders().find(s => s.track?.kind === 'video');
              if (sender) {
                 await sender.replaceTrack(newVideoTrack);
              }
           }

           localStream.removeTrack(videoTrack);
           localStream.addTrack(newVideoTrack);
           
           videoTrack.stop(); // Stop the old track usage

           // We force an update so the React component re-assigns srcObject
           set({ localStream: new MediaStream([localStream.getAudioTracks()[0], newVideoTrack]) });
           
        } catch (error) {
           console.error("Camera switch failed:", error);
           toast.error("Không thể đổi Camera.");
        }
     }
  },

  // === Utilities & Reset ===

  setupPeerConnection: (iceServers, remoteUserId) => {
    const socket = useAuthStore.getState().socket;
    
    const pc = createPeerConnection(
      iceServers,
      // onIceCandidate (generated locally, send to remote)
      (candidate) => {
        socket.emit("call:ice-candidate", { to: remoteUserId, candidate });
      },
      // onTrack (received remote media stream)
      (stream) => {
        set({ remoteStream: stream });

        // Listen to remote video track mute/unmute (fires when sender does replaceTrack(null))
        stream.getVideoTracks().forEach(track => {
          track.onmute = () => {
            console.log("[WebRTC] Remote video track muted");
            set({ isRemoteVideoMuted: true });
          };
          track.onunmute = () => {
            console.log("[WebRTC] Remote video track unmuted");
            set({ isRemoteVideoMuted: false });
          };
        });
      },
      // onIceConnectionStateChange 
      (state) => {
        console.log("ICE Connection State:", state);
        
        switch(state) {
          case "checking":
             set({ callStatus: "connecting" });
             break;
          case "connected":
             set({ callStatus: "connected", callStartTime: Date.now() });
             break;
          case "disconnected":
             set({ callStatus: "reconnecting" });
             toast("Mạng yếu, đang thử kết nối lại...", { icon: '⚠️' });
             break;
          case "failed":
             if (get().callStatus === "idle") break; // Already cleaned up
             toast.error("Mất kết nối hoàn toàn. Cuộc gọi kết thúc.");
             get().endCall();
             break;
          case "closed":
             get().resetCallState();
             break;
        }
      }
    );

    set({ peerConnection: pc });
    return pc;
  },

  resetCallState: () => {
    const { peerConnection, localStream } = get();
    cleanupConnection(peerConnection, localStream);

    set({
      callStatus: "idle",
      callType: null,
      remoteUser: null,
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      isMuted: false,
      isVideoMuted: false,
      isRemoteVideoMuted: false,
      isRemoteAudioMuted: false,
      callStartTime: null,
      _pendingOffer: null,
      _isTogglingVideo: false
      // Do not clear deviceError here automatically
    });
  },
  
  clearDeviceError: () => set({ deviceError: null }),

  getCallHistory: async () => {
    try {
      const { axiosInstance } = await import("../lib/axios.js");
      const res = await axiosInstance.get("/calls/history");
      return res.data;
    } catch (error) {
      console.error("Lỗi lấy lịch sử cuộc gọi:", error);
      return [];
    }
  }

}));
