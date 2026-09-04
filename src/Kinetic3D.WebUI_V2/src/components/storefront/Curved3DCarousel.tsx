"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { SplitRevealImage } from "@/components/storefront/SplitRevealImage";
import Link from "next/link";

interface CarouselModel {
  id: string;
  title: string;
  category: string;
  polyCount: string;
  format: string;
  image: string;
  slug: string;
}

const CAROUSEL_MODELS: CarouselModel[] = [
  {
    id: "tank-m4a1",
    title: "M4A1 Sherman Tank",
    category: "3D Print Plate (AMS)",
    polyCount: "75 Parts // 373K Verts",
    format: "FDM / STL / GLB",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    slug: "/products",
  },
  {
    id: "cyber-warrior",
    title: "Cyber Mecha Warrior",
    category: "Game-Ready Asset",
    polyCount: "28K Triangles",
    format: "Rigged // FBX / GLB",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    slug: "/custom",
  },
  {
    id: "anime-figurine",
    title: "Fabriko3D Figurine",
    category: "Collectible / SLA Resin",
    polyCount: "1.2M High-Poly",
    format: "Color PBR / 4K",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    slug: "/custom",
  },
  {
    id: "keycap-dragon",
    title: "Titan Keycap Custom",
    category: "Custom Workshop",
    polyCount: "45K Triangles",
    format: "Resin / MX Stem",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
    slug: "/products",
  },
  {
    id: "sci-fi-drone",
    title: "Autonomous Recon Drone",
    category: "Industrial Design",
    polyCount: "62K Triangles",
    format: "CAD / STP / STEP",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop",
    slug: "/custom",
  },
  {
    id: "cyber-katana",
    title: "Neon Plasma Blade",
    category: "VR / AR Metaverse",
    polyCount: "14K Triangles",
    format: "Unreal / Unity",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    slug: "/custom",
  },
  {
    id: "heritage-temple",
    title: "Khuê Văn Các Heritage",
    category: "Culture & Architecture",
    polyCount: "210K Triangles",
    format: "Precision 3D Print",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    slug: "/products",
  },
];

export function Curved3DCarousel() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const total = CAROUSEL_MODELS.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch drag support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 40) prevSlide();
    else if (diff < -40) nextSlide();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full py-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Curved Perspective Viewport */}
      <div
        className="relative mx-auto h-[380px] md:h-[440px] w-full max-w-[1280px] flex items-center justify-center overflow-visible"
        style={{ perspective: "1300px" }}
      >
        {CAROUSEL_MODELS.map((model, i) => {
          // Circular offset calculation relative to active item
          let diff = i - activeIndex;
          if (diff < -Math.floor(total / 2)) diff += total;
          if (diff > Math.floor(total / 2)) diff -= total;

          const isCenter = diff === 0;
          const absDiff = Math.abs(diff);

          // Arc geometry parameters for a sleek Tripo3D cylindrical curve
          const rotateY = diff * 18; // rotation around vertical axis
          const translateX = diff * 210; // horizontal separation
          const translateZ = -absDiff * 80; // depth recession
          const scale = Math.max(0.72, 1 - absDiff * 0.1);
          const opacity = Math.max(0.2, 1 - absDiff * 0.28);
          const zIndex = 30 - absDiff;

          return (
            <div
              key={model.id}
              onClick={() => setActiveIndex(i)}
              className="absolute w-[240px] md:w-[280px] h-[340px] md:h-[390px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                boxShadow: isCenter
                  ? "0 20px 50px -10px rgba(0,0,0,0.9), 0 0 35px rgba(245,185,66,0.25)"
                  : "0 10px 30px -10px rgba(0,0,0,0.8)",
                border: isCenter
                  ? "1px solid rgba(245, 185, 66, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                filter: isCenter ? "none" : "brightness(0.75)",
              }}
            >
              {/* Background Artwork Layer with Split Reveal on Hover */}
              <div className="absolute inset-0 z-0">
                <SplitRevealImage
                  src={model.image}
                  alt={model.title}
                  sizes="(max-width: 768px) 240px, 280px"
                  imgClassName="scale-105"
                  initialSplit={50}
                />
              </div>

              {/* Top Vignette & Category Pill */}
              <div className="absolute top-0 inset-x-0 p-3.5 flex items-center justify-between z-20 pointer-events-none bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase bg-black/60 text-[#f5b942] border border-[#f5b942]/30 backdrop-blur-md">
                  {model.category}
                </span>
                <span className="text-[10px] font-mono text-white/50 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {model.format}
                </span>
              </div>

              {/* Bottom Card Details Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 z-20 pointer-events-none bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white tracking-tight leading-snug drop-shadow-md">
                      {model.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#f5b942]/90 mt-0.5">
                      {model.polyCount}
                    </p>
                  </div>
                  {isCenter && (
                    <Link
                      href={model.slug}
                      className="pointer-events-auto w-8 h-8 rounded-full bg-[#f5b942] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,185,66,0.6)]"
                      title="Xem chi tiết"
                    >
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Glowing Active Border Ring */}
              {isCenter && (
                <div className="absolute inset-0 rounded-3xl pointer-events-none ring-1 ring-[#f5b942]/50 shadow-[inset_0_0_20px_rgba(245,185,66,0.1)]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls & Indicators */}
      <div className="relative z-30 flex items-center justify-center gap-5 mt-4">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous model"
          className="w-10 h-10 rounded-full border border-white/10 bg-black/60 text-white/70 hover:text-white hover:border-[#f5b942]/50 hover:bg-[#f5b942]/10 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="flex items-center gap-1.5">
          {CAROUSEL_MODELS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? "w-7 bg-[#f5b942] shadow-[0_0_8px_rgba(245,185,66,0.8)]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next model"
          className="w-10 h-10 rounded-full border border-white/10 bg-black/60 text-white/70 hover:text-white hover:border-[#f5b942]/50 hover:bg-[#f5b942]/10 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tripo-style Interactive Hint */}
      <div className="text-center mt-3 text-[11px] font-mono text-white/40 tracking-wider">
        RÊ CHUỘT VÀO CARD ĐỂ SOI BẢN VẼ MỘC (CLAY) // BẢN TÔ MÀU 3D
      </div>
    </div>
  );
}
