"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  QrCode,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { ordersApi } from "@/lib/api";
import type { OrderDto } from "@/types/api";
import { Kinetic3DLogo } from "@/components/brand/Kinetic3DLogo";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDto | null>(null);

  const handleLookup = async (codeToSearch?: string) => {
    const query = (codeToSearch ?? searchQuery).trim();
    if (!query) {
      setError("Vui lòng nhập mã đơn hàng (KN3D-...) hoặc số điện thoại.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await ordersApi.lookup(query);
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError(err?.message || "Không tìm thấy thông tin đơn hàng. Vui lòng kiểm tra lại mã hoặc SĐT.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleLookup(initialCode);
    }
  }, [initialCode]);

  // Stepper timeline definition
  const getStepIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 0; // Đã tiếp nhận
      case "processing":
        return 1; // Đã thanh toán / Cắt lớp Slicer
      case "confirmed":
        return 2; // Đang in 3D & Xử lý bề mặt
      case "shipped":
        return 3; // Đang vận chuyển
      case "completed":
        return 4; // Hoàn thành
      default:
        return 0;
    }
  };

  const steps = [
    { title: "Tiếp Nhận Đơn Hàng", desc: "Hệ thống ghi nhận đơn và file CAD", icon: Clock },
    { title: "Xác Nhận & Lập Lịch", desc: "Xác nhận thanh toán & duyệt file CAD", icon: QrCode },
    { title: "Đang In 3D Đa Màu", desc: "Xưởng chạy máy in AMS & xử lý UV", icon: Printer },
    { title: "Đang Vận Chuyển", desc: "Đóng gói chống sốc & gửi bưu tá", icon: Truck },
    { title: "Đã Giao Thành Công", desc: "Khách hàng nhận & nghiệm thu mẫu in", icon: CheckCircle2 },
  ];

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isPaid = order?.status === "Processing" || 
                 order?.status === "Confirmed" || 
                 order?.status === "Shipped" || 
                 order?.status === "Completed";

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative z-10 transition-colors" style={{ color: "var(--c-white)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <Kinetic3DLogo size="md" showTagline={true} />
          </div>

          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border"
            style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)", color: "var(--c-lime)" }}
          >
            <ShieldCheck size={14} />
            <span>KINETIC3D LIVE TELEMETRY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Tra Cứu Tiến Độ In 3D & Đơn Hàng
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--c-white-60)" }}>
            Nhập mã đơn hàng <code className="text-amber-400 font-mono">KN3D-...</code>, số điện thoại hoặc email đặt hàng để theo dõi tiến trình sản xuất và vận chuyển thời gian thực.
          </p>
        </div>

        {/* Search Box */}
        <div 
          className="p-3 sm:p-4 rounded-2xl border shadow-xl mb-10 transition-colors"
          style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}
        >
          <form 
            onSubmit={(e) => { e.preventDefault(); handleLookup(); }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập mã đơn (KN3D-...), số điện thoại hoặc email đặt hàng..."
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl outline-none font-mono transition-all border"
                style={{
                  backgroundColor: "var(--c-bg-deep)",
                  borderColor: "var(--c-white-10)",
                  color: "var(--c-white)",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer shrink-0 disabled:opacity-50"
              style={{ backgroundColor: "var(--c-lime)", color: "var(--c-bg-deep)" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={16} />
                  <span>Tra cứu ngay</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--c-white-50)" }}>
            <span>Mẫu thử nghiệm nhanh:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("KN3D-20260904-4B7FA7");
                handleLookup("KN3D-20260904-4B7FA7");
              }}
              className="px-2.5 py-0.5 rounded border font-mono hover:text-amber-300 transition-colors"
              style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-15)" }}
            >
              KN3D-20260904-4B7FA7
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("0988888888");
                handleLookup("0988888888");
              }}
              className="px-2.5 py-0.5 rounded border font-mono hover:text-amber-300 transition-colors"
              style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-15)" }}
            >
              SĐT: 0988888888
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl mb-8 flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Không tìm thấy đơn hàng</p>
              <p className="text-xs text-red-300/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Order Details Result */}
        {order && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Status Header */}
            <div 
              className="p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--c-white-50)" }}>Mã đơn hàng:</span>
                  <span className="text-lg font-bold font-mono text-amber-400">{order.orderNumber}</span>
                </div>
                <p className="text-xs font-mono" style={{ color: "var(--c-white-50)" }}>
                  Khởi tạo lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isPaid ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    Đã xác nhận thanh toán
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                    <Clock size={14} />
                    Chờ thanh toán
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10" style={{ color: "var(--c-white)" }}>
                  Trạng thái: {order.status}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div 
              className="p-6 rounded-2xl border"
              style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color: "var(--c-lime)" }}>
                <Printer size={16} /> Tiến Trình Sản Xuất & Vận Chuyển
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-neutral-800 -z-0" />
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                  {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                            isDone 
                              ? "bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20" 
                              : "bg-neutral-900 text-neutral-500 border-neutral-800"
                          } ${isCurrent ? "ring-4 ring-emerald-500/30 scale-110" : ""}`}
                        >
                          <StepIcon size={18} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isDone ? "text-white" : "text-neutral-500"}`}>
                            {step.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items & Shipping Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product List */}
              <div 
                className="md:col-span-2 p-6 rounded-2xl border space-y-4"
                style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}
              >
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "var(--c-orange)" }}>
                  <Package size={16} /> Danh Sách Mẫu In 3D ({order.items?.length || 0})
                </h3>

                <div className="divide-y divide-white/5">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--c-white)" }}>{item.productName}</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: "var(--c-white-50)" }}>
                          Số lượng: {item.quantity} x {item.unitPrice.toLocaleString("vi-VN")}₫
                        </p>
                        {item.customText && (
                          <p className="text-xs text-amber-300 font-mono mt-0.5">Khắc chữ: &quot;{item.customText}&quot;</p>
                        )}
                      </div>
                      <span className="text-sm font-bold font-mono" style={{ color: "var(--c-white)" }}>
                        {(item.quantity * item.unitPrice).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs font-mono" style={{ color: "var(--c-white-70)" }}>
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{order.subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển bưu tá:</span>
                    <span>{order.shippingFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                    <span>Tổng đơn hàng:</span>
                    <span className="text-amber-400">{order.total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery Info */}
              <div 
                className="p-6 rounded-2xl border space-y-4"
                style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}
              >
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "var(--c-lime)" }}>
                  <Truck size={16} /> Địa Chỉ Giao Hàng
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-500 block">Người nhận:</span>
                    <span className="font-bold text-white text-sm">{order.shippingFullName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Số điện thoại:</span>
                    <span className="font-mono text-white">{order.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Địa chỉ nhận hàng:</span>
                    <span className="text-white leading-relaxed">{order.shippingAddress}, {order.shippingCity}</span>
                  </div>
                  {order.note && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-neutral-500 block">Ghi chú xưởng:</span>
                      <span className="text-amber-300 font-mono text-[11px]">{order.note}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    href="/custom"
                    className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border hover:bg-white/5 transition-colors"
                    style={{ borderColor: "var(--c-white-15)", color: "var(--c-white)" }}
                  >
                    <span>Vào 3D Studio Custom</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-white">Đang tải dữ liệu tra cứu...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
