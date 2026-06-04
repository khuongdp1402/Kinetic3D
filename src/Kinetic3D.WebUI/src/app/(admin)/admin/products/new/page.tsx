"use client";

import React, { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import VariantMatrix from "@/components/admin/VariantMatrix";

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    // Collect data and POST to backend
    const productData = { name, description };
    console.log("Saving product:", productData);
    // Integration logic
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Add New Product</h1>
      
      <div className="bg-neutral-900 p-6 rounded-lg shadow border border-neutral-800">
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Product Name</label>
          <input
            type="text"
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Description</label>
          <textarea
            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 focus:border-cyan-400 outline-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <ImageUpload />
        
        <VariantMatrix />

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
