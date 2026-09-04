"use client";

import Link from "next/link";
import { ChevronUp, LayoutDashboard, Grid, Package, Tag } from "lucide-react";
import { useState } from "react";

export function QuickNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-48 bg-primary border border-border-color shadow-2xl rounded-lg overflow-hidden flex flex-col font-mono text-sm">
          <div className="bg-bg-tertiary px-4 py-2 font-bold text-accent-cyan border-b border-border-color">
            TEST ROUTES
          </div>
          <Link href="/categories" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary text-primary transition-colors">
            <Grid className="w-4 h-4" /> Categories
          </Link>
          <Link href="/products/1" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary text-primary transition-colors">
            <Package className="w-4 h-4" /> Customizer (ID:1)
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary text-primary transition-colors border-t border-border-color">
            <LayoutDashboard className="w-4 h-4" /> Admin: Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary text-primary transition-colors">
            <Tag className="w-4 h-4" /> Admin: Categories
          </Link>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-accent-orange text-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <ChevronUp className={`w-6 h-6 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
