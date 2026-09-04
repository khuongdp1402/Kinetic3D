"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PricingOdometer({ price }: { price: number }) {
  const [digits, setDigits] = useState<string[]>([]);

  useEffect(() => {
    // Convert price to array of characters, padding with zeros if needed
    const priceStr = price.toFixed(2);
    setDigits(priceStr.split(""));
  }, [price]);

  return (
    <div className="flex text-4xl font-bold font-mono tracking-tighter text-cyan-400">
      <span className="mr-1">$</span>
      <div className="flex">
        {digits.map((digit, index) => {
          if (digit === ".") {
            return (
              <span key="dot" className="text-cyan-400">
                .
              </span>
            );
          }
          return (
            <div
              key={`${index}-${digit}`}
              className="h-[40px] overflow-hidden leading-[40px] relative w-[24px] flex justify-center"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="absolute inset-0 flex justify-center"
              >
                {digit}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
