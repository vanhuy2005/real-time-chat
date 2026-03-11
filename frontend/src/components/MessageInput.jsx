import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-3 sm:p-4 w-full bg-base-100/40 backdrop-blur-md border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-2xl border border-white/10 shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-300 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-base-content"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
        <div className="flex-1 flex gap-2 relative">
          <input
            type="text"
            className="w-full input h-[44px] rounded-full bg-base-200/50 backdrop-blur-sm border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/30 px-4 sm:px-5 transition-all outline-none"
            placeholder="Nhắn tin..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex icon-bubble !p-1.5 !bg-transparent hover:!bg-base-300/50
                     ${imagePreview ? "text-primary" : "text-base-content/50"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} className={imagePreview ? "text-primary fill-primary/10" : ""} />
          </button>
        </div>

        {/* Mobile image button */}
        <button
          type="button"
          className={`sm:hidden icon-bubble !p-2.5 !bg-base-200/50
                   ${imagePreview ? "text-primary" : "text-base-content/50"}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={18} />
        </button>

        <button
          type="submit"
          className="btn btn-circle bg-primary text-primary-content hover:bg-primary/90 hover:scale-105 active:scale-95 border-none shadow-sm min-h-[44px] h-[44px] w-[44px]"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
