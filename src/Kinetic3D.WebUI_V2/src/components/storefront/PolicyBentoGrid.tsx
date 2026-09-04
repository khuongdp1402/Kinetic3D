"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Truck, ShieldCheck, Globe2, Zap } from "lucide-react";

export function PolicyBentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".bento-box");
      
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full py-24 bg-primary px-4 md:px-8 border-t border-border-color">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-primary mb-4">
            Operational <span className="text-accent-cyan">Guarantees</span>
          </h2>
          <p className="text-text-muted font-mono max-w-2xl mx-auto">
            Our systems are designed for fail-safe execution. From digital ingestion to physical manifestation, we guarantee structural integrity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Block 1 */}
          <div className="bento-box bg-bg-tertiary border border-border-color rounded-3xl p-8 md:col-span-2 flex flex-col justify-end min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-accent-cyan mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight">Rapid Prototyping Cycle</h3>
              <p className="text-text-muted leading-relaxed">
                Our facilities operate 24/7. Most orders are processed, printed, and quality-checked within 48 hours of design lock. We utilize high-speed continuous liquid interface production for select resins.
              </p>
            </div>
          </div>

          {/* Block 2 */}
          <div className="bento-box bg-bg-tertiary border border-border-color rounded-3xl p-8 md:col-span-1 flex flex-col justify-end min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <ShieldCheck className="w-12 h-12 text-accent-orange mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight">Zero-Defect Protocol</h3>
              <p className="text-text-muted leading-relaxed">
                Every printed unit undergoes AI-assisted volumetric scanning to ensure it matches your exact WebGL configurations. Deviations &gt; 0.05mm trigger an automatic reprint.
              </p>
            </div>
          </div>

          {/* Block 3 */}
          <div className="bento-box bg-bg-tertiary border border-border-color rounded-3xl p-8 md:col-span-1 flex flex-col justify-end min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tl from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <Globe2 className="w-12 h-12 text-accent-cyan mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight">Global Node Logistics</h3>
              <p className="text-text-muted leading-relaxed">
                Encrypted routing ensures your physical asset reaches you securely, anywhere.
              </p>
            </div>
          </div>

          {/* Block 4 */}
          <div className="bento-box bg-bg-tertiary border border-border-color rounded-3xl p-8 md:col-span-2 flex flex-col md:flex-row items-center gap-8 min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-bl from-accent-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-full md:w-1/2 relative z-10">
              <div className="w-full h-40 bg-primary/50 border border-border-color rounded-xl flex items-center justify-center overflow-hidden">
                <div className="text-accent-orange font-mono text-xl animate-pulse">STATUS: ONLINE</div>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative z-10">
              <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight">Real-time Tracking</h3>
              <p className="text-text-muted">
                Monitor your artifact&apos;s status live from the build plate to your local node. Data streams directly from our facility floor.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
