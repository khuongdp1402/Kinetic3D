"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Clock,
  Weight,
  Layers,
  Box,
  Cpu,
  Gauge,
  Sparkles,
  Check,
  ShoppingCart,
  RotateCcw,
  ChevronRight,
  Printer,
  FileCheck,
  Heart,
} from "lucide-react";
import { productsApi } from "@/lib/api";
import type { ProductDto } from "@/types/api";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Product3DStage } from "@/components/storefront/Product3DStage";
import { getColorSwatch } from "@/lib/colorSwatch";

interface MaterialOption {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
  badge: string;
}

const MATERIAL_OPTIONS: MaterialOption[] = [
  {
    id: "pla-plus",
    name: "Nhựa PLA+ Matte Cao Cấp",
    description: "Bề mặt mờ mịn, chống lộ vân in, thân thiện môi trường",
    priceDelta: 0,
    badge: "Phổ biến nhất",
  },
  {
    id: "petg",
    name: "Nhựa PETG Chịu Lực & Chịu Nhiệt",
    description: "Độ bền va đập cao, chịu nhiệt tới 80°C, chống ẩm mốc",
    priceDelta: 45000,
    badge: "Bền cơ học",
  },
  {
    id: "resin-12k",
    name: "Resin SLA 12K Siêu Chi Tiết",
    description: "Độ phân giải hiển vi 19 micron, bề mặt láng mịn như đúc",
    priceDelta: 120000,
    badge: "Cực mịn",
  },
  {
    id: "carbon-fiber",
    name: "Composite Carbon-Fiber PLA",
    description: "Gia cường 20% sợi carbon thật, cứng cáp, siêu nhẹ và sang trọng",
    priceDelta: 180000,
    badge: "Cao cấp",
  },
];

interface FinishOption {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
}

const FINISH_OPTIONS: FinishOption[] = [
  {
    id: "raw-kit",
    name: "Bộ Phôi In Thô (Raw Kit)",
    description: "Bao gồm đầy đủ chi tiết đã cắt support, sẵn sàng để tự lắp và sơn",
    priceDelta: 0,
  },
  {
    id: "assembled",
    name: "Lắp Ráp & Test Khớp Cơ Học",
    description: "Kỹ thuật viên Kinetic3D lắp ráp hoàn thiện, cân chỉnh chuyển động",
    priceDelta: 120000,
  },
  {
    id: "hand-painted",
    name: "Sơn Weathering & Phủ Bóng Collector",
    description: "Nghệ nhân tạo hiệu ứng rỉ sét kim loại thực chiến thủ công độc bản",
    priceDelta: 450000,
  },
];

