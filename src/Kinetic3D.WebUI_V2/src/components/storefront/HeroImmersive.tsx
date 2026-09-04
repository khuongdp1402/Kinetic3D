"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, ArrowRight, Sparkles } from "lucide-react";
import { ScrambleIn } from "@/components/ui/scramble-in";
import { motion } from "framer-motion";
import { Curved3DCarousel } from "@/components/storefront/Curved3DCarousel";

export function HeroImmersive() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const goToStudio = () => {
    const params = prompt.trim() ? `?prompt=${encodeURIComponent(prompt.trim())}` : "";
    router.push(`/custom${params}`);
  };

  const onPickFile = () => fileInputRef.current?.click();
  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = () => {
    router.push("/custom?source=upload");
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#0a0a0f", minHeight: "100dvh" }}
    >
      {/* Ambient Cyber Grid backdrop (Pure CSS, 0 WebGL overhead) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black 30%, transparent 80%)",
        }}
      />

      {/* Cyber Golden Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 18%, rgba(245,185,66,0.1), transparent 65%)",
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center pt-24 md:pt-28 pb-16 px-4 md:px-6">
        {/* Top Feature Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.15em] mb-6 border border-[#f5b942]/30 text-[#f5b942] bg-[#f5b942]/10 backdrop-blur-md shadow-[0_0_20px_rgba(245,185,66,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>KINETIC3D // AI-POWERED 3D WORKSHOP</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1
            className="font-bold tracking-[-0.03em] leading-[1.04]"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)", color: "#ffffff" }}
          >
            <ScrambleIn
              text="Tạo Mô Hình 3D Trong Vài Giây"
              scrambleSpeed={35}
              scrambledLetterCount={6}
              scrambledClassName="text-white/40"
            />
          </h1>
          <p className="mt-4 max-w-xl text-sm md:text-lg mx-auto text-white/60">
            Kinetic3D biến ý tưởng hoặc ảnh chụp thành mô hình 3D chính xác, hỗ trợ xuất xưởng và in 3D đa màu thực tế chỉ trong tích tắc.
          </p>
        </motion.div>

        {/* Prompt / Upload Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 mb-6 w-full max-w-2xl"
        >
          <div
            className="flex items-center gap-3 rounded-2xl p-2 pl-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,185,66,0.15)] focus-within:shadow-[0_0_40px_rgba(245,185,66,0.25)] focus-within:border-[#f5b942]/60 bg-[#0f0f14]/80 border border-white/10 backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={onPickFile}
              aria-label="Tải ảnh lên"
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileSelected}
            />

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToStudio()}
              placeholder="Mô tả ý tưởng hoặc tải ảnh lên để tạo 3D..."
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/30 py-2 font-sans"
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
        </motion.div>

        {/* Curved 3D Arc Carousel (Tripo3D Style) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl mx-auto mt-2"
        >
          <Curved3DCarousel />
        </motion.div>
      </div>
    </section>
  );
}
