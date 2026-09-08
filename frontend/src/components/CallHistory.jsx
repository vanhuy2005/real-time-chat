import React, { useEffect, useState } from "react";
import { useCallStore } from "../store/useCallStore";
import { useAuthStore } from "../store/useAuthStore";
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneOff, Clock, AlertCircle } from "lucide-react";
import Avatar from "./Avatar";

const CallHistory = () => {
  const { getCallHistory, initiateCall } = useCallStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getCallHistory();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, [getCallHistory]);

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}p ${s}s` : `${s}s`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time. If earlier, show relative or date.
    if (date.toDateString() === now.toDateString()) {
       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  if (loading) {
     return (
        <div className="flex justify-center p-8">
           <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
     );
  }

  if (logs.length === 0) {
     return (
        <div className="text-center py-10 bg-base-200/30 rounded-2xl border border-white/5">
           <PhoneOff className="w-12 h-12 text-base-content/20 mx-auto mb-3" />
           <p className="text-base-content/60 font-medium">Chưa có lịch sử cuộc gọi nào.</p>
        </div>
     );
  }

  return (
    <div className="space-y-3">
       {logs.map((log) => {
          const isCaller = log.callerId._id === authUser._id;
          const otherUser = isCaller ? log.calleeId : log.callerId;
          const isOnline = onlineUsers.includes(otherUser._id);

          // Status & Styling
          let statusIcon;
          let statusColor = "text-base-content/60";
          let statusText = "";

          if (log.status === "completed") {
             statusIcon = isCaller ? <PhoneOutgoing className="w-4 h-4 text-emerald-500" /> : <PhoneIncoming className="w-4 h-4 text-emerald-500" />;
             statusText = isCaller ? "Gọi đi" : "Gọi đến";
          } else if (log.status === "missed") {
             statusIcon = <PhoneOff className="w-4 h-4 text-error" />;
             statusColor = "text-error";
             statusText = isCaller ? "Không trả lời" : "Gọi nhỡ";
          } else if (log.status === "rejected") {
             statusIcon = <PhoneOff className="w-4 h-4 text-error" />;
             statusColor = "text-error";
             statusText = "Từ chối";
          } else {
             statusIcon = <AlertCircle className="w-4 h-4 text-warning" />;
             statusText = "Thất bại";
          }

          return (
             <div key={log._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-base-200/40 hover:bg-base-200/80 transition-colors rounded-2xl border border-white/5 gap-4">
                
                {/* Left: User & Status */}
                <div className="flex items-center gap-4">
                   <Avatar 
                      src={otherUser.profilePic} 
                      alt={otherUser.fullName}
                      size="sm"
                      online={isOnline}
                   />
                   <div>
                      <h4 className="font-bold text-base-content">{otherUser.fullName}</h4>
                      <div className={`flex items-center gap-1.5 text-xs font-medium mt-0.5 ${statusColor}`}>
                         {statusIcon}
                         <span>{statusText}</span>
                      </div>
                   </div>
                </div>

                {/* Right: Actions & Details */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t border-white/5 pt-3 sm:border-0 sm:pt-0">
                   {/* Meta */}
                   <div className="text-right text-xs text-base-content/60 font-medium space-y-1">
                      <div className="flex items-center gap-1.5 justify-end">
                         {log.type === "video" ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                         {formatTime(log.startedAt)}
                      </div>
                      {log.status === "completed" && (
                         <div className="flex items-center gap-1.5 justify-end">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDuration(log.duration)}
                         </div>
                      )}
                   </div>

                   {/* Quick Call Again */}
                   <div className="flex gap-2">
                       <button 
                         onClick={() => initiateCall(otherUser, 'voice')}
                         className="btn btn-circle btn-sm btn-ghost bg-primary/10 text-primary hover:bg-primary/20"
                         title="Gọi thoại lại"
                       >
                         <Phone className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => initiateCall(otherUser, 'video')}
                         className="btn btn-circle btn-sm btn-ghost bg-secondary/10 text-secondary hover:bg-secondary/20"
                         title="Gọi video lại"
                       >
                         <Video className="w-4 h-4" />
                       </button>
                   </div>
                </div>

             </div>
          );
       })}
    </div>
  );
};

export default CallHistory;
