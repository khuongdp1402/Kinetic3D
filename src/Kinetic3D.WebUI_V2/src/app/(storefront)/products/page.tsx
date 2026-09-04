"use client";

import { useState, useMemo, useEffect } from "react";
import { categoriesApi, productsApi } from "@/lib/api";
import type { CategoryDto, ProductDto } from "@/types/api";
import { ProductCardNew } from "@/components/storefront/ProductCardNew";
import Link from "next/link";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [products, setProducts] = useState<ProductDto[] | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    Promise.all([productsApi.getAll(), categoriesApi.getAll()]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    });
  }, []);

  const productCount = (categoryId: string) => (products ?? []).filter((p) => p.categoryId === categoryId).length;

  const filtered = useMemo(() => {
    let result = [...(products ?? [])];
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen pt-16 relative z-10" style={{ color: "var(--c-white)" }}>
      {/* Page Header */}
      <div className="py-16 px-6" style={{ borderBottom: "1px solid var(--c-white-10)" }}>
        <div className="max-w-[var(--container-max)] mx-auto">
          <span
            className="text-xs uppercase tracking-[0.2em] block mb-3"
            style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
          >
            Danh mục sản phẩm
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-2"
            style={{ color: "var(--c-white)" }}
          >
            Tất cả sản phẩm
          </h1>
          <p className="text-sm max-w-lg" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
            Xem toàn bộ bộ sưu tập. Bấm vào sản phẩm để tuỳ chỉnh và thêm vào giỏ hàng.
          </p>
        </div>
      </div>

      <div className="max-w-[var(--container-max)] mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          {/* Categories */}
          <div className="mb-8">
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-4 pb-2"
              style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--c-white-10)" }}
            >
              Danh mục
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm transition-colors w-full text-left"
                  style={{
                    color: selectedCategory === null ? "var(--c-lime)" : "var(--c-white-50)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Tất cả danh mục
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className="text-sm transition-colors w-full text-left flex justify-between"
                    style={{
                      color: selectedCategory === cat.id ? "var(--c-lime)" : "var(--c-white-50)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <span>{cat.name}</span>
                    <span style={{ color: "var(--c-white-30)" }}>{productCount(cat.id)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-4 pb-2"
              style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--c-white-10)" }}
            >
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="link-hover text-sm hover:text-[var(--c-lime)] transition-colors" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
                  Xem danh mục
                </Link>
              </li>
              <li>
                <Link href="/cart" className="link-hover text-sm hover:text-[var(--c-lime)] transition-colors" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
                  Xem giỏ hàng
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--c-white-30)", fontFamily: "var(--font-mono)" }}>
              {filtered.length} kết quả
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs uppercase tracking-[0.1em] px-3 py-2 rounded outline-none"
              style={{
                backgroundColor: "var(--c-bg-deep)",
                border: "1px solid var(--c-white-10)",
                color: "var(--c-white)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <option value="featured">Sắp xếp: Nổi bật</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="name">Tên: A → Z</option>
            </select>
          </div>

          {/* Product Grid */}
          {products === null ? (
            <div className="text-center py-20 rounded-lg" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-10)" }}>
              <p className="text-lg" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
                Đang tải sản phẩm...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCardNew key={product.id} product={product} />
              ))}
            </div>
          )}

          {products !== null && filtered.length === 0 && (
            <div className="text-center py-20 rounded-lg mt-8" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-10)" }}>
              <p className="text-lg" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
                Không tìm thấy sản phẩm trong danh mục này.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
