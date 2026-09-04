"use client";
import { useEffect, useRef, useState } from "react";

/**
 * CircuitPattern — SVG circuit board pattern for backgrounds and borders.
 * Can be used as a full-section background or as a horizontal/vertical divider.
 */

export function CircuitBackground({ className = "", opacity = 0.15 }: { className?: string; opacity?: number }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            {`
              @keyframes dash {
                to {
                  stroke-dashoffset: -100;
                }
              }
              .circuit-pulse {
                stroke-dasharray: 4, 12;
                animation: dash 3s linear infinite;
              }
              .circuit-pulse-fast {
                stroke-dasharray: 2, 8;
                animation: dash 1.5s linear infinite;
              }
              .circuit-pulse-reverse {
                stroke-dasharray: 6, 18;
                animation: dash 4s linear infinite reverse;
              }
            `}
          </style>
          <pattern id="circuit-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Base static traces (low opacity) */}
            <g stroke="#f97316" strokeWidth="1" opacity="0.3">
              {/* Horizontal traces */}
              <line x1="0" y1="20" x2="50" y2="20" />
              <line x1="70" y1="20" x2="120" y2="20" />
              <line x1="0" y1="60" x2="30" y2="60" />
              <line x1="90" y1="60" x2="120" y2="60" />
              <line x1="0" y1="100" x2="80" y2="100" />

              {/* Vertical traces */}
              <line x1="20" y1="0" x2="20" y2="40" />
              <line x1="60" y1="30" x2="60" y2="80" />
              <line x1="100" y1="0" x2="100" y2="50" />
              <line x1="40" y1="70" x2="40" y2="120" />

              {/* Corners / turns */}
              <polyline points="50,20 60,20 60,30" fill="none" />
              <polyline points="30,60 40,60 40,70" fill="none" />
              <polyline points="80,100 100,100 100,50" fill="none" />
              <polyline points="20,40 20,60 30,60" fill="none" />
              <polyline points="60,80 60,100 80,100" fill="none" />
            </g>

            {/* Animated flowing data traces (high opacity) */}
            <g stroke="#f97316" strokeWidth="1.5" fill="none">
              <path d="M0,20 L50,20 L60,20 L60,30 L60,80 L60,100 L80,100" className="circuit-pulse" />
              <path d="M120,60 L90,60 L90,60 L90,60" className="circuit-pulse-fast" />
              <path d="M20,0 L20,40 L20,60 L30,60" className="circuit-pulse-reverse" />
              <path d="M100,0 L100,50 L100,100 L80,100" className="circuit-pulse" />
              <path d="M0,100 L80,100 L100,100 L100,50" className="circuit-pulse-fast" />
            </g>

            {/* IC pads / nodes */}
            <g fill="#f97316" opacity="0.6">
              <circle cx="50" cy="20" r="2.5" />
              <circle cx="70" cy="20" r="2" />
              <circle cx="20" cy="40" r="2" />
              <circle cx="30" cy="60" r="2.5" />
              <circle cx="90" cy="60" r="2" />
              <circle cx="60" cy="30" r="2" />
              <circle cx="60" cy="80" r="2.5" />
              <circle cx="100" cy="50" r="2" />
              <circle cx="40" cy="70" r="2" />
              <circle cx="80" cy="100" r="2.5" />
            </g>

            {/* Chip rectangles */}
            <g stroke="#f97316" strokeWidth="1" opacity="0.8">
              <rect x="55" y="45" width="10" height="14" rx="1" fill="#ffffff" />
              {/* Chip pins */}
              <line x1="55" y1="48" x2="50" y2="48" strokeWidth="0.8" />
              <line x1="55" y1="52" x2="50" y2="52" strokeWidth="0.8" />
              <line x1="55" y1="56" x2="50" y2="56" strokeWidth="0.8" />
              <line x1="65" y1="48" x2="70" y2="48" strokeWidth="0.8" />
              <line x1="65" y1="52" x2="70" y2="52" strokeWidth="0.8" />
              <line x1="65" y1="56" x2="70" y2="56" strokeWidth="0.8" />
            </g>
            
            {/* Blinking chip LED */}
            <circle cx="60" cy="52" r="1.5" fill="#f97316">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-grid)" />
      </svg>
    </div>
  );
}

/**
 * CircuitBorder — A horizontal divider with animated circuit traces flowing through it.
 */
