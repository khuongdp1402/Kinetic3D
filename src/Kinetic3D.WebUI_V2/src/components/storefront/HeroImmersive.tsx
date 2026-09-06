"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CircularTechOrbit } from "@/components/storefront/CircularTechOrbit";

export function HeroImmersive() {
  return (
    <section
      className="relative w-full overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--c-bg)", minHeight: "92dvh" }}
    >
      {/* Ambient Grid Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)",
        }}
      />

      {/* Amber/Orange Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 20%, rgba(245,185,66,0.12), transparent 70%)",
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center pt-24 md:pt-28 pb-12 px-4 md:px-6">
        {/* Top Feature Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.15em] mb-4 border border-[#f5b942]/40 text-[#f5b942] bg-[#f5b942]/10 backdrop-blur-md shadow-[0_0_20px_rgba(245,185,66,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>KINETIC3D // DIGITAL WORKSHOP & 3D FABRICATION</span>
        </motion.div>

        {/* Circular 360 Tech Orbit Hero Stage */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl mx-auto"
        >
          <CircularTechOrbit />
        </motion.div>
      </div>
    </section>
  );
}
