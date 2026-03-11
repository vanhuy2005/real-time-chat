import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import Avatar from "./Avatar";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="glass-panel fixed w-full top-0 z-40 border-b-0 border-b-white/5 rounded-none rounded-b-xl sm:rounded-none">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="icon-bubble size-9">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">ChatHub</h1>
            </Link>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
            <Link
              to={"/settings"}
              className="btn btn-sm sm:btn-md btn-ghost rounded-xl gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/70" />
              <span className="hidden sm:inline font-medium">Cài đặt</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="btn btn-sm sm:btn-md btn-ghost rounded-xl gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/70 sm:hidden" />
                  <span className="hidden sm:flex items-center gap-2 font-medium">
                    <Avatar src={authUser.profilePic} size="xs" />
                    Hồ sơ
                  </span>
                </Link>

                <button 
                  className="btn btn-sm sm:btn-md btn-ghost rounded-xl gap-2 transition-transform hover:scale-105 active:scale-95 text-error/80 hover:text-error hover:bg-error/10" 
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline font-medium">Đăng xuất</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
