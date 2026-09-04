import { categoriesApi, productsApi } from "@/lib/api";
import { ProductCardNew } from "@/components/storefront/ProductCardNew";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([categoriesApi.getAll(), productsApi.getAll()]);
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = category ? products.filter((p) => p.categoryId === category.id) : [];

  if (!category) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "var(--c-bg)" }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--c-white)" }}>Không tìm thấy danh mục</h1>
          <Link href="/categories" className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
            ← Quay lại danh mục
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "var(--c-bg)" }}>
      {/* Breadcrumb */}
      <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--c-white-10)" }}>
        <div className="max-w-[var(--container-max)] mx-auto flex items-center gap-2 text-xs uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-mono)" }}>
          <Link href="/" style={{ color: "var(--c-white-30)" }} className="hover:text-[var(--c-lime)] transition-colors">Trang chủ</Link>
          <span style={{ color: "var(--c-white-15)" }}>/</span>
          <Link href="/categories" style={{ color: "var(--c-white-30)" }} className="hover:text-[var(--c-lime)] transition-colors">Danh mục</Link>
          <span style={{ color: "var(--c-white-15)" }}>/</span>
          <span style={{ color: "var(--c-white-80)" }}>{category.name}</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="py-16 px-6" style={{ borderBottom: "1px solid var(--c-white-10)" }}>
        <div className="max-w-[var(--container-max)] mx-auto">
          <span
            className="text-xs uppercase tracking-[0.2em] block mb-3"
            style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
          >
            {categoryProducts.length} sản phẩm
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-2" style={{ color: "var(--c-white)" }}>
            {category.name}
          </h1>
          <p className="text-sm max-w-lg" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
            {category.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-12">
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <ProductCardNew key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg mb-4" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
              Danh mục này chưa có sản phẩm nào.
            </p>
            <Link href="/products" className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
              Xem tất cả sản phẩm →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
