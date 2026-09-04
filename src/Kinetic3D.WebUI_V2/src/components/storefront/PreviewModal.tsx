"use client";

import { useModalStore } from "@/store/useModalStore";
import { X, Share2, Heart, Box, User, ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect } from "react";

// Dynamically import the heavy WebGL viewer
const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1c1917] rounded-l-2xl">
      <div className="flex gap-2 items-center">
        <div className="w-2 h-2 rounded-full bg-[var(--c-lime)] animate-ping" />
        <span className="text-xs font-mono" style={{ color: "var(--c-lime)" }}>Loading WebGL Engine...</span>
      </div>
    </div>
  ),
});

export function PreviewModal() {
  const { isOpen, product, closeModal } = useModalStore();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-[1400px] h-[90vh] bg-[var(--c-bg-deep)] rounded-2xl border border-[var(--c-white-10)] shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* LEFT COLUMN: 3D Viewport (70%) */}
        <div className="relative w-full lg:w-[70%] h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r border-[var(--c-white-10)] bg-[#1c1917]">
          <ModelViewer glbUrl={product.glbUrl} />

          {/* Top-Right Canvas Metadata */}
          <div className="absolute top-4 left-4 flex gap-3 z-10 pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur border border-white/10 flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-wider text-white/50">Triangles</span>
              <span className="text-xs font-mono font-bold text-white">24.5K</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur border border-white/10 flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-wider text-white/50">Vertices</span>
              <span className="text-xs font-mono font-bold text-white">12.3K</span>
            </div>
          </div>

          {/* Bottom Floating Toolbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-black/60 backdrop-blur border border-white/10 z-10">
            {["Wireframe", "Matte", "Glossy", "Metallic"].map((mode, i) => (
              <button key={mode} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${i === 2 ? 'bg-[var(--c-lime-20)] text-[var(--c-lime)]' : 'text-white/70 hover:bg-white/10'}`}>
                {mode}
              </button>
            ))}
          </div>

          {/* Bottom-Center CTAs */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 hover:bg-black/80 border border-white/20 transition-all text-xs font-bold text-white uppercase">
              <Download className="w-4 h-4" />
              Export .GLB
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all text-xs font-bold uppercase shadow-[0_0_15px_rgba(255,87,34,0.4)] hover:scale-105" style={{ backgroundColor: "var(--c-orange)", color: "var(--c-bg-deep)" }}>
              <Box className="w-4 h-4" />
              3D Print Order
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Detail Panel (30%) */}
        <div className="w-full lg:w-[30%] h-[40vh] lg:h-full bg-[var(--c-bg-card)] flex flex-col overflow-y-auto custom-scrollbar relative">
          
          <div className="p-6 flex-1 flex flex-col gap-6">
            {/* Header: Author & Title */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-white/70" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{product.creator}</span>
                    <span className="text-[10px] text-white/50">June 18, 2026</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-full hover:bg-white/10 text-white/70 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-white/10 text-white/70 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{product.name}</h2>
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/80 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            {/* Origin Inputs */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--c-lime)]">Generation Origin</span>
              <div className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/20">
                  <Image src={product.image} alt="Source" fill className="object-cover" />
                </div>
                <p className="text-xs text-white/70 leading-relaxed italic line-clamp-4">
                  "{product.prompt}"
                </p>
              </div>
            </div>

            {/* Related Models Grid */}
            <div className="mt-2">
              <span className="text-xs font-bold text-white mb-3 block">Related Models</span>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-[var(--c-lime-30)] transition-colors">
                    <Image src={product.image} alt="Related" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Sticky Footer CTA */}
          <div className="sticky bottom-0 w-full p-4 bg-[var(--c-bg-card)] border-t border-[var(--c-white-10)]">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all hover:scale-[1.02]" style={{ backgroundColor: "var(--c-lime)", color: "var(--c-bg-deep)", boxShadow: "0 0 20px rgba(102, 252, 241, 0.2)" }}>
              Customize Similar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
