"use client";

import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useModalStore, PreviewProduct } from "@/store/useModalStore";

interface ProductCardProps {
  product: PreviewProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const openModal = useModalStore((s) => s.openModal);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    toggleItem({ id: product.id, name: product.name });
  };

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      scale={1.02}
      transitionSpeed={400}
      className="h-full cursor-pointer"
    >
      <div
        onClick={() => openModal(product)}
        className="group relative w-full h-full rounded-xl overflow-hidden bg-[var(--c-bg-card)] border border-[var(--c-white-10)] transition-colors duration-300 hover:border-[var(--c-lime-30)]"
        style={{ aspectRatio: "3/4" }}
      >
        {/* Wishlist Button Overlay */}
        <button
          onClick={handleWishlistClick}
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

        {/* Image */}
        <div className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-80" />
        </div>

        {/* Asset Metadata Overlays (Bottom Strip) */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-1 transform translate-y-2 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold truncate pr-2" style={{ color: "var(--c-white)" }}>
              {product.name}
            </h3>
            <span className="text-xs font-mono font-bold shrink-0" style={{ color: "var(--c-lime)" }}>
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs truncate" style={{ color: "var(--c-white-50)" }}>
              by {product.creator}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <Heart className="w-3 h-3" style={{ color: "var(--c-white-50)" }} />
              <span className="text-[10px] font-mono" style={{ color: "var(--c-white-50)" }}>
                {product.likes}
              </span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex gap-1 mt-1 overflow-hidden">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono"
                style={{ backgroundColor: "var(--c-white-10)", color: "var(--c-white-80)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Tilt>
  );
}
