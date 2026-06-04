import Link from "next/link";
import Search from "./Search";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          KINETIC<span className="text-color-cyan">3D</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-mono text-sm tracking-widest uppercase">
          <Link href="/products" className="hover:text-color-cyan transition-colors">Products</Link>
          <Link href="/categories" className="hover:text-color-cyan transition-colors">Categories</Link>
          <Link href="/about" className="hover:text-color-cyan transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Search />
          <Link href="/cart" className="hover:text-color-cyan transition-colors uppercase font-mono text-sm tracking-widest hidden md:block">
            Cart [0]
          </Link>
        </div>
      </div>
    </header>
  );
}
