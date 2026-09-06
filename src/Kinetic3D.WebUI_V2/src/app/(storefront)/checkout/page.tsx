"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { ordersApi, paymentsApi, authApi, ApiError } from "@/lib/api";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";
import { Check, Copy, QrCode, Truck, ShieldCheck, RefreshCw, Sparkles, AlertCircle, CheckCircle2, Lock, LogIn } from "lucide-react";
import { Kinetic3DLogo } from "@/components/brand/Kinetic3DLogo";

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

const CASSO_BANK_INFO = {
  bankId: "MB",
  bankName: "MBBank (Ngân Hàng Quân Đội)",
  accountNumber: "0988888888",
  accountName: "CONG TY KINETIC3D",
};

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user, isAuthenticated, login } = useAuthStore();
  const { openAuthModal } = useAppStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [placedTotal, setPlacedTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"casso" | "cod">("casso");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("TP. Hồ Chí Minh");
  const [note, setNote] = useState("");

  // Post-order account activation for guests
  const [guestPassword, setGuestPassword] = useState("");
  const [guestPasswordSuccess, setGuestPasswordSuccess] = useState(false);
  const [guestPasswordLoading, setGuestPasswordLoading] = useState(false);
  const [guestPasswordError, setGuestPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      if (!email && user.email) setEmail(user.email);
      if (!fullName && user.displayName) setFullName(user.displayName);
    }
  }, [user]);

  // Copy helpers
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Casso Polling State
  const [isPaid, setIsPaid] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      openAuthModal();
      setError("Vui lòng đăng nhập tài khoản để tiến hành đặt hàng và thanh toán.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await ordersApi.create({
        customerEmail: email,
        customerPhone: phone,
        shippingFullName: fullName.trim(),
        shippingAddress: address,
        shippingCity: city,
        note: `[Phương thức: ${paymentMethod === "casso" ? "Chuyển khoản QR" : "COD"}] ${note || ""}`.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          customText: item.customText || undefined,
        })),
      });

      setOrderNumber(order.orderNumber);
      setPlacedTotal(order.total);
      setOrderPlaced(true);
      clearCart();

      // If Casso VietQR, start polling for status
      if (paymentMethod === "casso") {
        setIsPolling(true);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Casso status polling
  useEffect(() => {
    if (!orderPlaced || paymentMethod !== "casso" || isPaid || !orderNumber) return;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await paymentsApi.getOrderStatus(orderNumber);
        if (res.isPaid) {
          setIsPaid(true);
          setIsPolling(false);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch {
        // Silently continue polling
      }
    }, 2500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [orderPlaced, paymentMethod, isPaid, orderNumber]);

  // Dev simulate Casso webhook
  const handleSimulatePayment = async () => {
    if (!orderNumber) return;
    setIsSimulating(true);
    try {
      const res = await paymentsApi.simulateCassoPayment(orderNumber);
      if (res.success) {
        setIsPaid(true);
        setIsPolling(false);
      }
    } catch (err) {
      alert("Lỗi giả lập thanh toán: " + (err as Error).message);
    } finally {
      setIsSimulating(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center relative z-10" style={{ color: "var(--c-white)" }}>
        <div className="text-center p-8 rounded-2xl max-w-md w-full mx-4 border" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-10)" }}>
            <span className="text-2xl text-[var(--c-lime)]">🛍️</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Giỏ hàng đang trống</h1>
          <p className="text-sm mb-6 font-mono" style={{ color: "var(--c-white-50)" }}>
            Bạn chưa chọn sản phẩm nào để đặt in hoặc chế tác.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--c-lime)", color: "#ffffff" }}
          >
            Khám phá sản phẩm 3D →
          </Link>
        </div>
      </div>
    );
  }

  // Auth gate for unauthenticated users
  if (!isAuthenticated && !orderPlaced) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center relative z-10 px-4" style={{ color: "var(--c-white)" }}>
        <div className="text-center p-8 sm:p-10 rounded-3xl max-w-lg w-full border backdrop-blur-xl shadow-2xl" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}>
          <div className="mb-6 flex justify-center">
            <Kinetic3DLogo size="lg" showTagline={true} />
          </div>
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl" style={{ backgroundColor: "rgba(255, 107, 0, 0.12)", border: "1px solid rgba(255, 107, 0, 0.3)" }}>
            <Lock className="w-7 h-7 text-[var(--c-orange)]" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--c-orange)] block mb-2">
            Yêu cầu xác thực tài khoản
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Đăng Nhập Để Tiếp Tục Đặt Hàng
          </h1>
          <p className="text-xs sm:text-sm font-mono leading-relaxed mb-6" style={{ color: "var(--c-white-60)" }}>
            Để bảo mật thông tin đơn hàng, đồng bộ lịch sử chế tác 3D và quản lý phiên thanh toán chặt chẽ, quý khách vui lòng đăng nhập hoặc đăng ký tài khoản trước khi hoàn tất đặt hàng.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openAuthModal}
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: "var(--c-lime)", color: "#000000", fontFamily: "var(--font-mono)" }}
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập / Đăng ký ngay</span>
            </button>
            <Link
              href="/cart"
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center border transition-colors hover:bg-white/5 flex items-center justify-center"
              style={{ borderColor: "var(--c-white-20)", color: "var(--c-white)", fontFamily: "var(--font-mono)" }}
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // VietQR URL builder using Casso specifications
  const vietQrUrl = orderNumber
    ? `https://img.vietqr.io/image/${CASSO_BANK_INFO.bankId}-${CASSO_BANK_INFO.accountNumber}-compact2.png?amount=${placedTotal}&addInfo=${encodeURIComponent(orderNumber)}&accountName=${encodeURIComponent(CASSO_BANK_INFO.accountName)}`
    : "";

  // Order confirmation view
  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 pb-20 relative z-10 px-4 sm:px-6" style={{ color: "var(--c-white)" }}>
        <div className="max-w-3xl mx-auto">
          {/* Brand header */}
          <div className="flex justify-center mb-6">
            <Kinetic3DLogo size="md" showTagline={true} />
          </div>

          {/* Status Header Banner */}
          <div
            className="p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden mb-8"
            style={{
              backgroundColor: isPaid ? "rgba(34, 197, 94, 0.08)" : "var(--c-bg-card)",
              borderColor: isPaid ? "rgba(34, 197, 94, 0.4)" : "var(--c-white-15)",
            }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: isPaid ? "#22c55e" : "var(--c-lime)",
                color: "#ffffff",
                boxShadow: isPaid ? "0 0 25px rgba(34, 197, 94, 0.4)" : "0 0 25px var(--c-lime-30)",
              }}
            >
              {isPaid ? <Check className="w-8 h-8 stroke-[3]" /> : <Sparkles className="w-7 h-7" />}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              {isPaid
                ? "Thanh Toán Thành Công!"
                : paymentMethod === "casso"
                ? "Đơn Hàng Đã Tạo — Chờ Thanh Toán"
                : "Đặt Hàng Thành Công (COD)!"}
            </h1>

            <div className="flex items-center justify-center gap-2 font-mono text-sm mb-3">
              <span style={{ color: "var(--c-white-50)" }}>Mã đơn hàng:</span>
              <span className="font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: "var(--c-bg-deep)", color: "var(--c-lime)", border: "1px solid var(--c-white-10)" }}>
                {orderNumber}
              </span>
            </div>

            <p className="text-xs sm:text-sm max-w-lg mx-auto font-mono" style={{ color: "var(--c-white-60)" }}>
              {isPaid
                ? "Đã xác nhận thanh toán thành công! Lệnh sản xuất in 3D đã được kích hoạt và gửi tới xưởng."
                : paymentMethod === "casso"
                ? "Quý khách vui lòng quét mã QR bên dưới bằng bất kỳ ứng dụng ngân hàng nào để hoàn tất thanh toán."
                : "Kinetic3D đã tiếp nhận đơn hàng. Nhân viên sẽ liên hệ xác nhận và tiến hành in 3D gửi đến địa chỉ của bạn."}
            </p>

            {/* Operational Notification indicator badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <CheckCircle2 size={13} />
              <span>Hệ thống đã tự động chuyển thông tin đơn hàng tới xưởng chế tác</span>
            </div>
          </div>

          {/* Bank Transfer Payment Box */}
          {paymentMethod === "casso" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 rounded-2xl border mb-8" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}>
              {/* QR Code Column */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 rounded-xl" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-10)" }}>
                <div className="relative w-60 h-60 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vietQrUrl}
                    alt="Mã QR thanh toán"
                    className={`w-full h-full object-contain transition-opacity duration-300 ${isPaid ? "opacity-30 blur-[1px]" : "opacity-100"}`}
                  />
                  {isPaid && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-950/85 text-white p-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-2 shadow-lg">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <span className="font-bold text-sm">ĐÃ THANH TOÁN</span>
                      <span className="text-[10px] text-green-300 font-mono">Xác nhận thanh toán tự động</span>
                    </div>
                  )}
                </div>

                {/* Polling live badge */}
                {!isPaid && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
                    <RefreshCw className={`w-3 h-3 ${isPolling ? "animate-spin" : ""}`} />
                    <span>Đang chờ đối soát chuyển khoản...</span>
                  </div>
                )}
              </div>

              {/* Bank Details & Copy Info Column */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[var(--c-lime)]" />
                    Thông Tin Chuyển Khoản Ngân Hàng
                  </h3>
                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-05)" }}>
                      <div>
                        <span className="block" style={{ color: "var(--c-white-40)" }}>Ngân hàng:</span>
                        <span className="font-bold" style={{ color: "var(--c-white)" }}>{CASSO_BANK_INFO.bankName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-05)" }}>
                      <div>
                        <span className="block" style={{ color: "var(--c-white-40)" }}>Số tài khoản:</span>
                        <span className="font-bold text-sm text-[var(--c-lime)]">{CASSO_BANK_INFO.accountNumber}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(CASSO_BANK_INFO.accountNumber, "acc")}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === "acc" ? "Đã chép" : "Chép STK"}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-05)" }}>
                      <div>
                        <span className="block" style={{ color: "var(--c-white-40)" }}>Chủ tài khoản:</span>
                        <span className="font-bold" style={{ color: "var(--c-white)" }}>{CASSO_BANK_INFO.accountName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: "var(--c-bg-deep)", border: "1px solid var(--c-white-05)" }}>
                      <div>
                        <span className="block" style={{ color: "var(--c-white-40)" }}>Số tiền thanh toán:</span>
                        <span className="font-bold text-sm text-[var(--c-orange)]">{fmtVND(placedTotal)}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(placedTotal.toString(), "amount")}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === "amount" ? "Đã chép" : "Chép số tiền"}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-amber-400/30 bg-amber-500/10">
                      <div>
                        <span className="block text-[10px] text-amber-300 font-bold uppercase">Nội dung chuyển khoản (Bắt buộc):</span>
                        <span className="font-bold text-sm text-amber-200">{orderNumber}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(orderNumber, "memo")}
                        className="px-2.5 py-1 rounded bg-amber-400 text-black font-bold flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === "memo" ? "Đã chép" : "Chép mã"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Payment Confirmation Action */}
                <div className="pt-2">
                  {!isPaid ? (
                    <button
                      onClick={async () => {
                        setIsPolling(true);
                        try {
                          const res = await paymentsApi.getOrderStatus(orderNumber);
                          if (res.isPaid) {
                            setIsPaid(true);
                            setIsPolling(false);
                          }
                        } catch {}
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-[var(--c-lime)] text-black text-xs font-bold font-mono tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Xác Nhận Đã Chuyển Khoản</span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold text-center">
                      ✓ Đã xác nhận thanh toán thành công qua ngân hàng!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 1-Click Guest Account Activation */}
          {!user && (
            <div 
              className="p-6 rounded-2xl border mb-8 text-left transition-colors"
              style={{ backgroundColor: "var(--c-bg-card)", borderColor: "rgba(34, 197, 94, 0.3)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm sm:text-base">Kích hoạt tài khoản Kinetic3D</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30">
                      Tài khoản thành viên
                    </span>
                  </div>
                  <p className="text-xs font-mono mb-4" style={{ color: "var(--c-white-60)" }}>
                    Đơn hàng đã được liên kết với email <span className="text-[#22c55e] font-bold">{email}</span>. Hãy thiết lập mật khẩu để tra cứu đơn, đồng bộ bản in và kích hoạt tài khoản thành viên!
                  </p>

                  {guestPasswordSuccess ? (
                    <div className="p-3.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-mono flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Tài khoản đã được tạo và kích hoạt thành công! Bạn đã đăng nhập tự động.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                        value={guestPassword}
                        onChange={(e) => setGuestPassword(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl text-xs font-mono outline-none border focus:border-[#22c55e]"
                        style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-15)", color: "var(--c-white)" }}
                      />
                      <button
                        type="button"
                        disabled={guestPasswordLoading || !guestPassword || guestPassword.length < 6}
                        onClick={async () => {
                          try {
                            setGuestPasswordLoading(true);
                            setGuestPasswordError("");
                            const did = getDeviceFingerprint();
                            const res = await authApi.setGuestPassword({
                              email,
                              password: guestPassword,
                              displayName: fullName || email.split("@")[0],
                              deviceHash: did,
                            });
                            login(res.token, {
                              id: res.userId,
                              email: res.email,
                              displayName: res.displayName,
                              avatar: "",
                              role: res.role,
                              tier: "Starter",
                              credits: res.credits ?? 30,
                            });
                            setGuestPasswordSuccess(true);
                          } catch (err: any) {
                            setGuestPasswordError(err.message || "Không thể tạo mật khẩu.");
                          } finally {
                            setGuestPasswordLoading(false);
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#22c55e] text-black text-xs font-bold font-mono hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {guestPasswordLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        <span>Kích hoạt ngay</span>
                      </button>
                    </div>
                  )}
                  {guestPasswordError && (
                    <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{guestPasswordError}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/tracking?code=${orderNumber}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center border transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ borderColor: "var(--c-orange)", color: "var(--c-orange)", backgroundColor: "rgba(255,107,0,0.1)", fontFamily: "var(--font-mono)" }}
            >
              <Truck className="w-4 h-4" />
              <span>Theo dõi tiến độ đơn hàng</span>
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-transform hover:scale-105"
              style={{ backgroundColor: "var(--c-lime)", color: "#ffffff", fontFamily: "var(--font-mono)" }}
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center border transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--c-white-20)", color: "var(--c-white)", fontFamily: "var(--font-mono)" }}
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--c-bg-deep)",
    border: "1px solid var(--c-white-15)",
    color: "var(--c-white)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.875rem",
    padding: "0.75rem 1rem",
    width: "100%",
    borderRadius: "0.75rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    color: "var(--c-white-60)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 600,
  };

  return (
    <div className="min-h-screen pt-20 pb-20 relative z-10" style={{ color: "var(--c-white)" }}>
      {/* Header */}
      <div className="py-12 px-6" style={{ borderBottom: "1px solid var(--c-white-10)" }}>
        <div className="max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
              Hoàn tất đơn hàng
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Thanh toán & Đặt hàng
            </h1>
          </div>
          <div className="shrink-0 hidden md:block">
            <Kinetic3DLogo size="sm" showTagline={false} />
          </div>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="max-w-[var(--container-max)] mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left — Form Inputs */}
            <div className="flex-1 space-y-8">
              {/* Contact Information */}
              <div className="p-6 sm:p-8 rounded-2xl border space-y-4" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-2" style={{ borderColor: "var(--c-white-10)" }}>
                  <h2 className="text-sm uppercase tracking-[0.2em] font-bold flex items-center gap-2" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
                    <span>1.</span> Thông tin liên hệ & người nhận
                  </h2>
                  {user && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 w-fit">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Tài khoản: {user.email}</span>
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label style={labelStyle}>Họ và tên người nhận *</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      required
                      style={inputStyle}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Số điện thoại *</label>
                    <input
                      type="tel"
                      placeholder="09xx xxx xxx"
                      required
                      style={inputStyle}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label style={labelStyle}>Email nhận hóa đơn & theo dõi 3D *</label>
                    <input
                      type="email"
                      placeholder="khachhang@email.com"
                      required
                      style={inputStyle}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-6 sm:p-8 rounded-2xl border space-y-4" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold pb-3 border-b flex items-center gap-2" style={{ color: "var(--c-lime)", borderColor: "var(--c-white-10)", fontFamily: "var(--font-mono)" }}>
                  <span>2.</span> Địa chỉ giao hàng chế tác
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="md:col-span-2">
                    <label style={labelStyle}>Địa chỉ chi tiết (Số nhà, đường, phường/xã) *</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 123 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh"
                      required
                      style={inputStyle}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Tỉnh / Thành phố *</label>
                    <input
                      type="text"
                      placeholder="TP. Hồ Chí Minh"
                      required
                      style={inputStyle}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Ghi chú cho xưởng in</label>
                    <input
                      type="text"
                      placeholder="Giao giờ hành chính, gọi trước khi giao..."
                      style={inputStyle}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="p-6 sm:p-8 rounded-2xl border space-y-4" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold pb-3 border-b flex items-center gap-2" style={{ color: "var(--c-lime)", borderColor: "var(--c-white-10)", fontFamily: "var(--font-mono)" }}>
                  <span>3.</span> Phương thức thanh toán
                </h2>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {/* Option 1: Bank Transfer (QR Code) */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
                      paymentMethod === "casso"
                        ? "border-[var(--c-lime)] shadow-[0_0_20px_var(--c-lime-20)]"
                        : "border-[var(--c-white-10)] hover:border-white/20"
                    }`}
                    style={{ backgroundColor: paymentMethod === "casso" ? "var(--c-bg-deep)" : "transparent" }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="casso"
                      checked={paymentMethod === "casso"}
                      onChange={() => setPaymentMethod("casso")}
                      className="mt-1 accent-[var(--c-lime)]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold flex items-center gap-2">
                          <span>Chuyển khoản ngân hàng (Quét mã QR)</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--c-lime)]/20 text-[var(--c-lime)]">
                            Khuyên dùng
                          </span>
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
                        Quét mã QR từ ứng dụng ngân hàng bất kỳ. Hệ thống tự động xác nhận đơn ngay khi chuyển khoản thành công.
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-emerald-400 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Không phí phụ thu • Tự động khớp lệnh 24/7</span>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: COD */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[var(--c-lime)] shadow-[0_0_20px_var(--c-lime-20)]"
                        : "border-[var(--c-white-10)] hover:border-white/20"
                    }`}
                    style={{ backgroundColor: paymentMethod === "cod" ? "var(--c-bg-deep)" : "transparent" }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 accent-[var(--c-lime)]"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-bold flex items-center gap-2">
                        <span>Thanh toán khi nhận hàng (COD)</span>
                      </span>
                      <p className="text-xs mt-1" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
                        Nhận kiện hàng in 3D, kiểm tra độ hoàn thiện và thanh toán tiền mặt trực tiếp cho nhân viên bưu tá.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div
                className="p-6 sm:p-8 rounded-2xl sticky top-28 border space-y-6"
                style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}
              >
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}>
                  Tóm tắt đơn hàng ({items.length})
                </h3>

                {/* Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs font-mono">
                      <div className="max-w-[70%]">
                        <span className="font-bold block truncate" style={{ color: "var(--c-white-90)" }}>{item.name}</span>
                        <span style={{ color: "var(--c-white-40)" }}>
                          {item.variants.color} • SL: ×{item.quantity}
                        </span>
                      </div>
                      <span className="font-bold" style={{ color: "var(--c-white)" }}>
                        {fmtVND(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-[1px]" style={{ backgroundColor: "var(--c-white-10)" }} />

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--c-white-50)" }}>Tạm tính:</span>
                    <span style={{ color: "var(--c-white)" }}>{fmtVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--c-white-50)" }}>Phí chế tác & đóng gói:</span>
                    <span className="text-emerald-400 font-bold">Miễn phí</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--c-white-50)" }}>Vận chuyển toàn quốc:</span>
                    <span style={{ color: "var(--c-white)" }}>{fmtVND(shipping)}</span>
                  </div>
                </div>

                <div className="h-[1px]" style={{ backgroundColor: "var(--c-white-10)" }} />

                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-xs uppercase font-bold tracking-wider" style={{ color: "var(--c-white-60)" }}>Tổng thanh toán:</span>
                  <span className="text-xl font-black" style={{ color: "var(--c-orange)" }}>{fmtVND(total)}</span>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--c-lime)",
                    color: "#ffffff",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang tạo đơn hàng...</span>
                    </>
                  ) : paymentMethod === "casso" ? (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Đặt Hàng & Thanh Toán VietQR</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Xác Nhận Đặt Hàng (COD)</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center font-mono" style={{ color: "var(--c-white-40)" }}>
                  Thông báo đơn hàng sẽ được gửi tức thì về Telegram của xưởng Kinetic3D sau khi bấm xác nhận.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
