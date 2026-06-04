"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ProductConfigurator } from "@/components/storefront/ProductConfigurator";

// Dynamically import the 3D viewer so it doesn't SSR (which would crash on WebGL missing)
const ProductViewer3D = dynamic(
  () => import("@/components/storefront/ProductViewer3D").then((mod) => mod.ProductViewer3D),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-cyan-400 font-mono animate-pulse">Initializing 3D Engine...</div> }
);

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [customText, setCustomText] = useState("KINETIC");
  const [price, setPrice] = useState(299.99);

  // In a real implementation we would fetch the product details from the API using params.id
  // and load the specific .glb file for this product.
  // We'll use a placeholder URL that assumes a model exists, or it will just show empty if not found.
  const modelUrl = "http://localhost:9000/kinetic3d-assets/cyber-jacket.glb";

  const handleVariantChange = (variant: { color: string; size: string }) => {
    // Simulate dynamic pricing based on variant
    let basePrice = 299.99;
    
    // Add premiums
    if (variant.color === "Neon Orange") basePrice += 20;
    if (variant.size === "XL") basePrice += 15;
    if (variant.size === "L") basePrice += 10;
    
    setPrice(basePrice);
  };

  const handleAddToCart = () => {
    // We'll implement this in Plan 2 with Zustand
    console.log("Added to cart:", { id: params.id, customText, price });
  };

  return (
    <div className="relative w-full h-screen bg-[#0B0B0B] overflow-hidden">
      {/* The 3D Viewer occupies the entire background */}
      <div className="absolute inset-0">
        <ProductViewer3D modelUrl={modelUrl} customText={customText} />
      </div>

      {/* The UI Overlay */}
      <ProductConfigurator
        price={price}
        customText={customText}
        onTextChange={setCustomText}
        onVariantChange={handleVariantChange}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
