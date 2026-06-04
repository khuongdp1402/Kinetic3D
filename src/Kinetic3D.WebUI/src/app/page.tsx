import HeroCarousel from "@/components/storefront/HeroCarousel";
import ProductGrid from "@/components/storefront/ProductGrid";
import { ProductCardProps } from "@/components/storefront/ProductCard";

const featuredProducts: ProductCardProps[] = [
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
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroCarousel />
      
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">FEATURED</h2>
              <p className="text-foreground/50 font-mono text-sm mt-2 uppercase tracking-widest">
                Curated selections for the grid.
              </p>
            </div>
            <a href="/products" className="text-color-cyan font-mono text-sm uppercase tracking-widest hover:text-white transition-colors">
              View All //
            </a>
          </div>
          
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </main>
  );
}
