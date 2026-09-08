import React, { useEffect, useRef, useState } from "react";
import { useCallStore } from "../store/useCallStore";
import { useAuthStore } from "../store/useAuthStore";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, X, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

const CallOverlay = () => {
  const { 
    callStatus, 
    callType, 
    remoteUser, 
    localStream, 
    remoteStream, 
    isMuted, 
    isVideoMuted,
    isRemoteVideoMuted,
    acceptCall, 
    rejectCall, 
    endCall, 
    toggleAudio,
    toggleVideo,
    switchCamera,
    callStartTime
  } = useCallStore();

  const { onlineUsers } = useAuthStore();
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [duration, setDuration] = useState("00:00");

  // Attach MediaStreams to <video> elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    return () => { if (localVideoRef.current) localVideoRef.current.srcObject = null; };
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Remote audio playback — works for BOTH voice and video calls
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Call Duration Timer
  useEffect(() => {
    let intervalId;
    if (callStatus === "connected" && callStartTime) {
      intervalId = setInterval(() => {
        const diffInSeconds = Math.floor((Date.now() - callStartTime) / 1000);
        const mins = String(Math.floor(diffInSeconds / 60)).padStart(2, '0');
        const secs = String(diffInSeconds % 60).padStart(2, '0');
        setDuration(`${mins}:${secs}`);
      }, 1000);
    } else {
      setDuration("00:00");
    }

    return () => clearInterval(intervalId);
  }, [callStatus, callStartTime]);

  // Auto-reject / timeout ringing after 30 seconds
  useEffect(() => {
    let timeoutId;
    if (callStatus === "ringing" || callStatus === "calling") {
      timeoutId = setTimeout(() => {
        toast("Không có phản hồi (Timeout).");
        if (callStatus === "ringing") {
          rejectCall();
        } else {
          endCall();
        }
      }, 30000);
    }

    return () => clearTimeout(timeoutId);
  }, [callStatus, rejectCall, endCall]);

  if (callStatus === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-300/90 backdrop-blur-md">
      
      {/* --- INCOMING CALL SCREEN --- */}
      {callStatus === "ringing" && (
        <div className="flex flex-col items-center glass-panel p-10 rounded-3xl w-full max-w-sm mx-4 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
          <div className="avatar mb-6">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200">
               <img src={remoteUser?.profilePic || "/avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 animate-pulse">{remoteUser?.fullName}</h2>
          <p className="text-base-content/60 mb-8">Cuộc gọi {callType === 'video' ? 'Video' : 'Thoại'} đến...</p>

          <div className="flex gap-8">
            <button onClick={rejectCall} className="btn btn-circle btn-error btn-lg shadow-lg hover:scale-110 transition-transform">
              <PhoneOff className="w-6 h-6" />
            </button>
            <button onClick={acceptCall} className="btn btn-circle btn-success btn-lg shadow-lg hover:scale-110 transition-transform animate-bounce">
              <Phone className="w-6 h-6 animate-pulse" />
            </button>
          </div>
        </div>
      )}

      {/* --- OUTGOING / ACTIVE CALL SCREEN --- */}
      {(callStatus === "calling" || callStatus === "connecting" || callStatus === "connected" || callStatus === "reconnecting") && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
          
          {/* Main Remote View (Avatar for Voice, Video for Video Call) */}
          <div className="flex-1 w-full max-w-4xl flex items-center justify-center relative rounded-3xl overflow-hidden bg-base-100/50 shadow-2xl border border-white/5">
            
            {(callType === 'voice' || !remoteStream) ? (
              <div className="flex flex-col items-center">
                 <div className="avatar mb-6">
                  <div className={`w-40 h-40 rounded-full overflow-hidden bg-base-200 ${callStatus === 'connected' ? 'ring-4 ring-primary ring-offset-4 ring-offset-base-100 shadow-[0_0_30px_rgba(var(--p),0.5)]' : ''}`}>
                     <img src={remoteUser?.profilePic || "/avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                 </div>
                 <h2 className="text-3xl font-bold mb-2">{remoteUser?.fullName}</h2>
                 
                 {callStatus === 'connected' ? (
                   <div className="mt-2 text-2xl font-mono bg-base-300/80 px-4 py-1 rounded-full text-primary tracking-widest">{duration}</div>
                 ) : callStatus === 'ended' ? (
                   <div className="mt-2 flex flex-col items-center gap-1">
                     <p className="text-xl font-medium text-error flex items-center gap-2"><PhoneOff className="w-5 h-5"/> Kết thúc</p>
                     <div className="text-xl font-mono opacity-70">{finalDuration}</div>
                   </div>
                 ) : (
                   <div className="mt-2 flex items-center gap-2">
                     <span className="loading loading-dots loading-md text-primary"></span>
                     <p className="text-lg text-base-content/70">
                       {callStatus === 'calling' && "Đang gọi..."}
                       {callStatus === 'connecting' && "Đang kết nối..."}
                       {callStatus === 'reconnecting' && "Đứt mạng, đang kết nối lại..."}
                     </p>
                   </div>
                 )}
              </div>
            ) : (
               <>
                 <video 
                   ref={remoteVideoRef} 
                   autoPlay 
                   playsInline 
                   className={`w-full h-full object-cover transition-opacity duration-300 ${(isRemoteVideoMuted || callStatus === 'ended') ? 'opacity-0' : 'opacity-100'}`} 
                 />
                 {(isRemoteVideoMuted || callStatus === 'ended') && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-300/80 backdrop-blur-sm z-10 transition-all duration-300">
                      <div className="avatar mb-4">
                        <div className="w-32 h-32 rounded-full ring-4 ring-base-100 overflow-hidden bg-base-200 shadow-xl">
                           <img src={remoteUser?.profilePic || "/avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <p className="text-xl font-medium text-base-content/80">
                         {callStatus === 'ended' ? "Cuộc gọi đã kết thúc" : `${remoteUser?.fullName} đã tắt Camera`}
                      </p>
                    </div>
                 )}
               </>
            )}

            {/* Local PiP Video (Only if video call and connected) */}
            {callType === 'video' && localStream && (
              <div className="absolute top-4 right-4 w-24 h-36 md:w-32 md:h-48 bg-base-300 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-20 transition-transform hover:scale-105 cursor-move flex items-center justify-center">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${isVideoMuted ? 'opacity-0' : 'opacity-100'}`} 
                />
                
                {/* Local Mute Mask */}
                {isVideoMuted && (
                   <div className="absolute inset-0 bg-base-200/90 backdrop-blur-md flex items-center justify-center z-10">
                      <VideoOff className="w-8 h-8 text-base-content/50" />
                   </div>
                )}
              </div>
            )}
            
          </div>

          {/* Call Control Bar */}
          <div className="mt-8 glass-panel py-4 px-10 rounded-full flex gap-8 items-center shadow-xl mb-4 border border-white/10">
            {callType === 'video' && (
              <>
                 <button 
                  onClick={toggleVideo} 
                  className={`btn btn-circle btn-lg shadow-md hover:scale-105 transition-transform ${isVideoMuted ? 'btn-error text-white' : 'btn-ghost bg-base-200/50'}`}
                  title={isVideoMuted ? "Bật Camera" : "Tắt Camera"}
                >
                  {isVideoMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                 </button>
                 <button 
                  onClick={switchCamera} 
                  className="btn btn-circle btn-lg shadow-md hover:scale-105 transition-transform btn-ghost bg-base-200/50"
                  title="Đổi Camera"
                 >
                  <RefreshCcw className="w-6 h-6" />
                 </button>
              </>
            )}
            <button 
              onClick={toggleAudio} 
              className={`btn btn-circle btn-lg shadow-md hover:scale-105 transition-transform ${isMuted ? 'btn-error text-white' : 'btn-ghost bg-base-200/50'}`}
              title={isMuted ? "Bật Míc" : "Tắt Míc"}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button onClick={endCall} className="btn btn-circle btn-error btn-lg shadow-lg hover:scale-110 transition-transform w-16 h-16 text-white" title="Kết thúc cuộc gọi">
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>

        </div>
      )}

      {/* Hidden audio element — plays remote audio for voice + video calls */}
      {remoteStream && <audio ref={remoteAudioRef} autoPlay playsInline />}
    </div>
  );
};

export default CallOverlay;
