"use client";

import React, { useState } from "react";
import { X, Copy, Check, Send, User } from "lucide-react";

interface DesignerNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  orderNumber?: string;
  requestId?: string;
  type?: "order" | "custom-request";
}

export function DesignerNotifyModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  requestId,
  type = "order",
}: DesignerNotifyModalProps) {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const shareLink =
    type === "order"
      ? `${window.location.origin}/admin/orders/${orderId}`
      : `${window.location.origin}/admin/custom-requests`;

  const title =
    type === "order"
      ? `Đơn hàng #${orderNumber}`
      : `Yêu cầu Custom #${requestId?.slice(0, 8)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-white font-bold text-lg">Gửi cho Designer</h3>
            <p className="text-neutral-400 text-sm mt-1">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Designer info mock */}
        <div className="flex items-center gap-3 p-3 bg-neutral-800 rounded-xl mb-5">
          <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <User size={16} className="text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Designer Team</p>
            <p className="text-xs text-neutral-500">designer@kinetic3d.io</p>
          </div>
        </div>

        {/* Share link */}
        <div className="mb-5">
          <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
            Link chia sẻ
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareLink}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-300 font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Notice */}
        <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
          * Tính năng gửi email tự động đang phát triển. Hiện tại hãy copy link và gửi thủ công cho designer qua Slack/Email.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600 text-sm transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handleSend}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {sent ? (
              <>
                <Check size={14} />
                Đã ghi nhận!
              </>
            ) : (
              <>
                <Send size={14} />
                Xác nhận gửi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
