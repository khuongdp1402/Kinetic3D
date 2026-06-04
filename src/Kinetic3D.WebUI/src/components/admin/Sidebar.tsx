import Link from "next/link";
import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-950 p-6 border-r border-neutral-800">
      <h2 className="text-2xl font-bold mb-8 text-cyan-400">Kinetic3D</h2>
      <nav className="flex flex-col gap-4">
        <Link href="/admin" className="hover:text-cyan-400 transition-colors">
          Dashboard
        </Link>
        <Link href="/admin/products/new" className="hover:text-cyan-400 transition-colors">
          Products
        </Link>
        <Link href="/admin/categories" className="hover:text-cyan-400 transition-colors">
          Categories
        </Link>
        <Link href="/admin/flash-sales" className="hover:text-cyan-400 transition-colors">
          Flash Sales
        </Link>
      </nav>
    </aside>
  );
}
