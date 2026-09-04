"use client";

import React from 'react';

export const StoryTelling = () => {
  return (
    <section className="bg-[#050505] py-32">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4">
        <div className="text-white space-y-6">
          <h2 className="text-5xl font-bold tracking-tighter uppercase">THE K-SERIES EVOLUTION</h2>
          <p className="text-gray-400 font-mono">
            Redefining urban mobility through generative AI design and 3D precision printing.
          </p>
        </div>
        <div className="w-full aspect-square bg-gradient-to-br from-cyan-900/20 to-black rounded-lg border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center">
          <span className="text-cyan-500/50 font-mono tracking-widest text-sm">SCANNING...</span>
        </div>
      </div>
    </section>
  );
};
