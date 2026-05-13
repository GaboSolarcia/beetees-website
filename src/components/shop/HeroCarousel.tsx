"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

type Artist = { name: string; slug: string; coverImage: string | null };

export default function HeroCarousel({ artists }: { artists: Artist[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);

  if (!artists.length) return null;

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {artists.map((artist) => (
          <div
            key={artist.slug}
            className="flex-none w-full relative h-[70vh] min-h-96"
          >
            {artist.coverImage ? (
              <Image
                src={artist.coverImage}
                alt={artist.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-12 left-8 sm:left-16">
              <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
                Colección
              </p>
              <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-4">
                {artist.name}
              </h2>
              <Link
                href={`/artists/${artist.slug}`}
                className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors"
              >
                Ver colección
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
