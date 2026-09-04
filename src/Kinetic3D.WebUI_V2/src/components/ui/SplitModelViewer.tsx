"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, PresentationControls, Center, Float } from "@react-three/drei";
import * as THREE from "three";

// Preload common model
useGLTF.preload("/models/reelseat_tcp.glb");

interface ClippedModelProps {
  url: string;
  splitXRatioRef: React.MutableRefObject<number>;
  isClay: boolean;
  isHoveringRef: React.MutableRefObject<boolean>;
}

function ClippedModel({ url, splitXRatioRef, isClay, isHoveringRef }: ClippedModelProps) {
  const { scene } = useGLTF(url);
  const { viewport } = useThree();
  
  // Clone scene and materials to avoid mutating the global cache
  const clone = useMemo(() => {
    const clonedScene = scene.clone(true);
    clonedScene.traverse((child: any) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          mesh.material = (mesh.material as THREE.Material).clone();
        }
      }
    });
    return clonedScene;
  }, [scene]);

  const plane = useMemo(() => new THREE.Plane(), []);

  // Set up materials
  const clayMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      roughness: 0.8,
      metalness: 0.2,
      emissive: 0x00ffff,
      emissiveIntensity: 0.15,
      clippingPlanes: [plane],
      wireframe: false,
    });
  }, [plane]);

  // Hologram wireframe overlay material
  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      clippingPlanes: [plane],
    });
  }, [plane]);

  useFrame(() => {
    // If not hovering, keep the entire model colored
    const ratio = isHoveringRef.current ? splitXRatioRef.current : 0;
    const clipX = (ratio - 0.5) * viewport.width;

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
          // For the "clay" side, we can render the raw clay material
          mesh.material = clayMaterial;
        } else {
          // For the colored side, restore original materials but apply clipping
          if (mesh.material) {
            (mesh.material as THREE.Material).clippingPlanes = [plane];
          }
        }
      }
    });
  });

  return (
    <group>
      <primitive object={clone} />
      {/* If it's the raw side, we also render a wireframe overlay for a cool tech effect */}
      {isClay && (
        <primitive 
          object={clone.clone(true)} 
          onClick={(e: any) => e.stopPropagation()}
          onPointerOver={(e: any) => e.stopPropagation()}
        />
      )}
    </group>
  );
}

// Special component for wireframe overlay
function WireframeOverlay({ url, splitXRatioRef, isHoveringRef }: { url: string; splitXRatioRef: React.MutableRefObject<number>; isHoveringRef: React.MutableRefObject<boolean> }) {
  const { scene } = useGLTF(url);
  const { viewport } = useThree();
  
  const plane = useMemo(() => new THREE.Plane(), []);
  
  const wireframeScene = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child: any) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          wireframe: true,
          transparent: true,
          opacity: 0.25,
          clippingPlanes: [plane]
        });
      }
    });
    return cloned;
  }, [scene, plane]);

  useFrame(() => {
    const ratio = isHoveringRef.current ? splitXRatioRef.current : 0;
    const clipX = (ratio - 0.5) * viewport.width;
    
    // Keep left side (x < clipX)
    plane.normal.set(-1, 0, 0);
    plane.constant = clipX;
  });

  return <primitive object={wireframeScene} />;
}

interface SplitModelViewerProps {
  modelUrl: string;
  heightClass?: string;
}

export default function SplitModelViewer({ modelUrl, heightClass = "h-[450px]" }: SplitModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const splitXRatioRef = useRef<number>(0.5);
  const isHoveringRef = useRef<boolean>(false);
  const [isHoveredState, setIsHoveredState] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = x / rect.width;
    
    splitXRatioRef.current = ratio;
    isHoveringRef.current = true;

    if (dividerRef.current) {
      dividerRef.current.style.left = `${x}px`;
    }
  };

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    setIsHoveredState(true);
    if (dividerRef.current) {
      dividerRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    setIsHoveredState(false);
    if (dividerRef.current) {
      dividerRef.current.style.opacity = "0";
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${heightClass} rounded-2xl bg-gradient-to-b from-[#101014] to-[#070709] border border-white/10 overflow-hidden group select-none`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ localClippingEnabled: true }} camera={{ position: [0, 0, 3.5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#f97316" />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#d946ef" />
          <Environment preset="city" />
          
          <PresentationControls 
            global 
            rotation={[0.1, -0.3, 0]} 
            polar={[-0.4, 0.4]} 
            azimuth={[-0.8, 0.8]}
          >
            <Center>
              <Float rotationIntensity={0.2} floatIntensity={0.4} speed={1.5}>
                {/* 1. Fully textured model (renders on the right side) */}
                <ClippedModel 
                  url={modelUrl} 
                  splitXRatioRef={splitXRatioRef} 
                  isClay={false} 
                  isHoveringRef={isHoveringRef} 
                />
                
                {/* 2. Clay model (renders on the left side) */}
                <ClippedModel 
                  url={modelUrl} 
                  splitXRatioRef={splitXRatioRef} 
                  isClay={true} 
                  isHoveringRef={isHoveringRef} 
                />

                {/* 3. Wireframe holographic overlay (renders on the left side) */}
                <WireframeOverlay 
                  url={modelUrl} 
                  splitXRatioRef={splitXRatioRef} 
                  isHoveringRef={isHoveringRef} 
                />
              </Float>
            </Center>
          </PresentationControls>
        </Canvas>
      </div>

      {/* Vertical Slider Bar Indicator */}
      <div 
        ref={dividerRef}
        className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-400 via-orange-500 to-amber-500 shadow-[0_0_15px_#f97316] z-20 pointer-events-none transition-opacity duration-300"
        style={{ left: "50%", transform: "translateX(-50%)", opacity: isHoveredState ? 1 : 0 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/80 border border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Floating Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 flex items-center gap-2 pointer-events-none font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        Drag to rotate. Hover to split render.
      </div>
    </div>
  );
}
