"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingCart, Gamepad2, Glasses, Cog, Film, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Industry {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  stats: string;
  statsLabel: string;
  tags: string[];
  image: string;
  accent: string;
  icon: typeof ShoppingCart;
}

const INDUSTRIES: Industry[] = [
  {
    id: "ecom",
    title: "E-Commerce",
    subtitle: "Visualization sản phẩm 3D tương tác",
    desc: "Khách hàng xoay 360°, zoom chi tiết, customize vật liệu trực tiếp trên trình duyệt. Tăng trải nghiệm thực tế và giảm tỷ lệ hoàn hàng.",
    stats: "+42%",
    statsLabel: "Tỷ lệ chuyển đổi",
    tags: ["Interactive 3D", "AR Quick Look", "Dynamic Pricing"],
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1200&auto=format&fit=crop",
    accent: "#f5b942",
    icon: ShoppingCart,
  },
  {
    id: "game",
    title: "Game Development",
    subtitle: "Assets 3D sẵn sàng cho Game Engine",
    desc: "Từ concept art đến game-ready 3D asset trong vài phút. Tự động retopology và texture PBR 4K, tương thích hoàn hảo Unity, Unreal Engine, Godot.",
    stats: "10x",
    statsLabel: "Tốc độ sản xuất asset",
    tags: ["Auto Retopo", "PBR 4K Textures", "Rigged & Animated"],
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop",
    accent: "#fb923c",
    icon: Gamepad2,
  },
  {
    id: "vr-ar",
    title: "VR / AR / XR",
    subtitle: "Trải nghiệm immersive cho Metaverse",
    desc: "Tạo môi trường không gian 3D, avatar và mô hình cho thiết bị Apple Vision Pro, Meta Quest và các bộ lọc AR. Tối ưu hóa số lượng polygon mượt mà.",
    stats: "60 FPS+",
    statsLabel: "Tối ưu hóa đa nền tảng",
    tags: ["VisionOS", "Meta Quest", "Real-time Spatial"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    accent: "#38bdf8",
    icon: Glasses,
  },
  {
    id: "industrial",
    title: "Industrial Design",
    subtitle: "Prototype siêu tốc cho sản xuất",
    desc: "Từ bản phác thảo ý tưởng đến mẫu in 3D vật lý chính xác trong 48 giờ. Hỗ trợ đầy đủ các định dạng CAD/CAM công nghiệp STEP, STL, OBJ.",
    stats: "0.05mm",
    statsLabel: "Độ chính xác in SLA/FDM",
    tags: ["Rapid Prototyping", "CAD/CAM Export", "Tolerance Check"],
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop",
    accent: "#10b981",
    icon: Cog,
  },
  {
    id: "film",
    title: "Animation & Film",
    subtitle: "Assets cho Motion Graphics & CGI",
    desc: "Tạo mô hình nhân vật, đạo cụ và bối cảnh chi tiết cao (high-poly), sẵn sàng tích hợp vào Blender, Maya, Cinema 4D và Houdini pipeline.",
    stats: "4K / 8K",
    statsLabel: "Bản đồ họa chất lượng cao",
    tags: ["High-Poly Sculpt", "UV Unwrapped", "VFX Ready"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    accent: "#a855f7",
    icon: Film,
  },
];

export function IndustryShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const current = INDUSTRIES[activeTab];

  const nextTab = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % INDUSTRIES.length);
  }, []);

  const prevTab = useCallback(() => {
    setActiveTab((prev) => (prev - 1 + INDUSTRIES.length) % INDUSTRIES.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      nextTab();
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, nextTab]);

  return (
    <section
      className="relative w-full py-24 md:py-32 px-4 md:px-8 bg-[#090a0f] border-b border-white/5 overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Subtle Cyber Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none rounded-full blur-[140px] opacity-15"
        style={{ backgroundColor: current.accent }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest text-[#f5b942] bg-[#f5b942]/10 border border-[#f5b942]/20 mb-3">
              <span>HỆ SINH THÁI ĐA LĨNH VỰC</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Lĩnh Vực Ứng Dụng
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/60 max-w-xl">
              Kinetic3D phục vụ từ thương mại điện tử, phát triển game đến nghiên cứu sản xuất công nghiệp chuẩn xác cao.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevTab}
              aria-label="Previous Industry"
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextTab}
              aria-label="Next Industry"
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            const isActive = activeTab === i;

            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs md:text-sm font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    : "bg-white/[0.02] border-white/5 text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
                style={{
                  borderColor: isActive ? ind.accent : undefined,
                  boxShadow: isActive ? `0 0 20px ${ind.accent}20` : undefined,
                }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: isActive ? ind.accent : "currentColor" }}
                />
                <span>{ind.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Showcase Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0d0e14] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]"
            >
              {/* Left Details Info */}
              <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between z-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
                      style={{
                        backgroundColor: `${current.accent}20`,
                        color: current.accent,
                        border: `1px solid ${current.accent}40`,
                      }}
                    >
                      {String(activeTab + 1).padStart(2, "0")} / 05
                    </span>
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                      {current.subtitle}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    {current.title}
                  </h3>

                  <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-lg mb-8">
                    {current.desc}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {current.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Metric & Action */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div
                      className="text-2xl md:text-4xl font-extrabold font-mono tracking-tight"
                      style={{ color: current.accent }}
                    >
                      {current.stats}
                    </div>
                    <div className="text-xs font-mono text-white/50 uppercase mt-0.5">
                      {current.statsLabel}
                    </div>
                  </div>

                  <Link
                    href="/custom"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs md:text-sm font-bold text-black transition-all hover:opacity-90 shadow-lg cursor-pointer"
                    style={{ backgroundColor: current.accent }}
                  >
                    <span>Trải Nghiệm Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Cinematic Artwork Visual */}
              <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Gradient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0d0e14] via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0e14]/80" />

                {/* Watermark Number */}
                <div
                  className="absolute bottom-6 right-8 text-8xl md:text-9xl font-extrabold font-mono pointer-events-none select-none"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                  }}
                >
                  0{activeTab + 1}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
