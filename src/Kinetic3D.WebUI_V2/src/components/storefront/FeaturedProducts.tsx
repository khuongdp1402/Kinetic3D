"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { productsApi } from "@/lib/api";
import type { ProductDto } from "@/types/api";
import { useCartStore } from "@/store/useCartStore";
import { SplitRevealImage } from "@/components/storefront/SplitRevealImage";

import Tilt from "react-parallax-tilt";

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [featured, setFeatured] = useState<ProductDto[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    productsApi.getAll().then((products) => {
      setFeatured(products.filter((p) => p.featured));
    });
  }, []);

  const handleQuickAdd = (product: ProductDto) => {
    const color = product.colors[0] ?? "";
    const size = product.sizes[0] ?? "";
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

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-32" style={{ backgroundColor: "#0b0c10" }}>
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16 flex items-end justify-between">
        <div>
          <span
            className="text-xs uppercase tracking-[0.2em] block mb-4 px-3 py-1 rounded-full border inline-block"
            style={{ color: "#f5b942", borderColor: "rgba(245,185,66,0.3)", backgroundColor: "rgba(245,185,66,0.05)" }}
          >
            Latest Artifacts
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em]" style={{ color: "#ffffff" }}>
            Sản Phẩm Nổi Bật
          </h2>
        </div>
        <Link
          href="/products"
          className="link-hover text-sm uppercase tracking-[0.15em] transition-colors hidden md:inline-block border-b pb-1"
          style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#f5b942"; e.currentTarget.style.borderColor = "#f5b942"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
        >
          View All →
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-12 px-6 md:px-12 mx-auto max-w-full no-scrollbar"
      >
        {featured.map((product) => (
          <div key={product.id} className="snap-start flex-shrink-0" style={{ width: "min(85vw, 380px)" }}>
            <Tilt 
              tiltMaxAngleX={5} 
              tiltMaxAngleY={5} 
              perspective={1000} 
              transitionSpeed={1000} 
              scale={1.02}
              className="group card-tripo relative w-full h-full rounded-2xl overflow-hidden border border-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              {/* Image */}
              <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
                <SplitRevealImage
                  src={product.images[0] || product.imageUrl || "/placeholder-product.jpg"}
                  alt={product.name}
                  imgClassName="transition-transform duration-[1.5s] group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, #0b0c10 0%, transparent 60%)" }}
                />
                {/* Category tag */}
                <span
                  className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-mono)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {product.category?.name ?? ""}
                </span>
              </Link>

              {/* Info */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col justify-end">
                <Link href={`/products/${product.id}`}>
                  <h3
                    className="text-2xl font-bold tracking-[-0.01em] mb-2 transition-colors group-hover:text-[#f5b942]"
                    style={{ color: "#ffffff" }}
                  >
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm mb-6 max-w-[90%]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)" }}>
                  {product.shortDescription ?? ""}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className="text-lg font-bold" style={{ color: "#f5b942", fontFamily: "var(--font-mono)" }}>
                      {product.basePrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="rounded-full text-xs uppercase tracking-[0.15em] px-5 py-3 font-bold transition-all shadow-[0_0_15px_rgba(245,185,66,0)] group-hover:shadow-[0_0_15px_rgba(245,185,66,0.3)]"
                    style={{
                      border: "1px solid rgba(245,185,66,0.5)",
                      backgroundColor: "rgba(245,185,66,0.1)",
                      color: "#f5b942",
                      fontFamily: "var(--font-mono)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5b942";
                      e.currentTarget.style.color = "#0b0c10";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(245,185,66,0.1)";
                      e.currentTarget.style.color = "#f5b942";
                    }}
                  >
                    + Cart
                  </button>
                </div>
              </div>
            </Tilt>
          </div>
        ))}
      </div>
    </section>
  );
}
