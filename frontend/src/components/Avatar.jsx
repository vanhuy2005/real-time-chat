const sizeMap = {
  xs: "size-8",    // 32px  — Navbar
  sm: "size-10",   // 40px  — ChatHeader, ChatContainer
  md: "size-12",   // 48px  — Sidebar
  lg: "size-20",   // 80px  — Medium displays
  xl: "size-32",   // 128px — ProfilePage
};

const Avatar = ({ src, alt = "Avatar", size = "sm", online, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src || "/avatar.png"}
        alt={alt}
        className={`${sizeMap[size]} rounded-full object-cover border`}
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
