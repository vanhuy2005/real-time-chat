import React, { useEffect, useState } from "react";
import { Camera, Mic, Settings, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

const DeviceLobby = ({ onRetry, errorType }) => {
  const [browser, setBrowser] = useState("Unknown");

  useEffect(() => {
    // Basic browser detection for customized help text
    if (navigator.userAgent.indexOf("Chrome") !== -1) setBrowser("Chrome");
    else if (navigator.userAgent.indexOf("Safari") !== -1) setBrowser("Safari");
    else if (navigator.userAgent.indexOf("Firefox") !== -1) setBrowser("Firefox");
    else setBrowser("your browser");
  }, []);

  const getInstructions = () => {
    if (errorType === "NotAllowedError" || errorType === "PermissionDeniedError") {
      return (
        <div className="text-left bg-base-200/50 p-4 rounded-xl mt-4 text-sm">
           <h4 className="font-bold flex items-center gap-2 mb-2"><Settings className="w-4 h-4"/> Hướng dẫn cấp quyền trên {browser}</h4>
           <ol className="list-decimal list-inside space-y-2 text-base-content/80">
             {browser === "Chrome" && (
                <>
                  <li>Nhấn vào biểu tượng 🔒 (Ổ khóa) hoặc ⚙️ (Cài đặt) trên thanh địa chỉ.</li>
                  <li>Trong menu hiện ra, tìm phần <strong>Micrô</strong> và <strong>Máy nén ảnh</strong>.</li>
                  <li>Chuyển trạng thái sang <strong>Cho phép (Allow)</strong>.</li>
                  <li>Tải lại trang web này.</li>
                </>
             )}
             {browser === "Safari" && (
                <>
                  <li>Mở <strong>Preferences</strong> (Cài đặt) {'>'} <strong>Websites</strong>.</li>
                  <li>Chọn <strong>Camera</strong> và <strong>Microphone</strong> ở cột trái.</li>
                  <li>Tìm ChatHub trong danh sách và đổi quyền thành <strong>Allow</strong>.</li>
                </>
             )}
             {browser !== "Chrome" && browser !== "Safari" && (
                <>
                  <li>Nhấn vào biểu tượng thông tin hoặc cài đặt gần thanh địa chỉ trình duyệt.</li>
                  <li>Tìm mục phân quyền (Permissions).</li>
                  <li>Cấp quyền truy cập <strong>Micro và Camera</strong>.</li>
                </>
             )}
           </ol>
        </div>
      );
    }
    
    // For NotFoundError or others
    return (
      <p className="mt-4 text-sm text-base-content/70">
        Hãy chắn chắn bạn đã cắm Micro hoặc phần cứng Camera vào máy tính. Nếu bạn dùng máy bàn, vui lòng cắm Headphone và tải lại trang.
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-base-300 backdrop-blur-md p-4">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md mx-auto text-center flex flex-col items-center">
        
        <div className="w-20 h-20 rounded-full bg-error/10 text-error flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Không thể truy cập thiết bị</h2>
        
        <p className="text-base-content/80 mb-6">
          {errorType === "NotAllowedError" || errorType === "PermissionDeniedError" 
            ? "Bạn đã chặn quyền truy cập Micro và Camera. ChatHub cần các quyền này để thực hiện cuộc gọi."
            : "Không tìm thấy bất kỳ Micro hoặc Camera nào được kết nối với thiết bị của bạn."}
        </p>

        <div className="flex gap-4 w-full justify-center mb-6 text-base-content/50">
           <div className="flex flex-col items-center gap-2">
             <div className="bg-base-200 p-3 rounded-2xl"><Mic className="w-6 h-6"/></div>
           </div>
           <div className="flex items-center"><ChevronRight className="w-5 h-5"/></div>
           <div className="flex flex-col items-center gap-2">
             <div className="bg-base-200 p-3 rounded-2xl"><Camera className="w-6 h-6"/></div>
           </div>
        </div>

        {getInstructions()}

        <button 
          onClick={onRetry} 
          className="btn btn-primary w-full rounded-2xl mt-8"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Tôi đã cấp quyền, Thử lại
        </button>
        
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-ghost mt-2"
        >
          Tải lại trang web
        </button>

      </div>
    </div>
  );
};

export default DeviceLobby;
