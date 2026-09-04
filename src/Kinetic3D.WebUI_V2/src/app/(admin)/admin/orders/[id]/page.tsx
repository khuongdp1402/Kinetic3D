"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ordersApi, ApiError } from "@/lib/api";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { DesignerNotifyModal } from "@/components/admin/ui/DesignerNotifyModal";
import type { OrderDto } from "@/types/api";
import {
  ArrowLeft,
  Share2,
  Send,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Package,
  Check,
} from "lucide-react";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await ordersApi.getById(id);
        setOrder(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Không tải được đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdatingStatus(true);
    setShowStatusDropdown(false);
    try {
      const updated = await ordersApi.updateStatus(order.id, newStatus);
      setOrder(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Cập nhật trạng thái thất bại.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-orange-400 animate-pulse text-sm">
        Đang tải đơn hàng...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-400 text-sm">
          {error || "Không tìm thấy đơn hàng"}
        </div>
        <button
          onClick={() => router.push("/admin/orders")}
          className="text-sm text-neutral-400 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <>
      <DesignerNotifyModal
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        orderId={order.id}
        orderNumber={order.orderNumber}
        type="order"
      />

      <div className="space-y-6 max-w-4xl">
        {/* Back + actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Danh sách đơn hàng
          </Link>

          <div className="flex items-center gap-2">
            {/* Share */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600 text-sm transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              {copied ? "Đã copy!" : "Chia sẻ"}
            </button>

            {/* Notify designer */}
            <button
              onClick={() => setNotifyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-colors"
            >
              <Send size={14} />
              Gửi Designer
            </button>
          </div>
        </div>

        {/* Order header */}
        <div className="flex items-start justify-between flex-wrap gap-4 p-6 rounded-xl border border-neutral-800 bg-neutral-950">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-white">Đơn hàng #{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-neutral-500">
              Đặt ngày {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          {/* Status change dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              disabled={updatingStatus}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-sm text-white hover:border-neutral-600 transition-colors disabled:opacity-50"
            >
              {updatingStatus ? "Đang cập nhật..." : `Đổi trạng thái`}
              <ChevronDown size={14} />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-10 overflow-hidden">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-neutral-800 ${
                      s === order.status ? "text-orange-400 bg-orange-500/10" : "text-neutral-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shipping info */}
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Thông tin giao hàng
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Package size={13} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Người nhận</p>
                  <p className="text-sm text-white font-medium">{order.shippingFullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={13} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Địa chỉ</p>
                  <p className="text-sm text-white">
                    {order.shippingAddress}, {order.shippingCity}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={13} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Điện thoại</p>
                  <p className="text-sm text-white">{order.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={13} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Email</p>
                  <p className="text-sm text-white">{order.customerEmail}</p>
                </div>
              </div>
              {order.note && (
                <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                  <p className="text-xs text-neutral-500 mb-1">Ghi chú từ khách</p>
                  <p className="text-sm text-neutral-300">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Price summary */}
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Tóm tắt thanh toán</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Tạm tính</span>
                <span className="text-white">{order.subtotal.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Phí vận chuyển</span>
                <span className="text-white">{order.shippingFee.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="border-t border-neutral-800 pt-3 flex justify-between">
                <span className="text-white font-semibold">Tổng cộng</span>
                <span className="text-orange-400 text-lg font-bold">
                  {order.total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Sản phẩm trong đơn ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                  <Package size={16} className="text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{item.productName}</p>
                  {item.variantAttributesSnapshot && (
                    <p className="text-xs text-neutral-500 mt-0.5">{item.variantAttributesSnapshot}</p>
                  )}
                  {item.customText && (
                    <p className="text-xs text-orange-400 mt-0.5 italic">
                      Custom: {item.customText}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-neutral-300">x{item.quantity}</p>
                  <p className="text-sm text-orange-400 font-medium mt-0.5">
                    {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
