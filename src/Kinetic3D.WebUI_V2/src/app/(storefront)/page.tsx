import { HeroImmersive } from "@/components/storefront/HeroImmersive";
import { BrandStoryAI3D } from "@/components/storefront/BrandStoryAI3D";
import { FeaturedProductsGrid } from "@/components/storefront/FeaturedProductsGrid";
import { SocialProof } from "@/components/storefront/SocialProof";
import { FAQSection } from "@/components/storefront/FAQSection";
import { FinalCTA } from "@/components/storefront/FinalCTA";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main 
      className="relative w-full overflow-x-hidden transition-colors duration-300" 
      style={{ backgroundColor: "var(--c-bg)", color: "var(--c-white)" }}
    >
      {/* §1 — Hero Banner: Vòng Xoay Quỹ Đạo 360° Circular Tech Orbit */}
      <HeroImmersive />

      {/* §2 — Brand Story & AI 3D Mesh: Layout Bất Đối Xứng + Upload Capsule & Đĩa 3D Zoom Lệch Phải */}
      <BrandStoryAI3D />

      {/* §3 — Featured Products: 8 Sản Phẩm Tiêu Biểu (2 Dòng x 4 Cột) */}
      <FeaturedProductsGrid />

      {/* §4 — Social Proof: Được Tin Dùng Bởi Các Kỹ Sư & Thống Kê */}
      <SocialProof />

      {/* §5 — AEO FAQ Section: Câu Hỏi Thường Gặp & Schema.org FAQPage */}
      <FAQSection />

      {/* §6 — Final CTA: Kêu Gọi Hành Động & Newsletter */}
      <FinalCTA />
    </main>
  );
}
