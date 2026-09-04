"use client";

import React, { Suspense } from 'react';
import { View, Float, Environment, useGLTF } from '@react-three/drei';
import Link from 'next/link';
import { CyberpunkEmptyState } from '@/components/ui/CyberpunkEmptyState';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  modelUrl?: string; // Assume we have a modelUrl
}

interface ProductGrid3DProps {
  products: Product[];
}

export function ProductGrid3D({ products }: ProductGrid3DProps) {
  if (products.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12">
        <CyberpunkEmptyState message="NO PRODUCTS FOUND IN SECTOR" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {products.map((product) => (
        <div key={product.id} className="relative group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-colors flex flex-col">
          {/* 3D Viewport Area */}
          <div className="w-full h-64 relative bg-[#1c1917]">
            {product.modelUrl ? (
              <View className="absolute inset-0">
                <color attach="background" args={['#1c1917']} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} color="#f97316" />
                <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#fb923c" />
                
                <Suspense fallback={null}>
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <Model url={product.modelUrl} />
                  </Float>
                  <Environment preset="city" />
                </Suspense>
              </View>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                [NO MODEL DATA]
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{product.name}</h3>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{product.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-cyan-400 font-bold">${product.basePrice.toFixed(2)}</span>
              <Link href={`/products/${product.id}`} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 rounded text-sm transition-colors uppercase tracking-widest">
                Configure
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
