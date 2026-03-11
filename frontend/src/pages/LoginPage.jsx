import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-12">
        <div className="w-full max-w-md space-y-8 glass-panel p-6 sm:p-10 rounded-[2rem] shadow-xl border-white/10 relative z-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-3 group">
              <div
                className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
                transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-sm border border-primary/10"
              >
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Chào mừng quay lại 👋</h1>
                <p className="text-base-content/60 font-medium mt-1">Đăng nhập để vào ChatHub</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-bold text-[15px]">Tài khoản Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input w-full pl-11 h-12 rounded-2xl bg-base-100/50 backdrop-blur-sm border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                  placeholder="thuphuong@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-bold text-[15px]">Mật khẩu</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input w-full pl-11 pr-12 h-12 rounded-2xl bg-base-100/50 backdrop-blur-sm border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-medium tracking-wide"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center icon-bubble hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40 hover:text-primary transition-colors" />
                  ) : (
                        <Eye className="h-5 w-5 text-base-content/40 hover:text-primary transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full h-12 rounded-2xl text-[15px] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all border-none" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng Nhập Ngay"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-base-content/60 font-medium">
              Chưa có tài khoản?{" "}
              <Link to="/signup" className="link link-primary font-bold hover:opacity-80 transition-opacity">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Kết nối không khoảng cách"}
        subtitle={"Tham gia ChatHub để trò chuyện cùng bạn bè một cách nhanh chóng và bảo mật nhất."}
      />
    </div>
  );
};

export default LoginPage;
