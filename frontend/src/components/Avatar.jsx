import { getAvatarUrl } from "../lib/cloudinary";

const SIZE_CONFIG = {
  xs: { px: 28, cloudinary: 64 },   // Navbar (28px fits well in btn-sm)
  sm: { px: 40, cloudinary: 80 },   // ChatHeader, ChatContainer
  md: { px: 48, cloudinary: 96 },   // Sidebar
  lg: { px: 80, cloudinary: 200 },  // Medium displays
  xl: { px: 128, cloudinary: 500 }, // ProfilePage
};

const Avatar = ({
  src,
  alt = "Avatar",
  size = "sm",
  online,
  className = "",
}) => {
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.sm;
  const optimizedSrc = src ? getAvatarUrl(src, config.cloudinary) : "/avatar.png";

  return (
    <div 
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: config.px, height: config.px }}
    >
      <img
        src={optimizedSrc}
        alt={alt}
        className="w-full h-full rounded-full object-cover border"
        onError={(e) => {
          e.target.src = "/avatar.png";
        }}
      />
      {online && (
        <span
          className="absolute bottom-0 right-0 size-3 bg-green-500
          rounded-full ring-2 ring-zinc-900"
        />
      )}
    </div>
  );
};

export default Avatar;
