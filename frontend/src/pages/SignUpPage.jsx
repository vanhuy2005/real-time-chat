import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Vui lòng nhập họ và tên");
    if (!formData.email.trim()) return toast.error("Vui lòng nhập email");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email không hợp lệ");
    if (!formData.password) return toast.error("Vui lòng nhập mật khẩu");
    if (formData.password.length < 6) return toast.error("Mật khẩu phải dài ít nhất 6 ký tự");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-12">
        <div className="w-full max-w-md space-y-8 glass-panel p-6 sm:p-10 rounded-[2rem] shadow-xl border-white/10 relative z-10">
          {/* LOGO */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-3 group">
              <div
                className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
                transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 shadow-sm border border-primary/10"
              >
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Tạo tài khoản mới ✨</h1>
                <p className="text-base-content/60 font-medium mt-1">Bắt đầu hành trình kết nối của bạn</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-bold text-[15px]">Họ và tên</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input w-full pl-11 h-12 rounded-2xl bg-base-100/50 backdrop-blur-sm border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

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
                  placeholder="nguyenvana@example.com"
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
              className="btn btn-primary w-full h-12 rounded-2xl text-[15px] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all border-none mt-2" 
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng Ký Ngay"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-base-content/60 font-medium">
              Đã có tài khoản rồi?{" "}
              <Link to="/login" className="link link-primary font-bold hover:opacity-80 transition-opacity">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Tham gia cộng đồng"
        subtitle="Kết nối với bạn bè, chia sẻ khoảnh khắc và giữ liên lạc với những người thân yêu theo cách hoàn toàn mới."
      />
    </div>
  );
};

export default SignUpPage;
