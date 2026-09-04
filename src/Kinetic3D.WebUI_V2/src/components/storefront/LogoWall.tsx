"use client";

const LOGOS = [
  { name: "ByteDance", slug: "bytedance" },
  { name: "Unity", slug: "unity" },
  { name: "Blender", slug: "blender" },
  { name: "Unreal Engine", slug: "unrealengine" },
  { name: "Autodesk", slug: "autodesk" },
  { name: "Adobe", slug: "adobe" },
  { name: "NVIDIA", slug: "nvidia" },
  { name: "Epic Games", slug: "epicgames" },
];

const LOGOS_ROW2 = [
  { name: "Steam", slug: "steam" },
  { name: "PlayStation", slug: "playstation" },
  { name: "Roblox", slug: "roblox" },
  { name: "Godot", slug: "godotengine" },
  { name: "Three.js", slug: "threedotjs" },
  { name: "Figma", slug: "figma" },
  { name: "GitHub", slug: "github" },
  { name: "Docker", slug: "docker" },
];

function LogoRow({ logos, reverse = false }: { logos: typeof LOGOS; reverse?: boolean }) {
  const doubled = [...logos, ...logos];
  return (
    <div className="mask-fade-x overflow-hidden">
      <div className={`flex items-center gap-16 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {doubled.map((logo, i) => (
          <div key={`${logo.slug}-${i}`} className="flex items-center gap-3 shrink-0 opacity-30 hover:opacity-60 transition-opacity duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://cdn.simpleicons.org/${logo.slug}/ffffff`}
              alt={logo.name}
              width={24}
              height={24}
              className="w-6 h-6"
              loading="lazy"
            />
            <span className="text-sm font-bold tracking-wider text-white/40 uppercase whitespace-nowrap">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogoWall() {
  return (
    <section className="w-full py-12 md:py-16" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="max-w-[1400px] mx-auto">
        <p
          className="text-center text-[11px] uppercase tracking-[0.25em] mb-8"
          style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-mono)" }}
        >
          Được tin dùng bởi các studio và nhà sáng tạo
        </p>
        <div className="flex flex-col gap-6">
          <LogoRow logos={LOGOS} />
          <LogoRow logos={LOGOS_ROW2} reverse />
        </div>
      </div>
    </section>
  );
}
