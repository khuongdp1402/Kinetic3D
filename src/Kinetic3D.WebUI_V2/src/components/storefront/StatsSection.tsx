"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/mockData";

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const isFloat = value % 1 !== 0;

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * value;
            setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
            if (progress < 1) requestAnimationFrame(animate);
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
    <div ref={ref} className="text-center md:text-left">
      <div
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-2"
        style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)", textShadow: "0 0 30px var(--c-lime-20)" }}
      >
        {prefix}{count}{suffix}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section
      className="w-full py-20"
      style={{ backgroundColor: "var(--c-bg)" }}
    >
      <div className="px-[var(--content-padding)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="py-6 md:py-8"
              style={{ borderLeft: i > 0 ? "1px solid var(--c-white-10)" : "none", paddingLeft: i > 0 ? "2rem" : "0" }}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <p
                className="text-xs uppercase tracking-[0.2em] mt-3"
                style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
