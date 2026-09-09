"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings?tab=orders");
  }, [router]);

  return (
    <div className="min-h-screen pt-28 text-center text-white/50 font-mono">
      Đang chuyển hướng tới lịch sử đơn hàng...
    </div>
  );
}
