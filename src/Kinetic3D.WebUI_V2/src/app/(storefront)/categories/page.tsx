import Link from "next/link";
import Image from "next/image";
import { categoriesApi } from "@/lib/api";
import { productsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([categoriesApi.getAll(), productsApi.getAll()]);
  const productCount = (categoryId: string) => products.filter((p) => p.categoryId === categoryId).length;

  return (
    <div className="min-h-screen pt-16 relative z-10" style={{ color: "var(--c-white)" }}>
      {/* Page Header */}
      <div className="py-16 px-6" style={{ borderBottom: "1px solid var(--c-white-10)" }}>
        <div className="max-w-[var(--container-max)] mx-auto">
          <span
            className="text-xs uppercase tracking-[0.2em] block mb-3"
            style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
          >
            Khám phá
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-2" style={{ color: "var(--c-white)" }}>
            Tất cả danh mục
          </h1>
          <p className="text-sm max-w-lg" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
            Chọn một dòng sản phẩm để khám phá toàn bộ mẫu in 3D chuyên biệt.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-lg"
              style={{ border: "1px solid var(--c-white-10)", aspectRatio: "4/3" }}
            >
              <Image
                src={cat.image || "/placeholder-category.jpg"}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 10%, transparent 70%)" }} />
              <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
                <span
                  className="text-[10px] uppercase tracking-[0.2em] block mb-2"
                  style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
                >
                  {productCount(cat.id)} sản phẩm
                </span>
                <h3 className="text-xl md:text-2xl font-bold tracking-[-0.02em] mb-1 text-white">
                  {cat.name}
                </h3>
                <p
                  className="text-sm text-white/80 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                >
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