const ENGRAVING_FEE = 50000;

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const [product, setProduct] = useState<ProductDto | null | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<number | null>(null); // null = 3D mode
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("pla-plus");
  const [selectedFinish, setSelectedFinish] = useState<string>("raw-kit");
  const [quantity, setQuantity] = useState(1);
  const [engraveEnabled, setEngraveEnabled] = useState(false);
  const [customText, setCustomText] = useState("");
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    productsApi
      .getById(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch(() => setProduct(null));
  }, [productId]);

  if (product === undefined) {
    return (
      <div 
        className="min-h-screen pt-24 pb-16 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: "var(--c-bg)", color: "var(--c-white)" }}
      >
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#f5b942] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono" style={{ color: "var(--c-white-50)" }}>
            Đang tải cấu hình 3D sản phẩm...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div 
        className="min-h-screen pt-24 pb-16 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: "var(--c-bg)", color: "var(--c-white)" }}
      >
        <div 
          className="text-center space-y-4 max-w-md p-6 rounded-2xl border"
          style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}
        >
          <h1 className="text-2xl font-bold font-sans" style={{ color: "var(--c-white)" }}>
            Không tìm thấy mẫu sản phẩm
          </h1>
          <p className="text-sm font-sans" style={{ color: "var(--c-white-50)" }}>
            Mẫu in 3D này có thể đã được gỡ bỏ hoặc chưa được đồng bộ vào hệ thống.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
            style={{ backgroundColor: "#f5b942", color: "#0a0a0f" }}
          >
            ← Quay lại danh mục sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice,
      imageUrl: product.images[0] || product.imageUrl || "",
      categoryName: product.category?.name,
      shortDescription: product.shortDescription || "",
      model3DUrl: product.model3DUrl,
    });
  };

  // Parse specs & prices
  const basePrice = product.basePrice;
  const salePrice = product.specs?.salePrice ? parseInt(product.specs.salePrice, 10) : basePrice;
  const effectiveBase = salePrice > 0 ? salePrice : basePrice;

  // Variant deltas
  const currentMaterial = MATERIAL_OPTIONS.find((m) => m.id === selectedMaterial) || MATERIAL_OPTIONS[0];
  const currentFinish = FINISH_OPTIONS.find((f) => f.id === selectedFinish) || FINISH_OPTIONS[0];
  const scaleDelta = selectedSize * 90000;
  const engraveDelta = engraveEnabled ? ENGRAVING_FEE : 0;
  const unitPrice = effectiveBase + currentMaterial.priceDelta + currentFinish.priceDelta + scaleDelta + engraveDelta;
  const totalPrice = unitPrice * quantity;

  // Options lists
  const colors = product.colors && product.colors.length > 0 ? product.colors : ["Mặc định"];
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["Tiêu chuẩn"];
  const images = product.images && product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];

  // Specs
  const specs = product.specs || {};
  const authorName = specs.author || "Kinetic3D Design Studio";
  const licenseName = specs.license || "Creative Commons (CC-BY 4.0)";

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${colors[selectedColor]}-${sizes[selectedSize]}-${selectedMaterial}-${selectedFinish}-${customText}`,
      productId: product.id,
      name: product.name,
      price: unitPrice,
      quantity,
      customText: engraveEnabled ? customText.trim() : "",
      variants: {
        color: colors[selectedColor],
        size: sizes[selectedSize],
        material: currentMaterial.name,
        finish: currentFinish.name,
      },
    });
    setAddedFeedback(true);
  };

  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images || [],
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Kinetic3D",
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== "undefined" ? window.location.href : `https://kinetic3d.vn/products/${product.id}`,
      "priceCurrency": "VND",
      "price": product.basePrice,
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Kinetic3D",
      },
    },
  } : null;

  return (
    <div 
      className="min-h-screen pt-20 pb-28 relative transition-colors duration-300"
      style={{ backgroundColor: "var(--c-bg)", color: "var(--c-white)" }}
    >
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      {/* Breadcrumb navigation */}
      <div 
        className="border-b sticky top-16 z-30 transition-colors backdrop-blur-md"
        style={{ backgroundColor: "var(--c-header-bg)", borderColor: "var(--c-white-10)" }}
      >
        <div 
          className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs font-mono overflow-x-auto"
          style={{ color: "var(--c-white-50)" }}
        >
          <Link href="/" className="hover:text-[#f5b942] transition">Trang chủ</Link>
          <ChevronRight size={12} className="shrink-0 opacity-40" />
          <Link href="/products" className="hover:text-[#f5b942] transition">Kho Sản Phẩm</Link>
          {product.category && (
            <>
              <ChevronRight size={12} className="shrink-0 opacity-40" />
              <Link href={`/categories/${product.category.slug}`} className="hover:text-[#f5b942] transition">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} className="shrink-0 opacity-40" />
          <span className="text-[#f5b942] font-medium truncate">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: 3D Interactive Stage & Media Strip (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div 
              className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border transition-colors"
              style={{ borderColor: "var(--c-white-10)", backgroundColor: "var(--c-bg-card)" }}
            >
              {selectedImage === null ? (
                <Product3DStage
                  modelUrl={product.model3DUrl}
                  productName={product.name}
                  className="w-full h-full"
                />
              ) : (
                <div className="relative w-full h-full" style={{ backgroundColor: "var(--c-bg-card)" }}>
                  <Image
                    src={images[selectedImage]}
                    alt={`${product.name} góc nhìn ${selectedImage + 1}`}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              )}

              {/* View mode toggle overlay badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                <span 
                  className="px-3 py-1 rounded-full text-[11px] font-mono border backdrop-blur-md flex items-center gap-1.5 shadow-md"
                  style={{ 
                    backgroundColor: "rgba(10, 10, 15, 0.8)", 
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "#f5b942" 
                  }}
                >
                  <Sparkles size={12} className="text-[#f5b942]" />
                  {selectedImage === null ? "WebGL 3D Interactive" : `Ảnh mẫu in #${selectedImage + 1}`}
                </span>
              </div>
            </div>

            {/* Thumbnail selector ribbon */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {/* 3D Stage button */}
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  selectedImage === null
                    ? "border-[#f5b942] shadow-md shadow-[#f5b942]/20"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{ 
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: selectedImage === null ? "#f5b942" : "var(--c-white-15)"
                }}
              >
                <Box size={22} className="text-[#00f0ff]" />
                <span className="text-[10px] font-mono font-bold" style={{ color: "var(--c-white)" }}>3D MODEL</span>
              </button>

              {/* Photo angles */}
              {images.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                    selectedImage === i
                      ? "border-[#f5b942] shadow-md shadow-[#f5b942]/20"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ 
                    backgroundColor: "var(--c-bg-card)",
                    borderColor: selectedImage === i ? "#f5b942" : "var(--c-white-15)"
                  }}
                >
                  <Image src={img} alt={`${product.name} thumb ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* 6-Card Tech Specs Dashboard */}
            <div 
              className="rounded-2xl p-6 space-y-4 border transition-colors shadow-sm"
              style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 font-sans" style={{ color: "var(--c-white)" }}>
                  <Cpu size={16} className="text-[#f5b942]" />
                  Bảng Thông Số Kỹ Thuật In 3D
                </h3>
                <span 
                  className="text-[11px] font-mono px-2 py-0.5 rounded border"
                  style={{ 
                    backgroundColor: "var(--c-bg-deep)", 
                    borderColor: "var(--c-white-15)",
                    color: "var(--c-white-50)" 
                  }}
                >
                  Bambu Lab / SLA Spec
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}>
                  <div className="flex items-center gap-1.5 text-[11px] mb-1" style={{ color: "var(--c-white-50)" }}>
                    <Layers size={13} className="text-[#f5b942]" />
                    <span>Số Chi Tiết</span>
                  </div>
                  <p className="text-sm font-bold truncate" style={{ color: "var(--c-white)" }}>{specs["Số chi tiết"] || "1 chi tiết"}</p>
                </div>

                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}>
                  <div className="flex items-center gap-1.5 text-[11px] mb-1" style={{ color: "var(--c-white-50)" }}>
                    <Clock size={13} className="text-[#f5b942]" />
                    <span>Thời Gian In</span>
                  </div>
                  <p className="text-sm font-bold truncate" style={{ color: "var(--c-white)" }}>{specs["Thời gian in"] || "4 giờ"}</p>
                </div>

                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}>
                  <div className="flex items-center gap-1.5 text-[11px] mb-1" style={{ color: "var(--c-white-50)" }}>
                    <Weight size={13} className="text-[#f5b942]" />
                    <span>Khối Lượng</span>
                  </div>
                  <p className="text-sm font-bold truncate" style={{ color: "var(--c-white)" }}>{specs["Khối lượng"] || "120g"}</p>
                </div>

                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}>
                  <div className="flex items-center gap-1.5 text-[11px] mb-1" style={{ color: "var(--c-white-50)" }}>
                    <Gauge size={13} className="text-[#f5b942]" />
                    <span>Dung Sai Kỹ Thuật</span>
                  </div>
                  <p className="text-sm font-bold truncate" style={{ color: "var(--c-white)" }}>{specs["Dung sai"] || "±0.1 mm"}</p>
                </div>

                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}>
                  <div className="flex items-center gap-1.5 text-[11px] mb-1" style={{ color: "var(--c-white-50)" }}>
                    <Printer size={13} className="text-[#f5b942]" />
                    <span>Công Nghệ In</span>
                  </div>
                  <p className="text-sm font-bold truncate" style={{ color: "var(--c-white)" }}>{specs["Công nghệ in"] || "FDM AMS"}</p>
                </div>

                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}>
                  <div className="flex items-center gap-1.5 text-[11px] mb-1" style={{ color: "var(--c-white-50)" }}>
                    <Box size={13} className="text-[#f5b942]" />
                    <span>Độ Cao Lớp (Layer)</span>
                  </div>
                  <p className="text-sm font-bold truncate" style={{ color: "var(--c-white)" }}>{specs["Độ cao lớp in"] || "0.12 mm"}</p>
                </div>
              </div>
            </div>

            {/* Legal Attribution Notice */}
            <div 
              className="p-4 rounded-xl border flex items-start gap-3 transition-colors"
              style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}
            >
              <FileCheck size={18} className="text-[#f5b942] mt-0.5 shrink-0" />
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold" style={{ color: "var(--c-white)" }}>
                  Bản Quyền Thiết Kế & Nguồn Mở Hợp Pháp
                </p>
                <p className="leading-relaxed" style={{ color: "var(--c-white-50)" }}>
                  Thiết kế 3D gốc bởi <span className="font-medium" style={{ color: "var(--c-white)" }}>{authorName}</span>. Phân phối và sử dụng hợp pháp theo giấy phép{" "}
                  <span className="text-[#f5b942] font-medium">{licenseName}</span>. Kinetic3D đảm nhiệm cắt lớp, tối ưu in 3D và gia công hoàn thiện thành phẩm.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Configurator & Dynamic Price (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase border"
                    style={{ 
                      backgroundColor: "var(--c-bg-deep)", 
                      borderColor: "var(--c-white-15)",
                      color: "#f5b942" 
                    }}
                  >
                    {product.category?.name || "Bản In 3D"}
                  </span>
                  {product.inStock && (
                    <span className="text-xs font-mono text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Sẵn sàng in ngay
                    </span>
                  )}
                </div>

                {/* Heart Wishlist Toggle on Product Detail */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    isWished 
                      ? "bg-red-500/20 text-red-500 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                      : "hover:border-[#f5b942]/50 text-neutral-400 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: "var(--c-bg-card)",
                    borderColor: isWished ? "rgba(239, 68, 68, 0.4)" : "var(--c-white-15)",
                  }}
                  title={isWished ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
                >
                  <Heart className={`w-4 h-4 ${isWished ? "fill-red-500" : ""}`} />
                </button>
              </div>

              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2 font-sans" style={{ color: "var(--c-white)" }}>
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-xs font-mono mb-4" style={{ color: "var(--c-white-50)" }}>
                  {product.shortDescription}
                </p>
              )}

              {/* Dynamic Price Display */}
              <div 
                className="p-4 rounded-2xl border transition-colors flex items-baseline justify-between"
                style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}
              >
                <div>
                  <span className="text-xs uppercase tracking-wider block font-mono" style={{ color: "var(--c-white-50)" }}>
                    Giá Dự Kiến (Real-time)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono tracking-tight text-[#f5b942]">
                      {unitPrice.toLocaleString("vi-VN")}₫
                    </span>
                    {salePrice > 0 && salePrice < basePrice && (
                      <span className="text-sm line-through font-mono opacity-50" style={{ color: "var(--c-white)" }}>
                        {basePrice.toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right font-mono text-xs" style={{ color: "var(--c-white-50)" }}>
                  <div>Đã gồm VAT & Cắt support</div>
                  <div className="text-emerald-500">Miễn phí giao hàng từ 500k</div>
                </div>
              </div>
            </div>

            {/* Configurator Section 1: Color Variant */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between font-mono" style={{ color: "var(--c-white-80)" }}>
                <span>1. Màu Sắc Bản In ({colors.length} lựa chọn)</span>
                <span className="text-[#f5b942] font-semibold">{colors[selectedColor]}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {colors.map((c, i) => {
                  const swatch = getColorSwatch(c);
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 transition text-left cursor-pointer ${
                        selectedColor === i
                          ? "border-[#f5b942] shadow-md shadow-[#f5b942]/10"
                          : "hover:border-[#f5b942]/40"
                      }`}
                      style={{
                        backgroundColor: selectedColor === i ? "var(--c-bg-card)" : "var(--c-bg-deep)",
                        borderColor: selectedColor === i ? "#f5b942" : "var(--c-white-10)",
                        color: "var(--c-white)",
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-white/20 shadow-sm"
                        style={{ backgroundColor: swatch }}
                      />
                      <span className="truncate">{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configurator Section 2: Material Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider block font-mono" style={{ color: "var(--c-white-80)" }}>
                2. Vật Liệu In Kỹ Thuật
              </label>
              <div className="grid grid-cols-1 gap-2">
                {MATERIAL_OPTIONS.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setSelectedMaterial(m.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      selectedMaterial === m.id
                        ? "border-[#f5b942] shadow-md shadow-[#f5b942]/10"
                        : "hover:border-[#f5b942]/40"
                    }`}
                    style={{
                      backgroundColor: selectedMaterial === m.id ? "var(--c-bg-card)" : "var(--c-bg-deep)",
                      borderColor: selectedMaterial === m.id ? "#f5b942" : "var(--c-white-10)",
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-sans" style={{ color: "var(--c-white)" }}>{m.name}</span>
                        <span className="text-[10px] font-mono text-[#f5b942] bg-[#f5b942]/10 px-1.5 py-0.5 rounded">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5 font-sans" style={{ color: "var(--c-white-50)" }}>
                        {m.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold shrink-0 ml-2" style={{ color: "var(--c-white)" }}>
                      {m.priceDelta === 0 ? "Tiêu chuẩn" : `+${m.priceDelta.toLocaleString("vi-VN")}₫`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configurator Section 3: Scale / Size */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider block font-mono" style={{ color: "var(--c-white-80)" }}>
                3. Tỉ Lệ & Kích Thước In
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((s, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedSize(i)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      selectedSize === i
                        ? "border-[#f5b942] shadow-md shadow-[#f5b942]/10"
                        : "hover:border-[#f5b942]/40"
                    }`}
                    style={{
                      backgroundColor: selectedSize === i ? "var(--c-bg-card)" : "var(--c-bg-deep)",
                      borderColor: selectedSize === i ? "#f5b942" : "var(--c-white-10)",
                    }}
                  >
                    <div className="text-xs font-bold font-sans" style={{ color: "var(--c-white)" }}>{s}</div>
                    <div className="text-[11px] font-mono mt-0.5" style={{ color: "var(--c-white-50)" }}>
                      {i === 0 ? "Mặc định" : `+${(i * 90000).toLocaleString("vi-VN")}₫`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Configurator Section 4: Post-Processing & Finish */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider block font-mono" style={{ color: "var(--c-white-80)" }}>
                4. Cấp Độ Gia Công Hậu Kỳ (Post-Processing)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {FINISH_OPTIONS.map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => setSelectedFinish(f.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      selectedFinish === f.id
                        ? "border-[#f5b942] shadow-md shadow-[#f5b942]/10"
                        : "hover:border-[#f5b942]/40"
                    }`}
                    style={{
                      backgroundColor: selectedFinish === f.id ? "var(--c-bg-card)" : "var(--c-bg-deep)",
                      borderColor: selectedFinish === f.id ? "#f5b942" : "var(--c-white-10)",
                    }}
                  >
                    <div>
                      <div className="text-xs font-bold font-sans" style={{ color: "var(--c-white)" }}>{f.name}</div>
                      <p className="text-[11px] mt-0.5 font-sans" style={{ color: "var(--c-white-50)" }}>
                        {f.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold shrink-0 ml-2" style={{ color: "var(--c-white)" }}>
                      {f.priceDelta === 0 ? "+0₫" : `+${f.priceDelta.toLocaleString("vi-VN")}₫`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Personalization: Name Engraving */}
            <div 
              className="p-4 rounded-xl border space-y-3 transition-colors"
              style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer font-sans" style={{ color: "var(--c-white)" }}>
                  <input
                    type="checkbox"
                    checked={engraveEnabled}
                    onChange={(e) => setEngraveEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#f5b942] rounded"
                  />
                  <span>Khắc Laser / Tên Cá Nhân Lên Đế In</span>
                </label>
                <span className="text-xs font-mono text-[#f5b942]">+{ENGRAVING_FEE.toLocaleString("vi-VN")}₫</span>
              </div>

              {engraveEnabled && (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="text"
                    maxLength={20}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="VD: CAPTAIN-KHUONG (Tối đa 20 ký tự)"
                    className="w-full px-3.5 py-2 rounded-lg border text-xs font-mono uppercase outline-none focus:border-[#f5b942] transition"
                    style={{
                      backgroundColor: "var(--c-bg-deep)",
                      borderColor: "var(--c-white-15)",
                      color: "var(--c-white)",
                    }}
                  />
                  <span className="text-[10px] block text-right font-mono" style={{ color: "var(--c-white-50)" }}>
                    {customText.length}/20 ký tự
                  </span>
                </div>
              )}
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center rounded-xl border p-1"
                  style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-lg transition hover:bg-[#f5b942]/10 cursor-pointer"
                    style={{ color: "var(--c-white-80)" }}
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm" style={{ color: "var(--c-white)" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-lg transition hover:bg-[#f5b942]/10 cursor-pointer"
                    style={{ color: "var(--c-white-80)" }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    backgroundColor: "#f5b942",
                    color: "#0a0a0f",
                    boxShadow: "0 0 25px rgba(245, 185, 66, 0.3)",
                  }}
                >
                  {addedFeedback ? (
                    <>
                      <Check size={16} />
                      Đã Thêm Vào Giỏ Hàng!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Thêm Vào Giỏ Hàng ({totalPrice.toLocaleString("vi-VN")}₫)
                    </>
                  )}
                </button>
              </div>

              <Link
                href="/cart"
                onClick={handleAddToCart}
                className="w-full py-3 px-5 rounded-xl border text-xs font-bold text-center block transition hover:border-[#f5b942]/50"
                style={{
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: "var(--c-white-15)",
                  color: "var(--c-white)",
                }}
              >
                Đặt In & Thanh Toán Ngay (VietQR) →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
