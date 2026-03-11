import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import Avatar from "./Avatar";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full bg-base-100/30 flex flex-col transition-all duration-300 border-r border-white/5">
      {/* Header section */}
      <div className="w-full p-4 sm:p-5 border-b border-white/5 backdrop-blur-sm bg-base-100/40">
        <div className="flex items-center gap-2 mb-1 sm:mb-0">
          <div className="icon-bubble size-8 sm:size-10 bg-primary/10">
            <Users className="size-4 sm:size-5 text-primary" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight">Danh bạ</span>
        </div>
        
        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2">
          <label className="cursor-pointer flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary rounded-md transition-transform group-hover:scale-105"
            />
            <span className="text-sm font-medium text-base-content/80 group-hover:text-base-content transition-colors">
              Chỉ hiện người online
            </span>
          </label>
          <span className="text-xs font-semibold bg-base-300/50 px-2 py-1 rounded-full text-zinc-500">
            {onlineUsers.length - 1}
          </span>
        </div>
      </div>

      {/* Users list section */}
      <div className="overflow-y-auto w-full p-2 sm:p-3 space-y-1">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3 rounded-2xl
                transition-all duration-200 active:scale-[0.98]
                ${isSelected 
                  ? "bg-primary/15 shadow-sm ring-1 ring-primary/20 bg-base-100" 
                  : "hover:bg-base-300/50 hover:shadow-sm"
                }
              `}
            >
              <Avatar
                src={user.profilePic}
                alt={user.fullName}
                size="md"
                online={onlineUsers.includes(user._id)}
                className="flex-shrink-0"
              />

              <div className="text-left w-full min-w-0">
                <div className={`font-semibold truncate text-[15px] sm:text-base ${isSelected ? "text-primary" : "text-base-content"}`}>
                  {user.fullName}
                </div>
                <div className="text-sm text-base-content/60 font-medium">
                  {onlineUsers.includes(user._id) ? (
                    <span className="text-secondary flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-secondary animate-pulse"></span>
                      Online
                    </span>
                  ) : (
                    "Offline"
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-10 opacity-70">
            <Users className="size-12 text-base-content/20 mb-3" />
            <p className="text-sm font-medium text-base-content/60">Không có ai online</p>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
