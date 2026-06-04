"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const slides = [
  {
    id: 1,
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4", // Mock video loop placeholder
    title: "NEO-TOKYO COLLECTION",
    subtitle: "Define your aesthetic in 3D.",
  },
  {
    id: 2,
    type: "image",
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    title: "CYBER RUNNERS",
    subtitle: "Built for speed. Built for the grid.",
  },
  {
    id: 3,
    type: "image",
    src: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=2070&auto=format&fit=crop",
    title: "OBSIDIAN SERIES",
    subtitle: "Dark mode in real life.",
  },
  {
    id: 4,
    type: "image",
    src: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop",
    title: "CUSTOM LAB",
    subtitle: "Your design. Our engineering.",
  }
];

export default function HeroCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  return (
    <div className="relative w-full h-[80vh] bg-black overflow-hidden" ref={emblaRef}>
      <div className="flex w-full h-full">
        {slides.map((slide) => (
          <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 w-full h-full">
            {slide.type === "video" ? (
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <Image 
                src={slide.src} 
                alt={slide.title} 
                fill 
                className="object-cover opacity-60"
                priority={slide.id === 2}
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-12 pb-24 container mx-auto">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl font-mono text-color-cyan mb-8 uppercase tracking-widest">
                {slide.subtitle}
              </p>
              <div>
                <button className="bg-white text-black px-8 py-4 font-mono uppercase tracking-widest hover:bg-color-cyan hover:text-black transition-colors font-bold text-sm">
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
