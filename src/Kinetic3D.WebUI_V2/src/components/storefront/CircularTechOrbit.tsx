"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Box, 
  Layers, 
  Cpu, 
  Sparkles,
  ExternalLink,
  Plus,
  Minus
} from "lucide-react";

export interface OrbitProduct {
  id: string;
  title: string;
  category: string;
  badge: string;
  price: string;
  rawPrice: number;
  format: string;
  polyCount: string;
  description: string;
  specs: string[];
  image: string;
  slug: string;
}

export const ORBIT_PRODUCTS: OrbitProduct[] = [
  {
    id: "tank-m4a1",
    title: "M4A1 Sherman Tank AMS",
    category: "Bản In Đa Màu Tự Động (AMS)",
    badge: "MULTI-MATERIAL // AMS 4-COLOR",
    price: "850.000₫",
    rawPrice: 850000,
    format: "FDM / PETG+",
    polyCount: "75 Chi Tiết Lắp Ráp",
    description: "Khay in đa vật liệu tự động (AMS) mô hình xe tăng Sherman M4A1. Cấu trúc 75 chi tiết cơ khí tháo rời tinh xảo, tái hiện chân thực từng module xích kéo, thân xe và tháp pháo xoay.",
    specs: ["75 Chi Tiết", "Khay In AMS", "PETG Chịu Lực", "Tỉ Lệ 1:35"],
    image: "/images/products/sherman-m4a1-plate.jpg",
    slug: "/products",
  },
  {
    id: "cyber-warrior",
    title: "Cyber Mecha Explorer",
    category: "Sci-Fi Collectible // SLA Resin",
    badge: "SLA ULTRA-RES // 0.02MM",
    price: "1.250.000₫",
    rawPrice: 1250000,
    format: "SLA 8K / PBR",
    polyCount: "1.2M High-Poly Mesh",
    description: "Chiến binh Mecha tương lai với panel line siêu sắc nét, bề mặt láng mịn không tì vết. In quang hóa Resin SLA độ phân giải siêu cao, tối ưu cho anh em đam mê sơn phết thủ công.",
    specs: ["Tỉ Lệ 1:12", "SLA 8K Resin", "Panel Line Sắc Nét", "Khớp Cử Động"],
    image: "/images/products/cyber-bot-print.jpg",
    slug: "/products",
  },
  {
    id: "artisan-keycap",
    title: "Titan Mech Keycap SLA",
    category: "Artisan Mech Keycaps",
    badge: "ARTISAN CRAFT // CHERRY MX",
    price: "350.000₫",
    rawPrice: 350000,
    format: "Resin SLA / MX Stem",
    polyCount: "45K Polygons Chi Tiết",
    description: "Nút phím cơ chế tác độc bản chủ đề Cyber-Tech viễn tưởng. Đúc Resin SLA quang hóa độ cứng cao, tương thích hoàn toàn chuẩn chân switch Cherry MX và cho phép đèn LED RGB hắt xuyên thấu ma mị.",
    specs: ["Stem Cherry MX", "Resin Cường Lực", "Xuyên LED RGB", "Độ Bền Cao"],
    image: "/images/products/artisan-keycap.jpg",
    slug: "/products",
  },
  {
    id: "cyber-helmet",
    title: "Cyberpunk Tactical Helmet",
    category: "Cosplay & Wearable Tech",
    badge: "WEARABLE 1:1 // CARBON REINFORCED",
    price: "1.850.000₫",
    rawPrice: 1850000,
    format: "PETG Carbon / LED Visor",
    polyCount: "Tỉ Lệ Đội Đầu 1:1",
    description: "Mũ giáp công nghệ tương lai tỉ lệ 1:1 in bằng vật liệu PETG gia cường sợi Carbon. Trọng lượng siêu nhẹ chỉ 680g, chịu va đập mạnh, tích hợp rãnh cáp và ray gắn kính chắn sáng LED neon.",
    specs: ["Tỉ Lệ 1:1", "Sợi Carbon PETG", "Khe LED Neon", "Trọng Lượng 680g"],
    image: "/images/products/cyber-helmet-print.jpg",
    slug: "/products",
  },
  {
    id: "ion-drive",
    title: "Primary Ion Thruster Drive",
    category: "Industrial & Space Mechanism",
    badge: "INDUSTRIAL CAD // AIRFLOW DYNAMICS",
    price: "1.450.000₫",
    rawPrice: 1450000,
    format: "STEP / CAD / Poly",
    polyCount: "Cánh Turbine Lồng Ghép",
    description: "Mô hình cụm động cơ đẩy hạt nhân ion không gian viễn tưởng. Kết cấu cánh quạt turbine lồng ghép tinh vi với độ dung sai cơ khí đạt chuẩn CAD công nghiệp, hoàn thiện kim loại ánh nòng súng.",
    specs: ["Chuẩn CAD STEP", "Dung Sai 0.1mm", "Metallic PBR", "Bệ Đỡ Trưng Bày"],
    image: "/images/products/primary-ion-drive-print.jpg",
    slug: "/custom",
  },
  {
    id: "voronoi-vase",
    title: "Voronoi Computational Vase",
    category: "Nghệ Thuật Hình Học Thuật Toán",
    badge: "ALGORITHMIC ART // SILK DUAL-COLOR",
    price: "280.000₫",
    rawPrice: 280000,
    format: "PLA Silk / Dual-Tone",
    polyCount: "Voronoi Tessellation",
    description: "Vật phẩm nghệ thuật tạo tác từ thuật toán phân rã Voronoi toán học. In bằng sợi Silk đổi màu ánh kim, tạo hiệu ứng tán xạ ánh sáng ma trận huyền ảo khi đặt dưới ánh đèn phòng trưng bày.",
    specs: ["Thuật Toán Voronoi", "Sợi Silk Đổi Màu", "Kháng Nước", "Trang Trí Cao Cấp"],
    image: "/images/products/voronoi-vase-print.jpg",
    slug: "/products",
  },
];

