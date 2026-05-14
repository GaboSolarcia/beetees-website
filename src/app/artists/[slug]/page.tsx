import { prisma } from "@/lib/db";
import Navbar from "@/components/shop/Navbar";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export default async function ArtistPage({ params }: Params) {
  const { slug } = await params;

  const artist = await prisma.artist.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: { images: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!artist) return notFound();

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black">
        <div className="relative h-64 sm:h-96">
          {artist.coverImage ? (
            <Image src={artist.coverImage} alt={artist.name} fill className="object-cover object-top" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter">{artist.name}</h1>
            {artist.description && (
              <p className="text-white/70 mt-2 max-w-2xl">{artist.description}</p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-white/40 text-sm mb-8">{artist.products.length} producto{artist.products.length !== 1 ? "s" : ""} disponibles</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {artist.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {artist.products.length === 0 && (
            <div className="text-center py-20 text-white/40">
              Próximamente productos disponibles para {artist.name}.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
