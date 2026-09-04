"use client";

import { useEffect, useRef, useState } from "react";
import { stats, testimonials } from "@/data/mockData";
import { motion } from "framer-motion";

/* ─── Animated Counter with Glow ─── */
function GlowCounter({
  value,
  suffix,
  prefix,
  label,
}: {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2200;
          const startTime = performance.now();
          const isFloat = value % 1 !== 0;

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * value;
            setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDone(true);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-3 transition-all duration-500"
        style={{
          color: "#f5b942",
          fontFamily: "var(--font-mono)",
          textShadow: done
            ? "0 0 30px rgba(245,185,66,0.4), 0 0 60px rgba(245,185,66,0.1)"
            : "0 0 15px rgba(245,185,66,0.2)",
        }}
      >
        {prefix}
        {count}
        {suffix}
      </div>
      <p
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ─── Dual-Row Testimonial Marquee ─── */
function TestimonialMarquee({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) {
  const doubled = [...items, ...items];

  return (
    <div className="mask-fade-x overflow-hidden">
      <div className={`flex gap-5 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {doubled.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="glass-card flex-shrink-0 w-[340px] p-6 rounded-xl flex flex-col justify-between"
            style={{ minHeight: "180px" }}
          >
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: "linear-gradient(135deg, rgba(245,185,66,0.15), rgba(251,146,60,0.15))",
                  color: "#f5b942",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "#ffffff" }}>
                  {t.name}
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)" }}
                >
                  {t.role}, {t.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Combined Social Proof Section ─── */
export function SocialProof() {
  const half = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, half);
  const row2 = testimonials.slice(half);

  return (
    <section className="w-full py-32 md:py-40" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="py-6"
              style={{
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                paddingLeft: i > 0 ? "2rem" : "0",
              }}
            >
              <GlowCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                label={stat.label}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold tracking-[-0.03em]"
            style={{ color: "#ffffff" }}
          >
            Được Tin Dùng Bởi Các Kỹ Sư
          </h2>
        </motion.div>

        <div className="flex flex-col gap-5">
          <TestimonialMarquee items={row1} />
          <TestimonialMarquee items={row2} reverse />
        </div>
      </div>
    </section>
  );
}
