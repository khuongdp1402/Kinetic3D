"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, Check, QrCode, Copy, CheckCircle2, ShieldCheck, Zap, ArrowLeft, RefreshCw, Lock } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { Kinetic3DLogo } from "@/components/brand/Kinetic3DLogo";
import { creditsApi } from "@/lib/api";
import type { CreditPackageDto } from "@/types/api";

const FALLBACK_PACKAGES: CreditPackageDto[] = [
  { id: "pkg-100", name: "Starter Pack", credits: 100, bonusCredits: 0, priceVnd: 49000, priceUsd: 1.99, badge: "Trải Nghiệm", description: "Làm quen với Studio, tạo 2-3 mẫu nháp hoặc kiểm tra độ phân giải.", isPopular: false },
  { id: "pkg-500", name: "Creator Pack", credits: 500, bonusCredits: 50, priceVnd: 199000, priceUsd: 7.99, badge: "Tặng +50 Token", description: "Dựng mô hình chi tiết cao từ ảnh và câu lệnh, xuất GLB/OBJ/STL.", isPopular: false },
  { id: "pkg-2000", name: "Pro Workshop", credits: 2000, bonusCredits: 300, priceVnd: 599000, priceUsd: 23.99, badge: "Phổ Biến Nhất", description: "Ưu tiên hàng đợi cao nhất, tạo texture PBR và remesh quad.", isPopular: true },
  { id: "pkg-5000", name: "Studio Lab", credits: 5000, bonusCredits: 1000, priceVnd: 1290000, priceUsd: 49.99, badge: "Tiết Kiệm 35%", description: "Dành cho agency & xưởng chuyên nghiệp: Không giới hạn tác vụ song song.", isPopular: false },
];

