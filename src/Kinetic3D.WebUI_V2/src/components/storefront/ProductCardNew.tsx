"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import type { ProductDto } from "@/types/api";
import { SplitRevealImage } from "@/components/storefront/SplitRevealImage";

interface ProductCardNewProps {
  product: ProductDto;
}

export function ProductCardNew({ product }: ProductCardNewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const color = product.colors[0] ?? "";
  const size = product.sizes[0] ?? "";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-${color}-${size}`,
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
      customText: "",
      variants: { color, size },
    });
  };

  return (
    <div
      className="group relative card-tripo flex flex-col"
      style={{ backgroundColor: "var(--c-bg-card)" }}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
        <SplitRevealImage
          src={product.images[0] || product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--c-bg-card) 0%, transparent 50%)" }}
        />
        {/* Category tag */}
        <span
          className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.2em] px-2 py-1"
          style={{
            backgroundColor: "var(--c-white-05)",
            border: "1px solid var(--c-white-10)",
            color: "var(--c-white-50)",
            fontFamily: "var(--font-mono)",
            backdropFilter: "blur(10px)",
          }}
        >
          {product.category?.name ?? ""}
        </span>
        {/* Stock badge */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(28,25,23,0.6)" }}>
            <span className="text-sm uppercase tracking-[0.2em] font-bold" style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)" }}>
              Hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h3
            className="text-sm font-bold tracking-[-0.01em] mb-1 transition-colors"
            style={{ color: "var(--c-white)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-lime)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white)")}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-xs mb-3 flex-1" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
          {product.shortDescription ?? ""}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
              {product.basePrice.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-full text-[10px] uppercase tracking-[0.1em] px-3 py-2 font-bold transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              style={{
                border: "1px solid var(--c-white-20)",
                color: "var(--c-white)",
                fontFamily: "var(--font-mono)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--c-white-10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Xem 3D
            </Link>
            <button
              onClick={handleAdd}
              className="rounded-full text-[10px] uppercase tracking-[0.15em] px-3 py-2 font-bold transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              style={{
                border: "1px solid var(--c-lime-20)",
                color: "var(--c-lime)",
                fontFamily: "var(--font-mono)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--c-lime)";
                e.currentTarget.style.color = "var(--c-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--c-lime)";
              }}
            >
              + Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
