"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productsApi } from "@/lib/api";
import type { ProductDto } from "@/types/api";
import { useCartStore } from "@/store/useCartStore";
import { SplitRevealImage } from "@/components/storefront/SplitRevealImage";
import { ArrowRight, ShoppingBag, Eye, Sparkles } from "lucide-react";

export function FeaturedProductsGrid() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let mounted = true;
    productsApi
      .getAll()
      .then((all) => {
        if (!mounted) return;
        // Priority 1: Products marked featured: true in admin
        const featuredList = all.filter((p) => p.featured);
        // If fewer than 8-10, top-up with other top items so we have a full 8-12 grid
        const otherList = all.filter((p) => !p.featured);
        const combined = [...featuredList, ...otherList].slice(0, 10);
        setProducts(combined);
      })
      .catch((err) => {
        console.error("Failed to load featured products:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleQuickAdd = (e: React.MouseEvent, product: ProductDto) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.colors?.[0] ?? "Tiêu Chuẩn";
    const size = product.sizes?.[0] ?? "Chuẩn";
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

  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full py-24 md:py-32 relative" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Background ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none rounded-full blur-[160px] opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(245,185,66,0.25) 0%, rgba(251,146,60,0.1) 60%, transparent 80%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f5b942]/30 bg-[#f5b942]/10 mb-3">
              <Sparkles className="w-3 h-3 text-[#f5b942]" />
              <span className="text-[11px] font-mono tracking-widest text-[#f5b942] uppercase font-semibold">
                Curated Collection
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-sm text-white/50 max-w-xl">
              Danh mục tác phẩm 3D được đánh dấu nổi bật từ xưởng in Kinetic3D — Hỗ trợ soi bản vẽ mộc và bản tô màu thời gian thực khi rê chuột.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-mono tracking-wider text-white/70 hover:text-[#f5b942] transition-colors self-start md:self-auto group"
          >
            <span>XEM TOÀN BỘ CATALOG</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Compact 4 to 5 Columns Responsive Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {products.map((product) => {
            const displayImage =
              product.images?.[0] || product.imageUrl || "/placeholder-product.jpg";

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 flex flex-col transition-all duration-300 hover:border-[#f5b942]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                style={{ backgroundColor: "rgba(18, 18, 24, 0.75)" }}
              >
                {/* ── Visual Area with Mouse-Tracking Split Reveal ── */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                  <SplitRevealImage
                    src={displayImage}
                    alt={product.name}
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Category / Featured Badge (pointer-events-none so hover is never blocked) */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white/70 border border-white/10">
                      {product.category?.name || "3D Print"}
                    </span>
                    {product.featured && (
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#f5b942]/20 backdrop-blur-md text-[#f5b942] border border-[#f5b942]/30">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Stock Notice Badge */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center pointer-events-none z-20">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                        Tạm hết hàng
                      </span>
                    </div>
                  )}

                  {/* Quick Action Overlay on Card Hover */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <Link
                      href={`/products/${product.id}`}
                      className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
                      title="Xem chi tiết 3D"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="w-8 h-8 rounded-full bg-[#f5b942] text-black flex items-center justify-center font-bold hover:scale-105 transition-transform shadow-[0_0_12px_rgba(245,185,66,0.6)]"
                      title="Thêm nhanh vào giỏ"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* ── Card Content Info ── */}
                <div className="p-3.5 md:p-4 flex flex-col flex-1 justify-between gap-2.5">
                  <div>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#f5b942] transition-colors truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-white/45 truncate mt-0.5">
                      {product.shortDescription || "Mô hình 3D in sắc nét"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Giá từ</span>
                      <span className="text-sm md:text-base font-bold font-mono text-[#f5b942]">
                        {product.basePrice.toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="text-[11px] font-mono text-white/60 hover:text-[#f5b942] transition-colors flex items-center gap-1"
                    >
                      <span>Chi tiết</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
