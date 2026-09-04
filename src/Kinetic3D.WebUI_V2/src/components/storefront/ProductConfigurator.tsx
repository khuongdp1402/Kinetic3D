"use client";

import { PricingOdometer } from "./PricingOdometer";
import { useState } from "react";

interface ProductConfiguratorProps {
  price: number;
  customText: string;
  onTextChange: (text: string) => void;
  onVariantChange: (variant: any) => void;
  onAddToCart: () => void;
}

export function ProductConfigurator({
  price,
  customText,
  onTextChange,
  onVariantChange,
  onAddToCart,
}: ProductConfiguratorProps) {
  const [selectedColor, setSelectedColor] = useState("Obsidian Black");
  const [selectedSize, setSelectedSize] = useState("M");

  const colors = [
    { name: "Obsidian Black", hex: "#1c1917" },
    { name: "Warm Orange", hex: "#f97316" },
    { name: "Clay", hex: "#fb923c" },
  ];
  const sizes = ["S", "M", "L", "XL"];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onVariantChange({ color, size: selectedSize });
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onVariantChange({ color: selectedColor, size });
  };

  return (
    <div className="absolute top-1/2 right-8 -translate-y-1/2 w-80 bg-black/60 backdrop-blur-xl border border-neutral-800 rounded-xl p-6 text-[#F3F4F6] shadow-2xl z-10 flex flex-col gap-6">
      
      {/* Product Title */}
      <div>
        <h2 className="text-2xl font-bold font-sans uppercase tracking-widest text-white mb-1">
          Cyber Jacket V1
        </h2>
        <p className="text-sm text-neutral-400">High-tech modular streetwear</p>
      </div>

      {/* Dynamic Pricing */}
      <div className="py-4 border-y border-neutral-800">
        <PricingOdometer price={price} />
      </div>

      {/* Variant Selection: Color */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-3">
          Select Color
        </h3>
        <div className="flex gap-3">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => handleColorSelect(c.name)}
              title={c.name}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                selectedColor === c.name ? "border-cyan-400 scale-110" : "border-transparent hover:border-neutral-500"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      {/* Variant Selection: Size */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-3">
          Select Size
        </h3>
        <div className="flex gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => handleSizeSelect(s)}
              className={`flex-1 py-2 rounded font-mono font-bold transition-all duration-200 border ${
                selectedSize === s
                  ? "bg-cyan-400 text-black border-cyan-400"
                  : "bg-transparent text-neutral-300 border-neutral-700 hover:border-cyan-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Text Mapping */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-3">
          Custom Text Mapping
        </h3>
        <input
          type="text"
          value={customText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter text..."
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-neutral-600"
          maxLength={15}
        />
      </div>

      {/* Add to Cart CTA */}
      <button
        onClick={onAddToCart}
        className="w-full mt-2 bg-cyan-400 text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] active:scale-95"
      >
        Add To Cart
      </button>

    </div>
  );
}
