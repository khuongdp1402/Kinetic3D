"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Zap,
  Ticket,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Bell,
  CloudDownload,
} from "lucide-react";
import { customRequestsApi, ordersApi } from "@/lib/api";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    customRequestsApi
      .getAll()
      .then((data) => {
        setPendingCount(data.filter((r) => r.status === "PendingReview").length);
      })
      .catch(() => {});
    ordersApi
      .getAll()
      .then((data) => {
        setPendingOrders(
          data.filter((o) => o.status === "Pending" || o.status === "Processing").length
        );
      })
      .catch(() => {});
  }, []);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Sản phẩm", href: "/admin/products", icon: <Package size={18} /> },
    { label: "Đồng bộ 3D", href: "/admin/sync", icon: <CloudDownload size={18} /> },
    { label: "Danh mục", href: "/admin/categories", icon: <Tags size={18} /> },
    {
      label: "Đơn hàng",
      href: "/admin/orders",
      icon: <ShoppingCart size={18} />,
      badge: pendingOrders > 0 ? pendingOrders : undefined,
    },
    { label: "Flash Sale", href: "/admin/flash-sales", icon: <Zap size={18} /> },
    { label: "Voucher", href: "/admin/vouchers", icon: <Ticket size={18} /> },
    {
      label: "Custom Requests",
      href: "/admin/custom-requests",
      icon: <Wand2 size={18} />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`relative flex flex-col bg-neutral-950 border-r border-neutral-800 transition-all duration-300 shrink-0 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-neutral-800 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
          <span className="text-white font-black text-xs">K3D</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-tight">
              KINETIC<span className="text-orange-400">3D</span>
            </p>
            <p className="text-neutral-500 text-[10px] tracking-widest uppercase">Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent"
              }`}
            >
              <span className={`shrink-0 ${active ? "text-orange-400" : ""}`}>{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {item.badge !== undefined && (
                <span
                  className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center bg-orange-500 text-white shrink-0 ${
                    collapsed ? "absolute -top-1 -right-1 min-w-0 w-4 h-4 text-[9px]" : "ml-auto"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Notification hint */}
      {!collapsed && (
        <div className="mx-2 mb-2 p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-start gap-2">
          <Bell size={14} className="text-orange-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            {pendingCount > 0
              ? `${pendingCount} yêu cầu custom đang chờ duyệt`
              : "Không có thông báo mới"}
          </p>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
