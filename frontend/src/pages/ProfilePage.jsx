import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Trash2 } from "lucide-react";
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
  const { authUser, isUpdatingProfile, updateProfile, removeProfilePic } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const hasCustomAvatar = selectedImg || authUser?.profilePic;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation: file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, WebP, or GIF.");
      e.target.value = "";
      return;
    }

    // Client-side validation: file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum 5MB allowed.");
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
        toast.error("Failed to read image file.");
      };
    } catch (error) {
      toast.error("Failed to process image. Please try another.");
    }

    e.target.value = "";
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar
                src={selectedImg || authUser.profilePic}
                alt="Profile"
                size="xl"
                className="border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
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
                className={`btn btn-sm btn-outline gap-2 ${isUpdatingProfile ? "btn-disabled" : ""}`}
              >
                <Camera className="w-4 h-4" />
                {isUpdatingProfile ? "Uploading..." : "Change photo"}
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
                  className={`btn btn-sm btn-ghost text-error gap-2 ${isUpdatingProfile ? "btn-disabled" : ""}`}
                  onClick={async () => {
                    setSelectedImg(null);
                    await removeProfilePic();
                  }}
                  disabled={isUpdatingProfile}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>

            <p className="text-xs text-zinc-500">
              JPEG, PNG, WebP or GIF — max 5 MB
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
