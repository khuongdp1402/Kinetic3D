"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { Kinetic3DLogo } from "@/components/brand/Kinetic3DLogo";

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useAppStore();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center relative z-10 px-4" style={{ color: "var(--c-white)" }}>
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <Kinetic3DLogo size="lg" showTagline={true} />
          </div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] mb-2" style={{ color: "var(--c-white)" }}>
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
            Chưa có sản phẩm nào được thêm vào giỏ hàng.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-md transition-all hover:scale-105"
            style={{ backgroundColor: "var(--c-lime)", color: "#ffffff", fontFamily: "var(--font-mono)" }}
          >
            Tiếp tục mua sắm →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 relative z-10" style={{ color: "var(--c-white)" }}>
      {/* Header */}
      <div className="py-12 px-6" style={{ borderBottom: "1px solid var(--c-white-10)" }}>
        <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
              {items.length} {items.length === 1 ? "sản phẩm" : "sản phẩm"}
            </span>
            <h1 className="text-4xl font-bold tracking-[-0.03em]" style={{ color: "var(--c-white)" }}>
              Giỏ hàng
            </h1>
          </div>
          <div className="shrink-0 hidden md:block">
            <Kinetic3DLogo size="sm" showTagline={false} />
          </div>
        </div>
      </div>

      <div className="max-w-[var(--container-max)] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Items List */}
          <div className="flex-1">
            {/* Column headers */}
            <div
              className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-4 mb-4 text-xs uppercase tracking-[0.15em]"
              style={{ borderBottom: "1px solid var(--c-white-10)", color: "var(--c-white-30)", fontFamily: "var(--font-mono)" }}
            >
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
              <span className="w-8"></span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 py-6 items-center"
                style={{ borderBottom: "1px solid var(--c-white-05)" }}
              >
                {/* Product */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative flex-shrink-0 rounded-md overflow-hidden" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-10)" }}>
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=100&auto=format&fit=crop"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: "var(--c-white)" }}>{item.name}</h3>
                    <p className="text-xs" style={{ color: "var(--c-white-30)", fontFamily: "var(--font-mono)" }}>
                      {item.variants.color} / {item.variants.size}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <span className="text-sm" style={{ color: "var(--c-white-80)", fontFamily: "var(--font-mono)" }}>
                  {fmtVND(item.price)}
                </span>

                {/* Quantity */}
                <div className="inline-flex items-center rounded" style={{ border: "1px solid var(--c-white-15)" }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center transition-colors hover:text-[var(--c-lime)]"
                    style={{ color: "var(--c-white-50)" }}
                  >
                    −
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-xs font-bold" style={{ color: "var(--c-white)", fontFamily: "var(--font-mono)" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center transition-colors hover:text-[var(--c-lime)]"
                    style={{ color: "var(--c-white-50)" }}
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <span className="text-sm font-bold" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
                  {fmtVND(item.price * item.quantity)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 flex items-center justify-center transition-colors text-sm"
                  style={{ color: "var(--c-white-30)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-orange)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white-30)")}
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <Link
                href="/products"
                className="link-hover text-xs uppercase tracking-[0.15em] transition-colors"
                style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-lime)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white-50)")}
              >
                ← Tiếp tục mua sắm
              </Link>
              <button
                onClick={clearCart}
                className="text-xs uppercase tracking-[0.15em] transition-colors"
                style={{ color: "var(--c-white-30)", fontFamily: "var(--font-mono)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-orange)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white-30)")}
              >
                Xoá giỏ hàng
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div
              className="p-6 sticky top-24 rounded-lg"
              style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-10)" }}
            >
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
                Tóm tắt đơn hàng
              </h3>
              <div className="space-y-3 mb-6" style={{ fontFamily: "var(--font-mono)" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--c-white-50)" }}>Tạm tính</span>
                  <span style={{ color: "var(--c-white)" }}>{fmtVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--c-white-50)" }}>Vận chuyển</span>
                  <span style={{ color: "var(--c-white)" }}>{fmtVND(shipping)}</span>
                </div>
                <div className="h-[1px] my-2" style={{ backgroundColor: "var(--c-white-10)" }} />
                <div className="flex justify-between text-base font-bold">
                  <span style={{ color: "var(--c-white)" }}>Tổng cộng</span>
                  <span style={{ color: "var(--c-lime)" }}>{fmtVND(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal();
                  } else {
                    router.push("/checkout");
                  }
                }}
                className="w-full py-4 text-center text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-md hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: "var(--c-lime)",
                  color: "#000000",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {!isAuthenticated && <Lock size={14} />}
                <span>Tiến hành thanh toán</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