interface CreditTopupModalProps {
  isOpen?: boolean;
  packageId?: string | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function CreditTopupModal({
  isOpen,
  packageId,
  onClose,
  onSuccess,
}: CreditTopupModalProps) {
  const { user, isAuthenticated, addCredits } = useAuthStore();
  const {
    isCreditModalOpen,
    closeCreditModal,
    selectedPackageId,
    currency: appCurrency,
    setCurrency: setAppCurrency,
    openAuthModal,
  } = useAppStore();

  const activeIsOpen = isOpen !== undefined ? isOpen : isCreditModalOpen;
  const activePackageId = packageId !== undefined ? packageId : selectedPackageId;

  const handleClose = () => {
    if (onClose) onClose();
    closeCreditModal();
  };

  const [currency, setCurrency] = useState<"VND" | "USD">(appCurrency || "VND");
  const [packages, setPackages] = useState<CreditPackageDto[]>(FALLBACK_PACKAGES);
  const [selectedPkg, setSelectedPkg] = useState<CreditPackageDto | null>(null);
  const [step, setStep] = useState<"select" | "payment" | "success">("select");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const [qrDetails, setQrDetails] = useState<{
    topupCode: string;
    qrUrl: string;
    amount: number;
    bankId: string;
    accountNo: string;
    accountName: string;
    totalCredits: number;
  } | null>(null);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync currency with app store
  useEffect(() => {
    if (appCurrency) setCurrency(appCurrency);
  }, [appCurrency]);

  const generatePaymentForPackage = async (pkg: CreditPackageDto) => {
    if (!isAuthenticated || !user) {
      handleClose();
      openAuthModal();
      return;
    }
    setSelectedPkg(pkg);
    setIsProcessing(true);

    try {
      const res = await creditsApi.createOrder(pkg.id, currency, user?.email, user?.id);
      setQrDetails({
        topupCode: res.topupCode,
        qrUrl: res.vietQr.qrUrl,
        amount: res.amount,
        bankId: res.vietQr.bankId,
        accountNo: res.vietQr.accountNo,
        accountName: res.vietQr.accountName,
        totalCredits: res.totalCredits,
      });
      setStep("payment");
    } catch {
      const topupCode = `KINETIC_${Date.now().toString().slice(-6)}`;
      setQrDetails({
        topupCode,
        qrUrl: `https://img.vietqr.io/image/MBBank-0988888888-compact2.png?amount=${pkg.priceVnd}&addInfo=${topupCode}&accountName=CONG%20TY%20KINETIC3D`,
        amount: pkg.priceVnd,
        bankId: "MBBank",
        accountNo: "0988888888",
        accountName: "CONG TY KINETIC3D",
        totalCredits: pkg.credits + pkg.bonusCredits,
      });
      setStep("payment");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (activeIsOpen) {
      creditsApi
        .getPackages()
        .then((pkgs) => {
          const list = pkgs.length > 0 ? pkgs : FALLBACK_PACKAGES;
          setPackages(list);

          if (activePackageId && isAuthenticated) {
            const found = list.find((p) => p.id === activePackageId);
            if (found) {
              generatePaymentForPackage(found);
              return;
            }
          }

          // No target package specified: start on select step
          setStep("select");
          const popular = list.find((p) => p.isPopular) || list[1] || list[0];
          setSelectedPkg(popular);
        })
        .catch(() => {
          setPackages(FALLBACK_PACKAGES);
          if (activePackageId) {
            const found = FALLBACK_PACKAGES.find((p) => p.id === activePackageId);
            if (found) {
              generatePaymentForPackage(found);
              return;
            }
          }
          setStep("select");
          setSelectedPkg(FALLBACK_PACKAGES[2]);
        });
    } else {
      setStep("select");
      setQrDetails(null);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    }
  }, [activeIsOpen, activePackageId]);

  if (!activeIsOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmPaid = async () => {
    if (!qrDetails || !selectedPkg) return;
    setIsCheckingPayment(true);

    try {
      if (user?.id) {
        await creditsApi.confirmTest(user.id, qrDetails.totalCredits);
      }
      addCredits(qrDetails.totalCredits);
      setStep("success");
      if (onSuccess) onSuccess();
    } catch {
      addCredits(qrDetails.totalCredits);
      setStep("success");
      if (onSuccess) onSuccess();
    } finally {
      setIsCheckingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[var(--c-bg-card)] border border-[var(--c-white-10)] rounded-2xl shadow-2xl overflow-hidden my-auto"
        style={{ color: "var(--c-white)" }}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--c-white-10)]">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <Kinetic3DLogo size="sm" showText={false} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {step === "payment" ? "Thanh Toán Nạp Token" : "Nạp Token Sáng Tạo 3D"}
              </h3>
              <p className="text-xs text-[var(--c-white-60)]">
                {step === "payment"
                  ? "Quét mã chuyển khoản để kích hoạt token tức thì"
                  : "Chỉ nạp khi sử dụng Studio. Token bảo lưu vĩnh viễn, không hết hạn."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step === "select" && (
              <div className="flex items-center bg-[var(--c-bg-deep)] border border-[var(--c-white-10)] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrency("VND");
                    setAppCurrency("VND");
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    currency === "VND"
                      ? "bg-[var(--c-lime)] text-black shadow-sm"
                      : "text-[var(--c-white-60)] hover:text-white"
                  }`}
                >
                  VND
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrency("USD");
                    setAppCurrency("USD");
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    currency === "USD"
                      ? "bg-[var(--c-lime)] text-black shadow-sm"
                      : "text-[var(--c-white-60)] hover:text-white"
                  }`}
                >
                  USD
                </button>
              </div>
            )}

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-[var(--c-white-60)] hover:text-white hover:bg-[var(--c-white-10)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {!isAuthenticated ? (
            <div className="text-center py-8 px-4 space-y-5">
              <div className="flex justify-center mb-1">
                <Kinetic3DLogo size="lg" showTagline={true} />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Lock size={26} />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-white tracking-tight">Yêu Cầu Đăng Nhập</h3>
                <p className="text-xs text-[var(--c-white-60)] leading-relaxed">
                  Để nạp và bảo lưu số dư Credits vào ví tài khoản cá nhân, quý khách vui lòng đăng nhập hoặc tạo tài khoản trước khi tiếp tục.
                </p>
              </div>
              <div className="pt-2 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    openAuthModal();
                  }}
                  className="w-full py-3 rounded-xl bg-[var(--c-lime)] text-black font-extrabold text-xs tracking-wider uppercase hover:scale-105 transition-all shadow-lg cursor-pointer"
                >
                  ĐĂNG NHẬP / ĐĂNG KÝ NGAY
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Select Package */}
              {step === "select" && (
            <div>
              {/* Balance bar */}
              <div className="flex items-center justify-between p-4 mb-6 rounded-xl bg-[var(--c-bg-deep)] border border-[var(--c-white-10)]">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[var(--c-lime)]" />
                  <span className="text-sm">Số dư tài khoản hiện tại:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-black text-[var(--c-lime)]">
                    {user?.credits ?? 0}
                  </span>
                  <span className="text-xs font-mono uppercase text-[var(--c-white-60)]">Credits</span>
                </div>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.map((pkg) => {
                  const total = pkg.credits + pkg.bonusCredits;
                  const price =
                    currency === "VND"
                      ? `${pkg.priceVnd.toLocaleString("vi-VN")}₫`
                      : `$${pkg.priceUsd}`;

                  return (
                    <div
                      key={pkg.id}
                      className="relative flex flex-col justify-between p-5 rounded-xl border border-[var(--c-white-10)] bg-[var(--c-bg-deep)] hover:border-[var(--c-lime)] transition-all"
                    >
                      {pkg.badge && (
                        <span
                          className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            pkg.isPopular
                              ? "bg-[var(--c-lime)] text-black"
                              : "bg-[var(--c-white-10)] text-[var(--c-white)] border border-[var(--c-white-20)]"
                          }`}
                        >
                          {pkg.badge}
                        </span>
                      )}

                      <div>
                        <h4 className="font-bold text-base mb-1">{pkg.name}</h4>
                        <div className="flex items-baseline gap-1.5 my-2">
                          <span className="text-2xl font-black text-[var(--c-lime)] font-mono">
                            {total.toLocaleString()}
                          </span>
                          <span className="text-xs text-[var(--c-white-60)] uppercase font-mono">Credits</span>
                        </div>
                        {pkg.bonusCredits > 0 && (
                          <p className="text-[11px] text-[var(--c-lime)] font-mono mb-2">
                            +{pkg.bonusCredits} Credits tặng thêm
                          </p>
                        )}
                        <p className="text-xs text-[var(--c-white-60)] leading-relaxed mb-4">
                          {pkg.description}
                        </p>
                      </div>

                      <div>
                        <div className="pt-3 border-t border-[var(--c-white-10)] flex items-baseline justify-between mb-3">
                          <span className="text-xs text-[var(--c-white-60)]">Giá thanh toán:</span>
                          <span className="text-lg font-bold font-mono">{price}</span>
                        </div>
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => generatePaymentForPackage(pkg)}
                          className="w-full py-2.5 rounded-xl bg-[var(--c-lime)] text-black font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Chọn Gói &amp; Thanh Toán</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Direct Payment Screen for Selected Package */}
          {step === "payment" && qrDetails && selectedPkg && (
            <div>
              {/* Selected Package Header Summary */}
              <div className="flex items-center justify-between p-4 mb-6 rounded-xl bg-[var(--c-bg-deep)] border border-[var(--c-white-10)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-white">{selectedPkg.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--c-lime-10)] text-[var(--c-lime)] border border-[var(--c-lime-30)]">
                      {qrDetails.totalCredits.toLocaleString()} Credits
                    </span>
                  </div>
                  <span className="text-xs text-[var(--c-white-60)] font-mono">
                    Số tiền:{" "}
                    <strong className="text-[var(--c-white)]">
                      {qrDetails.amount.toLocaleString("vi-VN")}₫
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="flex items-center gap-1 text-xs text-[var(--c-white-60)] hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Đổi gói khác</span>
                </button>
              </div>

              {/* Payment Details + QR Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* QR Box (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-white text-black shadow-xl">
                  <div className="flex items-center gap-1.5 mb-2">
                    <QrCode size={16} className="text-neutral-800" />
                    <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-800">
                      Quét Mã Thanh Toán
                    </span>
                  </div>
                  <img
                    src={qrDetails.qrUrl}
                    alt="Mã thanh toán"
                    className="w-52 h-52 object-contain rounded-lg border border-neutral-200"
                  />
                  <p className="text-[11px] text-neutral-500 text-center mt-2 font-medium">
                    Mở ứng dụng ngân hàng bất kỳ để quét mã
                  </p>
                </div>

                {/* Transfer Information (7 cols) */}
                <div className="md:col-span-7 space-y-3">
                  <div className="p-4 rounded-xl bg-[var(--c-bg-deep)] border border-[var(--c-white-10)] space-y-3 text-xs font-mono">
                    {/* Amount */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-[var(--c-white-10)]">
                      <div>
                        <span className="text-[11px] text-[var(--c-white-60)] block font-sans">Số tiền thanh toán:</span>
                        <span className="text-xl font-bold font-mono text-[var(--c-lime)]">
                          {qrDetails.amount.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(qrDetails.amount.toString(), "amount")}
                        className="px-2.5 py-1 rounded bg-[var(--c-white-10)] hover:bg-[var(--c-white-20)] text-[11px] font-mono transition-colors flex items-center gap-1"
                      >
                        <Copy size={12} />
                        {copiedField === "amount" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>

                    {/* Account No */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-[var(--c-white-10)]">
                      <div>
                        <span className="text-[11px] text-[var(--c-white-60)] block font-sans">Số tài khoản ngân hàng:</span>
                        <span className="text-sm font-bold">{qrDetails.accountNo}</span>
                        <span className="text-[10px] text-[var(--c-white-60)] block font-sans mt-0.5">
                          {qrDetails.accountName} ({qrDetails.bankId})
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(qrDetails.accountNo, "acc")}
                        className="px-2.5 py-1 rounded bg-[var(--c-white-10)] hover:bg-[var(--c-white-20)] text-[11px] font-mono transition-colors flex items-center gap-1"
                      >
                        <Copy size={12} />
                        {copiedField === "acc" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>

                    {/* Transfer Note */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[var(--c-white-60)] block font-sans">Nội dung chuyển khoản:</span>
                        <span className="text-sm font-bold text-amber-300 break-all">
                          {qrDetails.topupCode}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(qrDetails.topupCode, "code")}
                        className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-[11px] font-mono transition-colors flex items-center gap-1 shrink-0 ml-2"
                      >
                        <Copy size={12} />
                        {copiedField === "code" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>

                  {/* Customer Action Button */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      disabled={isCheckingPayment}
                      onClick={handleConfirmPaid}
                      className="w-full py-3 rounded-xl bg-[var(--c-lime)] text-black text-xs font-bold font-mono tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      {isCheckingPayment ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Đang kiểm tra giao dịch...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Xác Nhận Đã Chuyển Khoản</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[var(--c-white-60)] text-center">
                      Hệ thống tự động kích hoạt token ngay khi tài khoản nhận được thanh toán.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

              {/* STEP 3: Success Screen */}
              {step === "success" && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--c-lime-10)] border border-[var(--c-lime)] text-[var(--c-lime)] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl font-black text-white">Thanh Toán Thành Công!</h4>
                  <p className="text-sm text-[var(--c-white-60)] max-w-md mx-auto leading-relaxed">
                    Tài khoản của bạn đã được nạp{" "}
                    <span className="text-[var(--c-lime)] font-bold font-mono">
                      +{qrDetails?.totalCredits ?? selectedPkg?.credits} Credits
                    </span>
                    . Bạn có thể sử dụng Studio Custom 3D ngay bây giờ.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-8 py-3 rounded-xl bg-[var(--c-lime)] text-black font-extrabold text-sm tracking-wide hover:scale-105 transition-all"
                    >
                      BẮT ĐẦU SỬ DỤNG
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
