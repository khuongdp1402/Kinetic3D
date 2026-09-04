"use client";

import React, { useState, useEffect } from "react";
import FileUpload from "@/components/admin/FileUpload";
import VariantMatrix from "@/components/admin/VariantMatrix";
import { useRouter } from "next/navigation";
import { categoriesApi, productsApi, ApiError } from "@/lib/api";
import type { CategoryDto } from "@/types/api";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface VariantInput {
  price: number | null;
  attributes: Record<string, string>;
}

function TagListInput({
  label,
  helper,
  values,
  onChange,
}: {
  label: string;
  helper: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v, i) => (
          <span key={v} className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm flex items-center gap-2">
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        placeholder="Nhập rồi nhấn Enter"
        className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
      />
      <p className="text-xs text-neutral-500 mt-1">{helper}</p>
    </div>
  );
}

function SpecsEditor({
  specs,
  onChange,
}: {
  specs: Record<string, string>;
  onChange: (specs: Record<string, string>) => void;
}) {
  const entries = Object.entries(specs);

  const updateEntry = (index: number, key: string, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = [key, value];
    onChange(Object.fromEntries(newEntries));
  };

  const removeEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(Object.fromEntries(newEntries));
  };

  const addEntry = () => {
    onChange({ ...specs, "": "" });
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Thông số kỹ thuật</label>
      <p className="text-xs text-neutral-500 mb-2">VD: Vật liệu / Nhựa PETG. Mỗi dòng là một cặp tên - giá trị.</p>
      {entries.map(([key, value], i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Tên (VD: Vật liệu)"
            value={key}
            onChange={(e) => updateEntry(i, e.target.value, value)}
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm focus:border-cyan-400 outline-none"
          />
          <input
            type="text"
            placeholder="Giá trị (VD: Nhựa PETG)"
            value={value}
            onChange={(e) => updateEntry(i, key, e.target.value)}
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm focus:border-cyan-400 outline-none"
          />
          <button type="button" onClick={() => removeEntry(i)} className="text-red-400 hover:text-red-300 px-2">
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="mt-1 bg-neutral-800 hover:bg-neutral-700 text-sm py-1.5 px-3 rounded transition-colors"
      >
        + Thêm thông số
      </button>
    </div>
  );
}

export default function NewProductPage() {
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
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [featured, setFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [variants, setVariants] = useState<VariantInput[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [productUploadId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    categoriesApi
      .getAll()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      })
      .catch((err) => console.error("Không tải được danh mục:", err));
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
    setImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      setError("Tên và Slug là bắt buộc.");
      return;
    }
    if (!categoryId) {
      setError("Vui lòng chọn danh mục.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await productsApi.create({
        name,
        slug,
        shortDescription: shortDescription || null,
        description,
        basePrice,
        categoryId,
        imageUrl: imageUrl || null,
        images,
        model3DUrl: model3DUrl || null,
        specs,
        colors,
        sizes,
        featured,
        inStock,
        variants,
      });
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Lưu sản phẩm thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Thêm sản phẩm mới</h1>
          <p className="text-neutral-500 text-sm mt-1">Điền đầy đủ thông tin để đăng sản phẩm lên hệ thống</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 text-white font-bold text-sm transition-colors"
        >
          {isSaving ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
      </div>

      {error && <p className="text-sm text-red-400 p-3 bg-red-950/30 border border-red-800 rounded-xl">{error}</p>}

      {/* Section: Basic Info */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Thông tin cơ bản</h2>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Tên sản phẩm</label>
          <input
            type="text"
            placeholder="VD: Cyber-Tech Desk Organizer"
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Slug</label>
          <input
            type="text"
            placeholder="cyber-tech-desk-organizer"
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none font-mono text-sm"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
          <p className="text-xs text-neutral-500 mt-1">Dùng trong đường dẫn trang. Chỉ chữ thường, số và dấu gạch ngang.</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Mô tả ngắn</label>
          <input
            type="text"
            placeholder="Hiển thị ở danh sách sản phẩm, khoảng 100 ký tự"
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Mô tả chi tiết</label>
          <textarea
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Giá gốc (VNĐ)</label>
          <input
            type="number"
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
            value={basePrice}
            onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
          />
          <p className="text-xs text-neutral-500 mt-1">Giá bán khi sản phẩm không có biến thể riêng giá.</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Danh mục</label>
          <select
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none text-white"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <TagListInput
          label="Màu sắc"
          helper="Nhập tên màu rồi nhấn Enter để thêm vào danh sách."
          values={colors}
          onChange={setColors}
        />

        <TagListInput
          label="Kích thước"
          helper="Nhập kích thước rồi nhấn Enter để thêm vào danh sách."
          values={sizes}
          onChange={setSizes}
        />

        <SpecsEditor specs={specs} onChange={setSpecs} />

        <div className="mb-4 flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4" />
            <span>Sản phẩm nổi bật — hiển thị ở trang chủ trong mục "Sản phẩm nổi bật".</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="w-4 h-4" />
            <span>Còn hàng — bỏ chọn nếu sản phẩm tạm hết hàng (vẫn hiển thị nhưng không mua được).</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FileUpload
            label="Ảnh sản phẩm"
            accept="image/*"
            folder={`products/${productUploadId}/images`}
            onUploadComplete={handleImageUploaded}
          />
          <FileUpload
            label="Mô hình 3D (.glb)"
            accept=".glb"
            folder={`products/${productUploadId}/models`}
            onUploadComplete={setModel3DUrl}
          />
        </div>

        <VariantMatrix onChange={setVariants} />
      </div>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 text-white font-bold transition-colors"
        >
          {isSaving ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
      </div>
    </div>
  );
}
