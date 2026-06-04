import ProductGrid from "@/components/storefront/ProductGrid";
import { ProductCardProps } from "@/components/storefront/ProductCard";
import Link from "next/link";

const allProducts: ProductCardProps[] = [
  {
    id: "1",
    name: "Aero X-1",
    price: 299.99,
    category: "Sneakers",
    tagline: "Ultra-lightweight urban mobility.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Neon Pulse V2",
    price: 189.50,
    salePrice: 149.99,
    category: "Runners",
    tagline: "Glow in the dark mesh tech.",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Obsidian High-Top",
    price: 349.00,
    category: "Boots",
    tagline: "Matte black leather finish.",
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Cyber Walkers",
    price: 129.99,
    category: "Casual",
    tagline: "Everyday comfort with a tech edge.",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Void Drifter",
    price: 219.00,
    category: "Sneakers",
    tagline: "Step into the void.",
    imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Quantum Lace",
    price: 159.00,
    category: "Casual",
    tagline: "Self-lacing prototype.",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1998&auto=format&fit=crop",
  }
];

export default function ProductsPage() {
  return (
    <div className="flex-1 bg-background">
      <div className="border-b border-white/10 bg-[#050505]">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">ALL PRODUCTS</h1>
          <p className="text-foreground/50 font-mono uppercase tracking-widest text-sm max-w-xl">
            Browse our complete collection of cyber-tech footwear. Customize any model to your exact specifications.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filter Placeholder */}
        <aside className="w-full md:w-64 flex-shrink-0 font-mono text-sm uppercase tracking-widest">
          <div className="mb-8">
            <h3 className="font-bold mb-4 text-color-cyan border-b border-white/10 pb-2">Categories</h3>
            <ul className="space-y-3 text-foreground/70">
              <li><Link href="#" className="hover:text-white transition-colors">All Categories</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sneakers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Runners</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Boots</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Casual</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-color-cyan border-b border-white/10 pb-2">Price Range</h3>
            <ul className="space-y-3 text-foreground/70">
              <li><Link href="#" className="hover:text-white transition-colors">All Prices</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Under $150</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">$150 - $250</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Over $250</Link></li>
            </ul>
          </div>
        </aside>
        
        {/* Main Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 font-mono text-xs uppercase tracking-widest text-foreground/50">
            <span>Showing {allProducts.length} results</span>
            <select className="bg-transparent border border-white/10 p-2 outline-none focus:border-color-cyan text-foreground">
              <option value="featured" className="bg-[#111]">Sort by Featured</option>
              <option value="price-asc" className="bg-[#111]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#111]">Price: High to Low</option>
            </select>
          </div>
          
          <ProductGrid products={allProducts} />
        </div>
      </div>
    </div>
  );
}
