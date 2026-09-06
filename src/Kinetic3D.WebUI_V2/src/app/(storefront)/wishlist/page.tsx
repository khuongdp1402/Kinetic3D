"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  Eye, 
  Box, 
  ArrowRight, 
  Sparkles,
  Check
} from "lucide-react";

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: `${item.id}-default`,
      productId: item.id,
      name: item.name,
      price: item.price || 0,
      quantity: 1,
      customText: "",
      variants: {
        color: "Tiêu chuẩn",
        size: "Tiêu chuẩn (1:1)",
      },
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  if (!mounted) {
    return (
      <div 
        className="min-h-screen pt-24 pb-16 flex items-center justify-center relative z-10"
        style={{ color: "var(--c-white)", backgroundColor: "var(--c-bg)" }}
      >
        <div className="w-8 h-8 border-2 border-[#f5b942] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pt-16 pb-28 relative z-10 transition-colors duration-300"
      style={{ color: "var(--c-white)", backgroundColor: "var(--c-bg)" }}
    >
      {/* Page Header */}
      <div 
        className="py-14 px-6 border-b transition-colors"
        style={{ borderColor: "var(--c-white-10)" }}
      >
        <div className="max-w-[var(--container-max)] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="text-xs uppercase tracking-[0.2em] font-mono"
                style={{ color: "#f5b942" }}
              >
                // BỘ SƯU TẬP CỦA BẠN
              </span>
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
                style={{ 
                  backgroundColor: "var(--c-bg-card)", 
                  borderColor: "var(--c-white-15)",
                  color: "var(--c-white-80)" 
                }}
              >
                {items.length} MẪU IN
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-sans">
              Danh Sách Yêu Thích
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-colors border hover:border-red-500/50 hover:text-red-400 cursor-pointer"
              style={{
                backgroundColor: "var(--c-bg-card)",
                borderColor: "var(--c-white-15)",
                color: "var(--c-white-50)",
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Tất Cả</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-12">
        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 max-w-md mx-auto">
            <div 
              className="w-24 h-24 mx-auto mb-8 rounded-3xl border flex items-center justify-center shadow-lg"
              style={{ 
                backgroundColor: "var(--c-bg-card)",
                borderColor: "var(--c-white-15)" 
              }}
            >
              <Heart className="w-10 h-10 text-[#f5b942]/60 animate-pulse" />
            </div>

            <h2 className="text-2xl font-bold mb-3 font-sans" style={{ color: "var(--c-white)" }}>
              Chưa Có Sản Phẩm Nào
            </h2>

            <p 
              className="text-sm leading-relaxed mb-8 font-sans"
              style={{ color: "var(--c-white-50)" }}
            >
              Lưu lại các mẫu in 3D, mô hình nghệ thuật và linh kiện công nghệ bạn quan tâm để dễ dàng theo dõi và đặt in sau.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-md cursor-pointer"
              style={{
                backgroundColor: "#f5b942",
                color: "#0a0a0f",
                boxShadow: "0 0 25px rgba(245, 185, 66, 0.25)",
              }}
            >
              <span>Khám Phá Kho Mẫu In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                style={{
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: "var(--c-white-10)",
                }}
              >
                {/* Image & Badges */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/10">
                  <Image
                    src={item.imageUrl || "/placeholder-product.jpg"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Category Badge */}
                  {item.categoryName && (
                    <span 
                      className="absolute top-3 left-3 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md border backdrop-blur-md"
                      style={{
                        backgroundColor: "rgba(10, 10, 15, 0.75)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        color: "#f5b942",
                      }}
                    >
                      {item.categoryName}
                    </span>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Xóa khỏi wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer backdrop-blur-md"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.65)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* 3D Indicator */}
                  {item.model3DUrl && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-mono text-white/90 bg-black/70 px-2 py-0.5 rounded border border-white/20">
                      <Box className="w-3 h-3 text-[#00f0ff]" />
                      <span>3D Live</span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/products/${item.slug || item.id}`}>
                      <h3 
                        className="font-bold text-base line-clamp-1 mb-1.5 transition-colors group-hover:text-[#f5b942]"
                        style={{ color: "var(--c-white)" }}
                      >
                        {item.name}
                      </h3>
                    </Link>

                    {item.shortDescription && (
                      <p 
                        className="text-xs line-clamp-2 mb-3 font-sans"
                        style={{ color: "var(--c-white-50)" }}
                      >
                        {item.shortDescription}
                      </p>
                    )}

                    <div className="font-mono font-bold text-lg text-[#f5b942] mb-4">
                      {item.price ? fmtVND(item.price) : "Liên hệ"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t" style={{ borderColor: "var(--c-white-10)" }}>
                    <Link
                      href={`/products/${item.slug || item.id}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-mono border transition-colors hover:border-[#f5b942]/40"
                      style={{
                        backgroundColor: "var(--c-bg-deep)",
                        borderColor: "var(--c-white-15)",
                        color: "var(--c-white)",
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi Tiết</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        addedIds[item.id]
                          ? "bg-[#22c55e] text-white"
                          : "bg-[#f5b942] hover:bg-[#f5b942]/90 text-[#0a0a0f]"
                      }`}
                    >
                      {addedIds[item.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã Thêm</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Đặt In</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
