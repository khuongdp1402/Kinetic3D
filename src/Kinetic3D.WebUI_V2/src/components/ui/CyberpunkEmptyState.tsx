import React from 'react';

interface CyberpunkEmptyStateProps {
  message?: string;
}

export function CyberpunkEmptyState({ message = "NO SIGNALS FOUND" }: CyberpunkEmptyStateProps) {
  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-center bg-black overflow-hidden border border-gray-800 rounded-lg group">
      {/* Background Noise & Scanline */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-scanline"></div>
      
      {/* Glitch Icon */}
      <div className="relative text-cyan-500 text-6xl mb-4 opacity-80 group-hover:animate-glitch">
        ⚠
        <div className="absolute inset-0 text-red-500 opacity-50 translate-x-[2px] animate-glitch-1">⚠</div>
        <div className="absolute inset-0 text-blue-500 opacity-50 -translate-x-[2px] animate-glitch-2">⚠</div>
      </div>

      {/* Text Message */}
      <div className="relative">
        <h3 className="text-xl font-bold tracking-[0.3em] text-white opacity-90">{message}</h3>
        <h3 className="absolute inset-0 text-xl font-bold tracking-[0.3em] text-cyan-400 opacity-50 translate-x-[2px] animate-glitch-1 mix-blend-screen">{message}</h3>
        <h3 className="absolute inset-0 text-xl font-bold tracking-[0.3em] text-pink-500 opacity-50 -translate-x-[2px] animate-glitch-2 mix-blend-screen">{message}</h3>
      </div>
      
      <p className="text-xs text-gray-500 mt-4 tracking-widest uppercase opacity-50">SYSTEM_ERR_404</p>

      {/* Global Glitch Styles for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(256px); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
        @keyframes glitch-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(-2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(-1px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(1px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, 2px); }
        }
        @keyframes glitch-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(-2px, -1px); }
          20% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 1px); }
          40% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(20% 0 50% 0); transform: translate(1px, -2px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(5% 0 80% 0); transform: translate(2px, -1px); }
        }
        .animate-glitch-1 {
          animation: glitch-1 3s infinite linear alternate-reverse;
        }
        .animate-glitch-2 {
          animation: glitch-2 2s infinite linear alternate-reverse;
        }
      `}} />
    </div>
  );
}
