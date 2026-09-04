"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ordersApi, ApiError } from "@/lib/api";

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const order = await ordersApi.create({
        customerEmail: email,
        customerPhone: phone,
        shippingFullName: `${lastName} ${firstName}`.trim(),
        shippingAddress: address,
        shippingCity: city,
        note: note || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          customText: item.customText || undefined,
        })),
      });
      setOrderNumber(order.orderNumber);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "var(--c-bg)" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--c-white)" }}>Giỏ hàng đang trống</h1>
          <Link href="/products" className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
            Xem sản phẩm →
          </Link>
        </div>
      </div>
    );
  }

  // Order confirmation
  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "var(--c-bg)" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div
            className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full"
            style={{ border: "2px solid var(--c-lime)" }}
          >
            <span className="text-3xl" style={{ color: "var(--c-lime)" }}>✓</span>
          </div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] mb-2" style={{ color: "var(--c-white)" }}>
            Đặt hàng thành công
          </h1>
          <p className="text-lg font-bold mb-2" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
            {orderNumber}
          </p>
          <p className="text-sm mb-8" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
            Cảm ơn bạn đã đặt hàng. Bạn sẽ nhận được email xác nhận kèm thông tin theo dõi đơn hàng.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded"
            style={{ backgroundColor: "var(--c-lime)", color: "#ffffff", fontFamily: "var(--font-mono)" }}
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--c-bg)",
    border: "1px solid var(--c-white-15)",
    color: "var(--c-white)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.875rem",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    color: "var(--c-white-50)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    display: "block",
    marginBottom: "0.5rem",
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "var(--c-bg)" }}>
      {/* Header */}
      <div className="py-12 px-6" style={{ borderBottom: "1px solid var(--c-white-10)" }}>
        <div className="max-w-[var(--container-max)] mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] block mb-3" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
            Bước cuối cùng
          </span>
          <h1 className="text-4xl font-bold tracking-[-0.03em]" style={{ color: "var(--c-white)" }}>
            Thanh toán
          </h1>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="max-w-[var(--container-max)] mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left — Form */}
            <div className="flex-1 space-y-8">
              {/* Contact */}
              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] font-bold mb-4 pb-2" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--c-white-10)", display: "block", width: "100%" }}>
                  Thông tin liên hệ
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" placeholder="ban@email.com" required style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Số điện thoại</label>
                    <input type="tel" placeholder="09xx xxx xxx" required style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
              </fieldset>

              {/* Shipping */}
              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] font-bold mb-4 pb-2" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--c-white-10)", display: "block", width: "100%" }}>
                  Địa chỉ giao hàng
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Họ</label>
                    <input type="text" placeholder="Nguyễn" required style={inputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Tên</label>
                    <input type="text" placeholder="Văn A" required style={inputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label style={labelStyle}>Địa chỉ</label>
                    <input type="text" placeholder="Số nhà, đường, phường/xã" required style={inputStyle} value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Thành phố</label>
                    <input type="text" placeholder="TP. Hồ Chí Minh" required style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Ghi chú</label>
                    <input type="text" placeholder="Tuỳ chọn" style={inputStyle} value={note} onChange={(e) => setNote(e.target.value)} />
                  </div>
                </div>
              </fieldset>

              {/* Payment */}
              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] font-bold mb-4 pb-2" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--c-white-10)", display: "block", width: "100%" }}>
                  Thông tin thanh toán
                </legend>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label style={labelStyle}>Số thẻ</label>
                    <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Hết hạn</label>
                      <input type="text" placeholder="MM/YY" maxLength={5} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>CVV</label>
                      <input type="text" placeholder="123" maxLength={4} style={inputStyle} />
                    </div>
                  </div>
                </div>
                <p className="text-xs mt-3" style={{ color: "var(--c-white-30)", fontFamily: "var(--font-mono)" }}>
                  * Đây là bản demo. Không có giao dịch thanh toán thật nào được xử lý.
                </p>
              </fieldset>
            </div>

            {/* Right — Order Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div
                className="p-6 crosses-border sticky top-24"
                style={{ backgroundColor: "var(--c-bg-card)", border: "1px solid var(--c-white-10)" }}
              >
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
                  Tóm tắt đơn hàng
                </h3>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                      <div>
                        <span style={{ color: "var(--c-white-80)" }}>{item.name}</span>
                        <span style={{ color: "var(--c-white-30)" }}> ×{item.quantity}</span>
                      </div>
                      <span style={{ color: "var(--c-white)" }}>{fmtVND(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="h-[1px]" style={{ backgroundColor: "var(--c-white-10)" }} />

                <div className="space-y-3 my-4" style={{ fontFamily: "var(--font-mono)" }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--c-white-50)" }}>Tạm tính</span>
                    <span style={{ color: "var(--c-white)" }}>{fmtVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--c-white-50)" }}>Vận chuyển</span>
                    <span style={{ color: "var(--c-white)" }}>{fmtVND(shipping)}</span>
                  </div>
                </div>

                <div className="h-[1px]" style={{ backgroundColor: "var(--c-white-10)" }} />

                <div className="flex justify-between mt-4 mb-6 text-base font-bold" style={{ fontFamily: "var(--font-mono)" }}>
                  <span style={{ color: "var(--c-white)" }}>Tổng cộng</span>
                  <span style={{ color: "var(--c-lime)" }}>{fmtVND(total)}</span>
                </div>

                {error && (
                  <p className="text-xs mb-4" style={{ color: "var(--c-orange)", fontFamily: "var(--font-mono)" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] rounded transition-all duration-300 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--c-lime)",
                    color: "#ffffff",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
