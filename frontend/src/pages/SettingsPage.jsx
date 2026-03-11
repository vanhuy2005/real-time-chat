import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Sparkles } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Ê! Đang làm gì đó?", isSent: false },
  { id: 2, content: "Chào nè! Đang lướt ChatHub, giao diện mới xinh xỉu! ✨", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-200 pt-16 sm:pt-20 px-4 pb-10">
      <div className="container mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-primary size-6" />
            Cài đặt giao diện
          </h2>
          <p className="text-base-content/70 font-medium">Cá nhân hoá trải nghiệm chat của bạn với 9 giao diện độc quyền</p>
        </div>

        {/* Theme Selection Section */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                  group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200
                  ${theme === t ? "bg-base-300 shadow-md ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105" : "hover:bg-base-300/50 hover:scale-105 active:scale-95"}
                `}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-12 w-full rounded-xl overflow-hidden shadow-sm" data-theme={t}>
                  <div className="absolute inset-0 flex flex-col">
                    {/* Fake Header */}
                    <div className="h-4 bg-base-200 flex items-center px-1">
                      <div className="size-2 rounded-full bg-primary/80"></div>
                    </div>
                    {/* Fake body */}
                    <div className="flex-1 bg-base-100 p-1 flex flex-col gap-1 justify-center">
                       <div className="h-2 w-1/2 rounded bg-base-300 mr-auto"></div>
                       <div className="h-2 w-3/4 rounded bg-primary ml-auto"></div>
                    </div>
                  </div>
                </div>
                <span className="text-[12px] font-bold tracking-tight truncate w-full flex justify-center text-center">
                  {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <h3 className="text-lg font-bold mb-4 ml-1 tracking-tight">Trực quan hiển thị</h3>
          <div className="glass-panel rounded-2xl overflow-hidden bg-base-100/50 shadow-xl max-w-3xl border border-white/10">
            <div className="p-4 sm:p-6 bg-transparent">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-2xl shadow-sm border border-white/5 overflow-hidden flex flex-col h-[400px]">
                
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-white/5 bg-base-100/80 backdrop-blur-md z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold shadow-sm">
                      D
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px]">Demo User</h3>
                      <p className="text-xs text-base-content/70 font-medium flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-secondary animate-pulse"></span>
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-base-100/30">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] p-3 shadow-sm flex flex-col
                          ${message.isSent 
                            ? "bubble-sent bg-primary text-primary-content" 
                            : "bubble-received bg-base-200/80 backdrop-blur-sm text-base-content border border-white/5"}
                        `}
                      >
                        <p className="text-[15px] leading-relaxed">{message.content}</p>
                        <p
                          className={`
                            text-[11px] mt-1 font-medium
                            ${message.isSent ? "text-primary-content/70 text-right" : "text-base-content/50 text-left"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input Area Mock */}
                <div className="p-3 bg-base-100/60 backdrop-blur-md border-t border-white/5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="w-full input h-[44px] rounded-full bg-base-200/50 backdrop-blur-sm border border-white/10 px-4 text-[15px]"
                      placeholder="Nhắn tin..."
                      value="Giao diện này đỉnh quá!"
                      readOnly
                    />
                    <button className="btn btn-circle bg-primary text-primary-content hover:bg-primary/90 hover:scale-105 active:scale-95 border-none shadow-sm min-h-[44px] h-[44px] w-[44px]">
                      <Send size={18} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
