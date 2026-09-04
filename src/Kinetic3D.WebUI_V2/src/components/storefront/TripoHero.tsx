"use client";

import { useRef, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, ArrowRight, Sparkles } from "lucide-react";
import { ScrambleIn } from "@/components/ui/scramble-in";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import type { Group } from "three";

function Model() {
  const { scene } = useGLTF("/cyber-jacket.glb");
  const modelRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <primitive ref={modelRef} object={scene} scale={2} position={[0, -1, 0]}>
        <meshStandardMaterial attach="material" color="#111" wireframe={true} />
      </primitive>
    </Float>
  );
}

export function TripoHero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goToStudio = () => {
    const params = prompt.trim() ? `?prompt=${encodeURIComponent(prompt.trim())}` : "";
    router.push(`/custom${params}`);
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = () => {
    router.push("/custom?source=upload");
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#0b0c10", minHeight: "100vh" }}
    >
      {/* Ambient grid + glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 90%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 15%, rgba(251,191,36,0.14), transparent 65%)",
        }}
      />

      {/* R3F 3D Model Background */}
      <div className="absolute inset-0 hidden lg:block opacity-70">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Canvas>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center pt-40 pb-24 px-6 text-center pointer-events-none">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.15em] mb-6 border border-white/15 text-white/70 shadow-[0_0_15px_rgba(245,185,66,0.2)]"
          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          <Sparkles className="w-3 h-3" style={{ color: "#f5b942" }} />
          AI 3D Studio
        </div>

        <h1
          className="font-bold tracking-[-0.03em] leading-[1.04] max-w-4xl"
          style={{ fontSize: "clamp(2.2rem, 5.2vw, 4.2rem)", color: "#ffffff" }}
        >
          <ScrambleIn 
            text="Tạo Mô Hình 3D Trong Vài Giây" 
            scrambleSpeed={40}
            scrambledLetterCount={6}
            scrambledClassName="text-white/40"
          />
        </h1>
        <p className="mt-5 max-w-xl text-base md:text-lg text-white/60">
          Kinetic3D — biến ảnh chụp hoặc mô tả của bạn thành mô hình 3D sẵn sàng in ấn, chỉ trong tích tắc.
        </p>

        {/* Prompt / upload bar */}
        <div className="mt-10 w-full max-w-2xl pointer-events-auto">
          <div
            className="flex items-center gap-3 rounded-2xl p-2 pl-5 border transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,185,66,0.15)] focus-within:shadow-[0_0_30px_rgba(245,185,66,0.25)] focus-within:border-[#f5b942]/50"
            style={{ backgroundColor: "rgba(20,20,24,0.7)", borderColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}
          >
            <button
              type="button"
              onClick={onPickFile}
              aria-label="Tải ảnh lên"
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelected} />

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToStudio()}
              placeholder="Mô tả ý tưởng của bạn, hoặc tải ảnh lên và bắt đầu tạo..."
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/35 py-2"
            />

            <button
              type="button"
              onClick={goToStudio}
              className="shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: "#f5b942", color: "#14110f" }}
            >
              Bắt Đầu Tạo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trusted-by strip */}
        <div className="mt-16 w-full max-w-3xl overflow-hidden">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-4">Được tin dùng bởi các studio &amp; nhà sáng tạo</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {["SONY", "BYTEDANCE", "MIHOYO", "NETEASE", "TENCENT", "UNITY"].map((name) => (
              <span key={name} className="text-sm font-bold tracking-[0.15em] text-white/25">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

