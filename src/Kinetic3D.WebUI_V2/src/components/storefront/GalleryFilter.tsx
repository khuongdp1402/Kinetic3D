"use client";

import { Sparkles } from "lucide-react";
import type { CategoryDto } from "@/types/api";

interface GalleryFilterProps {
  categories: CategoryDto[];
  activeCategory: string | null;
  onChange: (categoryId: string | null) => void;
}

export function GalleryFilter({ categories, activeCategory, onChange }: GalleryFilterProps) {
  const tags = [{ id: null, name: "Tất cả" }, ...categories.map((c) => ({ id: c.id, name: c.name }))];

  return (
    <div className="w-full border-b border-[var(--c-white-10)] bg-[var(--c-bg)] sticky top-16 z-40">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-4 snap-x">
          <div className="flex items-center gap-2 pr-4 border-r border-[var(--c-white-10)] shrink-0">
            <Sparkles className="w-4 h-4" style={{ color: "var(--c-orange)" }} />
            <span className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: "var(--c-white-80)" }}>
              Filter
            </span>
          </div>

          <div className="flex gap-2">
            {tags.map((tag) => {
              const isActive = activeCategory === tag.id;
              return (
                <button
                  key={tag.id ?? "all"}
                  onClick={() => onChange(tag.id)}
                  className="snap-start shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? "var(--c-lime-10)" : "transparent",
                    color: isActive ? "var(--c-lime)" : "var(--c-white-50)",
                    border: `1px solid ${isActive ? "var(--c-lime-50)" : "var(--c-white-10)"}`,
                    fontFamily: "var(--font-mono)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--c-white)";
                      e.currentTarget.style.borderColor = "var(--c-white-30)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--c-white-50)";
                      e.currentTarget.style.borderColor = "var(--c-white-10)";
                    }
                  }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
