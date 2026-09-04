"use client";

import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-neutral-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-14 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <span className="text-xs text-amber-400 bg-amber-950/40 border border-amber-700 rounded px-2 py-1">
                Chưa đăng nhập — một số tính năng bị giới hạn
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                    <User size={14} className="text-orange-400" />
                  </div>
                  <span className="text-neutral-300 font-medium">{user.displayName || user.email}</span>
                  <span className="text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded px-1.5 py-0.5 font-bold uppercase">
                    Admin
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-red-400 transition-colors"
                >
                  <LogOut size={14} />
                  Đăng xuất
                </button>
              </>
            ) : (
              <span className="text-xs text-neutral-500">Khách</span>
            )}
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
