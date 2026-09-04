"use client";

import { testimonials } from "@/data/mockData";

export function Testimonials() {
  // Double the array for seamless infinite scroll
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="w-full py-20 overflow-hidden" style={{ backgroundColor: "var(--c-bg-deep)" }}>
      <div className="px-[var(--content-padding)] mb-10">
        <span
          className="text-xs uppercase tracking-[0.2em] block mb-3"
          style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
        >
          Đánh giá
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em]" style={{ color: "var(--c-white)" }}>
          Được Tin Dùng Bởi Các Kỹ Sư
        </h2>
      </div>

      {/* Marquee */}
      <div className="relative mx-[var(--content-padding)] overflow-hidden">
        <div className="animate-marquee flex gap-6 w-max">
          {doubled.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="flex-shrink-0 w-[350px] p-6 flex flex-col justify-between"
              style={{
                backgroundColor: "var(--c-white-05)",
                border: "1px solid var(--c-white-10)",
                backdropFilter: "blur(10px)",
                minHeight: "220px",
              }}
            >
              <p
                className="text-sm leading-relaxed italic mb-6"
                style={{ color: "var(--c-white-80)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: `linear-gradient(135deg, var(--c-lime-20), var(--c-orange-20))`,
                    color: "var(--c-lime)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--c-white)" }}>
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
