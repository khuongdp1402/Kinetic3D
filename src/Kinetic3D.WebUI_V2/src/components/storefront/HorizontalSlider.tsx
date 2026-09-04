"use client";

import React from 'react';
import Link from 'next/link';

const categories = [
  { id: "k-1", name: "K-1 APEX", slug: "k-1-apex" },
  { id: "k-2", name: "K-2 NEXUS", slug: "k-2-nexus" },
  { id: "k-3", name: "K-3 VORTEX", slug: "k-3-vortex" },
  { id: "k-x", name: "K-X CONCEPT", slug: "k-x-concept" },
];

export const HorizontalSlider = () => {
  return (
    <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-8 scrollbar-hide px-4">
      {categories.map((cat) => (
        <Link href={`/categories/${cat.slug}`} key={cat.id} className="min-w-[300px] md:min-w-[400px] aspect-[4/5] bg-[#0A0A0A] border border-white/10 hover:border-cyan-500/50 transition-colors snap-center p-8 flex flex-col justify-end relative overflow-hidden group cursor-pointer block">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0 group-hover:from-cyan-950/80 transition-colors" />
          
          <span className="font-mono text-cyan-500 tracking-widest text-xl z-10 group-hover:scale-105 transition-transform origin-bottom-left">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
};
