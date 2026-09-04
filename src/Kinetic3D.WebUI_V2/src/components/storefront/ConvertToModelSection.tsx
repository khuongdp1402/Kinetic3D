"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Gem, Printer } from "lucide-react";
import { SplitRevealImage } from "@/components/storefront/SplitRevealImage";
import { motion } from "framer-motion";

const PATHS = [
  {
    icon: Gem,
    tag: "Chi Tiết Cao",
    title: "Ghi Lại Từng Chi Tiết",
    description:
      "Dựng mô hình 3D độ phân giải cao — lý tưởng cho render, VFX, in 3D và các dự án cần tái tạo chi tiết gốc với lưới (mesh) sắc nét.",
    cta: "Thử Ngay",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
  },
  {
    icon: Printer,
    tag: "In Ấn Sẵn Sàng",
    title: "Sẵn Sàng Trong Vài Giây",
    description:
      "Tự động dựng mesh sạch, tối ưu để in — không lỗi thủng, không cần sửa tay, xuất file ngay khi hoàn tất quá trình khởi tạo AI.",
    cta: "Thử Ngay",
    image:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1000&auto=format&fit=crop",
  },
];

export function ConvertToModelSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section 
      ref={containerRef}
      className="w-full relative py-32 md:py-48" 
      style={{ backgroundColor: "#0b0c10" }}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">
          
          {/* LEFT: Sticky Text */}
          <div className="w-full lg:w-5/12">
            <div className="sticky top-40 flex flex-col items-start">
              <span
                className="text-xs uppercase tracking-[0.2em] block mb-6 px-3 py-1 rounded-full border"
                style={{ color: "#f5b942", borderColor: "rgba(245,185,66,0.3)", backgroundColor: "rgba(245,185,66,0.05)" }}
              >
                Từ Ảnh Đến Mô Hình 3D
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] mb-6" style={{ color: "#ffffff" }}>
                Hai Cách Để Tạo Mô Hình 3D
              </h2>
              <p className="text-lg leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.6)" }}>
                Trí tuệ nhân tạo của Kinetic3D mang đến sự linh hoạt tối đa. Chọn độ chi tiết theo nhu cầu — dựng tác phẩm nghệ thuật sắc nét hoặc tạo mesh sạch hoàn hảo sẵn sàng cho máy in 3D của bạn.
              </p>
            </div>
          </div>

          {/* RIGHT: Scrolling Cards */}
          <div className="w-full lg:w-7/12 flex flex-col gap-32 pt-10 lg:pt-40 pb-20">
            {PATHS.map((path, index) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="group relative flex flex-col"
              >
                <div 
                  className="relative h-[400px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <SplitRevealImage
                    src={path.image}
                    alt={path.title}
                    imgClassName="transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Tag */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest bg-black/40 backdrop-blur-md text-white border border-white/20">
                    <path.icon className="w-4 h-4" style={{ color: "#f5b942" }} />
                    {path.tag}
                  </div>
                </div>

                <div className="pt-8 pl-4 border-l-2 mt-8 transition-colors duration-500" style={{ borderColor: "rgba(245,185,66,0.3)" }}>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] mb-4" style={{ color: "#ffffff" }}>
                    {path.title}
                  </h3>
                  <p className="text-base mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {path.description}
                  </p>
                  <Link
                    href="/custom"
                    className="inline-flex items-center gap-3 text-sm font-bold tracking-wide transition-all group-hover:translate-x-2"
                    style={{ color: "#f5b942" }}
                  >
                    <span className="uppercase border-b border-[#f5b942] pb-1">{path.cta}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
