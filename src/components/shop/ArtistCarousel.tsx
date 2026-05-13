"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  sizes: string | null;
  images: { id: string; url: string; isPrimary: boolean }[];
};

export default function ArtistCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3500, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!products.length) {
    return (
      <div className="flex items-center justify-center h-48 bg-white/5 rounded-xl text-white/40 text-sm">
        Próximamente productos disponibles
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => {
            const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
            return (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="flex-none w-64 sm:w-72 bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="relative h-72 bg-white/5">
                  {primary ? (
                    <Image
                      src={primary.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/20 text-xs">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {product.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm truncate">{product.name}</h3>
                  {product.description && (
                    <p className="text-white/50 text-xs mt-1 line-clamp-2">{product.description}</p>
                  )}
                  {product.sizes && (
                    <p className="text-white/40 text-xs mt-2">Tallas: {product.sizes}</p>
                  )}
                  {product.price && (
                    <p className="text-yellow-400 font-bold mt-2">₡{product.price.toLocaleString()}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {products.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-black border border-white/20 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-400 hover:text-black hover:border-yellow-400"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-black border border-white/20 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-400 hover:text-black hover:border-yellow-400"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
