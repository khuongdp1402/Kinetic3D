"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  QrCode,
  ShieldCheck,
  Layers,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { Kinetic3DLogo } from "@/components/brand/Kinetic3DLogo";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"VND" | "USD">("VND");
  const { isAuthenticated, user } = useAuthStore();
  const { openAuthModal, openCreditModal } = useAppStore();

  const tokenPacks = [
    {
      id: "pkg-100",
      name: "Starter Pack",
      credits: 100,
      bonus: 0,
      priceVnd: 49000,
      priceUsd: 1.99,
      badge: "Trải Nghiệm",
      desc: "Phù hợp để làm quen với Studio, tạo 2-3 mẫu nháp hoặc kiểm tra độ phân giải lưới AI.",
      features: [
        "100 Credits AI thế hệ mới",
        "Tạo được ~10 mô hình Text-to-3D",
        "Xuất file định dạng .GLB chuẩn",
        "Hỗ trợ xem trước 3D WebGL 120 FPS",
      ],
      popular: false,
    },
    {
      id: "pkg-500",
      name: "Creator Pack",
      credits: 500,
      bonus: 50,
      priceVnd: 199000,
      priceUsd: 7.99,
      badge: "Tặng +50 Token",
      desc: "Dành cho cá nhân & hobbyist: Dựng mô hình chi tiết cao từ ảnh và câu lệnh, tối ưu lưới Quad.",
      features: [
        "550 Credits (500 + 50 tặng kèm)",
        "Tạo ~50 mô hình Text/Image-to-3D",
        "Xuất file GLB, OBJ, STL in 3D",
        "Tự động tính toán dung tích & giá in",
        "Bảo lưu token vĩnh viễn không hết hạn",
      ],
      popular: false,
    },
    {
      id: "pkg-2000",
      name: "Pro Workshop",
      credits: 2000,
      bonus: 300,
      priceVnd: 599000,
      priceUsd: 23.99,
      badge: "Phổ Biến Nhất",
      desc: "Lựa chọn hàng đầu cho xưởng và nhà thiết kế 3D: Ưu tiên hàng đợi cao nhất, tạo vân PBR sắc nét.",
      features: [
        "2,300 Credits (2,000 + 300 tặng kèm)",
        "Tạo ~230 mô hình 3D cao cấp",
        "Hàng đợi ưu tiên render nhanh gấp 3x",
        "Texture PBR 4K & Retopology quad mesh",
        "Tự động gắn khung xương (Auto-rigging)",
        "Chiết khấu 10% khi đặt in 3D tại xưởng",
      ],
      popular: true,
    },
    {
      id: "pkg-5000",
      name: "Studio Lab",
      credits: 5000,
      bonus: 1000,
      priceVnd: 1290000,
      priceUsd: 49.99,
      badge: "Tiết Kiệm 35%",
      desc: "Gói số lượng lớn dành cho agency và studio chuyên nghiệp: Không giới hạn concurrent tasks.",
      features: [
        "6,000 Credits (5,000 + 1,000 tặng kèm)",
        "Tạo ~600 mô hình 3D độc bản",
        "Không giới hạn số tác vụ chạy song song",
        "Xuất định dạng PEEK, Resin, Carbon Fiber",
        "Hỗ trợ kỹ thuật CAD 1-1 từ kỹ sư Kinetic3D",
        "Chiết khấu 15% khi đặt in gia công số lượng lớn",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 relative z-10" style={{ color: "var(--c-white)" }}>
      {/* Background radial glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ backgroundColor: "var(--c-lime-05)" }}
      />

      {/* Header Title */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 text-center space-y-4 mb-12">
        <div className="flex justify-center mb-2">
          <Kinetic3DLogo size="md" showTagline={true} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-[0.2em] bg-[var(--c-lime-10)] border-[var(--c-lime-30)] text-[var(--c-lime)]">
          <Sparkles size={14} />
          <span>Pay-As-You-Go • Không Thu Phí Định Kỳ</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
          Nạp Token Sáng Tạo 3D <br />
          <span className="text-[var(--c-lime)]">Dùng Bao Nhiêu Trả Bấy Nhiêu</span>
        </h1>

        <p
          className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--c-white-60)", fontFamily: "var(--font-mono)" }}
        >
          Nạp token linh hoạt theo nhu cầu sáng tạo tại Studio 3D AI. Không phí duy trì định kỳ, token được bảo lưu vĩnh viễn và không bao giờ hết hạn.
        </p>

        {/* Currency Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className="text-xs text-[var(--c-white-60)]">Đơn vị tiền tệ:</span>
          <div className="inline-flex bg-[var(--c-bg-card)] border border-[var(--c-white-10)] rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setCurrency("VND")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currency === "VND"
                  ? "bg-[var(--c-lime)] text-black shadow font-extrabold"
                  : "text-[var(--c-white-60)] hover:text-white"
              }`}
            >
              🇻🇳 VND (₫)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currency === "USD"
                  ? "bg-[var(--c-lime)] text-black shadow font-extrabold"
                  : "text-[var(--c-white-60)] hover:text-white"
              }`}
            >
              🇺🇸 USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Free Trial Banner */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 mb-12">
        <div className="p-6 rounded-2xl bg-[var(--c-bg-card)] border border-[var(--c-white-10)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--c-lime-10)] border border-[var(--c-lime-30)] flex items-center justify-center text-[var(--c-lime)] shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Trải Nghiệm Studio Miễn Phí</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--c-lime-10)] text-[var(--c-lime)] border border-[var(--c-lime-30)]">
                  30 CREDITS TRẢI NGHIỆM
                </span>
              </div>
              <p className="text-xs text-[var(--c-white-60)] mt-0.5">
                Nhận ngay 30 credits trải nghiệm tính năng tạo mô hình 3D từ ảnh &amp; văn bản khi tạo tài khoản.
              </p>
            </div>
          </div>

          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[11px] text-[var(--c-white-60)]">Số dư hiện tại</p>
                  <p className="text-base font-black font-mono text-[var(--c-lime)]">
                    {user?.credits ?? 0} Credits
                  </p>
                </div>
                <Link
                  href="/custom"
                  className="px-5 py-2.5 rounded-xl bg-[var(--c-lime)] text-black font-bold text-xs hover:scale-105 transition-all"
                >
                  VÀO STUDIO LAB →
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="px-6 py-3 rounded-xl bg-[var(--c-lime)] text-black font-bold text-xs tracking-wide hover:scale-105 transition-all uppercase"
              >
                ĐĂNG KÝ TRẢI NGHIỆM NGAY →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-[var(--container-max)] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokenPacks.map((pack) => {
            const totalCredits = pack.credits + pack.bonus;
            const price =
              currency === "VND"
                ? `${pack.priceVnd.toLocaleString("vi-VN")}₫`
                : `$${pack.priceUsd}`;

            return (
              <div
                key={pack.id}
                className={`relative rounded-2xl flex flex-col justify-between p-6 transition-all duration-300 ${
                  pack.popular
                    ? "bg-[var(--c-bg-card)] border-2 border-[var(--c-lime)] shadow-[0_0_40px_rgba(34,197,94,0.12)] scale-[1.02]"
                    : "bg-[var(--c-bg-card)] border border-[var(--c-white-10)] hover:border-[var(--c-white-30)]"
                }`}
              >
                {/* Popular Badge */}
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--c-lime)] text-black text-[11px] font-black uppercase font-mono tracking-wider shadow">
                    Phổ Biến Nhất
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg">{pack.name}</h3>
                    {pack.badge && !pack.popular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--c-white-10)] text-[var(--c-white)] border border-[var(--c-white-15)]">
                        {pack.badge}
                      </span>
                    )}
                  </div>

                  <div className="my-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black font-mono text-[var(--c-lime)]">
                        {totalCredits.toLocaleString()}
                      </span>
                      <span className="text-xs uppercase font-mono text-[var(--c-white-60)]">Credits</span>
                    </div>
                    {pack.bonus > 0 && (
                      <p className="text-[11px] font-mono text-[var(--c-lime)] mt-1">
                        +{pack.bonus} Credits tặng thêm miễn phí!
                      </p>
                    )}
                  </div>

                  <div className="p-3 mb-5 rounded-xl bg-[var(--c-bg-deep)] border border-[var(--c-white-10)]">
                    <span className="text-[11px] text-[var(--c-white-60)] block">Giá thanh toán 1 lần:</span>
                    <span className="text-xl font-bold font-mono text-[var(--c-white)]">{price}</span>
                  </div>

                  <p className="text-xs text-[var(--c-white-60)] leading-relaxed mb-6">
                    {pack.desc}
                  </p>

                  <div className="space-y-2.5 mb-8 border-t border-[var(--c-white-10)] pt-5">
                    {pack.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <Check size={14} className="text-[var(--c-lime)] shrink-0 mt-0.5" />
                        <span style={{ color: "var(--c-white-80)" }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        openAuthModal();
                      } else {
                        openCreditModal(pack.id);
                      }
                    }}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                      pack.popular
                        ? "bg-[var(--c-lime)] text-black font-black hover:scale-105 shadow-md"
                        : "bg-[var(--c-white-10)] text-[var(--c-white)] hover:bg-[var(--c-white-20)]"
                    }`}
                  >
                    <QrCode size={14} />
                    <span>CHỌN GÓI &amp; THANH TOÁN</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consumption Table: 1 Token = How much? */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--c-bg-card)] border border-[var(--c-white-10)] space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">Quy Đổi Định Mức Tiêu Thụ Credits</h3>
            <p className="text-xs text-[var(--c-white-60)] font-mono">
              Minh bạch 100%. Chỉ trừ credits khi tác vụ AI hoàn tất thành công.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[var(--c-bg-deep)] border border-[var(--c-white-10)]">
              <span className="text-xs text-[var(--c-white-60)] block mb-1">Text-to-3D Tạo Mô Hình</span>
              <span className="text-2xl font-black font-mono text-[var(--c-lime)]">10 Credits</span>
              <span className="text-[10px] text-[var(--c-white-60)] block mt-1">/ lượt tạo AI</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--c-bg-deep)] border border-[var(--c-white-10)]">
              <span className="text-xs text-[var(--c-white-60)] block mb-1">Image-to-3D Chuyển Ảnh</span>
              <span className="text-2xl font-black font-mono text-[var(--c-lime)]">20 Credits</span>
              <span className="text-[10px] text-[var(--c-white-60)] block mt-1">/ ảnh đa góc</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--c-bg-deep)] border border-[var(--c-white-10)]">
              <span className="text-xs text-[var(--c-white-60)] block mb-1">Retopology &amp; Texture PBR</span>
              <span className="text-2xl font-black font-mono text-[var(--c-lime)]">15 Credits</span>
              <span className="text-[10px] text-[var(--c-white-60)] block mt-1">/ mesh siêu mịn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
