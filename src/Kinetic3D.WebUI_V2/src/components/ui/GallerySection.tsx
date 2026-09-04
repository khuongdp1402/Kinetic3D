import { InteractiveGalleryCard } from "./InteractiveGalleryCard";

export default function GallerySection() {
  // Using 4 models to ensure good performance and stay within browser WebGL context limits.
  const models = [
    { id: 1, title: "TCP Reel Seat", author: "Kinetic3D", url: "/models/reelseat_tcp.glb" },
    { id: 2, title: "EVA Foregrip", author: "Creator A", url: "/models/reelseat_tcp.glb" },
    { id: 3, title: "Carbon Fiber Handle", author: "Studio X", url: "/models/reelseat_tcp.glb" },
    { id: 4, title: "Skeleton Grip", author: "Maker Z", url: "/models/reelseat_tcp.glb" }
  ];

  return (
    <section className="py-24 px-8 max-w-[1400px] mx-auto z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4">
            Community Gallery
          </h2>
          <p className="text-gray-400 text-lg">
            Hover to reveal the transformation from clay to final masterpiece.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {["All", "Featured", "Characters", "Vehicles", "Props"].map(filter => (
            <button key={filter} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 hover:border-purple-500/50 transition-all">
              {filter}
            </button>
          ))}
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all ml-4">
            Feature My Model ✨
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {models.map((model) => (
          <InteractiveGalleryCard 
            key={model.id}
            modelUrl={model.url}
            title={model.title}
            author={model.author}
          />
        ))}
      </div>
    </section>
  );
}
