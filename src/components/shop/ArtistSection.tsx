import Image from "next/image";
import Link from "next/link";
import ArtistCarousel from "./ArtistCarousel";

type Artist = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  products: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    category: string;
    sizes: string | null;
    images: { id: string; url: string; isPrimary: boolean }[];
  }[];
};

export default function ArtistSection({ artist }: { artist: Artist }) {
  return (
    <section className="py-16 border-b border-white/10 last:border-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 mb-10">
          {artist.coverImage && (
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-400 flex-shrink-0">
              <Image src={artist.coverImage} alt={artist.name} fill className="object-cover object-top" />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">{artist.name}</h2>
            {artist.description && (
              <p className="text-white/60 mt-1 max-w-xl">{artist.description}</p>
            )}
            <Link
              href={`/artists/${artist.slug}`}
              className="inline-block mt-2 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors"
            >
              Ver toda la colección →
            </Link>
          </div>
        </div>

        <ArtistCarousel products={artist.products} />
      </div>
    </section>
  );
}
