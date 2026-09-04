"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ordersApi, ApiError } from "@/lib/api";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { OrderDto } from "@/types/api";
import { Search, RefreshCw, ShoppingCart } from "lucide-react";

const STATUS_FILTERS = ["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tải được danh sách đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.shippingFullName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Đơn hàng</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {orders.length} đơn hàng{pendingCount > 0 && ` — ${pendingCount} đang chờ xử lý`}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600 text-sm transition-colors"
        >
          <RefreshCw size={14} />
          Làm mới
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã, email, tên..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                filter === f
                  ? "border-orange-500 text-orange-400 bg-orange-500/10"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white"
              }`}
            >
              {f === "all" ? "Tất cả" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-400 text-sm flex items-center justify-between">
          {error}
          <button onClick={fetchOrders} className="underline text-xs hover:text-red-300">
            Thử lại
          </button>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="p-16 text-center text-orange-400 animate-pulse text-sm">Đang tải đơn hàng...</div>
      ) : filtered.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center text-center border border-neutral-800 rounded-xl">
          <ShoppingCart size={40} className="text-neutral-700 mb-3" />
          <p className="text-neutral-500 text-sm">Không có đơn hàng nào phù hợp</p>
        </div>
      ) : (
        <div className="border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950">
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Mã đơn</th>
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Khách hàng</th>
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Tổng tiền</th>
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider hidden lg:table-cell">Ngày đặt</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-neutral-800 last:border-0 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-neutral-300 bg-neutral-800 px-2 py-1 rounded">
                      #{o.orderNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-300 font-medium">{o.shippingFullName}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs hidden md:table-cell">{o.customerEmail}</td>
                  <td className="px-4 py-3 text-orange-400 font-semibold">
                    {o.total.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs hidden lg:table-cell">
                    {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-xs text-neutral-500 hover:text-orange-400 transition-colors font-medium"
                    >
                      Chi tiết →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
