"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { authApi, ordersApi } from "@/lib/api";
import type { OrderDto } from "@/types/api";
import {
  User,
  Package,
  Shield,
  Coins,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Lock,
  Camera,
  LogIn,
  Save,
  Check
} from "lucide-react";
import { Kinetic3DLogo } from "@/components/brand/Kinetic3DLogo";

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-1.5 w-fit">
          <Clock className="w-3.5 h-3.5" />
          <span>Chờ thanh toán</span>
        </span>
      );
    case "processing":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center gap-1.5 w-fit">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Đang in 3D / Chế tác</span>
        </span>
      );
    case "confirmed":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center gap-1.5 w-fit">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Đã duyệt sản xuất</span>
        </span>
      );
    case "shipped":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center gap-1.5 w-fit">
          <Truck className="w-3.5 h-3.5" />
          <span>Đang giao hàng</span>
        </span>
      );
    case "completed":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 w-fit">
          <Check className="w-3.5 h-3.5" />
          <span>Hoàn tất</span>
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/10 border border-white/20 text-white/80 flex items-center gap-1.5 w-fit">
          <span>{status}</span>
        </span>
      );
  }
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "security" | "credits">(
    (initialTab as "profile" | "orders" | "security" | "credits") || "profile"
  );

  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { openAuthModal, openCreditModal } = useAppStore();

  // Profile Form State
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  // Orders State
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setAvatarUrl(user.avatar || "");
    }
  }, [user]);

  // Load orders when orders tab active
  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated) {
      setLoadingOrders(true);
      setOrdersError("");
      ordersApi
        .getMy()
        .then((res) => setOrders(res || []))
        .catch((err) => setOrdersError(err.message || "Không thể tải danh sách đơn hàng."))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab, isAuthenticated]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);
    setProfileError("");

    try {
      const res = await authApi.updateProfile({
        displayName: displayName.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      updateUser({
        displayName: res.displayName,
        avatar: res.avatarUrl,
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "Cập nhật thông tin thất bại.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      setPwdError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setPwdSaving(true);
    setPwdSuccess(false);
    setPwdError("");

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setPwdSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err: unknown) {
      setPwdError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại.");
    } finally {
      setPwdSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center relative z-10 px-4" style={{ color: "var(--c-white)" }}>
        <div className="text-center p-8 sm:p-10 rounded-3xl max-w-lg w-full border backdrop-blur-xl shadow-2xl" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}>
          <div className="mb-6 flex justify-center">
            <Kinetic3DLogo size="lg" showTagline={true} />
          </div>
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl" style={{ backgroundColor: "rgba(224, 254, 16, 0.12)", border: "1px solid rgba(224, 254, 16, 0.3)" }}>
            <Lock className="w-7 h-7 text-[var(--c-lime)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Tài Khoản & Cài Đặt
          </h1>
          <p className="text-xs sm:text-sm font-mono leading-relaxed mb-6" style={{ color: "var(--c-white-60)" }}>
            Vui lòng đăng nhập để xem thông tin tài khoản, quản lý đơn hàng chế tác 3D và bảo mật tài khoản của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => openAuthModal()}
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: "var(--c-lime)", color: "#000000", fontFamily: "var(--font-mono)" }}
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập ngay</span>
            </button>
            <Link
              href="/"
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center border transition-colors hover:bg-white/5 flex items-center justify-center"
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
    <div className="min-h-screen pt-24 pb-20 relative z-10" style={{ color: "var(--c-white)" }}>
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10 bg-[var(--c-lime-05)]" />

      <div className="max-w-[var(--container-max)] mx-auto px-6">
        {/* Page Header */}
        <div className="pb-8 border-b mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: "var(--c-white-10)" }}>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] block mb-2 font-mono text-[var(--c-lime)]">
              Quản Lý Tài Khoản
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Cài Đặt & Hồ Sơ Thành Viên
            </h1>
          </div>

          {/* Quick stats badge */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl border flex items-center gap-2" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
              <Coins className="w-4 h-4 text-[var(--c-orange)]" />
              <div className="text-xs font-mono">
                <span className="text-white/50 block text-[10px]">Số dư Credits:</span>
                <span className="font-bold text-white">{(user?.credits ?? 30).toLocaleString()}</span>
              </div>
            </div>
            {user?.role === "Admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[var(--c-lime)] text-black hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <span>Vào Trang Admin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Layout: Sidebar Tabs + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tabs Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === "profile"
                  ? "bg-[var(--c-lime)] text-black shadow-lg shadow-[var(--c-lime-20)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === "orders"
                  ? "bg-[var(--c-lime)] text-black shadow-lg shadow-[var(--c-lime-20)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Đơn hàng của tôi</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === "security"
                  ? "bg-[var(--c-lime)] text-black shadow-lg shadow-[var(--c-lime-20)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Bảo mật & Mật khẩu</span>
            </button>

            <button
              onClick={() => setActiveTab("credits")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === "credits"
                  ? "bg-[var(--c-lime)] text-black shadow-lg shadow-[var(--c-lime-20)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Coins className="w-4 h-4 shrink-0" />
              <span>Gói AI & Credits</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {/* TAB 1: PROFILE */}
            {activeTab === "profile" && (
              <div className="p-6 sm:p-8 rounded-2xl border space-y-6" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                <div>
                  <h2 className="text-lg font-bold mb-1">Hồ Sơ Thành Viên</h2>
                  <p className="text-xs font-mono text-white/50">Cập nhật họ tên hiển thị và ảnh đại diện trên Kinetic3D Studio.</p>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Cập nhật thông tin thành công!</span>
                  </div>
                )}

                {profileError && (
                  <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Preview */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[var(--c-lime-50)] bg-white/5 flex items-center justify-center shrink-0">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                      ) : (
                        <span className="text-2xl font-bold font-mono text-[var(--c-lime)]">{displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-mono block text-white/80 font-bold mb-1">Ảnh đại diện</span>
                      <span className="text-[11px] font-mono text-white/50 block mb-2">Hỗ trợ đường link ảnh trực tiếp (JPG, PNG, WebP)</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--c-lime-15)] text-[var(--c-lime)] border border-[var(--c-lime-30)]">
                        Vai trò: {user?.role || "Customer"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Họ và tên hiển thị *</label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        style={inputStyle}
                        placeholder="Ví dụ: Đỗ Phú Khương"
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Địa chỉ Email (Định danh)</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label style={labelStyle}>URL Ảnh Đại Diện</label>
                      <div className="relative">
                        <input
                          type="url"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          style={inputStyle}
                          placeholder="https://example.com/avatar.jpg"
                        />
                        <Camera className="w-4 h-4 text-white/40 absolute right-3.5 top-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-3 rounded-xl bg-[var(--c-lime)] text-black text-xs font-bold font-mono uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {profileSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Lưu Thay Đổi</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold mb-1">Đơn Hàng Chế Tác Của Bạn</h2>
                      <p className="text-xs font-mono text-white/50">Theo dõi trạng thái in 3D, thanh toán và lịch sử đơn hàng theo thời gian thực.</p>
                    </div>
                    <Link
                      href="/tracking"
                      className="px-4 py-2 rounded-xl text-xs font-mono border border-white/20 hover:bg-white/5 transition-colors flex items-center gap-2 w-fit"
                    >
                      <Truck className="w-3.5 h-3.5 text-[var(--c-lime)]" />
                      <span>Tra cứu mã khác</span>
                    </Link>
                  </div>
                </div>

                {loadingOrders && (
                  <div className="p-12 text-center border rounded-2xl" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[var(--c-lime)]" />
                    <span className="text-xs font-mono text-white/50">Đang tải lịch sử đơn hàng...</span>
                  </div>
                )}

                {ordersError && (
                  <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono">
                    {ordersError}
                  </div>
                )}

                {!loadingOrders && orders.length === 0 && !ordersError && (
                  <div className="p-12 text-center border rounded-2xl" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                    <Package className="w-12 h-12 mx-auto mb-3 text-white/20" />
                    <h3 className="text-base font-bold mb-1">Chưa có đơn hàng nào</h3>
                    <p className="text-xs font-mono text-white/50 mb-6">Bạn chưa tạo đơn hàng hoặc bản in custom 3D nào trên tài khoản này.</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--c-lime)] text-black text-xs font-bold font-mono uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      <span>Khám phá sản phẩm 3D →</span>
                    </Link>
                  </div>
                )}

                {!loadingOrders && orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl border transition-all hover:border-[var(--c-lime-30)]"
                    style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3" style={{ borderColor: "var(--c-white-10)" }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-sm text-[var(--c-lime)]">{order.orderNumber}</span>
                          <span className="text-[10px] text-white/40 font-mono">• {formatDate(order.createdAt)}</span>
                        </div>
                        <span className="text-xs text-white/60 font-mono">Giao tới: {order.shippingFullName} — {order.shippingCity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        <Link
                          href={`/tracking?code=${order.orderNumber}`}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Chi tiết tiến độ</span>
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="py-4 space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-mono">
                          <span className="text-white/80">
                            {item.productName || "Sản phẩm chế tác 3D"} <span className="text-white/40">× {item.quantity}</span>
                          </span>
                          <span className="font-bold">{fmtVND(item.unitPrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between font-mono" style={{ borderColor: "var(--c-white-05)" }}>
                      <span className="text-xs text-white/50">Tổng thanh toán:</span>
                      <span className="text-base font-bold text-[var(--c-orange)]">{fmtVND(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: SECURITY */}
            {activeTab === "security" && (
              <div className="p-6 sm:p-8 rounded-2xl border space-y-6" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                <div>
                  <h2 className="text-lg font-bold mb-1">Bảo Mật & Mật Khẩu</h2>
                  <p className="text-xs font-mono text-white/50">Đổi mật khẩu tài khoản để đảm bảo an toàn cho tài sản số và lịch sử file 3D.</p>
                </div>

                {pwdSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.</span>
                  </div>
                )}

                {pwdError && (
                  <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{pwdError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                  <div>
                    <label style={labelStyle}>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={inputStyle}
                      placeholder="Nhập mật khẩu đang dùng (bỏ trống nếu dùng Google Login)..."
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Mật khẩu mới *</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={inputStyle}
                      placeholder="Tối thiểu 6 ký tự..."
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Xác nhận mật khẩu mới *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={inputStyle}
                      placeholder="Nhập lại mật khẩu mới..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={pwdSaving || !newPassword || newPassword.length < 6}
                      className="px-6 py-3 rounded-xl bg-[var(--c-lime)] text-black text-xs font-bold font-mono uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {pwdSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      <span>Cập Nhật Mật Khẩu</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: CREDITS */}
            {activeTab === "credits" && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-2xl border" style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--c-orange)] font-bold block mb-1">
                        Điểm Chế Tác AI 3D
                      </span>
                      <h2 className="text-xl font-bold">Số Dư & Gói Nạp</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--c-orange-20)] text-[var(--c-orange)] flex items-center justify-center">
                          <Coins className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-white/50 block">Số dư hiện tại</span>
                          <span className="text-lg font-mono font-bold text-white">{(user?.credits ?? 30).toLocaleString()} <span className="text-xs text-[var(--c-lime)]">CR</span></span>
                        </div>
                      </div>

                      <button
                        onClick={() => openCreditModal()}
                        className="px-5 py-4 rounded-xl bg-[var(--c-lime)] text-black text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Nạp Thêm Credits</span>
                      </button>
                    </div>
                  </div>

                  {/* Credits Benefits info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: "var(--c-white-10)" }}>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/05 space-y-1 font-mono text-xs">
                      <span className="text-[var(--c-lime)] font-bold block">1. Tạo 3D từ Text/Prompt</span>
                      <span className="text-white/60 text-[11px] block">Tiêu thụ 10 Credits / lượt mô phỏng AI Tripo mesh 3D.</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/05 space-y-1 font-mono text-xs">
                      <span className="text-[var(--c-lime)] font-bold block">2. Chuyển ảnh 2D sang 3D</span>
                      <span className="text-white/60 text-[11px] block">Tiêu thụ 15 Credits / lượt chuyển hóa phác thảo CAD.</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/05 space-y-1 font-mono text-xs">
                      <span className="text-[var(--c-lime)] font-bold block">3. Thanh toán tự động VCB</span>
                      <span className="text-white/60 text-[11px] block">Quét mã VietQR Vietcombank, cộng điểm tức thì 24/7.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 text-center text-white/50 font-mono">Đang tải cài đặt...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