export function CircuitBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full relative ${className}`} style={{ height: "60px" }}>
      <svg width="100%" height="60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          {/* Animated pulse */}
          <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0">
              <animate attributeName="offset" values="-0.3;1" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="5%" stopColor="#f97316" stopOpacity="0.8">
              <animate attributeName="offset" values="-0.2;1.1" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="10%" stopColor="#f97316" stopOpacity="0">
              <animate attributeName="offset" values="-0.1;1.2" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <linearGradient id="pulse-gradient-2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0">
              <animate attributeName="offset" values="-0.3;1" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="5%" stopColor="#fb923c" stopOpacity="0.6">
              <animate attributeName="offset" values="-0.2;1.1" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="10%" stopColor="#fb923c" stopOpacity="0">
              <animate attributeName="offset" values="-0.1;1.2" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Static base traces */}
        <line x1="0" y1="30" x2="100%" y2="30" stroke="#f97316" strokeWidth="0.5" opacity="0.15" />

        {/* Circuit path top */}
        <path
          d="M0,20 L100,20 L120,10 L300,10 L320,20 L500,20 L520,10 L700,10 L720,20 L900,20 L920,10 L1100,10 L1120,20 L1400,20"
          fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.12"
        />
        {/* Circuit path bottom */}
        <path
          d="M0,40 L80,40 L100,50 L280,50 L300,40 L480,40 L500,50 L680,50 L700,40 L880,40 L900,50 L1080,50 L1100,40 L1400,40"
          fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.12"
        />

        {/* Animated pulse on main line */}
        <line x1="0" y1="30" x2="100%" y2="30" stroke="url(#pulse-gradient)" strokeWidth="2" />
        {/* Second pulse going opposite direction */}
        <line x1="0" y1="30" x2="100%" y2="30" stroke="url(#pulse-gradient-2)" strokeWidth="1.5" />

        {/* Nodes along the line */}
        <circle cx="10%" cy="30" r="3" fill="#f97316" opacity="0.2" />
        <circle cx="10%" cy="30" r="1.5" fill="#f97316" opacity="0.4" />
        <circle cx="25%" cy="30" r="3" fill="#f97316" opacity="0.2" />
        <circle cx="25%" cy="30" r="1.5" fill="#f97316" opacity="0.4" />
        <circle cx="50%" cy="30" r="4" fill="#f97316" opacity="0.15" />
        <circle cx="50%" cy="30" r="2" fill="#f97316" opacity="0.4" />
        <circle cx="75%" cy="30" r="3" fill="#f97316" opacity="0.2" />
        <circle cx="75%" cy="30" r="1.5" fill="#f97316" opacity="0.4" />
        <circle cx="90%" cy="30" r="3" fill="#f97316" opacity="0.2" />
        <circle cx="90%" cy="30" r="1.5" fill="#f97316" opacity="0.4" />

        {/* Small IC chip in center */}
        <rect x="48%" y="22" width="4%" height="16" rx="1" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.25" />
        <line x1="48%" y1="26" x2="46%" y2="26" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
        <line x1="48%" y1="30" x2="46%" y2="30" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
        <line x1="48%" y1="34" x2="46%" y2="34" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
        <line x1="52%" y1="26" x2="54%" y2="26" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
        <line x1="52%" y1="30" x2="54%" y2="30" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
        <line x1="52%" y1="34" x2="54%" y2="34" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
      </svg>
    </div>
  );
}

/**
 * CircuitCorner — A corner accent with circuit traces radiating from the corner.
 * Place in a relative parent. position = which corner.
 */
export function CircuitCorner({
  position = "top-left",
  size = 80,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
}) {
  const isTop = position.includes("top");
  const isLeft = position.includes("left");

  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    pointerEvents: "none",
    ...(isTop ? { top: 0 } : { bottom: 0 }),
    ...(isLeft ? { left: 0 } : { right: 0 }),
  };

  const scaleX = isLeft ? 1 : -1;
  const scaleY = isTop ? 1 : -1;

  return (
    <div style={posStyle}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `scale(${scaleX}, ${scaleY})` }}
      >
        {/* Main corner traces */}
        <line x1="0" y1="0" x2="40" y2="0" stroke="#f97316" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="0" x2="0" y2="40" stroke="#f97316" strokeWidth="1" opacity="0.3" />

        {/* Diagonal trace */}
        <polyline points="0,0 15,0 25,10 25,35" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.2" />
        <polyline points="0,0 0,15 10,25 35,25" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.2" />

        {/* Nodes */}
        <circle cx="0" cy="0" r="3" fill="#f97316" opacity="0.4" />
        <circle cx="40" cy="0" r="2" fill="#f97316" opacity="0.2" />
        <circle cx="0" cy="40" r="2" fill="#f97316" opacity="0.2" />
        <circle cx="25" cy="10" r="1.5" fill="#f97316" opacity="0.3" />
        <circle cx="10" cy="25" r="1.5" fill="#f97316" opacity="0.3" />
        <circle cx="25" cy="35" r="1.5" fill="#f97316" opacity="0.2" />
        <circle cx="35" cy="25" r="1.5" fill="#f97316" opacity="0.2" />

        {/* Tiny chip */}
        <rect x="12" y="8" width="6" height="8" rx="0.5" fill="none" stroke="#f97316" strokeWidth="0.6" opacity="0.2" />
      </svg>
    </div>
  );
}

/**
 * GlobalCircuitOverlay — A continuous circuit path that zig-zags through the entire page.
 * It uses a single SVG path with vector-effect="non-scaling-stroke" so it scales responsively.
 */
export function GlobalCircuitOverlay() {
  const [pathData, setPathData] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const calculatePath = () => {
      const svg = wrapperRef.current;
      if (!svg) return;

      const container = svg.closest(".relative");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      // Find all sections
      const sections = Array.from(document.querySelectorAll(".homepage-section"));
      if (sections.length === 0) return;

      // Find footer
      const footer = document.querySelector("footer");

      // Get computed variable value for --site-margin by evaluating it on a dummy element
      let marginX = W * 0.05; // fallback
      if (typeof document !== "undefined") {
        const dummy = document.createElement("div");
        dummy.style.paddingLeft = "var(--site-margin)";
        dummy.style.position = "absolute";
        dummy.style.visibility = "hidden";
        document.body.appendChild(dummy);
        const computedPadding = window.getComputedStyle(dummy).paddingLeft;
        document.body.removeChild(dummy);
        
        if (computedPadding && computedPadding.endsWith("px")) {
          marginX = parseFloat(computedPadding);
        }
      }

      // Ensure a minimum/maximum bounding
      const leftX = marginX;
      const rightX = W - marginX;

      const yCoordinates: number[] = [];

      sections.forEach((sec, idx) => {
        const secRect = sec.getBoundingClientRect();
        const relativeTop = secRect.top - rect.top;
        const relativeBottom = secRect.bottom - rect.top;
        
        if (idx === 0) {
          yCoordinates.push(relativeTop);
        }
        yCoordinates.push(relativeBottom);
      });

      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const relativeFooterTop = footerRect.top - rect.top;
        if (yCoordinates.length > 0) {
          yCoordinates[yCoordinates.length - 1] = relativeFooterTop;
        }
      }

      let d = "";
      if (yCoordinates.length > 0) {
        // Start at leftX, y0
        d += `M ${leftX} ${yCoordinates[0]} `;

        for (let i = 0; i < yCoordinates.length - 1; i++) {
          const yTop = yCoordinates[i];
          const yBottom = yCoordinates[i + 1];
          const isEven = i % 2 === 0;

          if (isEven) {
            d += `H ${rightX} `;
            d += `V ${yBottom} `;
          } else {
            d += `H ${leftX} `;
            d += `V ${yBottom} `;
          }
        }

        // Trace horizontally along the top of the footer
        const lastY = yCoordinates[yCoordinates.length - 1];
        const lastIsEven = (yCoordinates.length - 2) % 2 === 0;
        if (lastIsEven) {
          d += `H 0`;
        } else {
          d += `H ${W}`;
        }
      }

      setPathData(d);
      setDimensions({ width: W, height: H });
    };

    // Run initially
    calculatePath();

    // Re-run on resize or DOM changes
    let debounceTimer: NodeJS.Timeout;
    const debouncedCalculatePath = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(calculatePath, 150);
    };

    window.addEventListener("resize", debouncedCalculatePath);

    const observer = new ResizeObserver(() => {
      debouncedCalculatePath();
    });
    observer.observe(document.body);

    // Run once after initial render to account for layout shifts
    const initialTimer = setTimeout(calculatePath, 1000);

    return () => {
      window.removeEventListener("resize", debouncedCalculatePath);
      observer.disconnect();
      clearTimeout(initialTimer);
      clearTimeout(debounceTimer);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <svg
        ref={wrapperRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width || 100} ${dimensions.height || 100}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>
            {`
              .global-path {
                vector-effect: non-scaling-stroke;
              }
              .global-pulse-anim {
                stroke-dasharray: 120 1200;
                animation: global-dash 15s linear infinite;
                vector-effect: non-scaling-stroke;
              }
              @keyframes global-dash {
                0% { stroke-dashoffset: 1320; }
                100% { stroke-dashoffset: 0; }
              }
            `}
          </style>
        </defs>

        {pathData && (
          <>
            {/* The static line */}
            <path
              d={pathData}
              fill="none"
              stroke="#f97316"
              strokeWidth="1"
              opacity="0.15"
              strokeLinejoin="round"
              className="global-path"
            />

            {/* The animated pulse */}
            <path
              d={pathData}
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="global-pulse-anim"
              style={{ filter: "drop-shadow(0 0 6px rgba(249, 115, 22, 0.8))" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}