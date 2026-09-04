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
} from "lucide-react";
import { productsApi } from "@/lib/api";
import type { ProductDto } from "@/types/api";
import { useCartStore } from "@/store/useCartStore";
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
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-neutral-950 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-neutral-400">Đang tải cấu hình 3D sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-neutral-950 text-white">
        <div className="text-center space-y-4 max-w-md p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <h1 className="text-2xl font-bold text-white">Không tìm thấy mẫu sản phẩm</h1>
          <p className="text-sm text-neutral-400">
            Mẫu in 3D này có thể đã được gỡ bỏ hoặc chưa được đồng bộ vào hệ thống.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition"
          >
            ← Quay lại danh mục sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  // Parse specs & prices
  const basePrice = product.basePrice;
  const salePrice = product.specs?.salePrice ? parseInt(product.specs.salePrice, 10) : basePrice;
  const effectiveBase = salePrice > 0 ? salePrice : basePrice;

  // Variant deltas
  const currentMaterial = MATERIAL_OPTIONS.find((m) => m.id === selectedMaterial) || MATERIAL_OPTIONS[0];
  const currentFinish = FINISH_OPTIONS.find((f) => f.id === selectedFinish) || FINISH_OPTIONS[0];
  const scaleDelta = selectedSize * 90000;
  const engraveDelta = engraveEnabled && customText.trim() ? ENGRAVING_FEE : 0;

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
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-20 pb-28 relative">
      {/* Breadcrumb navigation */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs font-mono text-neutral-400 overflow-x-auto">
          <Link href="/" className="hover:text-orange-400 transition">Trang chủ</Link>
          <ChevronRight size={12} className="text-neutral-600 shrink-0" />
          <Link href="/products" className="hover:text-orange-400 transition">Kho Sản Phẩm</Link>
          {product.category && (
            <>
              <ChevronRight size={12} className="text-neutral-600 shrink-0" />
              <Link href={`/categories/${product.category.slug}`} className="hover:text-orange-400 transition">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} className="text-neutral-600 shrink-0" />
          <span className="text-orange-400 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: 3D Interactive Stage & Media Strip (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/5">
              {selectedImage === null ? (
                <Product3DStage
                  modelUrl={product.model3DUrl}
                  productName={product.name}
                  className="w-full h-full"
                />
              ) : (
                <div className="relative w-full h-full bg-neutral-900">
                  <Image
                    src={images[selectedImage]}
                    alt={`${product.name} view`}
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition"
                  >
                    <RotateCcw size={13} />
                    Quay lại Chế độ 3D
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail selector: 3D Stage + Gallery photos */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedImage(null)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 flex flex-col items-center justify-center gap-1 bg-neutral-900 ${
                  selectedImage === null
                    ? "border-orange-500 shadow-md shadow-orange-500/30"
                    : "border-neutral-800 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <span className="text-[10px] font-bold text-neutral-300">Stage 3D</span>
              </button>

              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 bg-neutral-900 ${
                    selectedImage === i
                      ? "border-orange-500 shadow-md shadow-orange-500/30"
                      : "border-neutral-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumb ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* 6-Card Tech Specs Dashboard */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Cpu size={16} className="text-orange-500" />
                  Bảng Thông Số Kỹ Thuật In 3D
                </h3>
                <span className="text-[11px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                  Bambu Lab / SLA Spec
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] mb-1">
                    <Layers size={13} className="text-orange-400" />
                    <span>Số Chi Tiết</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{specs["Số chi tiết"] || "1 chi tiết"}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] mb-1">
                    <Clock size={13} className="text-orange-400" />
                    <span>Thời Gian In</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{specs["Thời gian in"] || "4 giờ"}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] mb-1">
                    <Weight size={13} className="text-orange-400" />
                    <span>Khối Lượng</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{specs["Khối lượng"] || "120g"}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] mb-1">
                    <Gauge size={13} className="text-orange-400" />
                    <span>Dung Sai Kỹ Thuật</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{specs["Dung sai"] || "±0.1 mm"}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] mb-1">
                    <Printer size={13} className="text-orange-400" />
                    <span>Công Nghệ In</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{specs["Công nghệ in"] || "FDM AMS"}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] mb-1">
                    <Box size={13} className="text-orange-400" />
                    <span>Độ Cao Lớp (Layer)</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{specs["Độ cao lớp in"] || "0.12 mm"}</p>
                </div>
              </div>
            </div>

            {/* Legal Attribution Notice */}
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex items-start gap-3">
              <FileCheck size={18} className="text-orange-400 mt-0.5 shrink-0" />
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold text-neutral-300">
                  Bản Quyền Thiết Kế & Nguồn Mở Hợp Pháp
                </p>
                <p className="text-neutral-500 leading-relaxed">
                  Thiết kế 3D gốc bởi <span className="text-neutral-300 font-medium">{authorName}</span>. Phân phối và sử dụng hợp pháp theo giấy phép{" "}
                  <span className="text-orange-400/90 font-medium">{licenseName}</span>. Kinetic3D đảm nhiệm cắt lớp, tối ưu in 3D và gia công hoàn thiện thành phẩm.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Configurator & Dynamic Price (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 border border-orange-500/30 text-orange-400">
                  {product.category?.name || "Mẫu in 3D Kinetic"}
                </span>
                <span className="text-xs text-neutral-500">Mã: {product.slug}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-snug">
                {product.name}
              </h1>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Dynamic Price Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-orange-500/30 shadow-xl shadow-orange-500/5 space-y-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block">
                Giá Báo Realtime (Đã Gồm Tùy Biến)
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl lg:text-4xl font-black text-orange-400 tracking-tight">
                  {totalPrice.toLocaleString("vi-VN")} ₫
                </span>
                {salePrice < basePrice && (
                  <span className="text-sm text-neutral-500 line-through">
                    {(basePrice * quantity).toLocaleString("vi-VN")} ₫
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">
                Miễn phí vận chuyển toàn quốc cho đơn từ 500.000₫ • Hỗ trợ quét mã VietQR
              </p>
            </div>

            {/* 1. Material Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span>1. Chọn Vật Liệu In</span>
                <span className="text-orange-400 font-mono text-[11px]">
                  {currentMaterial.priceDelta > 0 ? `+${currentMaterial.priceDelta.toLocaleString("vi-VN")}₫` : "Tiêu chuẩn"}
                </span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {MATERIAL_OPTIONS.map((mat) => {
                  const active = selectedMaterial === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        active
                          ? "bg-orange-500/10 border-orange-500 shadow-md shadow-orange-500/10"
                          : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${active ? "text-white" : "text-neutral-300"}`}>
                            {mat.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                            {mat.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">{mat.description}</p>
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <span className={`text-xs font-mono font-bold ${active ? "text-orange-400" : "text-neutral-400"}`}>
                          {mat.priceDelta > 0 ? `+${mat.priceDelta.toLocaleString("vi-VN")}₫` : "0₫"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Scale / Size Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span>2. Tỉ Lệ Kích Thước</span>
                <span className="text-neutral-400 text-[11px]">{sizes[selectedSize]}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((sz, i) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(i)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                      selectedSize === i
                        ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                        : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Color Palette Swatches */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span>3. Màu Sắc In</span>
                <span className="text-orange-400 text-[11px]">{colors[selectedColor]}</span>
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {colors.map((c, i) => {
                  const active = selectedColor === i;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(i)}
                      className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
                        active
                          ? "bg-neutral-900 border-orange-500 shadow-md shadow-orange-500/10"
                          : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-neutral-600 shrink-0"
                        style={{ backgroundColor: getColorSwatch(c) }}
                      />
                      <span className={`text-xs ${active ? "text-white font-bold" : "text-neutral-400"}`}>
                        {c}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Finishing Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span>4. Quy Cách Hoàn Thiện</span>
                <span className="text-orange-400 text-[11px]">
                  {currentFinish.priceDelta > 0 ? `+${currentFinish.priceDelta.toLocaleString("vi-VN")}₫` : "Mặc định"}
                </span>
              </label>
              <div className="space-y-2">
                {FINISH_OPTIONS.map((fin) => {
                  const active = selectedFinish === fin.id;
                  return (
                    <button
                      key={fin.id}
                      onClick={() => setSelectedFinish(fin.id)}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        active
                          ? "bg-orange-500/10 border-orange-500"
                          : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className={`text-xs font-bold ${active ? "text-white" : "text-neutral-300"}`}>
                          {fin.name}
                        </span>
                        <p className="text-[11px] text-neutral-500">{fin.description}</p>
                      </div>
                      <span className={`text-xs font-mono font-bold shrink-0 pl-3 ${active ? "text-orange-400" : "text-neutral-400"}`}>
                        {fin.priceDelta > 0 ? `+${fin.priceDelta.toLocaleString("vi-VN")}₫` : "0₫"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Custom 3D Engraving */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={engraveEnabled}
                    onChange={(e) => setEngraveEnabled(e.target.checked)}
                    className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 accent-orange-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-white">Khắc Laser / Tên Chữ Nổi 3D</span>
                </div>
                <span className="text-xs font-mono font-bold text-orange-400">
                  +{ENGRAVING_FEE.toLocaleString("vi-VN")}₫
                </span>
              </label>

              {engraveEnabled && (
                <div className="space-y-1.5 pt-1 animate-in fade-in">
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Nhập chữ muốn khắc (VD: CALLSIGN / TÊN)"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-orange-500 font-mono uppercase"
                  />
                  <span className="text-[10px] text-neutral-500 block text-right">
                    {customText.length}/20 ký tự
                  </span>
                </div>
              )}
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-lg transition"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-lg transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2"
                >
                  {addedFeedback ? (
                    <>
                      <Check size={16} className="text-white" />
                      Đã Thêm Vào Giỏ Hàng!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Thêm Vào Giỏ Hàng
                    </>
                  )}
                </button>
              </div>

              <Link
                href="/cart"
                onClick={handleAddToCart}
                className="w-full py-3 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-bold text-center block transition"
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
