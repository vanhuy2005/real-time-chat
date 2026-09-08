import { X, ArrowLeft, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";
import Avatar from "./Avatar";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { initiateCall } = useCallStore();

  return (
    <div className="p-3 sm:p-4 border-b border-white/5 bg-base-100/40 backdrop-blur-sm z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button (Mobile only) */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="sm:hidden icon-bubble bg-transparent hover:bg-base-300 p-2 -ml-2"
          >
            <ArrowLeft className="size-5" />
          </button>

          {/* Avatar */}
          <Avatar
            src={selectedUser.profilePic}
            alt={selectedUser.fullName}
            size="sm"
            online={onlineUsers.includes(selectedUser._id)}
          />

          {/* User info */}
          <div>
            <h3 className="font-bold text-[15px] sm:text-base tracking-tight">{selectedUser.fullName}</h3>
            <p className="text-xs sm:text-sm text-base-content/60 font-medium">
              {onlineUsers.includes(selectedUser._id) ? (
                <span className="text-secondary flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Online
                </span>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
           <button 
             onClick={() => initiateCall(selectedUser, 'voice')}
             className="icon-bubble bg-transparent hover:bg-base-300 p-2 text-primary"
             title="Cuộc gọi thoại"
           >
             <Phone className="size-5" />
           </button>
           <button 
             onClick={() => initiateCall(selectedUser, 'video')}
             className="icon-bubble bg-transparent hover:bg-base-300 p-2 text-secondary"
             title="Cuộc gọi video"
           >
             <Video className="size-5 border-2 rounded-md p-0.5 border-current" />
           </button>
           
          {/* Close button (Desktop only) */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="hidden sm:flex icon-bubble bg-transparent hover:bg-base-300 p-2 ml-2"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
