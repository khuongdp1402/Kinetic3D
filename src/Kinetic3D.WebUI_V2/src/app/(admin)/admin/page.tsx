"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { productsApi, categoriesApi, customRequestsApi, ordersApi } from "@/lib/api";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Package, Tags, ShoppingCart, Wand2, DollarSign, Clock } from "lucide-react";
import type { OrderDto, CustomRequestDto } from "@/types/api";

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderDto[]>([]);
  const [recentRequests, setRecentRequests] = useState<CustomRequestDto[]>([]);

  useEffect(() => {
    productsApi.getAll().then((d) => setProductCount(d.length)).catch(() => setProductCount(0));
    categoriesApi.getAll().then((d) => setCategoryCount(d.length)).catch(() => setCategoryCount(0));
    customRequestsApi
      .getAll()
      .then((d) => {
        setPendingCount(d.filter((r) => r.status === "PendingReview").length);
        setRecentRequests(d.slice(0, 4));
      })
      .catch(() => { setPendingCount(0); });
    ordersApi
      .getAll()
      .then((d) => {
        setOrderCount(d.length);
        setRevenue(d.reduce((sum, o) => sum + o.total, 0));
        setRecentOrders(d.slice(0, 5));
      })
      .catch(() => { setOrderCount(0); setRevenue(0); });
  }, []);

  const fmtVnd = (n: number | null) =>
    n == null ? "…" : n.toLocaleString("vi-VN") + "₫";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Tổng quan hệ thống Kinetic3D</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Sản phẩm" value={productCount} icon={Package} href="/admin/products" color="orange" />
        <StatCard label="Danh mục" value={categoryCount} icon={Tags} href="/admin/categories" color="cyan" />
        <StatCard label="Đơn hàng" value={orderCount} icon={ShoppingCart} href="/admin/orders" color="emerald" />
        <StatCard
          label="Custom chờ duyệt"
          value={pendingCount}
          icon={Wand2}
          href="/admin/custom-requests"
          highlight={(pendingCount ?? 0) > 0}
          color="amber"
        />
      </div>

      {/* Revenue card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-orange-400" />
            <span className="text-sm text-neutral-400 font-medium">Tổng doanh thu</span>
          </div>
          <p className="text-3xl font-bold text-white">{fmtVnd(revenue)}</p>
          <p className="text-xs text-neutral-600 mt-1">Tính từ tất cả đơn hàng</p>
        </div>
        <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-cyan-400" />
            <span className="text-sm text-neutral-400 font-medium">Cần xử lý</span>
          </div>
          <p className="text-3xl font-bold text-white">{pendingCount ?? "…"}</p>
          <p className="text-xs text-neutral-600 mt-1">Yêu cầu custom đang chờ báo giá</p>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Đơn hàng gần đây</h2>
          <Link href="/admin/orders" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
            Xem tất cả →
          </Link>
        </div>
        <div className="border border-neutral-800 rounded-xl overflow-hidden">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">Chưa có đơn hàng nào</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950">
                  <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Mã đơn</th>
                  <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Khách hàng</th>
                  <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Tổng</th>
                  <th className="text-left px-4 py-3 text-xs text-neutral-500 font-semibold uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-900/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-300">#{o.orderNumber}</td>
                    <td className="px-4 py-3 text-neutral-300">{o.shippingFullName}</td>
                    <td className="px-4 py-3 text-orange-400 font-medium">{o.total.toLocaleString("vi-VN")}₫</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/orders/${o.id}`} className="text-xs text-neutral-500 hover:text-white transition-colors">
                        Chi tiết →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent custom requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Yêu cầu Custom mới nhất</h2>
          <Link href="/admin/custom-requests" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentRequests.length === 0 ? (
            <p className="text-sm text-neutral-500 col-span-2">Chưa có yêu cầu nào</p>
          ) : (
            recentRequests.map((req) => (
              <div key={req.id} className="flex gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-neutral-700 transition-colors">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {req.referenceImageUrl && <img src={req.referenceImageUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={req.status} />
                    <span className="text-[10px] text-neutral-600">{new Date(req.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">{req.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

