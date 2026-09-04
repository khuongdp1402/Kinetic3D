"use client";

import React, { useState, useEffect } from "react";
import { productsApi } from "@/lib/api";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { ProductDto } from "@/types/api";
import { Zap, Plus, X, Trash2 } from "lucide-react";

interface FlashSaleItem {
  id: string;
  productIds: string[];
  discountPercent: number;
  startTime: string;
  endTime: string;
  status: "Scheduled" | "Active" | "Ended";
}

export default function FlashSalesPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState(20);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [flashSales, setFlashSales] = useState<FlashSaleItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    productsApi.getAll().then(setProducts).catch(() => {});
  }, []);

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    setError("");
    if (selectedIds.length === 0) { setError("Vui lòng chọn ít nhất 1 sản phẩm."); return; }
    if (!startTime || !endTime) { setError("Vui lòng chọn thời gian bắt đầu và kết thúc."); return; }
    if (new Date(endTime) <= new Date(startTime)) { setError("Thời gian kết thúc phải sau bắt đầu."); return; }

    setSaving(true);
    setTimeout(() => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      const status: FlashSaleItem["status"] =
        now >= start && now <= end ? "Active" : now > end ? "Ended" : "Scheduled";

      const newSale: FlashSaleItem = {
        id: crypto.randomUUID(),
        productIds: selectedIds,
        discountPercent,
        startTime,
        endTime,
        status,
      };
      setFlashSales((prev) => [newSale, ...prev]);
      setSelectedIds([]);
      setDiscountPercent(20);
      setStartTime("");
      setEndTime("");
      setSaving(false);
    }, 600);
  };

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Zap size={22} className="text-orange-400" />
          Flash Sale
        </h1>
        <p className="text-neutral-500 text-sm mt-1">Tạo chương trình giảm giá theo thời gian</p>
      </div>

      {/* Create form */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Plus size={15} className="text-orange-400" /> Tạo Flash Sale mới
        </h2>

        {/* Product selection */}
        <div>
          <label className="text-sm font-medium text-neutral-300 block mb-3">
            Chọn sản phẩm tham gia
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {products.map((p) => {
              const selected = selectedIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProduct(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selected
                      ? "border-orange-500 bg-orange-500/10 text-white"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      selected ? "border-orange-500 bg-orange-500" : "border-neutral-600"
                    }`}
                  >
                    {selected && <X size={10} className="text-white rotate-45 hidden" />}
                    {selected && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.basePrice.toLocaleString("vi-VN")}₫</p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedProducts.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProducts.map((p) => (
                <span
                  key={p.id}
                  className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs px-2.5 py-1 rounded-full"
                >
                  {p.name}
                  <button onClick={() => toggleProduct(p.id)} className="hover:text-white">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Discount + time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
              Giảm giá (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={99}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">%</span>
            </div>
            <p className="text-xs text-orange-400 mt-1">Giảm {discountPercent}% giá gốc</p>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
              Bắt đầu
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
              Kết thúc
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
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
          <Zap size={14} />
          {saving ? "Đang tạo..." : "Kích hoạt Flash Sale"}
        </button>
      </div>

      {/* Flash sales list */}
      {flashSales.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Flash Sales đã tạo ({flashSales.length})
          </h2>
          <div className="space-y-3">
            {flashSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={sale.status} />
                    <span className="text-orange-400 font-bold text-sm">{sale.discountPercent}% OFF</span>
                    <span className="text-xs text-neutral-600">
                      {new Date(sale.startTime).toLocaleString("vi-VN")} →{" "}
                      {new Date(sale.endTime).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sale.productIds.map((pid) => {
                      const p = products.find((x) => x.id === pid);
                      return (
                        <span key={pid} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                          {p?.name ?? pid.slice(0, 8)}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setFlashSales((prev) => prev.filter((s) => s.id !== sale.id))}
                  className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