export function CircularTechOrbit() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const total = ORBIT_PRODUCTS.length;
  const activeProduct = ORBIT_PRODUCTS[activeIndex];

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) prevSlide();
    else if (diff < -50) nextSlide();
  };

  const anglePerItem = 360 / total;
  const wheelRotation = -activeIndex * anglePerItem;

  return (
    <div 
      className="relative w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[580px] lg:min-h-[640px] relative">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: PRODUCT INTEL & CONTROLS */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-center z-20 order-2 lg:order-1 pt-4 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-[#f5b942]/10 text-[#f5b942] border border-[#f5b942]/30 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  {activeProduct.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[var(--c-bg-card)] text-[var(--c-white-50)] border border-[var(--c-white-10)]">
                  {activeProduct.format}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] font-sans" style={{ color: "var(--c-white)" }}>
                {activeProduct.title}
              </h1>

              {/* Dynamic Price & Specs Overview */}
              <div className="flex items-baseline gap-3 pt-1">
                <div className="text-3xl lg:text-4xl font-mono font-black text-[#f5b942] tracking-tight drop-shadow-[0_0_20px_rgba(245,185,66,0.35)]">
                  {activeProduct.price}
                </div>
                <div className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--c-white-50)" }}>
                  {`// ${activeProduct.polyCount}`}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base leading-relaxed max-w-lg font-sans" style={{ color: "var(--c-white-80)" }}>
                {activeProduct.description}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activeProduct.specs.map((spec, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border shadow-sm transition-colors"
                    style={{
                      backgroundColor: "var(--c-bg-card)",
                      borderColor: "var(--c-white-10)",
                      color: "var(--c-white)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5b942]" />
                    {spec}
                  </span>
                ))}
              </div>

              {/* Quantity Stepper & Order CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {/* Stepper */}
                <div 
                  className="flex items-center rounded-xl border p-1"
                  style={{
                    backgroundColor: "var(--c-bg-card)",
                    borderColor: "var(--c-white-15)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Giảm số lượng"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f5b942]/10 transition-colors cursor-pointer"
                    style={{ color: "var(--c-white-80)" }}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center font-mono font-bold text-sm text-[#f5b942]">
                    {String(quantity).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Tăng số lượng"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f5b942]/10 transition-colors cursor-pointer"
                    style={{ color: "var(--c-white-80)" }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary CTA */}
                <Link
                  href={activeProduct.slug}
                  className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#f5b942] to-[#fb923c] text-[#0a0a0f] shadow-[0_0_25px_rgba(245,185,66,0.35)] hover:shadow-[0_0_35px_rgba(245,185,66,0.5)] cursor-pointer"
                >
                  <span>Đặt In / Chi Tiết</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                {/* Secondary Studio Button */}
                <Link
                  href="/custom"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer hover:border-[#f5b942]/50 hover:bg-[#f5b942]/10"
                  style={{
                    backgroundColor: "var(--c-bg-card)",
                    borderColor: "var(--c-white-15)",
                    color: "var(--c-white)",
                  }}
                  title="Mở Studio AI 3D"
                >
                  <Box className="w-4 h-4 text-[#f5b942]" />
                  <span className="hidden sm:inline">3D Studio</span>
                </Link>
              </div>

              {/* Navigation & Progress Row */}
              <div 
                className="flex items-center justify-between pt-4 border-t"
                style={{ borderColor: "var(--c-white-10)" }}
              >
                {/* Prev / Next buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Mẫu trước đó"
                    className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer hover:border-[#f5b942]/50 hover:bg-[#f5b942]/10"
                    style={{
                      backgroundColor: "var(--c-bg-card)",
                      borderColor: "var(--c-white-15)",
                      color: "var(--c-white-80)",
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Trước</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Mẫu tiếp theo"
                    className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer hover:border-[#f5b942]/50 hover:bg-[#f5b942]/10"
                    style={{
                      backgroundColor: "var(--c-bg-card)",
                      borderColor: "var(--c-white-15)",
                      color: "var(--c-white-80)",
                    }}
                  >
                    <span>Tiếp Theo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#f5b942] font-bold">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "var(--c-white-30)" }}>/</span>
                  <span className="font-mono text-xs" style={{ color: "var(--c-white-50)" }}>
                    {String(total).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CIRCULAR ORBIT WHEEL & CENTER HERO STAGE */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 relative flex items-center justify-center z-10 order-1 lg:order-2 overflow-visible py-8 lg:py-0">
          
          {/* Main Orbit Stage Outer Bounds */}
          <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] lg:w-[580px] lg:h-[580px] flex items-center justify-center">
            
            {/* Ambient Background Radial Glow behind Orbit */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(245,185,66,0.15) 0%, rgba(251,146,60,0.06) 45%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />

            {/* Futuristic Concentric Radar Rings & Dash Tracks */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 animate-[spin_60s_linear_infinite]" 
              viewBox="0 0 600 600"
            >
              {/* Outer Orbit Track */}
              <circle 
                cx="300" 
                cy="300" 
                r="260" 
                fill="none" 
                stroke="#f5b942" 
                strokeWidth="1.2" 
                strokeDasharray="6 8"
                opacity="0.6"
              />
              {/* Inner Orbit Track */}
              <circle 
                cx="300" 
                cy="300" 
                r="200" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.8" 
                strokeDasharray="3 12"
                className="text-[var(--c-white-30)]"
              />
              {/* Cardinal Radar Tick Crosshairs */}
              <line x1="300" y1="20" x2="300" y2="50" stroke="#f5b942" strokeWidth="1.5" />
              <line x1="300" y1="550" x2="300" y2="580" stroke="#f5b942" strokeWidth="1.5" />
              <line x1="20" y1="300" x2="50" y2="300" stroke="#f5b942" strokeWidth="1.5" />
              <line x1="550" y1="300" x2="580" y2="300" stroke="#f5b942" strokeWidth="1.5" />
            </svg>

            {/* Static Outer Compass Dial */}
            <div 
              className="absolute inset-[15px] sm:inset-[25px] rounded-full border pointer-events-none" 
              style={{ borderColor: "var(--c-white-05)" }} 
            />
            <div className="absolute inset-[50px] sm:inset-[70px] rounded-full border border-[#f5b942]/15 pointer-events-none" />

            {/* ----------------------------------------------------- */}
            {/* ROTATING ORBIT WHEEL CONTAINER */}
            {/* ----------------------------------------------------- */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              animate={{ rotate: wheelRotation }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {ORBIT_PRODUCTS.map((prod, index) => {
                const angle = index * anglePerItem;
                const isSelected = index === activeIndex;

                return (
                  <div
                    key={prod.id}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      style={{
                        transform: `rotate(${angle}deg) translateY(var(--orbit-radius, -250px)) rotate(-${angle}deg)`,
                      }}
                      className="[--orbit-radius:-145px] sm:[--orbit-radius:-195px] md:[--orbit-radius:-230px] lg:[--orbit-radius:-255px]"
                    >
                      {/* Satellite Node Counter-Rotation so image stays upright */}
                      <motion.button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        animate={{ rotate: -wheelRotation }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        aria-label={`Chọn mô hình ${prod.title}`}
                        className={`group relative rounded-full transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-[#f5b942] shadow-[0_0_25px_rgba(245,185,66,0.7)] scale-110 z-30"
                            : "w-12 h-12 sm:w-16 sm:h-16 opacity-75 hover:opacity-100 hover:scale-105 z-10"
                        }`}
                        style={{
                          backgroundColor: "var(--c-bg-card)",
                          border: isSelected ? "none" : "1px solid var(--c-white-15)",
                        }}
                      >
                        {/* Node Inner Image */}
                        <div 
                          className="w-full h-full rounded-full overflow-hidden relative"
                          style={{ backgroundColor: "var(--c-bg-deep)" }}
                        >
                          <Image
                            src={prod.image}
                            alt={prod.title}
                            fill
                            sizes="80px"
                            className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                              isSelected ? "brightness-110" : "brightness-90"
                            }`}
                          />
                        </div>

                        {/* Active Glowing Pulse Ring */}
                        {isSelected && (
                          <span className="absolute -inset-1.5 rounded-full border border-[#f5b942]/60 animate-ping pointer-events-none" />
                        )}

                        {/* Micro Index Tag on Hover */}
                        <span 
                          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold group-hover:text-[#f5b942] transition-colors whitespace-nowrap px-1.5 py-0.5 rounded border pointer-events-none"
                          style={{
                            backgroundColor: "var(--c-bg-card)",
                            borderColor: "var(--c-white-15)",
                            color: "var(--c-white-80)",
                          }}
                        >
                          0{index + 1}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* ----------------------------------------------------- */}
            {/* CENTER STAGE: FOCAL 3D HERO PODIUM & MODEL */}
            {/* ----------------------------------------------------- */}
            <div className="relative z-20 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[330px] md:h-[330px] lg:w-[360px] lg:h-[360px] flex items-center justify-center">
              
              {/* Concentric Glow Podium Disc */}
              <div 
                className="absolute inset-0 rounded-full border shadow-2xl transition-colors"
                style={{
                  background: "radial-gradient(circle at 40% 40%, var(--c-bg-card) 0%, var(--c-bg-deep) 65%, var(--c-bg) 100%)",
                  borderColor: "rgba(245, 185, 66, 0.35)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15), inset 0 0 35px rgba(245,185,66,0.12)",
                }}
              />

              {/* Inner Cyber Reticle */}
              <div className="absolute inset-4 rounded-full border border-dashed border-[#f5b942]/25 pointer-events-none" />
              <div 
                className="absolute inset-8 rounded-full border pointer-events-none"
                style={{ borderColor: "var(--c-white-10)" }}
              />

              {/* Hero Image Showcase with Springy Rotation on Switch */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, scale: 0.75, rotate: -40 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 40 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 240, 
                    damping: 24, 
                    mass: 0.9 
                  }}
                  className="relative w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] lg:w-[310px] lg:h-[310px] rounded-full overflow-hidden shadow-2xl border-2 border-[#f5b942]/40 group"
                >
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 240px, 340px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* High-Tech Glass Sheen Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                  
                  {/* Bottom Vignette with Quick Link */}
                  <div className="absolute inset-x-0 bottom-0 p-3 pt-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-mono text-[#f5b942] tracking-wider uppercase drop-shadow font-semibold">
                      {activeProduct.format}
                    </span>
                    <Link
                      href={activeProduct.slug}
                      className="pointer-events-auto p-1.5 rounded-full bg-[#f5b942] text-black hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,185,66,0.6)]"
                      title="Xem chi tiết"
                    >
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* --------------------------------------------------- */}
              {/* FLOATING PARTICLES / DEBRIS (Salad leaves effect) */}
              {/* --------------------------------------------------- */}
              
              {/* Particle 1: Floating Filament Coil Badge */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                  rotate: [0, 8, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-3 -right-2 sm:-top-6 sm:right-4 z-30 px-2.5 py-1 rounded-full border border-[#f5b942]/40 backdrop-blur-md shadow-md flex items-center gap-1.5 text-[10px] font-mono text-[#f5b942]"
                style={{ backgroundColor: "var(--c-bg-card)" }}
              >
                <Layers className="w-3 h-3 text-[#f5b942]" />
                <span>0.02mm Layer</span>
              </motion.div>

              {/* Particle 2: Floating Precision CAD Tag */}
              <motion.div
                animate={{
                  y: [10, -10, 10],
                  rotate: [-3, 5, -3],
                }}
                transition={{
                  duration: 5.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
                className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:left-4 z-30 px-2.5 py-1 rounded-full border shadow-md flex items-center gap-1.5 text-[10px] font-mono"
                style={{ 
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: "var(--c-white-15)",
                  color: "var(--c-white-80)",
                }}
              >
                <Cpu className="w-3 h-3 text-[#f5b942]" />
                <span>AMS Multi-Color</span>
              </motion.div>

              {/* Particle 3: Micro Energy Spark */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  x: [4, -4, 4],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
                className="absolute top-1/4 -left-6 sm:-left-8 z-30 w-3.5 h-3.5 rounded-full bg-[#f5b942] shadow-[0_0_18px_rgba(245,185,66,0.9)] flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>

              {/* Particle 4: Secondary Spark on Bottom Right */}
              <motion.div
                animate={{
                  y: [6, -6, 6],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                className="absolute bottom-1/4 -right-4 sm:-right-6 z-30 w-2.5 h-2.5 rounded-full bg-[#fb923c] shadow-[0_0_12px_rgba(251,146,60,0.8)]"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Subtle Hint Bar at bottom */}
      <div 
        className="relative z-20 text-center mt-6 text-[11px] font-mono tracking-widest uppercase transition-colors"
        style={{ color: "var(--c-white-50)" }}
      >
        {"// CLICK THUMBNAIL HOẶC DÙNG NÚT ĐIỀU HƯỚNG ĐỂ XOAY QUỸ ĐẠO MÔ HÌNH 3D //"}
      </div>
    </div>
  );
}
