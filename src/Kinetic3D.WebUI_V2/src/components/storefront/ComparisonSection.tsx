"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImagePlus, Sparkles, ArrowRight, Layers, Cpu } from "lucide-react";

export function ComparisonSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  return (
    <section className="w-full py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Subtle ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none rounded-full blur-[140px] opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(245,185,66,0.3) 0%, rgba(251,146,60,0.15) 50%, transparent 80%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f5b942]/30 bg-[#f5b942]/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f5b942]" />
            <span className="text-[11px] font-mono tracking-widest text-[#f5b942] uppercase font-semibold">
              AI Generator V3
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Chuyển Ảnh Thành Mô Hình 3D
          </h2>
          <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto">
            Biến ảnh chụp, ảnh phác thảo hoặc bản vẽ 2D thành mô hình 3D hoàn chỉnh chỉ trong vài giây.
          </p>
        </motion.div>

        {/* ── Tripo3D-style Neon Border Upload Capsule ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-[840px] mx-auto mb-20"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative p-[1.5px] rounded-[32px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] group ${
              isDragging ? "scale-[1.02]" : ""
            }`}
          >
            {/* Spinning Conic Neon Gradient Beam */}
            <div
              className="absolute -inset-[150%] animate-spin-neon pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, #f5b942 330deg, #ffffff 350deg, #f5b942 360deg)",
              }}
            />

            {/* Inner Capsule Content */}
            <div
              className="relative z-10 w-full rounded-[30.5px] px-6 md:px-8 py-5 md:py-6 flex items-center justify-between gap-4 transition-colors"
              style={{
                backgroundColor: isDragging ? "#181824" : "#101016",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.6)",
              }}
            >
              {/* Left & Center: Icon + Upload Prompt */}
              <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/70 group-hover:text-[#f5b942] group-hover:border-[#f5b942]/40 transition-colors">
                  <ImagePlus className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm md:text-base font-medium text-white/90 truncate group-hover:text-white transition-colors">
                    {selectedFileName ? (
                      <span className="text-[#f5b942] font-mono font-semibold">{selectedFileName}</span>
                    ) : (
                      "Upload an image, photo, or sketch here"
                    )}
                  </span>
                  <span className="text-xs text-white/40 mt-0.5 hidden sm:block">
                    Hỗ trợ PNG, JPG, WEBP lên đến 25MB • Tự động tạo Mesh & PBR Texture
                  </span>
                </div>
              </div>

              {/* Right: Gold CTA Button */}
              <Link
                href="/products"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold text-xs md:text-sm tracking-wide shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(245,185,66,0.35)]"
                style={{
                  backgroundColor: "#f5b942",
                  color: "#0a0a0f",
                }}
              >
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── 3D Visual with Staggered Top-Left & Bottom-Right Popups ── */}
        <div className="relative max-w-[1060px] mx-auto min-h-[460px] flex items-center justify-center">
          {/* Top-Left Popup: High Detail */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="w-full lg:w-[310px] lg:absolute lg:-left-4 lg:-top-4 z-20 mb-6 lg:mb-0"
          >
            <div
              className="rounded-2xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-[#f5b942]/40"
              style={{
                backgroundColor: "rgba(18, 18, 24, 0.82)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#f5b942]/10 border border-[#f5b942]/30 flex items-center justify-center text-[#f5b942]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#f5b942]">
                  Chi Tiết Cao
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ghi Lại Từng Chi Tiết</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-5">
                Dựng mô hình 3D lên đến 2M polygon — tái hiện sắc sảo bề mặt, lý tưởng cho render, VFX, in 3D và điêu khắc kỹ thuật số.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f5b942] hover:text-white transition-colors"
              >
                <span>Khám phá chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Center: Heroic 3D Render (Single Crisp Full-Color Asset, No B&W Split) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[480px] aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10 mx-auto"
            style={{ backgroundColor: "#12131a" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=900&auto=format&fit=crop"
              alt="AI 3D Model Render"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover transition-transform duration-1000 hover:scale-105"
              priority={false}
            />

            {/* Subtle cyber vignette & bottom shadow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,15,0.85) 0%, transparent 40%, rgba(10,10,15,0.3) 100%)",
              }}
            />

            {/* In-visual badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] font-mono text-white/80 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                PBR Textured • Quad Mesh
              </span>
              <span className="text-[11px] font-mono text-[#f5b942] px-3 py-1.5 rounded-full bg-[#f5b942]/10 border border-[#f5b942]/30">
                AI Fast-Gen
              </span>
            </div>
          </motion.div>

          {/* Bottom-Right Popup: Smart Engine-Ready Mesh */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="w-full lg:w-[310px] lg:absolute lg:-right-4 lg:-bottom-4 z-20 mt-6 lg:mt-0"
          >
            <div
              className="rounded-2xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-[#fb923c]/40"
              style={{
                backgroundColor: "rgba(18, 18, 24, 0.82)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#fb923c]/10 border border-[#fb923c]/30 flex items-center justify-center text-[#fb923c]">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#fb923c]">
                  Mesh Thông Minh
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sẵn Sàng Cho Game Engine</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-5">
                Tự động retopo thành quad mesh chuẩn từ 500 đến 25K polygon, sẵn sàng đưa ngay vào Unreal Engine, Unity, Blender hoặc Godot.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fb923c] hover:text-white transition-colors"
              >
                <span>Xem pipeline kỹ thuật</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
