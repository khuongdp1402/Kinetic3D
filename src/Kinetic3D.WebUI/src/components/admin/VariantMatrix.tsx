"use client";

import React, { useState } from "react";

export default function VariantMatrix() {
  const [variants, setVariants] = useState<any[]>([]);

  const addVariant = () => {
    setVariants([...variants, { sku: "", price: 0, stock: 0 }]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl mb-4 font-semibold">Variant Matrix</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="py-2">SKU</th>
            <th className="py-2">Price ($)</th>
            <th className="py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v, i) => (
            <tr key={i} className="border-b border-neutral-800">
              <td className="py-2">
                <input
                  type="text"
                  value={v.sku}
                  onChange={(e) => updateVariant(i, "sku", e.target.value)}
                  className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-cyan-400 outline-none"
                />
              </td>
              <td className="py-2">
                <input
                  type="number"
                  value={v.price}
                  onChange={(e) => updateVariant(i, "price", parseFloat(e.target.value))}
                  className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-cyan-400 outline-none"
                />
              </td>
              <td className="py-2">
                <input
                  type="number"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value, 10))}
                  className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-cyan-400 outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addVariant}
        className="mt-4 bg-neutral-800 hover:bg-neutral-700 text-sm py-2 px-4 rounded transition-colors"
      >
        + Add Variant
      </button>
    </div>
  );
}
