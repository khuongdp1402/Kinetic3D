"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productsApi } from "@/lib/api";
import type { ProductDto } from "@/types/api";
import { useCartStore } from "@/store/useCartStore";
import { SplitRevealImage } from "@/components/storefront/SplitRevealImage";
import { ArrowRight, ShoppingBag, Eye, Sparkles } from "lucide-react";

// Curated 8 fallback products in case API is offline or has fewer items
const FALLBACK_8_PRODUCTS: ProductDto[] = [
  {
    id: "tank-m4a1",
    name: "M4A1 Sherman Tank AMS",
    slug: "m4a1-sherman-tank-ams",
    description: "Mô hình xe tăng Sherman M4A1 in đa vật liệu tự động. Cấu trúc 75 chi tiết tháo rời tinh xảo.",
    shortDescription: "75 Chi Tiết // Khay In AMS",
    basePrice: 850000,
    imageUrl: "/images/products/sherman-m4a1-plate.jpg",
    images: ["/images/products/sherman-m4a1-plate.jpg"],
    model3DUrl: null,
    isDeleted: false,
    variants: null,
    featured: true,
    inStock: true,
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Bản In Đa Màu AMS", slug: "ams-multi-color", description: "", image: null, isDeleted: false },
    colors: ["Rằn ri Xanh Quân Đội", "Desert Tan"],
    sizes: ["Tỉ lệ 1:35"],
    specs: { "Chi tiết": "75", "Công nghệ": "FDM AMS" },
  },
  {
    id: "cyber-bot",
    name: "Cyber Mech Explorer",
    slug: "cyber-mech-explorer",
    description: "Chiến binh Mecha viễn tưởng in công nghệ Resin SLA 8K độ nét micro.",
    shortDescription: "SLA 8K // Panel Line Sắc Nét",
    basePrice: 1250000,
    imageUrl: "/images/products/cyber-bot-print.jpg",
    images: ["/images/products/cyber-bot-print.jpg"],
    model3DUrl: null,
    isDeleted: false,
    variants: null,
    featured: true,
    inStock: true,
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Collectible Resin", slug: "collectible-resin", description: "", image: null, isDeleted: false },
    colors: ["Xám Gunmetal", "Trắng Mech"],
    sizes: ["Tỉ lệ 1:12"],
    specs: { "Độ phân giải": "0.02mm", "Chất liệu": "SLA Resin" },
  },
  {
    id: "artisan-keycap",
    name: "Titan Mech Keycap SLA",
    slug: "titan-mech-keycap-sla",
    description: "Nút phím cơ chế tác độc bản chủ đề Cyber-Tech viễn tưởng, xuyên LED RGB.",
    shortDescription: "Resin SLA // Stem Cherry MX",
    basePrice: 350000,
    imageUrl: "/images/products/artisan-keycap.jpg",
    images: ["/images/products/artisan-keycap.jpg"],
    model3DUrl: null,
    isDeleted: false,
    variants: null,
    featured: true,
    inStock: true,
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Artisan Keycaps", slug: "artisan-keycaps", description: "", image: null, isDeleted: false },
    colors: ["Titan Smoke", "Neon Violet"],
    sizes: ["1u Standard"],
    specs: { "Chuẩn stem": "Cherry MX", "Xuyên LED": "Có" },
  },
  {
    id: "cyber-helmet",
    name: "Cyberpunk Tactical Helmet",
    slug: "cyberpunk-tactical-helmet",
    description: "Mũ giáp công nghệ tương lai tỉ lệ 1:1 in bằng sợi Carbon tổng hợp chịu va đập.",
    shortDescription: "Tỉ Lệ Đội Đầu 1:1 // Carbon",
    basePrice: 1850000,
    imageUrl: "/images/products/cyber-helmet-print.jpg",
    images: ["/images/products/cyber-helmet-print.jpg"],
    model3DUrl: null,
    isDeleted: false,
    variants: null,
    featured: true,
    inStock: true,
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Cosplay & Wearable", slug: "cosplay-wearable", description: "", image: null, isDeleted: false },
    colors: ["Đen Carbon Matt", "Cyber Amber"],
    sizes: ["One Size Adult"],
    specs: { "Trọng lượng": "680g", "Vật liệu": "PETG Carbon" },
  },
  {
    id: "ion-drive",
    name: "Primary Ion Thruster Drive",
    slug: "primary-ion-thruster-drive",
    description: "Mô hình cụm động cơ đẩy hạt nhân ion không gian viễn tưởng chuẩn CAD.",
    shortDescription: "Turbine Lồng Ghép // CAD Precision",
    basePrice: 1450000,
    imageUrl: "/images/products/primary-ion-drive-print.jpg",
    images: ["/images/products/primary-ion-drive-print.jpg"],
    model3DUrl: null,
    isDeleted: false,
    variants: null,
    featured: true,
    inStock: true,
    categoryId: "cat-5",
    category: { id: "cat-5", name: "Industrial & Sci-Fi", slug: "industrial-sci-fi", description: "", image: null, isDeleted: false },
    colors: ["Metallic Gunmetal", "Anodized Silver"],
    sizes: ["250mm Display"],
    specs: { "Dung sai": "0.1mm", "File": "STEP / CAD" },
  },
  {
    id: "voronoi-vase",
    name: "Voronoi Computational Vase",
    slug: "voronoi-computational-vase",
    description: "Bình hoa nghệ thuật tạo tác từ thuật toán phân rã Voronoi toán học siêu thực.",
    shortDescription: "Thuật Toán Voronoi // Silk Dual-Tone",
    basePrice: 280000,
    imageUrl: "/images/products/voronoi-vase-print.jpg",
    images: ["/images/products/voronoi-vase-print.jpg"],
    model3DUrl: null,
    isDeleted: false,
    variants: null,
    featured: true,
    inStock: true,
    categoryId: "cat-6",
    category: { id: "cat-6", name: "Kiến Trúc & Thuật Toán", slug: "algorithmic-art", description: "", image: null, isDeleted: false },
    colors: ["Silk Gold-Copper", "Silk Blue-Green"],
    sizes: ["Cao 22cm"],
    specs: { "Vật liệu": "PLA Silk", "Kháng nước": "Có" },
  },
  {
    id: "flexi-dragon",
    name: "Imperial Articulated Dragon",
    slug: "imperial-articulated-dragon",
    description: "Mô hình Rồng phương Đông in nguyên khối cử động linh hoạt không cần lắp ráp.",
    shortDescription: "Print-In-Place // Khớp Cử Động 360",
    basePrice: 420000,
    imageUrl: "/images/products/flexi-dragon.jpg",
    images: ["/images/products/flexi-dragon.jpg"],
    model3DUrl: null,
    isDeleted: false,
    variants: null,
    featured: true,
    inStock: true,
    categoryId: "cat-7",
    category: { id: "cat-7", name: "Print-in-Place Art", slug: "print-in-place", description: "", image: null, isDeleted: false },
    colors: ["Gold Silk Đổi Màu", "Hồng Ngọc"],
    sizes: ["Dài 45cm"],
    specs: { "Khớp cử động": "48 đốt", "In nguyên khối": "Có" },
  },
  {
    id: "gearbox-assy",
    name: "Epicyclic Gearbox Assembly",
    slug: "epicyclic-gearbox-assembly",
    description: "Mô hình hộp số hành tinh cơ khí xoay tỷ số truyền động chính xác theo thực tế.",
    shortDescription: "Cơ Khí Hành Tinh // Tỉ Số Truyền Động",
    basePrice: 520000,
    imageUrl: "/images/products/gearbox-assy-print.jpg",
    images: ["/images/products/gearbox-assy-print.jpg"],
    model3DUrl: null,
    isDeleted: false,
    variants: null,
    featured: true,
    inStock: true,
    categoryId: "cat-8",
    category: { id: "cat-8", name: "Mô Hình Cơ Khí", slug: "mechanical-models", description: "", image: null, isDeleted: false },
    colors: ["Cam Cơ Khí / Xám", "Đen Carbon"],
    sizes: ["Module 1.5"],
    specs: { "Tỉ số truyền": "4:1", "Vòng bi": "Tích hợp 608ZZ" },
  },
];

