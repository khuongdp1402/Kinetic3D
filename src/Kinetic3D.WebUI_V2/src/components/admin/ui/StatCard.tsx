"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string | null;
  icon: LucideIcon;
  href?: string;
  highlight?: boolean;
  sub?: string;
  color?: "orange" | "cyan" | "emerald" | "amber" | "red";
}

const colorMap = {
  orange: {
    icon: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    value: "text-orange-400",
  },
  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    value: "text-cyan-400",
  },
  emerald: {
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    value: "text-emerald-400",
  },
  amber: {
    icon: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    value: "text-amber-400",
  },
  red: {
    icon: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    value: "text-red-400",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  highlight,
  sub,
  color = "orange",
}: StatCardProps) {
  const c = colorMap[color];

  const inner = (
    <div
      className={`p-5 rounded-xl border transition-all duration-200 ${
        highlight
          ? `${c.bg} ${c.border}`
          : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon size={18} className={c.icon} />
        </div>
      </div>
      <div className={`text-3xl font-bold mb-1 ${highlight ? c.value : "text-white"}`}>
        {value ?? "…"}
      </div>
      <div className="text-sm text-neutral-400">{label}</div>
      {sub && <div className="text-xs text-neutral-600 mt-1">{sub}</div>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {inner}
      </Link>
    );
  }
  return inner;
}
