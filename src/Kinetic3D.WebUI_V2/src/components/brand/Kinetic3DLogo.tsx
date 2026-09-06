"use client";

import React from "react";

interface Kinetic3DLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  isDarkHeader?: boolean;
}

export function Kinetic3DLogo({
  size = "md",
  showText = true,
  showTagline = false,
  className = "",
  isDarkHeader,
}: Kinetic3DLogoProps) {
  // Dimensions
  const iconDimensions = {
    sm: { w: 26, h: 26, viewBox: "0 0 48 48" },
    md: { w: 34, h: 34, viewBox: "0 0 48 48" },
    lg: { w: 46, h: 46, viewBox: "0 0 48 48" },
    xl: { w: 64, h: 64, viewBox: "0 0 48 48" },
  }[size];

  const fontSizes = {
    sm: { title: "text-base", badge: "text-[9px]" },
    md: { title: "text-xl", badge: "text-[10px]" },
    lg: { title: "text-2xl", badge: "text-[11px]" },
    xl: { title: "text-4xl", badge: "text-[13px]" },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Kinetic Isometric Polyhedron Vector Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-110"
        >
          <defs>
            {/* Top Face Gradient: Futuristic Emerald to Lime */}
            <linearGradient id="k3d-top" x1="24" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

            {/* Left Face Gradient: Deep Tech Teal/Cyan */}
            <linearGradient id="k3d-left" x1="6" y1="14" x2="24" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Right Face Gradient: Cyber Obsidian Metallic */}
            <linearGradient id="k3d-right" x1="24" y1="24" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="k3d-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Isometric Faceted Hexagon Cube Structure */}
          {/* Top Diamond Facet */}
          <polygon
            points="24,5 41,15 24,24 7,15"
            fill="url(#k3d-top)"
            opacity="0.95"
          />

          {/* Left Isometric Facet */}
          <polygon
            points="7,15 24,24 24,43 7,33"
            fill="url(#k3d-left)"
            opacity="0.85"
          />

          {/* Right Isometric Facet */}
          <polygon
            points="24,24 41,15 41,33 24,43"
            fill="url(#k3d-right)"
            opacity="0.9"
          />

          {/* Cyber Kinetic Inner Lattice / Struts */}
          <line x1="24" y1="5" x2="24" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="7" y1="15" x2="24" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="41" y1="15" x2="24" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="24" y1="24" x2="24" y2="43" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Exterior Sharp Outlines */}
          <polygon
            points="24,5 41,15 41,33 24,43 7,33 7,15"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Neon Vertices (Nodes) */}
          <circle cx="24" cy="5" r="2.2" fill="#ffffff" filter="url(#k3d-glow)" />
          <circle cx="41" cy="15" r="1.8" fill="#4ade80" />
          <circle cx="7" cy="15" r="1.8" fill="#38bdf8" />
          <circle cx="24" cy="24" r="2.5" fill="#ffffff" filter="url(#k3d-glow)" />
          <circle cx="24" cy="43" r="1.8" fill="#22c55e" />
        </svg>

        {/* Ambient Subtle Pulse Glow Behind Icon */}
        <div className="absolute inset-0 bg-[#22c55e]/25 blur-md -z-10 rounded-full scale-125" />
      </div>

      {/* Typography: Brand Name + Tagline */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-0.5">
            <span
              className={`font-black tracking-[-0.04em] uppercase ${fontSizes.title}`}
              style={{
                color: isDarkHeader !== undefined
                  ? isDarkHeader ? "#ffffff" : "var(--c-white)"
                  : "var(--c-white)",
                fontFamily: "var(--font-heading, inherit)",
              }}
            >
              KINETIC
            </span>
            <span
              className={`font-black tracking-[-0.04em] ${fontSizes.title} text-[#22c55e]`}
              style={{
                textShadow: "0 0 16px rgba(34, 197, 94, 0.5)",
              }}
            >
              3D
            </span>
          </div>

          {showTagline && (
            <span
              className={`font-mono tracking-[0.18em] uppercase ${fontSizes.badge} opacity-60 mt-0.5`}
              style={{ color: "var(--c-muted)" }}
            >
              STUDIO & LAB
            </span>
          )}
        </div>
      )}
    </div>
  );
}
