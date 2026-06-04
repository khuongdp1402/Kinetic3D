"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

// Add Umami type to window
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: any) => void;
    };
  }
}

export function CheckoutForm({ onBack, total, onComplete }: { onBack: () => void; total: number; onComplete: () => void }) {
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // 1. Clear cart
      clearCart();
      
      // 2. Track conversion with Umami
      if (typeof window !== "undefined" && window.umami) {
        window.umami.track("checkout", { value: total });
      }

      setIsSuccess(true);
      setIsSubmitting(false);

      // Close modal after success
      setTimeout(() => {
        onComplete();
      }, 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center">
          <span className="text-3xl text-cyan-400">✓</span>
        </div>
        <h3 className="text-xl font-bold font-sans uppercase tracking-widest text-cyan-400">
          Order Confirmed
        </h3>
        <p className="text-neutral-400 text-sm">
          Your Kinetic3D custom gear is entering production.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
      <button onClick={onBack} className="text-neutral-400 hover:text-white transition-colors text-sm mb-6 flex items-center gap-2">
        <span>←</span> Back to Cart
      </button>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">Email</label>
            <input required type="email" className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400" placeholder="cyber@runner.net" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">Shipping Address</label>
            <textarea required className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 h-24" placeholder="Sector 7G..."></textarea>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">Card Details (Mock)</label>
            <input required type="text" className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400" placeholder="XXXX XXXX XXXX XXXX" />
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-neutral-800">
          <div className="flex justify-between items-center mb-4 text-cyan-400 font-mono text-xl">
            <span>Total To Pay:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF5F1F] text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-[#ff7a45] transition-colors shadow-[0_0_15px_rgba(255,95,31,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Complete Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
}
