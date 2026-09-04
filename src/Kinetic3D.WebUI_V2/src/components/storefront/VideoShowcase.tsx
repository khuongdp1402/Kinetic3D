"use client";

import { useRef, useState } from "react";
import { showcaseVideos } from "@/data/mockData";

export function VideoShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const children = scrollRef.current.children;
    if (children[index]) {
      (children[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="w-full py-20 overflow-hidden" style={{ backgroundColor: "var(--c-bg-deep)" }}>
      {/* Header */}
      <div className="px-[var(--content-padding)] mb-10 flex items-end justify-between">
        <div>
          <span
            className="text-xs uppercase tracking-[0.2em] block mb-3"
            style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
          >
            Quy Trình
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-[-0.03em]"
            style={{ color: "var(--c-white)" }}
          >
            Từ Ý Tưởng Đến Hiện Thực
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span
            className="text-sm"
            style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}
          >
            {String(activeIndex + 1).padStart(2, "0")}/{String(showcaseVideos.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
              className="w-10 h-10 flex items-center justify-center transition-colors"
              style={{
                border: "1px solid var(--c-white-15)",
                color: activeIndex === 0 ? "var(--c-white-30)" : "var(--c-white)",
              }}
              disabled={activeIndex === 0}
            >
              ←
            </button>
            <button
              onClick={() => scrollTo(Math.min(showcaseVideos.length - 1, activeIndex + 1))}
              className="w-10 h-10 flex items-center justify-center transition-colors"
              style={{
                border: "1px solid var(--c-white-15)",
                color: activeIndex === showcaseVideos.length - 1 ? "var(--c-white-30)" : "var(--c-white)",
              }}
              disabled={activeIndex === showcaseVideos.length - 1}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 mx-[var(--content-padding)] no-scrollbar"
        onScroll={() => {
          if (!scrollRef.current) return;
          const el = scrollRef.current;
          const scrollLeft = el.scrollLeft;
          const cardWidth = el.children[0]?.clientWidth || 1;
          setActiveIndex(Math.round(scrollLeft / (cardWidth + 24)));
        }}
      >
        {showcaseVideos.map((video, index) => (
          <div
            key={video.id}
            className="snap-center flex-shrink-0 relative group crosses-border"
            style={{
              width: "min(80vw, 700px)",
              aspectRatio: "16/9",
              border: "1px solid var(--c-white-10)",
              overflow: "hidden",
            }}
          >
            {/* Video */}
            <video
              src={video.videoUrl}
              poster={video.posterUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              style={{
                filter: index === activeIndex ? "grayscale(0%)" : "grayscale(100%)",
                opacity: index === activeIndex ? 1 : 0.5,
              }}
            />

            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, var(--c-bg) 0%, transparent 60%)" }}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-6 z-10">
              <span
                className="text-xs uppercase tracking-[0.2em] block mb-2"
                style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
              >
                {video.label}
              </span>
              <h3
                className="text-xl md:text-2xl font-bold tracking-[-0.02em] mb-1"
                style={{ color: "var(--c-white)" }}
              >
                {video.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}
              >
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile dots */}
      <div className="flex md:hidden justify-center gap-2 mt-6">
        {showcaseVideos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              backgroundColor: i === activeIndex ? "var(--c-lime)" : "var(--c-white-15)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
