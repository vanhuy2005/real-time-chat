import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full h-full flex flex-1 flex-col items-center justify-center p-8 sm:p-16 bg-base-100/30">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center
             justify-center animate-bounce shadow-xl shadow-primary/5 border border-primary/20 backdrop-blur-sm"
            >
              <MessageSquare className="w-10 h-10 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Chào mừng đến với ChatHub! 👋</h2>
          <p className="text-base-content/60 font-medium leading-relaxed">
            Chọn một đoạn chat ở menu bên cạnh để bắt đầu trò chuyện cùng mọi người nhé!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
