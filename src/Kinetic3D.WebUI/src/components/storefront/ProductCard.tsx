"use client";

import Tilt from "react-parallax-tilt";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  category: string;
  tagline: string;
  imageUrl: string;
}

export default function ProductCard({
  id,
  name,
  price,
  salePrice,
  category,
  tagline,
  imageUrl,
}: ProductCardProps) {
  const isSale = salePrice !== undefined && salePrice < price;

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1000}
      transitionSpeed={1000}
      scale={1.02}
      className="group"
    >
      <div className="relative bg-[#111111] border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-white/20 h-full flex flex-col">
        {isSale && (
          <div className="absolute top-4 left-4 z-10 bg-color-orange text-black text-xs font-mono font-bold px-2 py-1 uppercase">
            Flash Sale
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md text-white/70 text-xs font-mono px-2 py-1 uppercase border border-white/10">
          {category}
        </div>

        <div className="relative w-full aspect-square bg-[#0a0a0a]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-80" />
        </div>

        <div className="p-6 flex flex-col flex-1 justify-between relative z-20 -mt-12">
          <div>
            <h3 className="text-xl font-bold tracking-tighter mb-1">{name}</h3>
            <p className="text-sm text-foreground/50 font-mono mb-4">{tagline}</p>
          </div>
          
          <div className="flex items-end justify-between mt-4">
            <div className="font-mono">
              {isSale ? (
                <>
                  <span className="text-color-cyan text-xl font-bold mr-2">${salePrice?.toFixed(2)}</span>
                  <span className="text-foreground/40 line-through text-sm">${price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-color-cyan text-xl font-bold">${price.toFixed(2)}</span>
              )}
            </div>
            
            <Link 
              href={`/products/${id}`}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground hover:text-color-cyan transition-colors"
            >
              Customize
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </Tilt>
  );
}
