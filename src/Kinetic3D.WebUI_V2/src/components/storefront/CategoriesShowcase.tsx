"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoriesApi, productsApi } from "@/lib/api";
import { SplitRevealImage } from "@/components/storefront/SplitRevealImage";
import { motion } from "framer-motion";
import type { CategoryDto, ProductDto } from "@/types/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as any },
  },
};

export function CategoriesShowcase() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);

  useEffect(() => {
    Promise.all([categoriesApi.getAll(), productsApi.getAll()]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
    });
  }, []);

  const productCount = (categoryId: string) => products.filter((p) => p.categoryId === categoryId).length;

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-32" style={{ backgroundColor: "#0b0c10" }}>
      <div className="max-w-max mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start">
          <span
            className="text-xs uppercase tracking-[0.2em] block mb-4 px-3 py-1 rounded-full border"
            style={{ color: "#f5b942", borderColor: "rgba(245,185,66,0.3)", backgroundColor: "rgba(245,185,66,0.05)" }}
          >
            Lĩnh Vực 3D
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em]" style={{ color: "#ffffff" }}>
            Khám Phá Danh Mục
          </h2>
        </div>

        {/* Asymmetric Grid with Stagger */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Large card */}
          <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-2">
            <Link
              href={`/categories/${categories[0].slug}`}
              className="group relative overflow-hidden block w-full h-full rounded-2xl border border-white/10"
              style={{ minHeight: "500px", backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <SplitRevealImage
                src={categories[0].image || "/placeholder-category.jpg"}
                alt={categories[0].name}
                imgClassName="transition-transform duration-[1.5s] group-hover:scale-105"
              />
              <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-[#0b0c10] via-[#0b0c10]/40 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-10 z-10">
                <span className="text-xs uppercase tracking-[0.2em] block mb-3" style={{ color: "#f5b942", fontFamily: "var(--font-mono)" }}>
                  {productCount(categories[0].id)} Artifacts
                </span>
                <h3 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] mb-4" style={{ color: "#ffffff" }}>
                  {categories[0].name}
                </h3>
                <p className="text-base md:text-lg max-w-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {categories[0].description}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Small cards */}
          {categories.slice(1, 5).map((cat) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link
                href={`/categories/${cat.slug}`}
                className="group relative overflow-hidden block w-full rounded-2xl border border-white/10"
                style={{ minHeight: "240px", backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <SplitRevealImage
                  src={cat.image || "/placeholder-category.jpg"}
                  alt={cat.name}
                  imgClassName="transition-transform duration-[1.5s] group-hover:scale-110"
                />
                <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-[#0b0c10] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] block mb-2" style={{ color: "#f5b942", fontFamily: "var(--font-mono)" }}>
                    {productCount(cat.id)} Models
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold tracking-[-0.01em]" style={{ color: "#ffffff" }}>
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
