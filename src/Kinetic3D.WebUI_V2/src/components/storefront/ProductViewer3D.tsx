"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, useGLTF, Text, Center, Float, PresentationControls } from "@react-three/drei";
import { Suspense } from "react";

function Model({ url, customText }: { url: string; customText: string }) {
  const { scene } = useGLTF(url);

  return (
    <group>
      <Center>
        <primitive object={scene} />
      </Center>
      
      {customText && (
        <Text
          position={[0, 0.5, 2]}
          fontSize={0.5}
          color="#f97316"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#1c1917"
        >
          {customText}
        </Text>
      )}
    </group>
  );
}

export function ProductViewer3D({ modelUrl, customText }: { modelUrl: string; customText: string }) {
  return (
    <div className="w-full h-full" style={{ backgroundColor: "#1c1917" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={["#1c1917"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#f97316" />
        
        <Suspense fallback={null}>
          <PresentationControls 
            global 
            rotation={[0, 0, 0]} 
            polar={[-Math.PI / 4, Math.PI / 4]} 
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <Float
              speed={2} // Animation speed
              rotationIntensity={0.5} // XYZ rotation intensity
              floatIntensity={1} // Up/down float intensity
              floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within
            >
              <Model url={modelUrl} customText={customText} />
            </Float>
          </PresentationControls>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload standard model if we know it ahead of time, else it loads dynamically
// useGLTF.preload('/path-to-model.glb');
