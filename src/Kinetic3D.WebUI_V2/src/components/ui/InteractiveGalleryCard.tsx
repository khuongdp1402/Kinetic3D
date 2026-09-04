"use client";

import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, PresentationControls, Center, Float } from "@react-three/drei";
import * as THREE from "three";

// Preload the model
useGLTF.preload("/models/reelseat_tcp.glb");

function ClippedModel({ url, splitXRatio, isClay }: { url: string, splitXRatio: number, isClay: boolean }) {
  const { scene } = useGLTF(url);
  const { viewport } = useThree();
  
  // Clone scene and materials to avoid mutating the global cache
  const clone = useMemo(() => {
    const clonedScene = scene.clone(true);
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
           mesh.material = (mesh.material as THREE.Material).clone();
           // Remove standard textures if we want a pure clay look, or just use a new material
        }
      }
    });
    return clonedScene;
  }, [scene]);

  const plane = useMemo(() => new THREE.Plane(), []);

  useFrame(() => {
    const clipX = (splitXRatio - 0.5) * viewport.width;

    if (isClay) {
      // Keep left side (x < clipX). Clip right side (x > clipX).
      plane.normal.set(-1, 0, 0);
      plane.constant = clipX;
    } else {
      // Keep right side (x > clipX). Clip left side (x < clipX).
      plane.normal.set(1, 0, 0);
      plane.constant = -clipX;
    }

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (isClay) {
          if (!mesh.userData.clayMaterial) {
            mesh.userData.clayMaterial = new THREE.MeshStandardMaterial({
              color: 0x888888,
              roughness: 0.9,
              metalness: 0.1,
              clippingPlanes: [plane]
            });
          }
          mesh.material = mesh.userData.clayMaterial;
        } else {
          if (mesh.material) {
            (mesh.material as THREE.Material).clippingPlanes = [plane];
          }
        }
      }
    });
  });

  return <primitive object={clone} />;
}

export function InteractiveGalleryCard({ modelUrl, title, author }: { modelUrl: string, title: string, author: string }) {
  const [splitX, setSplitX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSplitX(e.clientX - rect.left);
  };

  const isHovering = splitX !== null;
  const width = containerRef.current?.offsetWidth || 1;
  const splitXRatio = isHovering ? splitX / width : 0; // Default to 0 (all colored) when not hovering

  return (
    <div 
      className="relative w-full aspect-square rounded-2xl bg-[#131313] overflow-hidden group cursor-pointer border border-white/5 hover:border-purple-500/30 transition-colors shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSplitX(null)}
      ref={containerRef}
    >
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ localClippingEnabled: true }} camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <Environment preset="city" />
          
          <PresentationControls global rotation={[0.1, -0.3, 0]} polar={[-0.4, 0.4]} azimuth={[-0.5, 0.5]} snap={true}>
            <Center>
              <Float rotationIntensity={0.2} floatIntensity={0.5} speed={2}>
                {/* Colored Model (Right Side) */}
                <ClippedModel url={modelUrl} splitXRatio={isHovering ? splitXRatio : 0} isClay={false} />
                
                {/* Clay Model (Left Side) */}
                {isHovering && (
                  <ClippedModel url={modelUrl} splitXRatio={splitXRatio} isClay={true} />
                )}
              </Float>
            </Center>
          </PresentationControls>
        </Canvas>
      </div>

      {/* Divider Line in HTML Overlay */}
      {isHovering && (
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-purple-400 shadow-[0_0_15px_#a855f7] z-20 pointer-events-none"
          style={{ left: `${splitX}px`, transform: 'translateX(-50%)' }}
        />
      )}

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent z-30 flex justify-between items-end opacity-80 group-hover:opacity-100 transition-opacity">
        <div>
          <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
          <p className="text-purple-300 text-xs tracking-wider">CREATOR: {author}</p>
        </div>
        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5">
          <span className="text-xs font-medium text-white">❤️ 120</span>
        </div>
      </div>
    </div>
  );
}
