"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Heart, Settings, Coins } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProfileDropdownProps {
  onClose: () => void;
}

export function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div 
      className="absolute top-full right-0 mt-3 w-64 rounded-xl border border-[var(--c-white-15)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50"
      style={{ backgroundColor: "var(--c-bg-card)", backdropFilter: "blur(20px)" }}
    >
      {/* Header: User Info */}
      <div className="p-4 border-b border-[var(--c-white-10)] bg-white/5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
            {user.avatar ? (
               <Image src={user.avatar} alt="Avatar" fill className="object-cover" />
            ) : (
               <div className="w-full h-full bg-white/10 flex items-center justify-center text-xs font-bold">{user.displayName[0]}</div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">{user.displayName}</span>
            <span className="text-[10px] text-white/50">{user.email}</span>
          </div>
        </div>
        
        {/* Tier & Credits */}
        <div className="mt-3 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--c-lime-20)] text-[var(--c-lime)] border border-[var(--c-lime-50)]">
            {user.tier}
          </span>
          <div className="flex items-center gap-1">
             <Coins className="w-3 h-3 text-[var(--c-orange)]" />
             <span className="text-xs font-mono font-bold text-white">{(user.credits ?? 30).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Body: Links */}
      <div className="p-2">
        <Link 
          href="/wishlist" 
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/80 hover:text-white"
        >
          <Heart className="w-4 h-4 text-white/50" />
          My Wishlist
        </Link>
        <Link 
          href="/settings" 
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/80 hover:text-white"
        >
          <Settings className="w-4 h-4 text-white/50" />
          Account Settings
        </Link>
      </div>

      {/* Footer: Logout */}
      <div className="p-2 border-t border-[var(--c-white-10)]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
