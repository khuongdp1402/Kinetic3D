"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ImagePlus, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Cpu, 
  ShieldCheck 
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function BrandStoryAI3D() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { openComingSoonModal } = useAppStore();

  const goToStudio = () => {
    openComingSoonModal("Công Cụ Tạo Mẫu AI Mesh Từ Văn Bản & Ý Tưởng");
  };

  const onPickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      openComingSoonModal(`Tạo Mẫu 3D Từ Ảnh [${file.name}]`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      openComingSoonModal(`Tạo Mẫu 3D Từ Ảnh [${file.name}]`);
    }
  };

  return (
    <section 
      className="w-full py-20 md:py-28 relative overflow-hidden transition-colors duration-300 border-t"
      style={{ 
        backgroundColor: "var(--c-bg)", 
        borderColor: "var(--c-white-10)" 
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[500px] pointer-events-none rounded-full blur-[140px] opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(245,185,66,0.35) 0%, rgba(251,146,60,0.15) 50%, transparent 80%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ========================================================= */}
          {/* LEFT: ASYMMETRICAL STORY, HEADLINE & CUSTOM UPLOAD CAPSULE */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7">
            
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider w-fit border border-[#f5b942]/30 text-[#f5b942] bg-[#f5b942]/10 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>TỰ ĐỘNG HÓA AI // MESH THÔNG MINH</span>
            </motion.div>

            {/* Bold Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h2 
                className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-sans"
                style={{ color: "var(--c-white)" }}
              >
                Tạo Mô Hình 3D{" "}
                <span className="text-[#f5b942] underline decoration-[#f5b942]/30 underline-offset-8">
                  Trong Vài Giây
                </span>
              </h2>
              <p 
                className="mt-3 text-lg md:text-xl font-mono font-medium"
                style={{ color: "var(--c-orange)" }}
              >
                {"// Quad-Mesh Tự Động • Xuất Xưởng In Đa Màu AMS"}
              </p>
            </motion.div>

            {/* Narrative Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base md:text-lg leading-relaxed max-w-2xl font-sans"
              style={{ color: "var(--c-white-80)" }}
            >
              Chuyển hóa mọi ý tưởng phác thảo, hình ảnh chụp thực tế hoặc bản vẽ 2D thành mô hình 3D hoàn chỉnh chỉ trong tích tắc. Hệ thống AI độc quyền của Kinetic3D tự động tái tạo khối, sinh lưới Quad-Mesh thông minh chuẩn từ 500 đến 2M polygon, phủ bề mặt PBR Texture và sẵn sàng xuất xưởng in 3D đa màu hoặc đưa thẳng vào các game engine hàng đầu.
            </motion.p>

            {/* Pill CTA Button (Black in Light Mode, Gold Neon in Dark Mode) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex items-center gap-4 pt-1"
            >
              <button
                type="button"
                onClick={goToStudio}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm md:text-base tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg dark:bg-[#f5b942] dark:text-[#0a0a0f] dark:shadow-[0_0_25px_rgba(245,185,66,0.35)] bg-[#0a0a0f] text-white hover:bg-black"
              >
                <span>Tùy Biến 3D Ngay</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={onPickFile}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-mono text-xs md:text-sm font-semibold border transition-all hover:border-[#f5b942]/60 cursor-pointer"
                style={{
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: "var(--c-white-15)",
                  color: "var(--c-white)",
                }}
              >
                <ImagePlus className="w-4 h-4 text-[#f5b942]" />
                <span>Tải Ảnh 2D Lên</span>
              </button>
            </motion.div>

            {/* ── AI 3D Upload & Prompt Capsule ── */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-3 max-w-2xl"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-300 ${
                  isDragging ? "scale-[1.02] shadow-[0_0_35px_rgba(245,185,66,0.4)]" : "hover:shadow-[0_0_25px_rgba(245,185,66,0.2)]"
                }`}
              >
                {/* Spinning Conic Neon Gradient Beam */}
                <div
                  className="absolute -inset-[150%] animate-spin-neon pointer-events-none opacity-70 hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, #f5b942 330deg, #ffffff 350deg, #f5b942 360deg)",
                  }}
                />

                {/* Inner Capsule Content */}
                <div
                  className="relative z-10 w-full rounded-[14.5px] p-2.5 pl-4 flex items-center gap-3 transition-colors border"
                  style={{
                    backgroundColor: "var(--c-bg-card)",
                    borderColor: "var(--c-white-10)",
                  }}
                >
                  <button
                    type="button"
                    onClick={onPickFile}
                    aria-label="Tải ảnh lên"
                    className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#f5b942]/10 transition-colors cursor-pointer"
                    style={{ color: "var(--c-white-80)" }}
                  >
                    <ImagePlus className="w-5 h-5 text-[#f5b942]" />
                  </button>

                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && goToStudio()}
                    placeholder={
                      selectedFileName
                        ? `File đã chọn: ${selectedFileName}`
                        : "Nhập mô tả hoặc thả ảnh chụp vào đây để tạo 3D..."
                    }
                    className="flex-1 min-w-0 bg-transparent outline-none text-sm font-sans py-2"
                    style={{ color: "var(--c-white)" }}
                  />

                  <button
                    type="button"
                    onClick={goToStudio}
                    className="shrink-0 flex items-center gap-2 text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] bg-[#f5b942] text-[#0a0a0f] cursor-pointer shadow-[0_0_15px_rgba(245,185,66,0.3)]"
                  >
                    <span>Tạo Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div 
                className="mt-2 text-[11px] font-mono flex items-center gap-4"
                style={{ color: "var(--c-white-50)" }}
              >
                <span>✓ PNG, JPG, WEBP đến 25MB</span>
                <span>✓ Tự động Retopo Quad-Mesh</span>
              </div>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: OFFSET CROPPED 3D HERO PLATE & FLOATING ELEMENTS */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end overflow-visible">
            
            {/* Large Offset Stage Container */}
            <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] flex items-center justify-center lg:translate-x-12">
              
              {/* Concentric Glow Podium Disc */}
              <div 
                className="absolute inset-0 rounded-full border shadow-2xl"
                style={{
                  background: "radial-gradient(circle at 40% 40%, var(--c-bg-card) 0%, var(--c-bg-deep) 65%, var(--c-bg) 100%)",
                  borderColor: "rgba(245, 185, 66, 0.4)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.2), inset 0 0 40px rgba(245,185,66,0.15)",
                }}
              />

              {/* Decorative Tech Dash Rings */}
              <svg 
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] pointer-events-none opacity-50 animate-[spin_45s_linear_infinite]" 
                viewBox="0 0 500 500"
              >
                <circle 
                  cx="250" 
                  cy="250" 
                  r="230" 
                  fill="none" 
                  stroke="#f5b942" 
                  strokeWidth="1.2" 
                  strokeDasharray="6 8"
                />
                <circle 
                  cx="250" 
                  cy="250" 
                  r="190" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.8" 
                  strokeDasharray="2 10"
                  className="text-[var(--c-white-30)]"
                />
              </svg>

              {/* Zoomed 3D Model Image (Offset Center) */}
              <div className="relative w-[260px] h-[260px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden shadow-2xl border-2 border-[#f5b942]/50 group">
                <Image
                  src="/images/products/cyber-bot-print.jpg"
                  alt="Cyber Bot 3D Mesh Intelligent"
                  fill
                  sizes="(max-width: 768px) 300px, 450px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority={false}
                />

                {/* Cyber Spec Badge inside plate */}
                <div className="absolute inset-x-0 bottom-0 px-5 pt-8 pb-7 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end justify-between pointer-events-none">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-wide">
                      Cyber Mecha Quad-Mesh
                    </span>
                    <span className="text-[10px] font-mono text-[#f5b942]">
                      1.2M Polygons // Retopo Clean
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/90 bg-black/70 px-2.5 py-1 rounded border border-white/20">
                    SLA 8K
                  </span>
                </div>
              </div>

              {/* --------------------------------------------------- */}
              {/* FLOATING DEBRIS & TECH ELEMENTS (Like Salad Leaves) */}
              {/* --------------------------------------------------- */}
              
              {/* Floating Element 1: Quad Mesh Chip */}
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 6, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 left-6 z-30 px-3 py-1.5 rounded-full border shadow-xl flex items-center gap-2 text-xs font-mono"
                style={{
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: "rgba(245, 185, 66, 0.5)",
                  color: "#f5b942",
                }}
              >
                <Cpu className="w-3.5 h-3.5 text-[#f5b942]" />
                <span>Auto Quad Retopo</span>
              </motion.div>

              {/* Floating Element 2: PBR Texture Tag */}
              <motion.div
                animate={{
                  y: [12, -8, 12],
                  rotate: [-4, 4, -4],
                }}
                transition={{
                  duration: 5.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-4 right-10 z-30 px-3 py-1.5 rounded-full border shadow-xl flex items-center gap-2 text-xs font-mono"
                style={{
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: "var(--c-white-15)",
                  color: "var(--c-white)",
                }}
              >
                <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>PBR 4K Textures</span>
              </motion.div>

              {/* Floating Element 3: Precision Tolerance Badge */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                  x: [6, -6, 6],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-1/3 -left-8 z-30 px-2.5 py-1 rounded-full border shadow-md flex items-center gap-1.5 text-[11px] font-mono"
                style={{
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: "var(--c-white-15)",
                  color: "var(--c-white-80)",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>Sai Số &lt; 0.05mm</span>
              </motion.div>

              {/* Floating Element 4: Floating Energy Spark */}
              <motion.div
                animate={{
                  y: [6, -10, 6],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7,
                }}
                className="absolute bottom-1/4 -right-4 z-30 w-4 h-4 rounded-full bg-[#f5b942] shadow-[0_0_20px_rgba(245,185,66,0.9)] flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
