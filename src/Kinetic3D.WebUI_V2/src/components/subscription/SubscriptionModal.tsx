"use client";

import { useAppStore } from "@/store/useAppStore";
import { X, HelpCircle, Coins, ChevronDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { SubscriptionGrid } from "./SubscriptionGrid";

export function SubscriptionModal() {
  const { isSubscriptionModalOpen, closeSubscriptionModal, currency, setCurrency, language, setLanguage } = useAppStore();
  const [activeTab, setActiveTab] = useState<"membership" | "pricing" | "free">("pricing");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [locOpen, setLocOpen] = useState(false);

  // Prevent background scrolling
  useEffect(() => {
    if (isSubscriptionModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isSubscriptionModalOpen]);

  if (!isSubscriptionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 lg:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={closeSubscriptionModal} 
      />

      {/* Modal Container */}
      <div className="relative w-full h-full sm:h-auto max-w-[1400px] sm:max-h-[90vh] bg-[var(--c-bg-deep)] sm:rounded-2xl border-0 sm:border border-[var(--c-white-10)] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--c-white-10)] bg-black/20">
          <div className="flex items-center gap-6">
             <div className="text-xl font-bold tracking-tight text-white">
               Workspace <span className="text-[var(--c-lime)]">Billing</span>
             </div>
             
             {/* Tabs */}
             <div className="hidden md:flex bg-white/5 rounded-lg p-1 border border-white/10">
               {[
                 { id: "membership", label: "Membership" },
                 { id: "pricing", label: "Pricing" },
                 { id: "free", label: "Get Free Credits" }
               ].map((tab) => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab.id ? 'bg-[var(--c-bg-card)] text-white shadow' : 'text-white/50 hover:text-white'}`}
                 >
                   {tab.label}
                 </button>
               ))}
             </div>
          </div>
          
          <button onClick={closeSubscriptionModal} className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
          
          {/* Sub-Header Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            {/* Center Toggle (Annual/Monthly) */}
            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
               <button 
                 onClick={() => setBillingCycle("annually")}
                 className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${billingCycle === 'annually' ? 'bg-[var(--c-lime)] text-[var(--c-bg-deep)]' : 'text-white/70 hover:text-white'}`}
               >
                 Annually
                 <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${billingCycle === 'annually' ? 'bg-black/20 text-black' : 'bg-[var(--c-lime-20)] text-[var(--c-lime)]'}`}>
                   Save 50%
                 </span>
               </button>
               <button 
                 onClick={() => setBillingCycle("monthly")}
                 className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[var(--c-bg-card)] text-white shadow' : 'text-white/70 hover:text-white'}`}
               >
                 Monthly
               </button>
            </div>

            {/* Far Right Localization Utilities */}
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition-colors">
                 <HelpCircle className="w-4 h-4" /> FAQ
               </button>
               <button className="flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition-colors">
                 <Coins className="w-4 h-4" /> Credits Breakdown
               </button>
               
               {/* Language/Currency Dropdown */}
               <div className="relative">
                 <button 
                   onClick={() => setLocOpen(!locOpen)}
                   className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-white"
                 >
                   {language === 'vi' ? '🇻🇳' : '🇺🇸'} {currency}
                   <ChevronDown className="w-3 h-3 text-white/50" />
                 </button>
                 
                 {locOpen && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--c-bg-card)] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                     <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider px-2 py-1 mb-1">Language</div>
                     <button onClick={() => { setLanguage('vi'); setCurrency('VND'); setLocOpen(false); }} className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-white/5 text-xs text-white">
                       <span className="flex items-center gap-2">🇻🇳 Tiếng Việt</span>
                       {language === 'vi' && <Check className="w-3 h-3 text-[var(--c-lime)]" />}
                     </button>
                     <button onClick={() => { setLanguage('en'); setCurrency('USD'); setLocOpen(false); }} className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-white/5 text-xs text-white">
                       <span className="flex items-center gap-2">🇺🇸 English</span>
                       {language === 'en' && <Check className="w-3 h-3 text-[var(--c-lime)]" />}
                     </button>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "pricing" && (
            <div className="w-full max-w-full mx-auto">
              <SubscriptionGrid billingCycle={billingCycle} />
            </div>
          )}
          {activeTab === "membership" && (
            <div className="w-full h-64 flex items-center justify-center text-white/50 border border-white/10 border-dashed rounded-xl">
               Membership details will appear here
            </div>
          )}
          {activeTab === "free" && (
            <div className="w-full h-64 flex items-center justify-center text-white/50 border border-white/10 border-dashed rounded-xl">
               Free credits portal will appear here
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
