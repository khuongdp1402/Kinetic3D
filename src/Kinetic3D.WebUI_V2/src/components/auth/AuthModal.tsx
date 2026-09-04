"use client";

import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi, ApiError } from "@/lib/api";
import { X, Mail, KeyRound, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the WebGL component
const AuthModelViewer = dynamic(() => import("./AuthModelViewer"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#1c1917] animate-pulse" />
});

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAppStore();
  const { login } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prevent background scrolling
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const result =
        mode === "login"
          ? await authApi.login(email, password)
          : await authApi.register(email, password, displayName || email);

      login(result.token, {
        id: result.userId,
        email: result.email,
        displayName: result.displayName,
        avatar: "/images/mock/avatar.jpg",
        tier: "Starter",
        credits: 0,
      });
      closeAuthModal();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={closeAuthModal} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[1000px] h-[600px] bg-[var(--c-bg-deep)] rounded-2xl border border-[var(--c-white-10)] shadow-2xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button onClick={closeAuthModal} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>

        {/* LEFT PANEL: 3D Graphics & Typography (60%) */}
        <div className="hidden lg:block w-[60%] relative bg-gradient-to-br from-[#1c1917] to-[#2a2422] overflow-hidden">
          {/* 3D Canvas Layer */}
          <div className="absolute inset-0 z-0">
             <AuthModelViewer />
          </div>

          {/* Typography Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-12 bg-gradient-to-t from-[#1c1917] via-transparent to-transparent">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
              Tương lai của <br/>
              <span className="text-[var(--c-lime)]">thương mại 3D</span>
            </h2>
            <ul className="space-y-3">
              {[
                "Dựng mô hình 3D độ chi tiết cao",
                "Kết xuất & mô phỏng vật lý thời gian thực",
                "Rigging & animation một chạm",
                "API tích hợp liền mạch"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--c-lime)] glow-lime" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Control (40%) */}
        <div className="w-full lg:w-[40%] bg-[var(--c-bg-card)] flex flex-col p-8 lg:p-10 relative">
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
               <Sparkles className="w-6 h-6 text-[var(--c-lime)]" />
               <span className="text-xl font-bold tracking-[-0.05em] text-white">KINETIC 3D</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Chào mừng trở lại</h3>
            <p className="text-xs text-white/50 mt-2">Đăng nhập để truy cập mô hình và credit của bạn.</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 mb-8 bg-white/5 rounded-xl border border-white/10">
            <button
              type="button"
              title="Sắp ra mắt"
              disabled
              className="flex-1 py-2 text-xs font-bold rounded-lg text-white/20 cursor-not-allowed"
            >
              Mã xác thực
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode !== 'register' ? 'bg-[#1c1917] text-white shadow' : 'text-white/50 hover:text-white'}`}
            >
              Mật khẩu
            </button>
          </div>
          <p className="text-[10px] text-white/30 text-center -mt-6 mb-6">Tính năng mã xác thực đang phát triển, vui lòng dùng tab Mật khẩu.</p>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex-1 flex flex-col">
            <div className="space-y-4 mb-6">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-white/30" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email"
                  className="w-full bg-[#2a2422] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--c-lime)] transition-colors"
                  required
                />
              </div>

              {mode === "register" && (
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tên hiển thị"
                    className="w-full bg-[#2a2422] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--c-lime)] transition-colors"
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-white/30" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full bg-[#2a2422] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--c-lime)] transition-colors"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-400 mb-4 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              style={{
                backgroundColor: "var(--c-orange)",
                color: "#ffffff",
              }}
            >
              {isSubmitting ? "ĐANG XỬ LÝ..." : mode === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="mt-3 text-xs text-white/50 hover:text-[var(--c-lime)] transition-colors"
            >
              {mode === "login" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
            </button>

            {/* OAuth Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#1c1917] text-white/30">Hoặc tiếp tục với</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <button type="button" disabled title="Sắp ra mắt" className="w-full py-3 mb-3 rounded-xl border border-white/10 opacity-40 cursor-not-allowed transition-colors flex items-center justify-center gap-3 text-sm font-bold text-white">
               {/* Google SVG Icon (Simplified) */}
               <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
               Đăng nhập với Google
            </button>

            <div className="flex items-center justify-center gap-4 mt-2">
               {/* Grid of smaller identity channels - placeholders */}
               {['X', 'Discord', 'Apple'].map(provider => (
                 <button key={provider} type="button" disabled title="Sắp ra mắt" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-40 cursor-not-allowed text-white/50 text-[10px] font-bold">
                   {provider[0]}
                 </button>
               ))}
            </div>

            {/* Footer Links */}
            <div className="mt-auto pt-6 text-center text-[10px] text-white/30">
              Bằng việc tiếp tục, bạn đồng ý với <a href="#" className="underline hover:text-[var(--c-lime)]">Điều khoản sử dụng</a> và <a href="#" className="underline hover:text-[var(--c-lime)]">Chính sách bảo mật</a>.
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
