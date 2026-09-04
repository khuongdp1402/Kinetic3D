"use client";

import { useEffect, useState } from "react";
import { customRequestsApi, ApiError } from "@/lib/api";
import type { CustomRequestDto } from "@/types/api";

type StatusFilter = "all" | "PendingReview" | "Quoted" | "Confirmed" | "Rejected";

const STATUS_LABEL: Record<Exclude<StatusFilter, "all">, string> = {
  PendingReview: "Chờ duyệt",
  Quoted: "Đã báo giá",
  Confirmed: "Đã xác nhận sản xuất",
  Rejected: "Đã từ chối",
};

const STATUS_COLOR: Record<Exclude<StatusFilter, "all">, string> = {
  PendingReview: "bg-amber-950/40 text-amber-400 border-amber-700",
  Quoted: "bg-cyan-950/40 text-cyan-400 border-cyan-700",
  Confirmed: "bg-emerald-950/40 text-emerald-400 border-emerald-700",
  Rejected: "bg-red-950/40 text-red-400 border-red-700",
};

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<CustomRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await customRequestsApi.getAll();
      setRequests(data);
    } catch (err) {
      console.error("Không tải được yêu cầu custom:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const handleQuote = async (id: string) => {
    const price = Number(priceDrafts[id]);
    if (!price || price <= 0) {
      setActionError("Vui lòng nhập giá hợp lệ.");
      return;
    }
    setBusyId(id);
    setActionError("");
    try {
      await customRequestsApi.quote(id, price, noteDrafts[id]);
      await fetchRequests();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Gửi báo giá thất bại.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: string) => {
    setBusyId(id);
    setActionError("");
    try {
      await customRequestsApi.reject(id, noteDrafts[id] || "Không khả thi để sản xuất");
      await fetchRequests();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Từ chối yêu cầu thất bại.");
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirm = async (id: string) => {
    setBusyId(id);
    setActionError("");
    try {
      await customRequestsApi.confirm(id);
      await fetchRequests();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Xác nhận thất bại.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Yêu cầu Custom (AI Phác thảo)</h1>
      <p className="text-neutral-400 mb-6">
        Duyệt ảnh + mô tả khách gửi từ trang Custom, báo giá hoặc từ chối trước khi đưa vào sản xuất.
      </p>

      <div className="flex gap-2 mb-6">
        {(["all", "PendingReview", "Quoted", "Confirmed", "Rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-bold rounded border transition-colors ${
              filter === f ? "border-cyan-500 text-cyan-400 bg-cyan-950/30" : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
            }`}
          >
            {f === "all" ? "Tất cả" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="mb-4 p-3 rounded border border-red-800 bg-red-950/40 text-red-400 text-sm">{actionError}</div>
      )}

      {isLoading ? (
        <div className="p-12 text-center rounded-lg border border-neutral-800 bg-neutral-950 text-cyan-500 animate-pulse">
          Đang tải yêu cầu...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-500">
          Không có yêu cầu nào.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((req) => (
            <div key={req.id} className="p-6 rounded-lg border border-neutral-800 bg-neutral-950 flex flex-col md:flex-row gap-6">
              {/* Images */}
              <div className="flex gap-3 shrink-0">
                <div className="w-28 h-28 rounded overflow-hidden bg-neutral-900 border border-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={req.referenceImageUrl} alt="Ảnh gốc" className="w-full h-full object-cover" />
                </div>
                {req.sketchImageUrl && (
                  <div className="w-28 h-28 rounded overflow-hidden bg-neutral-900 border border-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={req.sketchImageUrl} alt="Phác thảo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-mono text-sm text-neutral-300">{req.id}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${STATUS_COLOR[req.status as Exclude<StatusFilter, "all">]}`}>
                    {STATUS_LABEL[req.status as Exclude<StatusFilter, "all">]}
                  </span>
                  <span className="text-xs text-neutral-500">{new Date(req.createdAt).toLocaleString("vi-VN")}</span>
                  {req.customerEmail && <span className="text-xs text-neutral-500">{req.customerEmail}</span>}
                </div>
                <p className="text-sm text-neutral-300 mb-4">{req.description}</p>

                {req.status === "PendingReview" && (
                  <div className="flex flex-wrap gap-3 items-end">
                    <div>
                      <label className="text-[10px] uppercase text-neutral-500 block mb-1">Báo giá (VNĐ)</label>
                      <input
                        type="number"
                        value={priceDrafts[req.id] ?? ""}
                        onChange={(e) => setPriceDrafts({ ...priceDrafts, [req.id]: e.target.value })}
                        placeholder="VD: 890000"
                        className="w-40 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[10px] uppercase text-neutral-500 block mb-1">Ghi chú (tuỳ chọn)</label>
                      <input
                        type="text"
                        value={noteDrafts[req.id] ?? ""}
                        onChange={(e) => setNoteDrafts({ ...noteDrafts, [req.id]: e.target.value })}
                        placeholder="Ghi chú cho khách hàng..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <button
                      onClick={() => handleQuote(req.id)}
                      disabled={busyId === req.id}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs rounded transition-colors"
                    >
                      {busyId === req.id ? "Đang gửi..." : "Gửi báo giá"}
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={busyId === req.id}
                      className="px-4 py-2 border border-red-700 text-red-400 hover:bg-red-950/40 disabled:opacity-50 font-bold text-xs rounded transition-colors"
                    >
                      Từ chối
                    </button>
                  </div>
                )}

                {req.status === "Quoted" && (
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm">
                      Đã báo giá: <strong className="text-cyan-400">{req.quotedPrice?.toLocaleString("vi-VN")}₫</strong>
                    </span>
                    {req.adminNote && <span className="text-xs text-neutral-500">Ghi chú: {req.adminNote}</span>}
                    <span className="text-xs text-neutral-500 italic">Đang chờ khách hàng xác nhận</span>
                    <button
                      onClick={() => handleConfirm(req.id)}
                      disabled={busyId === req.id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors"
                      title="Dùng khi khách đã xác nhận qua kênh khác (demo, chưa có cổng xác nhận cho khách)"
                    >
                      Đánh dấu khách đã xác nhận
                    </button>
                  </div>
                )}

                {req.status === "Confirmed" && (
                  <div className="text-sm text-emerald-400">
                    Đã xác nhận sản xuất — giá {req.quotedPrice?.toLocaleString("vi-VN")}₫
                  </div>
                )}

                {req.status === "Rejected" && req.adminNote && (
                  <div className="text-sm text-red-400">Lý do từ chối: {req.adminNote}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
