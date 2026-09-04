"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface SplitRevealImageProps {
  src: string;
  alt: string;
  sizes?: string;
  /** extra classes applied to both image layers, e.g. zoom-on-hover transforms */
  imgClassName?: string;
  /** Initial split position when hover starts (default 50) */
  initialSplit?: number;
}

/**
 * Interactive Cursor-Tracking Split Reveal:
 * - Idle state: 100% full-color vivid 3D render (no seam, no grayscale).
 * - On hover: glowing laser seam appears and tracks the cursor X position in real-time.
 *   - Left side of cursor: uncolored clay/sketch.
 *   - Right side of cursor: full-color textured 3D artwork.
 *   - The round center button is removed for an ultra-sleek, clean laser look.
 * - On leave: smoothly fades back to 100% full-color.
 */
export function SplitRevealImage({
  src,
  alt,
  sizes,
  imgClassName = "",
  initialSplit = 50,
}: SplitRevealImageProps) {
  const [splitPercent, setSplitPercent] = useState<number>(initialSplit);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSplit = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    const percent = Math.max(1, Math.min(99, (x / rect.width) * 100));
    setSplitPercent(percent);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updateSplit(e.clientX);
    },
    [updateSplit]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updateSplit(e.clientX);
      setIsHovered(true);
    },
    [updateSplit]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 select-none overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base layer — 100% Full Color Textured Render (Always visible) */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover transition-transform duration-700 ${imgClassName}`}
      />

      {/* Uncolored Layer (Appears ONLY on hover, left of seam: Raw Clay / Sketch) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          clipPath: `inset(0 ${100 - splitPercent}% 0 0)`,
        }}
      >
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className={`object-cover transition-transform duration-700 ${imgClassName}`}
          style={{
            filter: "grayscale(1) contrast(1.18) brightness(1.15)",
          }}
        />
        {/* Subtle holographic clay grain/tint */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundColor: "#2a2d34",
            mixBlendMode: "color-dodge",
          }}
        />
      </div>

      {/* Glowing Laser Seam (Appears ONLY on hover, tracks mouse X, NO round button) */}
      <div
        className="absolute inset-y-0 w-[2px] pointer-events-none z-10 transition-opacity duration-200"
        style={{
          left: `${splitPercent}%`,
          transform: "translateX(-50%)",
          opacity: isHovered ? 1 : 0,
          background:
            "linear-gradient(180deg, transparent 0%, #f5b942 20%, #ffffff 50%, #f5b942 80%, transparent 100%)",
          boxShadow:
            "0 0 14px rgba(245, 185, 66, 0.9), 0 0 4px #ffffff, 0 0 25px rgba(245, 185, 66, 0.4)",
        }}
      />
    </div>
  );
}
