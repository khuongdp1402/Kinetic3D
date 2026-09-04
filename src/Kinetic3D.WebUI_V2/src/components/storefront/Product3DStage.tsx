"use client";

import React, { Suspense, useRef, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { RotateCw, Maximize2, Shield, Eye, Grid } from "lucide-react";

interface ModelViewerProps {
  url: string;
  mode: "pbr" | "clay" | "wireframe";
  showGrid: boolean;
}

function LoadedModel({ url, mode, showGrid }: ModelViewerProps) {
  const { scene } = useGLTF(url);

  // Clone scene and normalize scale + center at (0,0,0) so all models render at consistent size and orbit cleanly
  const { group, bottomY } = useMemo(() => {
    const clone = scene.clone(true);

    const clayMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8, // neutral light grey clay
      roughness: 0.85,
      metalness: 0.05,
    });

    const wireframeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // amber wireframe
      wireframe: true,
      roughness: 0.5,
    });

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mode === "clay") {
          mesh.material = clayMaterial;
        } else if (mode === "wireframe") {
          mesh.material = wireframeMaterial;
        }
        // mode === "pbr" retains original material
      }
    });

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Target visual size: 2.2 units
    const targetSize = 2.2;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;

    // Apply scale and center precisely at (0, 0, 0)
    clone.scale.setScalar(scale);
    clone.position.x = -center.x * scale;
    clone.position.y = -center.y * scale;
    clone.position.z = -center.z * scale;

    const grp = new THREE.Group();
    grp.add(clone);

    const bY = -(size.y * scale) / 2;

    return { group: grp, bottomY: bY };
  }, [scene, mode]);

  return (
    <>
      <primitive object={group} />

      {/* Contact shadow right under model base */}
      <ContactShadows
        position={[0, bottomY, 0]}
        opacity={0.65}
        scale={7}
        blur={2}
        far={3}
        color="#000000"
      />

      {/* 3D Printer Grid Bed aligned to model base */}
      {showGrid && (
        <gridHelper
          args={[6, 24, "#f59e0b", "#334155"]}
          position={[0, bottomY - 0.005, 0]}
        />
      )}
    </>
  );
}

function FallbackBox({ mode, showGrid }: { mode: "pbr" | "clay" | "wireframe"; showGrid: boolean }) {
  const bottomY = -0.75;
  return (
    <>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color={mode === "wireframe" ? "#f59e0b" : mode === "clay" ? "#d4d4d8" : "#f97316"}
          wireframe={mode === "wireframe"}
          roughness={0.4}
        />
      </mesh>
      <ContactShadows
        position={[0, bottomY, 0]}
        opacity={0.65}
        scale={7}
        blur={2}
        far={3}
        color="#000000"
      />
      {showGrid && (
        <gridHelper
          args={[6, 24, "#f59e0b", "#334155"]}
          position={[0, bottomY - 0.005, 0]}
        />
      )}
    </>
  );
}

export interface Product3DStageProps {
  modelUrl?: string | null;
  productName?: string;
  className?: string;
}

export function Product3DStage({ modelUrl, productName, className = "" }: Product3DStageProps) {
  const [mode, setMode] = useState<"pbr" | "clay" | "wireframe">("pbr");
  const [autoRotate, setAutoRotate] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(2.5, 1.3, 3.2);
      controlsRef.current.update();
    }
  };

  return (
    <div
      aria-label={productName || "3D Product Viewer"}
      className={`relative w-full h-full min-h-[460px] bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden group select-none ${className}`}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [2.5, 1.3, 3.2], fov: 42 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 4, -4]} intensity={0.6} color="#38bdf8" />
        <pointLight position={[5, -2, 5]} intensity={0.4} color="#f59e0b" />

        <Suspense
          fallback={
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshStandardMaterial color="#f97316" wireframe />
            </mesh>
          }
        >
          {modelUrl ? (
            <LoadedModel url={modelUrl} mode={mode} showGrid={showGrid} />
          ) : (
            <FallbackBox mode={mode} showGrid={showGrid} />
          )}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          target={[0, 0, 0]}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          enableDamping
          dampingFactor={0.05}
          maxDistance={8}
          minDistance={1.2}
          maxPolarAngle={Math.PI / 2 - 0.02}
        />

        <Environment preset="city" />
      </Canvas>

      {/* Mode Switcher Pill top-left */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md rounded-xl p-1 shadow-xl">
        <button
          onClick={() => setMode("pbr")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            mode === "pbr"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Eye size={12} />
          <span>PBR Màu</span>
        </button>

        <button
          onClick={() => setMode("clay")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            mode === "clay"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Shield size={12} />
          <span>Phôi Clay</span>
        </button>

        <button
          onClick={() => setMode("wireframe")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            mode === "wireframe"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Grid size={12} />
          <span>Lưới Wireframe</span>
        </button>
      </div>

      {/* Top right badges */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-neutral-900/90 border border-neutral-700 text-orange-400 backdrop-blur-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Interactive 3D Stage
        </span>
      </div>

      {/* Bottom control tools */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl border backdrop-blur-md transition ${
            autoRotate
              ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
              : "bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:text-white"
          }`}
          title={autoRotate ? "Tắt tự xoay" : "Bật tự xoay"}
        >
          <RotateCw size={15} className={autoRotate ? "animate-spin" : ""} />
        </button>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 rounded-xl border backdrop-blur-md transition ${
            showGrid
              ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
              : "bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:text-white"
          }`}
          title="Bật/tắt mặt bàn in 3D"
        >
          <Grid size={15} />
        </button>

        <button
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white backdrop-blur-md transition"
          title="Đặt lại góc nhìn"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Bottom right indicator */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900/80 border border-neutral-800 px-2.5 py-1 rounded-lg backdrop-blur">
          Kéo chuột để xoay 360° • Cuộn để zoom
        </span>
      </div>
    </div>
  );
}
