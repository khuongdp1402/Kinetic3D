"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Heart, User, Sparkles, Zap } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { ThemeToggle } from "@/components/storefront/ThemeToggle";
import { Kinetic3DLogo } from "@/components/brand/Kinetic3DLogo";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Bảng giá", href: "/pricing" },
];

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { isAuthenticated, user } = useAuthStore();
  const { openAuthModal, openCreditModal } = useAppStore();

  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  
  const [wishlistCount, setWishlistCount] = useState(() => useWishlistStore.getState().items.length);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsub = useWishlistStore.subscribe((state) => {
      setWishlistCount(state.items.length);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCustomPage = pathname === "/custom";
  const isDark = resolvedTheme === "dark";
  const isDarkHeader = mounted && (isDark || isCustomPage);

  const textColor = isDarkHeader ? "#ffffff" : "var(--c-white)";
  const textMutedColor = isDarkHeader ? "rgba(255, 255, 255, 0.8)" : "var(--c-white-80)";
  const iconHoverBg = isDarkHeader ? "rgba(255, 255, 255, 0.1)" : "var(--c-white-05)";
  const borderColor = isDarkHeader ? "rgba(255, 255, 255, 0.15)" : "var(--c-white-15)";

  const headerBg = isCustomPage
    ? "rgba(11, 12, 16, 0.95)"
    : scrolled
    ? "var(--c-header-bg)"
    : "transparent";

  const headerBorder = isCustomPage
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : scrolled
    ? "1px solid var(--c-white-10)"
    : "1px solid transparent";

  return (
    <>
      <header
        className="fixed top-0 z-50 w-full transition-all duration-500"
        style={{
          backgroundColor: headerBg,
          backdropFilter: isCustomPage || scrolled ? "blur(30px)" : "none",
          borderBottom: headerBorder,
        }}
      >
        <div className="max-w-[var(--container-max)] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Logo + Core Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-0 z-10 shrink-0">
              <Kinetic3DLogo size="md" isDarkHeader={isDarkHeader} showTagline={false} />
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors"
                  style={{ color: textMutedColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = textColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textMutedColor)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => openComingSoonModal("Bảng Giá & Gói Dịch Vụ Token Studio")}
                className="text-sm font-medium transition-colors cursor-pointer"
                style={{ color: textMutedColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = textColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textMutedColor)}
              >
                Bảng giá
              </button>
              <button
                type="button"
                onClick={() => openComingSoonModal("Xưởng In 3D Độc Bản & AI Mesh Generator")}
                className="flex items-center gap-1.5 text-sm font-bold transition-all hover:scale-105 cursor-pointer"
                style={{ color: "var(--c-lime)" }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Custom</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--c-lime)]/15 border border-[var(--c-lime)]/30 uppercase">
                  Beta
                </span>
              </button>
            </nav>
          </div>

          {/* Far Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 z-10 shrink-0 ml-auto">
            {/* Theme Toggle */}
            <ThemeToggle isDarkHeader={isDarkHeader} />

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = iconHoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Heart className="w-5 h-5" style={{ color: textMutedColor }} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: "var(--c-orange)", color: "var(--c-bg)" }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = iconHoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: textMutedColor }} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: "var(--c-lime)", color: "var(--c-bg)" }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Auth */}
            <div className="relative">
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full transition-colors relative overflow-hidden"
                    style={{ border: `1px solid ${borderColor}` }}
                  >
                    {user.avatar ? (
                      <Image src={user.avatar} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <User className="w-5 h-5" style={{ color: textMutedColor }} />
                    )}
                  </button>
                  {profileDropdownOpen && (
                    <div className="hidden sm:block">
                      <ProfileDropdown onClose={() => setProfileDropdownOpen(false)} />
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-wider px-4 py-2 rounded-full transition-colors"
                  style={{ border: `1px solid ${borderColor}`, color: textColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = iconHoverBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  ĐĂNG NHẬP
                </button>
              )}
            </div>

            {/* Upgrade CTA */}
            <button
              onClick={() => openComingSoonModal("Gói Dịch Vụ Studio Pro & Enterprise")}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold tracking-wider px-4 py-2 rounded-full transition-all hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: "var(--c-orange)",
                color: "#ffffff",
              }}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              NÂNG CẤP
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1 transition-colors"
              style={{ color: textMutedColor }}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 px-6"
          style={{ backgroundColor: "var(--c-bg)" }}
        >
          <div className="mb-4">
            <Kinetic3DLogo size="lg" showTagline={true} />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-3xl font-bold tracking-[-0.03em] transition-colors"
              style={{ color: "var(--c-white)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-lime)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white)")}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openComingSoonModal("Bảng Giá & Gói Dịch Vụ Token Studio");
            }}
            className="text-3xl font-bold tracking-[-0.03em] transition-colors"
            style={{ color: "var(--c-white)" }}
          >
            Bảng giá
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openComingSoonModal("Xưởng In 3D Độc Bản & AI Mesh Generator");
            }}
            className="text-2xl font-bold tracking-[-0.03em] transition-colors flex items-center gap-2"
            style={{ color: "var(--c-lime)" }}
          >
            <Sparkles className="w-6 h-6" />
            <span>Custom</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--c-lime)]/20 uppercase font-mono">
              Beta
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openComingSoonModal("Gói Dịch Vụ Studio Pro & Enterprise");
            }}
            className="text-2xl font-bold tracking-[-0.03em] transition-colors flex items-center gap-2"
            style={{ color: "var(--c-orange)" }}
          >
            <Zap className="w-6 h-6 fill-current" />
            Nâng Cấp Token
          </button>
        </div>
      )}
    </>
  );
}
