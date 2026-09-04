"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CircuitBackground } from "@/components/ui/CircuitPattern";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Clip-path reveal for each line
    if (line1Ref.current) {
      tl.fromTo(
        line1Ref.current,
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", y: 40 },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0, duration: 1.2, ease: "power4.out" }
      );
    }
    if (line2Ref.current) {
      tl.fromTo(
        line2Ref.current,
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", y: 40 },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0, duration: 1.2, ease: "power4.out" },
        "-=0.8"
      );
    }
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );
    }
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 overflow-hidden"
      style={{ backgroundColor: "var(--c-bg)" }}
    >
      {/* Background gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 70% 40%, var(--c-lime-05), transparent 70%)",
        }}
      />

      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-24 pb-12">
        
        {/* Left Column: Text Content */}
        <div className="flex flex-col items-start">
          {/* Main headline */}
          <div className="overflow-hidden mb-2">
            <div
              ref={line1Ref}
              className="font-bold leading-[0.9] tracking-[-0.04em]"
              style={{ fontSize: "clamp(3rem, 8vw, 8rem)", color: "var(--c-white)" }}
            >TƯƠNG LAI</div>
          </div>
          <div className="overflow-hidden mb-8">
            <div
              ref={line2Ref}
              className="font-bold leading-[0.9] tracking-[-0.04em]"
              style={{ fontSize: "clamp(3rem, 8vw, 8rem)", color: "var(--c-lime)", textShadow: "0 0 60px var(--c-lime-20)" }}
            >ĐƯỢC IN 3D.</div>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-sm md:text-base uppercase tracking-[0.25em] mb-10 max-w-md"
            style={{ color: "var(--c-light-gray)", fontFamily: "var(--font-mono)", opacity: 0 }}
          >
            Nền tảng sản xuất 3D tùy chỉnh. Độ chính xác dưới 10 micron.
            Từ bản thiết kế kỹ thuật số đến tác phẩm vật lý.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300"
              style={{
                backgroundColor: "var(--c-lime)",
                color: "var(--c-bg)",
                fontFamily: "var(--font-mono)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px var(--c-lime-50)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Khám Phá Danh Mục
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300"
              style={{
                border: "1px solid var(--c-white-30)",
                color: "var(--c-white)",
                fontFamily: "var(--font-mono)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--c-lime)";
                e.currentTarget.style.color = "var(--c-lime)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--c-white-30)";
                e.currentTarget.style.color = "var(--c-white)";
              }}
            >
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Video Placeholder */}
        <div className="relative w-full flex items-center justify-center mt-16 lg:mt-0">
          <div className="relative w-full lg:w-[95%] aspect-[4/3] lg:aspect-[1/1] group perspective-[1000px]">
            
            {/* Layer 1: Background Layer */}
            <div className="absolute inset-0 crosses-border bg-[var(--c-lime-05)] border border-[#f97316]/30 rotate-3 translate-x-4 translate-y-4 transition-all duration-500 group-hover:rotate-6 group-hover:translate-x-6 group-hover:translate-y-6 opacity-50 backdrop-blur-sm" />
            
            {/* Main Video Container (Layer 2) */}
            <div className="absolute inset-0 crosses-border border border-[#f97316]/40 bg-[#2a2422]/80 backdrop-blur-xl overflow-hidden flex items-center justify-center -rotate-2 shadow-[0_0_50px_rgba(249,115,22,0.1)] transition-all duration-300 hover:animate-[shake-tilt_0.2s_ease-in-out_infinite]">
              
              {/* Actual Video */}
              <video 
                src="https://videos.pexels.com/video-files/5532771/5532771-sd_640_360_25fps.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
              />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#f97316]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#f97316]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#f97316]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#f97316]" />
              
              {/* Scanline overlay for the video box */}
              <div className="absolute inset-0 pointer-events-none opacity-40" style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(249,115,22,0.1) 2px, rgba(249,115,22,0.1) 4px)"
              }} />

              {/* Video Overlay Content */}
              <div className="text-center z-10 p-6 flex flex-col items-center pointer-events-none">
                <div className="w-16 h-16 border-2 border-[#f97316]/60 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:border-[#f97316] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] backdrop-blur-sm bg-black/20">
                  {/* Play icon */}
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-[#f97316] border-b-[8px] border-b-transparent ml-2" />
                </div>
                <p className="font-mono text-[#f97316] tracking-[0.25em] text-sm lg:text-base font-bold opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
                  [ STREAM ACTIVE ]
                </p>
                <p className="font-mono text-[var(--c-white)] font-bold tracking-widest text-[10px] lg:text-xs mt-3 drop-shadow-[0_0_5px_rgba(0,0,0,1)]">
                  REC: 00:00:00:00
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Cuộn indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "var(--c-white-30)", fontFamily: "var(--font-mono)" }}
        >
          Scroll
        </span>
        <div className="w-[1px] h-8" style={{ backgroundColor: "var(--c-white-15)" }} />
      </div>
    </section>
  );
}
