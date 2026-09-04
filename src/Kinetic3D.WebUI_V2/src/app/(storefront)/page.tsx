import { HeroImmersive } from "@/components/storefront/HeroImmersive";
import { LogoWall } from "@/components/storefront/LogoWall";
import { ComparisonSection } from "@/components/storefront/ComparisonSection";
import { FeaturedProductsGrid } from "@/components/storefront/FeaturedProductsGrid";
import { IndustryShowcase } from "@/components/storefront/IndustryShowcase";
import { SocialProof } from "@/components/storefront/SocialProof";
import { FinalCTA } from "@/components/storefront/FinalCTA";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden" style={{ backgroundColor: "#0a0a0f" }}>
      {/* §1 — Immersive Hero: Tripo3D Curved 3D Arc Carousel */}
      <HeroImmersive />

      {/* §2 — Logo Wall: Infinite Partner/Brand Marquee */}
      <LogoWall />

      {/* §3 — Image to 3D: Tripo3D Animated Neon Border Upload Capsule & Staggered Popups */}
      <ComparisonSection />

      {/* §4 — Featured Products Grid: Compact 4-5 Columns, Real-Time Split Reveal Hover */}
      <FeaturedProductsGrid />

      {/* §5 — Industry Showcase: Interactive Tabbed Domain Hub */}
      <IndustryShowcase />

      {/* §6 — Social Proof: Glowing Stats & Verified Reviews */}
      <SocialProof />

      {/* §7 — Final CTA: Lightweight GPU CSS Ambient & Newsletter */}
      <FinalCTA />
    </main>
  );
}
