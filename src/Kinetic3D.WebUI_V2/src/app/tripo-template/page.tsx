import CosmicBackground from "@/components/ui/CosmicBackground";
import TripoHero from "@/components/ui/TripoHero";
import TripoWorkflow from "@/components/ui/TripoWorkflow";
import GallerySection from "@/components/ui/GallerySection";

export const metadata = {
  title: 'Tripo3D Template Preview | Kinetic3D',
  description: 'Experimental cosmic UI template',
};

export default function TripoTemplatePage() {
  return (
    <main className="relative bg-[#09090b] min-h-screen text-white overflow-x-hidden font-sans">
      {/* Background Layer */}
      <CosmicBackground />

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Simple Header for Template */}
        <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-black/20 backdrop-blur-md z-50 flex items-center justify-between px-8">
          <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <span className="text-purple-500">▼</span> KINETIC STUDIO
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Research</a>
            <a href="#" className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Products</a>
            <a href="#" className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Features</a>
            <a href="#" className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Pricing</a>
          </nav>
          <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors">
            Try Kinetic Studio
          </button>
        </header>

        {/* Hero Section */}
        <TripoHero />

        {/* Community Gallery */}
        <GallerySection />

        {/* Workflow Showcase */}
        <TripoWorkflow />
        
        {/* Simple Footer */}
        <footer className="py-12 border-t border-white/10 mt-20 text-center text-gray-500 text-sm">
          Kinetic3D Tripo-Style Template Preview.
        </footer>
      </div>
    </main>
  );
}
