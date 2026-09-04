"use client";

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';

export function GlobalCanvas() {
  const container = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={container}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ width: '100vw', height: '100vh' }}
    >
      <Canvas eventSource={typeof document !== 'undefined' ? document.body : undefined} className="pointer-events-none">
        <View.Port />
      </Canvas>
    </div>
  );
}
