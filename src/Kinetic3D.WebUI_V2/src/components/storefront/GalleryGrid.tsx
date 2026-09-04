"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import Tilt from "react-parallax-tilt";
import type { ProductDto } from "@/types/api";
import { useWishlistStore } from "@/store/useWishlistStore";

interface GalleryGridProps {
  products: ProductDto[];
  activeCategory: string | null;
  searchQuery: string;
}

function GalleryCard({ product }: { product: ProductDto }) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={400} className="h-full">
      <Link
        href={`/products/${product.id}`}
        className="group relative block w-full h-full rounded-xl overflow-hidden bg-[var(--c-bg-card)] border border-[var(--c-white-10)] transition-colors duration-300 hover:border-[var(--c-lime-30)]"
        style={{ aspectRatio: "3/4" }}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem({ id: product.id, name: product.name });
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: isWishlisted ? "var(--c-orange-20)" : "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            border: `1px solid ${isWishlisted ? "var(--c-orange)" : "var(--c-white-20)"}`,
          }}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[var(--c-orange)] text-[var(--c-orange)]" : "text-white"}`}
          />
        </button>

        <div className="relative w-full h-full">
          <Image
            src={product.images[0] || product.imageUrl || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-80" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-1 transform translate-y-2 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold truncate" style={{ color: "var(--c-white)" }}>
              {product.name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs truncate" style={{ color: "var(--c-white-50)" }}>
              {product.category?.name ?? ""}
            </span>
            <span className="text-xs font-mono font-bold shrink-0" style={{ color: "var(--c-lime)" }}>
              {product.basePrice.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}

export function GalleryGrid({ products, activeCategory, searchQuery }: GalleryGridProps) {
  const q = searchQuery.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchesCategory = !activeCategory || p.categoryId === activeCategory;
    const matchesQuery =
      q.length === 0 ||
      p.name.toLowerCase().includes(q) ||
      (p.shortDescription ?? "").toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full bg-[var(--c-bg)] py-8 min-h-screen">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm font-mono" style={{ color: "var(--c-white-50)" }}>
              Không tìm thấy sản phẩm phù hợp.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <GalleryCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
