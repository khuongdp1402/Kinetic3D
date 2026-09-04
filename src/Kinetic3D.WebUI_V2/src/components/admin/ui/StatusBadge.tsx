"use client";

import React from "react";

const STATUS_CONFIG: Record<
  string,
  { label: string; classes: string }
> = {
  // Orders
  Pending: { label: "Chờ xử lý", classes: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  Processing: { label: "Đang xử lý", classes: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  Shipped: { label: "Đã giao", classes: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  Delivered: { label: "Hoàn thành", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  Cancelled: { label: "Đã hủy", classes: "bg-red-500/15 text-red-400 border-red-500/30" },
  // Custom Requests
  PendingReview: { label: "Chờ duyệt", classes: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  Quoted: { label: "Đã báo giá", classes: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  Confirmed: { label: "Đã xác nhận", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  Rejected: { label: "Đã từ chối", classes: "bg-red-500/15 text-red-400 border-red-500/30" },
  // Flash sale
  Active: { label: "Đang chạy", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  Scheduled: { label: "Lên lịch", classes: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  Ended: { label: "Đã kết thúc", classes: "bg-neutral-700/40 text-neutral-400 border-neutral-600" },
  // Voucher
  valid: { label: "Còn hiệu lực", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  expired: { label: "Hết hạn", classes: "bg-neutral-700/40 text-neutral-400 border-neutral-600" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    classes: "bg-neutral-700/40 text-neutral-400 border-neutral-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border tracking-wider uppercase ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
}
