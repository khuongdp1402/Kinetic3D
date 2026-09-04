"use client";

import React, { useState } from "react";
import { Ticket, Plus, Trash2, Copy, Check, Clock, ToggleLeft, ToggleRight } from "lucide-react";

interface Voucher {
  id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresAt, setExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setCode(`K3D-${rand}`);
  };

  const handleCreate = () => {
    setError("");
    if (!code.trim()) { setError("Vui lòng nhập hoặc tạo mã voucher."); return; }
    if (discountValue <= 0) { setError("Giá trị giảm phải lớn hơn 0."); return; }
    if (discountType === "percent" && discountValue > 100) { setError("Giảm % không thể vượt 100%."); return; }
    if (!expiresAt) { setError("Vui lòng chọn ngày hết hạn."); return; }
    if (vouchers.some((v) => v.code.toLowerCase() === code.toLowerCase())) {
      setError("Mã voucher đã tồn tại."); return;
    }

    setSaving(true);
    setTimeout(() => {
      const newVoucher: Voucher = {
        id: crypto.randomUUID(),
        code: code.trim().toUpperCase(),
        discountType,
        discountValue,
        minOrderValue,
        maxUses,
        usedCount: 0,
        expiresAt,
        isActive: true,
      };
      setVouchers((prev) => [newVoucher, ...prev]);
      setCode("");
      setDiscountValue(10);
      setMinOrderValue(0);
      setMaxUses(100);
      setExpiresAt("");
      setSaving(false);
    }, 500);
  };

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleActive = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  const deleteVoucher = (id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  const getVoucherStatus = (v: Voucher): "valid" | "expired" => {
    if (!v.isActive) return "expired";
    if (new Date(v.expiresAt) < new Date()) return "expired";
    return "valid";
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Ticket size={22} className="text-orange-400" />
            Voucher & Mã giảm giá
          </h1>
          <span className="text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-1 rounded-full uppercase tracking-wider">
            UI Preview — Backend đang phát triển
          </span>
        </div>
        <p className="text-neutral-500 text-sm">
          Tạo và quản lý mã giảm giá. Tính năng áp mã khi checkout sẽ được kích hoạt sau khi backend API sẵn sàng.
        </p>
      </div>

      {/* Create form */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950 space-y-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Plus size={15} className="text-orange-400" />
          Tạo mã voucher mới
        </h2>

        {/* Code input */}
        <div>
          <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">Mã voucher</label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VD: K3D-SUMMER20"
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-neutral-600"
            />
            <button
              type="button"
              onClick={generateCode}
              className="px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600 text-sm transition-colors whitespace-nowrap"
            >
              Tạo ngẫu nhiên
            </button>
          </div>
        </div>

        {/* Discount type + value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">Loại giảm giá</label>
            <div className="flex rounded-xl border border-neutral-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setDiscountType("percent")}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  discountType === "percent"
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                % Phần trăm
              </button>
              <button
                type="button"
                onClick={() => setDiscountType("fixed")}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  discountType === "fixed"
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                ₫ Cố định
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
              Giá trị giảm {discountType === "percent" ? "(%)" : "(₫)"}
            </label>
            <input
              type="number"
              min={1}
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
              Đơn tối thiểu (₫)
            </label>
            <input
              type="number"
              min={0}
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(Number(e.target.value))}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
              Số lần dùng tối đa
            </label>
            <input
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">Ngày hết hạn</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold text-sm transition-colors flex items-center gap-2"
        >
          <Ticket size={14} />
          {saving ? "Đang tạo..." : "Tạo Voucher"}
        </button>
      </div>

      {/* Voucher list */}
      {vouchers.length > 0 ? (
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Danh sách voucher ({vouchers.length})
          </h2>
          <div className="space-y-3">
            {vouchers.map((v) => {
              const status = getVoucherStatus(v);
              const usagePercent = Math.min((v.usedCount / v.maxUses) * 100, 100);
              return (
                <div
                  key={v.id}
                  className={`p-5 rounded-xl border transition-all ${
                    status === "valid"
                      ? "border-neutral-800 bg-neutral-950"
                      : "border-neutral-800 bg-neutral-900/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      {/* Code + copy */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-lg font-bold text-white tracking-wider">{v.code}</span>
                        <button
                          onClick={() => handleCopy(v.code, v.id)}
                          className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
                        >
                          {copiedId === v.id ? (
                            <Check size={13} className="text-emerald-400" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            status === "valid"
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                              : "bg-neutral-700/40 border-neutral-600 text-neutral-400"
                          }`}
                        >
                          {status === "valid" ? "Còn hiệu lực" : "Hết hạn / Tắt"}
                        </span>
                      </div>

                      {/* Info row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        <span className="text-orange-400 font-semibold">
                          {v.discountType === "percent"
                            ? `Giảm ${v.discountValue}%`
                            : `Giảm ${v.discountValue.toLocaleString("vi-VN")}₫`}
                        </span>
                        {v.minOrderValue > 0 && (
                          <span>Đơn tối thiểu: {v.minOrderValue.toLocaleString("vi-VN")}₫</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          HSD: {new Date(v.expiresAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      {/* Usage bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[10px] text-neutral-600">
                          <span>Đã dùng: {v.usedCount}/{v.maxUses}</span>
                          <span>{Math.round(usagePercent)}%</span>
                        </div>
                        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all"
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleActive(v.id)}
                        className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
                        title={v.isActive ? "Tắt voucher" : "Bật voucher"}
                      >
                        {v.isActive ? (
                          <ToggleRight size={20} className="text-emerald-400" />
                        ) : (
                          <ToggleLeft size={20} className="text-neutral-600" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteVoucher(v.id)}
                        className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 border border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center text-center">
          <Ticket size={36} className="text-neutral-700 mb-3" />
          <p className="text-neutral-500 text-sm">Chưa có voucher nào. Tạo voucher đầu tiên ở trên!</p>
        </div>
      )}
    </div>
  );
}
