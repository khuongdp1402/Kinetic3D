"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import FileUpload from "@/components/admin/FileUpload";
import VariantMatrix from "@/components/admin/VariantMatrix";
import { categoriesApi, productsApi, ApiError } from "@/lib/api";
import type { CategoryDto } from "@/types/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [model3DUrl, setModel3DUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      categoriesApi.getAll(),
      productsApi.getById(id),
    ])
      .then(([cats, product]) => {
        setCategories(cats);
        setName(product.name);
        setSlug(product.slug);
        setShortDescription(product.shortDescription || "");
        setDescription(product.description || "");
        setBasePrice(product.basePrice);
        setCategoryId(product.categoryId);
        setImageUrl(product.imageUrl || "");
        setModel3DUrl(product.model3DUrl || "");
        setFeatured(product.featured);
        setInStock(product.inStock);
        setSpecs(product.specs || {});
        setColors(product.colors || []);
        setSizes(product.sizes || []);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được sản phẩm."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) { setError("Tên và Slug là bắt buộc."); return; }
    if (!categoryId) { setError("Vui lòng chọn danh mục."); return; }
    setIsSaving(true);
    setError("");
    try {
      await productsApi.update(id, {
        id,
        name,
        slug,
        shortDescription: shortDescription || null,
        description,
        basePrice,
        categoryId,
        imageUrl: imageUrl || null,
        model3DUrl: model3DUrl || null,
        specs,
        colors,
        sizes,
        featured,
        inStock,
      });
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Lưu thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-16 text-center text-orange-400 animate-pulse">Đang tải sản phẩm...</div>;
  }

  const inputCls = "w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors";

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Chỉnh sửa sản phẩm</h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">{slug}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 text-white font-bold text-sm transition-colors"
        >
          <Save size={14} />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      {error && <p className="text-sm text-red-400 p-3 bg-red-950/30 border border-red-800 rounded-xl">{error}</p>}

      {/* Basic info */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Thông tin cơ bản</h2>

        <div>
          <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1.5">Tên sản phẩm</label>
          <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1.5">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }}
            className={`${inputCls} font-mono`}
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1.5">Mô tả ngắn</label>
          <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1.5">Mô tả chi tiết</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1.5">Giá gốc (₫)</label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
              className={inputCls}
            />
            <p className="text-xs text-orange-400 mt-1">{basePrice.toLocaleString("vi-VN")}₫</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1.5">Danh mục</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <span className="text-sm text-neutral-300">Sản phẩm nổi bật</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <span className="text-sm text-neutral-300">Còn hàng</span>
          </label>
        </div>
      </div>

      {/* Media */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950 space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Hình ảnh & Mô hình 3D</h2>
        <div className="grid grid-cols-2 gap-6">
          <FileUpload
            label="Ảnh sản phẩm"
            accept="image/*"
            folder={`products/${id}/images`}
            onUploadComplete={setImageUrl}
            currentUrl={imageUrl}
          />
          <FileUpload
            label="Mô hình 3D (.glb)"
            accept=".glb"
            folder={`products/${id}/models`}
            onUploadComplete={setModel3DUrl}
            currentUrl={model3DUrl}
          />
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 text-white font-bold transition-colors"
        >
          <Save size={16} />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