export function FeaturedProductsGrid() {
  const [products, setProducts] = useState<ProductDto[]>(FALLBACK_8_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let mounted = true;
    productsApi
      .getAll()
      .then((all) => {
        if (!mounted) return;
        if (all && all.length > 0) {
          const featuredList = all.filter((p) => p.featured);
          const otherList = all.filter((p) => !p.featured);
          let combined = [...featuredList, ...otherList];
          if (combined.length < 8) {
            combined = [...combined, ...FALLBACK_8_PRODUCTS.slice(combined.length, 8)];
          }
          setProducts(combined.slice(0, 8));
        }
      })
      .catch((err) => {
        console.warn("Using fallback curated 8 products:", err);
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

  return (
    <section 
      className="w-full py-20 md:py-28 relative transition-colors duration-300 border-t"
      style={{ 
        backgroundColor: "var(--c-bg)",
        borderColor: "var(--c-white-10)" 
      }}
    >
      {/* Background ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none rounded-full blur-[160px] opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(245,185,66,0.3) 0%, rgba(251,146,60,0.1) 60%, transparent 80%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b gap-4 transition-colors"
          style={{ borderColor: "var(--c-white-10)" }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f5b942]/30 bg-[#f5b942]/10 mb-3">
              <Sparkles className="w-3 h-3 text-[#f5b942]" />
              <span className="text-[11px] font-mono tracking-widest text-[#f5b942] uppercase font-semibold">
                Curated Collection // 8 Masterpieces
              </span>
            </div>
            <h2 
              className="text-3xl md:text-5xl font-bold tracking-tight mb-2 font-sans"
              style={{ color: "var(--c-white)" }}
            >
              Sản Phẩm Nổi Bật
            </h2>
            <p 
              className="text-sm md:text-base max-w-xl font-sans"
              style={{ color: "var(--c-white-50)" }}
            >
              Danh mục 8 tác phẩm 3D được đánh dấu tiêu biểu từ xưởng in Kinetic3D — Hỗ trợ soi bản vẽ mộc và bản tô màu thời gian thực khi rê chuột.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-mono tracking-wider transition-colors self-start md:self-auto group hover:text-[#f5b942]"
            style={{ color: "var(--c-white-80)" }}
          >
            <span>XEM TOÀN BỘ CATALOG</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Exactly 8 Products: 4 Columns x 2 Rows on Desktop, 2 Columns on Mobile ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const displayImage =
              product.images?.[0] || product.imageUrl || "/placeholder-product.jpg";

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl overflow-hidden border flex flex-col transition-all duration-300 hover:border-[#f5b942]/60 hover:shadow-xl"
                style={{ 
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: "var(--c-white-10)" 
                }}
              >
                {/* ── Visual Area with Mouse-Tracking Split Reveal ── */}
                <div 
                  className="relative aspect-square w-full overflow-hidden"
                  style={{ backgroundColor: "var(--c-bg-deep)" }}
                >
                  <SplitRevealImage
                    src={displayImage}
                    alt={product.name}
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Category / Featured Badge */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
                    <span 
                      className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md border shadow-sm"
                      style={{
                        backgroundColor: "var(--c-bg-card)",
                        borderColor: "var(--c-white-15)",
                        color: "var(--c-white)",
                      }}
                    >
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
                      className="w-8 h-8 rounded-full bg-[#f5b942] text-black flex items-center justify-center font-bold hover:scale-105 transition-transform shadow-[0_0_12px_rgba(245,185,66,0.6)] cursor-pointer"
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
                      <h3 
                        className="text-sm font-bold group-hover:text-[#f5b942] transition-colors truncate font-sans"
                        style={{ color: "var(--c-white)" }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    <p 
                      className="text-xs truncate mt-0.5 font-sans"
                      style={{ color: "var(--c-white-50)" }}
                    >
                      {product.shortDescription || "Mô hình 3D in sắc nét"}
                    </p>
                  </div>

                  <div 
                    className="flex items-center justify-between pt-2 border-t"
                    style={{ borderColor: "var(--c-white-10)" }}
                  >
                    <div className="flex flex-col">
                      <span 
                        className="text-[10px] font-mono uppercase"
                        style={{ color: "var(--c-white-50)" }}
                      >
                        Giá từ
                      </span>
                      <span className="text-sm md:text-base font-bold font-mono text-[#f5b942]">
                        {product.basePrice.toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="text-[11px] font-mono hover:text-[#f5b942] transition-colors flex items-center gap-1"
                      style={{ color: "var(--c-white-80)" }}
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
