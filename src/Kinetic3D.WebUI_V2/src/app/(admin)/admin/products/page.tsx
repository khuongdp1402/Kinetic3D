"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { productsApi, ApiError } from "@/lib/api";
import type { ProductDto } from "@/types/api";
import { Search, Plus, RefreshCw, Package, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tải được danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productsApi.remove(id);
      fetchProducts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Xóa sản phẩm thất bại.");
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sản phẩm</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {products.length} sản phẩm
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600 text-sm transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors"
          >
            <Plus size={14} />
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên, slug..."
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-400 text-sm flex items-center justify-between">
          {error}
          <button onClick={fetchProducts} className="underline text-xs hover:text-red-300">Thử lại</button>
        </div>
      )}

      {isLoading ? (
        <div className="p-16 text-center text-orange-400 animate-pulse text-sm">Đang tải sản phẩm...</div>
      ) : filtered.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center border border-neutral-800 rounded-xl">
          <Package size={40} className="text-neutral-700 mb-3" />
          <p className="text-neutral-500 text-sm">Không có sản phẩm nào</p>
        </div>
      ) : (
        <div className="border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950">
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Sản phẩm</th>
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider hidden md:table-cell">Giá gốc</th>
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider hidden lg:table-cell">Biến thể</th>
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider hidden lg:table-cell">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <React.Fragment key={p.id}>
                  <tr
                    className="border-b border-neutral-800 last:border-0 hover:bg-neutral-900/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  >
                    {/* Product cell */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                          {p.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-neutral-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{p.name}</p>
                          <p className="text-xs text-neutral-500 font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-orange-400 font-medium hidden md:table-cell">
                      {p.basePrice.toLocaleString("vi-VN")}₫
                    </td>

                    {/* Variants */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                        {p.variants?.length || 0} biến thể
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {p.inStock ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle size={12} /> Còn hàng
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <XCircle size={12} /> Hết hàng
                          </span>
                        )}
                        {p.featured && (
                          <span className="text-[10px] bg-orange-500/15 border border-orange-500/30 text-orange-400 px-1.5 py-0.5 rounded font-bold">
                            Nổi bật
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-orange-400 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-red-400 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded variants row */}
                  {expandedId === p.id && (
                    <tr className="border-b border-neutral-800">
                      <td colSpan={5} className="px-4 py-3 bg-neutral-900/40">
                        <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-2">
                          Biến thể (Attributes JSONB)
                        </div>
                        {p.variants && p.variants.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {p.variants.map((v) => (
                              <div
                                key={v.id}
                                className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2"
                              >
                                {v.price != null && (
                                  <span className="text-orange-400 font-semibold text-xs">{v.price.toLocaleString("vi-VN")}₫</span>
                                )}
                                {Object.entries(v.attributes).map(([key, val]) => (
                                  <span key={key} className="text-xs">
                                    <span className="text-neutral-500">{key}: </span>
                                    <span className="text-neutral-200">{val}</span>
                                  </span>
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-600 italic">Chưa có biến thể nào.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
