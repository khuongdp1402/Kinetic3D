"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, QrCode, Phone, Mail, MapPin, Printer } from "lucide-react";
import { Kinetic3DLogo } from "@/components/brand/Kinetic3DLogo";

const discoverLinks = [
  { label: "Tất cả sản phẩm", href: "/products" },
  { label: "Bộ sưu tập danh mục", href: "/categories" },
  { label: "Xưởng in 3D Custom", href: "/custom" },
  { label: "Bảng giá & Gói Pro", href: "/pricing" },
];

const supportLinks = [
  { label: "Tra cứu tiến độ in 3D", href: "/tracking", badge: "Live" },
  { label: "Giỏ hàng của bạn", href: "/cart" },
  { label: "Danh sách yêu thích", href: "/wishlist" },
  { label: "Về Kinetic3D Studio", href: "/about" },
];

const policyLinks = [
  { label: "Điều khoản dịch vụ", href: "/policies/terms" },
  { label: "Chính sách đổi trả & hoàn tiền", href: "/policies/refund" },
  { label: "Vận chuyển & đồng kiểm", href: "/policies/shipping" },
  { label: "Bảo mật thông tin & CAD", href: "/policies/privacy" },
];

export function Footer() {
  const pathname = usePathname();

  // Do not render footer on full-screen interactive 3D studio workspace
  if (pathname === "/custom") {
    return null;
  }

  return (
    <footer className="w-full relative z-10 border-t transition-colors" style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}>
      {/* Main Footer Content */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1 — Brand & Trust */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Kinetic3DLogo size="lg" showTagline={true} />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--c-white-60)", fontFamily: "var(--font-mono)" }}>
              Nền tảng thương mại điện tử 3D & xưởng chế tác kỹ thuật số đột phá. Từ tệp CAD đến sản phẩm in đa màu chuẩn cơ khí — độ phân giải tới 19 micron.
            </p>
            
            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
                style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)", color: "var(--c-lime)" }}
              >
                <QrCode size={13} />
                <span>Chuyển Khoản Ngân Hàng 24/7</span>
              </div>
              <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
                style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)", color: "var(--c-orange)" }}
              >
                <ShieldCheck size={13} />
                <span>Bảo Hành In Lại 100%</span>
              </div>
            </div>

            {/* Address */}
            <div className="pt-2 text-xs space-y-2 font-mono" style={{ color: "var(--c-white-50)" }}>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-amber-400" />
                <span>Khu Công Nghệ Cao TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-amber-400" />
                <span>Hotline Kỹ Thuật: 0988.888.888</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-amber-400" />
                <span>Email: contact@kinetic3d.vn</span>
              </p>
            </div>
          </div>

          {/* Col 2 — Khám Phá */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)" }}
            >
              Khám Phá
            </h3>
            <ul className="space-y-2.5">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-hover text-xs transition-colors hover:underline"
                    style={{ color: "var(--c-white-80)", fontFamily: "var(--font-mono)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Hỗ Trợ Khách Hàng */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)" }}
            >
              Hỗ Trợ
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-hover text-xs transition-colors hover:underline inline-flex items-center gap-1.5"
                    style={{ color: "var(--c-white-80)", fontFamily: "var(--font-mono)" }}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Chính Sách & Pháp Lý */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)" }}
            >
              Chính Sách
            </h3>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-hover text-xs transition-colors hover:underline"
                    style={{ color: "var(--c-white-80)", fontFamily: "var(--font-mono)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div
        className="border-t px-6 py-4"
        style={{ borderColor: "var(--c-white-10)" }}
      >
        <div className="max-w-[var(--container-max)] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs" style={{ color: "var(--c-white-40)", fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} Kinetic3D Vietnam Co., Ltd. Tất cả quyền được bảo lưu.
          </span>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--c-white-40)", fontFamily: "var(--font-mono)" }}>
            <Link href="/policies/terms" className="hover:underline">Điều khoản</Link>
            <span>•</span>
            <Link href="/policies/privacy" className="hover:underline">Bảo mật</Link>
            <span>•</span>
            <Link href="/tracking" className="hover:underline">Tra cứu đơn hàng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
