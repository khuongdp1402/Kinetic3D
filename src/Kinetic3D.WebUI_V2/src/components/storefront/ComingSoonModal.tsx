"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, Layers, Cpu, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

function ParamWatcher() {
  const searchParams = useSearchParams();
  const { openComingSoonModal } = useAppStore();

  useEffect(() => {
    if (searchParams.get("modal") === "coming-soon") {
      const feature = searchParams.get("feature");
      const label =
        feature === "custom-studio"
          ? "Xưởng In 3D & AI Mesh Generator"
          : feature === "pricing-packs"
          ? "Gói Dịch Vụ Token Studio"
          : feature === "checkout"
          ? "Cổng Thanh Toán Trực Tuyến"
          : "Tính năng Studio";
      openComingSoonModal(label);
    }
  }, [searchParams, openComingSoonModal]);

  return null;
}

export function ComingSoonModal() {
  const { isComingSoonModalOpen, comingSoonFeatureName, closeComingSoonModal } = useAppStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isComingSoonModalOpen) {
        closeComingSoonModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isComingSoonModalOpen, closeComingSoonModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        const saved = JSON.parse(localStorage.getItem("kinetic3d_beta_waitlist") || "[]");
        saved.push({ email, feature: comingSoonFeatureName, date: new Date().toISOString() });
        localStorage.setItem("kinetic3d_beta_waitlist", JSON.stringify(saved));
      } catch {}
    }, 600);
  };

  return (
    <>
      <Suspense fallback={null}>
        <ParamWatcher />
      </Suspense>
      <AnimatePresence>
      {isComingSoonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeComingSoonModal}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-3xl border overflow-hidden p-6 sm:p-8 z-10 shadow-2xl"
            style={{
              backgroundColor: "var(--c-bg-card)",
              borderColor: "rgba(245, 185, 66, 0.35)",
              boxShadow: "0 0 50px rgba(245, 185, 66, 0.12), inset 0 0 20px rgba(245, 185, 66, 0.05)",
            }}
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#f5b942]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#66fcf1]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={closeComingSoonModal}
              className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[#f5b942]/15 text-[#f5b942] border border-[#f5b942]/30">
                <Sparkles className="w-3 h-3" />
                GIAI ĐOẠN HOÀN THIỆN // LABS BETA
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              {comingSoonFeatureName}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6 font-mono">
              Tính năng đang được đội ngũ kỹ sư hiệu chỉnh độ chính xác mô hình 3D và tối ưu dây chuyền in vật lý. Chúng tôi sẽ mở cổng cho nhóm người dùng thử nghiệm sớm nhất.
            </p>

            {/* Features preview pills */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/[0.03]">
                <Cpu className="w-4 h-4 text-[#f5b942] shrink-0" />
                <span className="text-[11px] text-white/80 font-mono">Độ phân giải 0.02mm</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/[0.03]">
                <Layers className="w-4 h-4 text-[#66fcf1] shrink-0" />
                <span className="text-[11px] text-white/80 font-mono">Tự động tính giá in</span>
              </div>
            </div>

            {/* Waitlist Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn để nhận vé mời..."
                    className="flex-1 px-4 py-3 rounded-xl border text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#f5b942] transition-colors"
                    style={{
                      backgroundColor: "var(--c-bg-deep)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
                    style={{
                      backgroundColor: "var(--c-orange)",
                      color: "#ffffff",
                    }}
                  >
                    {isSubmitting ? (
                      <span>Đang lưu...</span>
                    ) : (
                      <>
                        <span>Nhận vé Beta</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-white/40 font-mono text-center">
                  * Kinetic3D cam kết không spam. Bạn sẽ nhận được thông báo ngay khi tính năng sẵn sàng.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-1"
              >
                <div className="flex items-center justify-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã ghi nhận thông tin của bạn!</span>
                </div>
                <p className="text-xs text-white/70 font-mono">
                  Chúng tôi sẽ gửi email thông báo kèm ưu đãi giảm 20% khi tính năng chính thức phát hành.
                </p>
              </motion.div>
            )}

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <button
                onClick={closeComingSoonModal}
                className="text-white/50 hover:text-white transition-colors"
              >
                ← Trở lại Landing Page
              </button>
              <span className="text-[#f5b942]/80">KINETIC3D V1.0-RC</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
