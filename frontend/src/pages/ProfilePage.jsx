import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Trash2, ShieldCheck, CalendarClock } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import Avatar from "../components/Avatar";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB before compression
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
};

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, removeProfilePic } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const hasCustomAvatar = selectedImg || authUser?.profilePic;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation: file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Định dạng không được hỗ trợ. Vui lòng chọn JPEG, PNG, WebP hoặc GIF.");
      e.target.value = "";
      return;
    }

    // Client-side validation: file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File quá lớn. Tối đa 5MB thôi nhé!");
      e.target.value = "";
      return;
    }

    try {
      // Client-side compression
      const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onload = async () => {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
      };

      reader.onerror = () => {
        toast.error("Lỗi khi đọc file ảnh.");
      };
    } catch (error) {
      toast.error("Không xử lý được ảnh. Hãy thử ảnh khác nhé.");
    }

    e.target.value = "";
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-base-200">
      <div className="max-w-2xl mx-auto p-4 py-8">
        
        <div className="glass-panel p-6 sm:p-10 rounded-[2rem] shadow-xl border-white/10 relative z-10 space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân ✨</h1>
            <p className="mt-2 text-base-content/60 font-medium">Thông tin chi tiết tài khoản của bạn</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-5">
            <div className="relative group">
              <Avatar
                src={selectedImg || authUser.profilePic}
                alt="Profile"
                size="xl"
                className="border-4 border-primary/20 shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-1 right-1 
                  bg-primary text-primary-content hover:bg-primary/90 hover:scale-110 active:scale-95
                  p-2.5 rounded-full cursor-pointer 
                  transition-all duration-200 shadow-md border-2 border-base-100
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-50" : ""}
                `}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="avatar-upload-btn"
                className={`btn btn-sm btn-ghost bg-base-200/50 hover:bg-base-300 rounded-xl font-medium gap-2 ${isUpdatingProfile ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Camera className="w-4 h-4" />
                {isUpdatingProfile ? "Đang tải lên..." : "Đổi ảnh đại diện"}
                <input
                  type="file"
                  id="avatar-upload-btn"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>

              {hasCustomAvatar && (
                <button
                  className={`btn btn-sm btn-ghost hover:bg-error/10 text-error rounded-xl font-medium gap-2 ${isUpdatingProfile ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={async () => {
                    setSelectedImg(null);
                    await removeProfilePic();
                  }}
                  disabled={isUpdatingProfile}
                >
                  <Trash2 className="w-4 h-4" />
                  Xoá ảnh
                </button>
              )}
            </div>

            <p className="text-[13px] text-base-content/50 font-medium bg-base-200/50 px-3 py-1.5 rounded-full">
              Hỗ trợ JPEG, PNG, WebP hoặc GIF — tối đa 5 MB
            </p>
          </div>

          {/* User Stats/Info Section */}
          <div className="space-y-4">
            
            <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl border border-white/5 p-4 sm:p-5 space-y-1.5 transition-all hover:bg-base-200/80">
              <div className="text-[13px] text-base-content/60 font-bold flex items-center gap-2 uppercase tracking-wide">
                <User className="w-4 h-4" />
                Họ và tên
              </div>
              <p className="text-[15px] font-medium text-base-content">
                {authUser?.fullName}
              </p>
            </div>

            <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl border border-white/5 p-4 sm:p-5 space-y-1.5 transition-all hover:bg-base-200/80">
              <div className="text-[13px] text-base-content/60 font-bold flex items-center gap-2 uppercase tracking-wide">
                <Mail className="w-4 h-4" />
                Tài khoản Email
              </div>
              <p className="text-[15px] font-medium text-base-content">
                {authUser?.email}
              </p>
            </div>

          </div>

          <div className="mt-8 bg-base-200/30 backdrop-blur-md rounded-2xl border border-white/5 p-5 sm:p-6">
            <h2 className="text-[15px] font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Thông tin hệ thống
            </h2>
            <div className="space-y-3 text-[14px] font-medium">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-base-content/70 flex items-center gap-2">
                  <CalendarClock className="w-4 h-4" />
                  Thành viên từ
                </span>
                <span className="text-base-content">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base-content/70">Trạng thái tài khoản</span>
                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">Hoạt động</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
