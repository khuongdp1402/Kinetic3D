"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export function FinalCTA() {
  const [nlEmail, setNlEmail] = useState("");
  const [nlSuccess, setNlSuccess] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail) return;
    try {
      const list = JSON.parse(localStorage.getItem("kinetic3d_newsletter") || "[]");
      list.push({ email: nlEmail, date: new Date().toISOString() });
      localStorage.setItem("kinetic3d_newsletter", JSON.stringify(list));
    } catch {}
    setNlSuccess(true);
  };
  return (
    <section
      className="w-full py-28 md:py-36 relative overflow-hidden transition-colors duration-300 border-t"
      style={{ backgroundColor: "var(--c-bg)", borderColor: "var(--c-white-10)" }}
    >
      {/* Pure CSS ambient glows — zero WebGL / zero GPU overhead */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none rounded-full blur-[160px] opacity-15"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,185,66,0.35) 0%, rgba(251,146,60,0.15) 50%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(rgba(245,185,66,0.2) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f5b942]/30 bg-[#f5b942]/10 mb-6">
            <span className="text-[11px] font-mono tracking-widest text-[#f5b942] uppercase font-semibold">
              KINETIC3D DIGITAL FABRICATION
            </span>
          </div>

          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05] font-sans"
            style={{ color: "var(--c-white)" }}
          >
            Sẵn Sàng Để{" "}
            <span
              style={{
                color: "#f5b942",
                textShadow: "0 0 35px rgba(245,185,66,0.4)",
              }}
            >
              Sáng Tạo
            </span>
            ?
          </h2>

          <p
            className="text-base md:text-lg mb-10 max-w-lg mx-auto font-sans"
            style={{ color: "var(--c-white-80)" }}
          >
            Bắt đầu dự án 3D của bạn ngay hôm nay. Từ ý tưởng đến sản phẩm thực — chúng tôi hiện thực hóa tầm nhìn của bạn.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
              style={{
                backgroundColor: "#f5b942",
                color: "#0a0a0f",
                boxShadow: "0 0 30px rgba(245,185,66,0.3)",
              }}
            >
              Khám Phá Catalog →
            </Link>

            <Link
              href="/custom"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] border hover:border-[#f5b942] hover:text-[#f5b942] cursor-pointer"
              style={{
                borderColor: "var(--c-white-15)",
                color: "var(--c-white)",
              }}
            >
              Tạo Custom 3D
            </Link>
          </div>

          {/* Newsletter */}
          <div
            className="max-w-md mx-auto p-6 rounded-2xl border backdrop-blur-xl shadow-lg"
            style={{ 
              backgroundColor: "var(--c-bg-card)",
              borderColor: "var(--c-white-10)" 
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.2em] mb-4 font-mono"
              style={{ color: "var(--c-white-50)" }}
            >
              Nhận thông báo về tính năng & bộ sưu tập mới
            </p>
            {!nlSuccess ? (
              <form onSubmit={handleNewsletter} className="flex">
                <input
                  type="email"
                  required
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  placeholder="ban@email.com"
                  className="flex-1 px-4 py-3 text-sm outline-none rounded-l-xl border border-r-0 font-mono placeholder:text-neutral-400 focus:border-[#f5b942]/60 transition-colors"
                  style={{
                    backgroundColor: "var(--c-bg-deep)",
                    borderColor: "var(--c-white-15)",
                    color: "var(--c-white)",
                  }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-r-xl transition-opacity hover:opacity-90 font-mono cursor-pointer"
                  style={{
                    backgroundColor: "#f5b942",
                    color: "#0a0a0f",
                  }}
                >
                  →
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                ✓ Cảm ơn bạn! Đã đăng ký nhận bản tin thành công.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
