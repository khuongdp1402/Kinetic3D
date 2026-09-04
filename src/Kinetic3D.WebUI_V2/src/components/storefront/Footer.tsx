"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Sản phẩm", href: "/products" },
  { label: "Danh mục", href: "/categories" },
  { label: "Custom", href: "/custom" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Giỏ hàng", href: "/cart" },
];

const contactInfo = [
  { label: "hello@kinetic3d.io", href: "mailto:hello@kinetic3d.io" },
  { label: "+84 (0) 90 000 0000", href: "tel:+84900000000" },
];

export function Footer() {
  const pathname = usePathname();

  // Do not render footer on full-screen interactive 3D studio workspace
  if (pathname === "/custom") {
    return null;
  }

  return (
    <footer className="w-full relative z-10 border-t" style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-10)" }}>
      {/* Main Footer */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tighter" style={{ color: "var(--c-white)" }}>
                KINETIC
              </span>
              <span className="text-2xl font-bold tracking-tighter" style={{ color: "var(--c-lime)" }}>
                3D
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
              Nền tảng in 3D cá nhân hoá. Từ ý tưởng số đến vật thể độc bản — độ chính xác dưới 10 micron.
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)" }}
            >
              Điều hướng
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-hover text-sm transition-colors"
                    style={{ color: "var(--c-white-80)", fontFamily: "var(--font-mono)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-lime)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white-80)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Liên hệ */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)" }}
            >
              Liên hệ
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-hover text-sm transition-colors"
                    style={{ color: "var(--c-white-80)", fontFamily: "var(--font-mono)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-lime)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white-80)")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)" }}
            >
              Bản tin
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--c-white-50)" }}>
              Nhận thông báo về chất liệu và tính năng mới.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Đăng ký thành công! (Demo)");
              }}
              className="flex"
            >
              <input
                type="email"
                placeholder="ban@email.com"
                className="flex-1 px-3 py-2 text-sm rounded-l outline-none transition-colors"
                style={{
                  backgroundColor: "var(--c-bg)",
                  border: "1px solid var(--c-white-15)",
                  color: "var(--c-white)",
                  fontFamily: "var(--font-mono)",
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-r transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--c-orange)",
                  color: "#ffffff",
                  fontFamily: "var(--font-mono)",
                }}
              >
                →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t px-6 py-4"
        style={{ borderColor: "var(--c-white-10)" }}
      >
        <div className="max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="text-xs" style={{ color: "var(--c-white-30)", fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} Kinetic3D. Bản quyền đã được bảo hộ.
          </span>
          <span className="text-xs" style={{ color: "var(--c-white-30)", fontFamily: "var(--font-mono)" }}>
            Powered by Kinetic3D Engine v3.0
          </span>
        </div>
      </div>
    </footer>
  );
}
