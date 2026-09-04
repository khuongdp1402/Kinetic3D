"use client";

import { motion } from "framer-motion";
import SplitModelViewer from "./SplitModelViewer";

const features = [
  {
    title: "AI Texturing",
    subtitle: "One-Click Texturing & Magic Brush",
    description: "Apply high-resolution 4K, PBR-ready textures in one click, with Magic Brush for seamless local repaint and precise detail control.",
    modelUrl: "/models/reelseat_tcp.glb",
    accent: "purple"
  },
  {
    title: "AI Rigging",
    subtitle: "Automated Skeletal Animation",
    description: "Instantly rig and animate your 3D models with industry-standard skeletons ready for Unreal Engine and Unity.",
    modelUrl: "/models/demo-print.glb",
    accent: "violet"
  }
];

export default function TripoWorkflow() {
  return (
    <section className="py-32 px-4 md:px-12 max-w-7xl mx-auto relative z-10">
      <div className="space-y-32">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <div className="inline-block px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-purple-400 tracking-wider">
                0{index + 1} // WORKFLOW
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                {feature.title}
              </h2>
              <h3 className="text-xl md:text-2xl text-purple-300 font-medium">
                {feature.subtitle}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                {feature.description}
              </p>
              
              <button className="mt-8 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium backdrop-blur-sm transition-all duration-300 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center gap-2">
                Explore Feature
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>

            {/* Visual/Mockup Area */}
            <div className="flex-1 w-full aspect-square md:aspect-[4/3] rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-md relative overflow-hidden group">
              <SplitModelViewer modelUrl={feature.modelUrl} heightClass="h-full w-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
