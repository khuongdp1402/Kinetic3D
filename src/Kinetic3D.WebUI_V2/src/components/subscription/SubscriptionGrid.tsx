"use client";

import { useState } from "react";
import { Check, Users, Plus, Minus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface SubscriptionGridProps {
  billingCycle: "monthly" | "annually";
}

const pricingData = [
  { id: "free", name: "Free", priceMonthly: 0, priceAnnually: 0, credits: "50 credits / month", features: ["Standard queue priority", "1 concurrent task", "Public models only"] },
  { id: "starter", name: "Starter", priceMonthly: 150000, priceAnnually: 90000, credits: "500 credits / month", features: ["High priority queue", "2 concurrent tasks", "Private models", "1-day edit history"] },
  { id: "pro", name: "Pro", priceMonthly: 450000, priceAnnually: 270000, credits: "2000 credits / month", features: ["Highest priority", "5 concurrent tasks", "Private models", "7-day edit history", "API Access"] },
  { id: "max", name: "Max", priceMonthly: 900000, priceAnnually: 540000, credits: "5000 credits / month", isBestValue: true, features: ["Highest priority", "10 concurrent tasks", "Private models", "30-day edit history", "API Access", "Dedicated Support"] },
];

export function SubscriptionGrid({ billingCycle }: SubscriptionGridProps) {
  const { currency } = useAppStore();
  const [teamSeats, setTeamSeats] = useState(5);

  const formatPrice = (amount: number) => {
    if (currency === "USD") {
      return `$${(amount / 25000).toFixed(2)}`;
    }
    return `₫${amount.toLocaleString()}`;
  };

  const getPrice = (tier: typeof pricingData[0]) => {
    return billingCycle === "annually" ? tier.priceAnnually : tier.priceMonthly;
  };

  const teamBasePrice = billingCycle === "annually" ? 400000 : 700000;
  const teamTotalPrice = teamBasePrice * teamSeats;

  return (
    <div className="w-full flex gap-4 overflow-x-auto pb-8 snap-x no-scrollbar">
      
      {/* Standard Tiers */}
      {pricingData.map((tier) => (
        <div 
          key={tier.id}
          className={`snap-start shrink-0 w-[280px] sm:w-[320px] bg-[var(--c-bg-card)] rounded-2xl p-6 flex flex-col relative transition-all duration-300 border ${tier.isBestValue ? 'border-[var(--c-lime)] glow-lime scale-105 z-10' : 'border-[var(--c-white-10)] hover:border-[var(--c-white-20)]'}`}
        >
          {tier.isBestValue && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--c-lime)] text-white text-[10px] font-bold uppercase tracking-widest">
              Tốt nhất
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>

          <div className="mb-4">
            <span className="text-3xl font-bold font-mono text-[var(--c-white)]">{formatPrice(getPrice(tier))}</span>
            <span className="text-xs text-white/50 ml-1">/ tháng</span>
            {billingCycle === "annually" && tier.priceMonthly > 0 && (
              <div className="text-[10px] text-[var(--c-orange)] font-bold mt-1">
                Thanh toán {formatPrice(getPrice(tier) * 12)} / năm
              </div>
            )}
          </div>
          
          <div className="text-sm font-bold text-[var(--c-lime)] mb-6 pb-4 border-b border-[var(--c-white-10)]">
            {tier.credits}
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {tier.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-white/80">
                <Check className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
                {feat}
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-2">
             <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${tier.isBestValue ? 'bg-[var(--c-lime)] text-white hover:scale-[1.02]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
               Nâng cấp lên {tier.name}
             </button>
             {tier.priceMonthly > 0 && (
               <div className="flex gap-2">
                 <button className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors">Stripe</button>
                 <button className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors">PayPal</button>
               </div>
             )}
          </div>
        </div>
      ))}

      {/* Team Tier (Custom Logic) */}
      <div className="snap-start shrink-0 w-[320px] sm:w-[360px] bg-gradient-to-br from-[var(--c-bg-card)] to-[#2a2422] rounded-2xl p-6 flex flex-col relative border border-[var(--c-white-10)] hover:border-[var(--c-orange-50)] transition-colors">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--c-orange)]" />
          Team
        </h3>

        <div className="mb-4">
          <span className="text-3xl font-bold font-mono text-[var(--c-white)]">{formatPrice(teamTotalPrice)}</span>
          <span className="text-xs text-white/50 ml-1">/ tháng</span>
        </div>

        {/* Multi-Seat Selector Form */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/70">Số chỗ</span>
            <span className="text-xs font-mono font-bold text-[var(--c-orange)]">{formatPrice(teamBasePrice)} / chỗ</span>
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-1 border border-white/10">
            <button 
              onClick={() => setTeamSeats(Math.max(2, teamSeats - 1))}
              className="w-8 h-8 rounded flex items-center justify-center bg-white/5 hover:bg-white/20 text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold font-mono text-white">{teamSeats}</span>
            <button 
              onClick={() => setTeamSeats(teamSeats + 1)}
              className="w-8 h-8 rounded flex items-center justify-center bg-white/5 hover:bg-white/20 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {["Toàn bộ tính năng gói Max", "Không gian làm việc nhóm", "Thanh toán tập trung", "Xác thực SSO", "Chuyên viên hỗ trợ riêng"].map((feat, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-white/80">
              <Check className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
              {feat}
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-2">
          <button className="w-full py-3 rounded-xl text-sm font-bold bg-[var(--c-orange)] text-white hover:scale-[1.02] transition-all">
            Liên hệ tư vấn
          </button>
        </div>
      </div>
    </div>
  );
}
