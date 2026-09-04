"use client";

import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, PresentationControls, Float, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

// Component to automatically rotate the model
function AutoRotatingModel({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3; // Adjust speed here
    }
  });
  
  return <group ref={groupRef}>{children}</group>;
}

// Fallback simple 3D mesh if GLTF is not provided or fails to load
function FallbackModel() {
  return (
    <mesh castShadow receiveShadow>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial color="#f97316" roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

export default function TripoHero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
      
      <div className="z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-block rounded-full px-4 py-1.5 border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-purple-300 text-sm font-medium tracking-wide shadow-[0_0_15px_rgba(139,92,246,0.2)]"
        >
          ✨ Kinetic3D Experimental Template
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-purple-400 mb-6 drop-shadow-lg"
        >
          Smarter Creation. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
            Simplified Workflow.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Turn hours of manual 3D work into seconds with AI-powered 3D Modeling. 
          Experience a sleek, modern interface designed for the next generation of creators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex gap-4"
        >
          <button className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transform hover:-translate-y-1">
            Try Studio Now
          </button>
          <button className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold backdrop-blur-md transition-all duration-300 hover:border-purple-500/50">
            View Features
          </button>
        </motion.div>
      </div>

      {/* 3D Showcase Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-auto opacity-40 mix-blend-screen">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f97316" />
              
              <PresentationControls 
                global 
                rotation={[0.13, 0.1, 0]} 
                polar={[-0.4, 0.2]} 
                azimuth={[-1, 0.75]} 
                snap={true}
              >
                <Float rotationIntensity={1} floatIntensity={2} speed={2}>
                   <AutoRotatingModel>
                     <FallbackModel />
                   </AutoRotatingModel>
                </Float>
              </PresentationControls>
              <Environment preset="city" />
            </Canvas>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-10 w-full z-10 flex justify-center gap-12 md:gap-24"
      >
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">10<span className="text-purple-400 text-3xl">x</span></div>
          <div className="text-gray-400 text-sm tracking-widest uppercase">Efficiency Boost</div>
        </div>
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">90<span className="text-purple-400 text-3xl">%</span></div>
          <div className="text-gray-400 text-sm tracking-widest uppercase">Time Saved</div>
        </div>
        <div className="text-center hidden md:block">
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">50<span className="text-purple-400 text-3xl">%</span></div>
          <div className="text-gray-400 text-sm tracking-widest uppercase">Cost Reduction</div>
        </div>
      </motion.div>

    </div>
  );
}
