import { prisma } from "@/lib/db";
import Navbar from "@/components/shop/Navbar";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ArtistsPage() {
  const artists = await prisma.artist.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Artistas</h1>
          <p className="text-white/50 mb-12">Explora colecciones por artista</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.slug}`} className="group">
                <div className="relative h-72 rounded-2xl overflow-hidden border border-white/10 group-hover:border-yellow-400/50 transition-all duration-300">
                  {artist.coverImage ? (
                    <Image src={artist.coverImage} alt={artist.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-black text-white tracking-tight">{artist.name}</h2>
                    <p className="text-white/60 text-sm mt-1">{artist._count.products} producto{artist._count.products !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </Link>
            ))}

            {artists.length === 0 && (
              <p className="text-white/40 col-span-3 text-center py-20">
                Próximamente colecciones disponibles.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
