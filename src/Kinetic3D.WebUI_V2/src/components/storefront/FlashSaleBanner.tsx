"use client";

import { useState, useEffect } from "react";

export function FlashSaleBanner({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const difference = endTime - Date.now();
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!isMounted) {
    return (
      <div className="w-full bg-accent-orange text-primary py-2 text-center font-bold font-sans uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(255,87,34,0.8)]">
        Flash Sale: Loading...
      </div>
    );
  }

  if (!timeLeft) {
    return null; // Sale ended
  }

  return (
    <div className="w-full bg-accent-orange text-primary py-2 text-center font-bold font-sans uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(255,87,34,0.8)] transition-colors">
      Flash Sale Ends In:{" "}
      <span className="font-mono bg-primary text-accent-orange px-2 py-1 rounded ml-2 shadow-[0_0_8px_rgba(255,87,34,0.5)]">
        {timeLeft.hours.toString().padStart(2, "0")}:
        {timeLeft.minutes.toString().padStart(2, "0")}:
        {timeLeft.seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
