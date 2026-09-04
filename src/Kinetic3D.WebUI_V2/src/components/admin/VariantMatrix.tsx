"use client";

import React, { useState, useEffect } from "react";

interface Variant {
  price: number | null;
  attributes: Record<string, string>;
}

interface VariantMatrixProps {
  onChange?: (variants: Variant[]) => void;
}

export default function VariantMatrix({ onChange }: VariantMatrixProps) {
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    if (onChange) {
      onChange(variants);
    }
  }, [variants, onChange]);

  const addVariant = () => {
    setVariants([...variants, { price: null, attributes: { "Kích thước": "L", "Màu sắc": "Đỏ" } }]);
  };

  const updatePrice = (index: number, value: string) => {
    const newVariants = [...variants];
    newVariants[index].price = value.trim() === "" ? null : Number(value);
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl mb-1 font-semibold">Biến thể sản phẩm</h3>
      <p className="text-sm text-neutral-400 mb-4">
        Mỗi biến thể là một tổ hợp thuộc tính (VD: màu + size) có thể có giá riêng. Để trống giá sẽ dùng giá gốc sản phẩm.
      </p>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="py-2 w-40">Giá riêng (VNĐ)</th>
            <th className="py-2">Thuộc tính (JSON)</th>
            <th className="py-2 w-20">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v, i) => (
            <tr key={i} className="border-b border-neutral-800 align-top">
              <td className="py-2 pr-2">
                <input
                  type="number"
                  placeholder="Dùng giá gốc"
                  className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-cyan-400 outline-none text-sm"
                  value={v.price ?? ""}
                  onChange={(e) => updatePrice(i, e.target.value)}
                />
              </td>
              <td className="py-2">
                <textarea
                  className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-cyan-400 outline-none font-mono text-sm"
                  rows={2}
                  value={JSON.stringify(v.attributes)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      const newVariants = [...variants];
                      newVariants[i].attributes = parsed;
                      setVariants(newVariants);
                    } catch {
                      // ignore parse errors while typing
                    }
                  }}
                />
              </td>
              <td className="py-2">
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-500 hover:text-red-400"
                >
                  Xóa
                </button>
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
        + Thêm biến thể
      </button>
    </div>
  );
}
