"use client";

import React, { useEffect, useState } from "react";
import { categoriesApi, ApiError } from "@/lib/api";
import type { CategoryDto } from "@/types/api";
import FileUpload from "@/components/admin/FileUpload";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadFolderId] = useState(() => crypto.randomUUID());

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Không tải được danh mục:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    categoriesApi.getAll().then((data) => {
      if (active) {
        setCategories(data);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (active) {
        console.error("Không tải được danh mục:", err);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setImage("");
    setEditingId(null);
    setError("");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSaveCategory = async () => {
    if (!name.trim() || !slug.trim()) {
      setError("Tên và Slug là bắt buộc.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const payload = { name, slug, description, image: image || null };
      if (editingId) {
        await categoriesApi.update(editingId, { id: editingId, ...payload });
      } else {
        await categoriesApi.create(payload);
      }
      resetForm();
      setShowAddForm(false);
      fetchCategories();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Lưu danh mục thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (cat: CategoryDto) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setSlugTouched(true);
    setDescription(cat.description);
    setImage(cat.image ?? "");
    setShowAddForm(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await categoriesApi.remove(id);
      fetchCategories();
    } catch (err) {
      console.error("Xóa danh mục thất bại:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">DANH MỤC</h1>
          <p className="text-gray-400 mt-1">Quản lý danh mục sản phẩm hiển thị trên storefront.</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) resetForm();
          }}
          className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 px-4 py-2 rounded transition-colors"
        >
          {showAddForm ? "Hủy" : "+ Thêm danh mục"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col gap-4">
          <h2 className="text-lg font-bold text-cyan-400 mb-2">{editingId ? "Sửa danh mục" : "Thêm danh mục"}</h2>

          <div>
            <label className="block mb-1 text-sm font-semibold">Tên danh mục</label>
            <input
              type="text"
              placeholder="VD: Dụng Cụ Học Tập & Bàn Làm Việc"
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white outline-none focus:border-cyan-400"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Slug</label>
            <input
              type="text"
              placeholder="dung-cu-hoc-tap-ban-lam-viec"
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white outline-none focus:border-cyan-400 font-mono text-sm"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
            <p className="text-xs text-neutral-500 mt-1">Dùng trong đường dẫn trang. Chỉ chữ thường, số và dấu gạch ngang.</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Mô tả</label>
            <textarea
              placeholder="Mô tả ngắn gọn về danh mục này"
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white outline-none focus:border-cyan-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Ảnh danh mục</label>
            <FileUpload
              label="Ảnh đại diện"
              accept="image/*"
              folder={`categories/${uploadFolderId}/image`}
              onUploadComplete={setImage}
            />
            {image && <p className="text-xs text-neutral-500 mt-1 truncate">Đã chọn: {image}</p>}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleSaveCategory}
              disabled={isSaving || !name || !slug}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
            >
              {isSaving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="p-8 text-cyan-500 animate-pulse">Đang tải danh mục...</div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black text-xs uppercase text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium">Tên</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Mô tả</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-800 bg-black/50 hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4 text-gray-400">{cat.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEditClick(cat)} className="text-cyan-500 hover:text-cyan-400 text-sm mr-4">Sửa</button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-400 text-sm">Xóa</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
