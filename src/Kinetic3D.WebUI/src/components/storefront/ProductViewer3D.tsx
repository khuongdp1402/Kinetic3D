"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Text, Center } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function Model({ url, customText }: { url: string; customText: string }) {
  // Load the GLTF model. Make sure MinIO CORS is configured to allow GET from localhost.
  const { scene } = useGLTF(url);

  return (
    <group>
      <Center>
        <primitive object={scene} />
      </Center>
      
      {/* If customText is provided, render it floating in front of the model */}
      {customText && (
        <Text
          position={[0, 0.5, 2]} // Placed slightly in front and up
          fontSize={0.5}
          color="#00FFFF" // Cyan accent
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0B0B0B" // Obsidian black outline for contrast
        >
          {customText}
        </Text>
      )}
    </group>
  );
}

export function ProductViewer3D({ modelUrl, customText }: { modelUrl: string; customText: string }) {
  return (
    <div className="w-full h-full bg-[#0B0B0B]">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={["#0B0B0B"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#00FFFF" />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#FF5F1F" />
        
        <Suspense fallback={null}>
          <Model url={modelUrl} customText={customText} />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls makeDefault minDistance={2} maxDistance={10} />
      </Canvas>
    </div>
  );
}

// Preload standard model if we know it ahead of time, else it loads dynamically
// useGLTF.preload('/path-to-model.glb');
