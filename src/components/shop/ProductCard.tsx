"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  sizes: string | null;
  images: { id: string; url: string; isPrimary: boolean }[];
};

export default function ProductCard({ product }: { product: Product }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = product.images;
  const current = images[imgIndex] ?? null;

  return (
    <Link href={`/shop/${product.id}`} className="block">
    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all duration-300 group">
      <div className="relative h-64 sm:h-80 bg-zinc-900">
        {current ? (
          <>
            <Image
              src={current.url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-yellow-400 w-3" : "bg-white/40"}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white/20 text-xs">Sin imagen</div>
        )}
        <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{product.name}</h3>
        {product.description && (
          <p className="text-white/50 text-xs mt-1 line-clamp-2">{product.description}</p>
        )}
        {product.sizes && (
          <p className="text-white/40 text-xs mt-2">Tallas: {product.sizes}</p>
        )}
        {product.price && (
          <p className="text-yellow-400 font-bold text-sm mt-3">₡{product.price.toLocaleString()}</p>
        )}
      </div>
    </div>
    </Link>
  );
}
