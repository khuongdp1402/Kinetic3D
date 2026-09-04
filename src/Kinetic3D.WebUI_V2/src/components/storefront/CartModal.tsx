"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { CheckoutForm } from "./CheckoutForm";

export function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md h-full bg-[#1c1917] border-l border-neutral-800 p-6 flex flex-col text-[#F3F4F6]">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-sans uppercase tracking-widest text-cyan-400">
            {showCheckout ? "Checkout" : "Cart"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {showCheckout ? (
          <CheckoutForm onBack={() => setShowCheckout(false)} total={total} onComplete={onClose} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="text-neutral-500 flex items-center justify-center h-full font-mono">
                  Cart is empty
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="bg-neutral-900 rounded p-4 border border-neutral-800 flex flex-col gap-2 relative">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 text-neutral-500 hover:text-[#fb923c] transition-colors"
                    >
                      ✕
                    </button>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <div className="text-sm text-neutral-400 font-mono">
                      Color: {item.variants.color} | Size: {item.variants.size}
                    </div>
                    {item.customText && (
                      <div className="text-sm text-neutral-400 font-mono">
                        Text: <span className="text-cyan-400">"{item.customText}"</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-mono text-cyan-400">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center hover:bg-neutral-700 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center hover:bg-neutral-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="pt-6 border-t border-neutral-800 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-400 uppercase tracking-wider text-sm font-bold">Total</span>
                  <span className="text-2xl font-mono text-cyan-400 font-bold">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-cyan-400 text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
