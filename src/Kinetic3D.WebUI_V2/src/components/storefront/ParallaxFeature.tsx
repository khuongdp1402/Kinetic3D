"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export function ParallaxFeature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ScrollTrigger needs to be registered if not already
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Pin the left column while the right column scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false,
      });

      // Animate the text blocks in the right column
      const blocks = gsap.utils.toArray<HTMLElement>(".feature-block");
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-bg-secondary w-full py-20 flex flex-col md:flex-row relative">
      {/* Left side: Sticky Image */}
      <div 
        ref={leftColRef} 
        className="w-full md:w-1/2 h-screen flex items-center justify-center relative bg-primary p-8 lg:p-20 border-r border-[#f97316]/10"
      >
        <div className="relative w-full h-full max-h-[70vh] rounded-lg overflow-hidden border border-[#f97316]/30 shadow-[0_0_30px_rgba(102,252,241,0.1)]">
          <div className="absolute inset-0 bg-[#f97316]/10 mix-blend-overlay z-10" />
          <Image
            src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1000&auto=format&fit=crop"
            alt="Cyber-tech 3D model"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
      </div>

      {/* Right side: Scrolling Content */}
      <div ref={rightColRef} className="w-full md:w-1/2 min-h-[150vh] px-8 lg:px-20 flex flex-col pt-[50vh] pb-[50vh] gap-40">
        <div className="feature-block">
          <div className="text-[#f97316] font-mono text-sm tracking-widest uppercase mb-4">01 // Precision</div>
          <div className="border-l-2 border-accent-cyan pl-6 py-2">
            <h3 className="text-xl font-bold text-primary mb-2">Micro-Resolution</h3>
            <p className="text-text-muted font-mono text-sm leading-relaxed">
              Our 3D printing rigs operate at sub-10 micron precision, delivering flawless surfaces for every custom artifact.
            </p>
          </div>
        </div>

        <div className="feature-block">
          <div className="text-[#fb923c] font-mono text-sm tracking-widest uppercase mb-4">02 // Instant</div>
          <div className="border-l-2 border-accent-cyan pl-6 py-2">
            <h3 className="text-xl font-bold text-primary mb-2">Real-time Visualization</h3>
            <p className="text-text-muted font-mono text-sm leading-relaxed">
              See your modifications instantly. Our WebGL engine renders your bespoke choices before the print head even heats up.
            </p>
          </div>
        </div>

        <div className="feature-block">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-primary mb-12">
            Industrial Grade <br />
            <span className="text-accent-cyan drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]">Precision</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Your digital constructs are materialized using state-of-the-art SLS and SLA technologies. Polymers and metals forged to exact specifications.
          </p>
        </div>
      </div>
    </section>
  );
}
