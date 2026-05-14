import { prisma } from "@/lib/db";
import Navbar from "@/components/shop/Navbar";
import HeroCarousel from "@/components/shop/HeroCarousel";
import ArtistSection from "@/components/shop/ArtistSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const artists = await prisma.artist.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: { images: { orderBy: { order: "asc" } } },
      },
    },
  });

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {artists.length > 0 ? (
          <>
            <HeroCarousel
              artists={artists.map((a) => ({
                name: a.name,
                slug: a.slug,
                coverImage: a.coverImage,
              }))}
            />
            <div className="bg-black">
              {artists.map((artist) => (
                <ArtistSection key={artist.id} artist={artist} />
              ))}
            </div>
          </>
        ) : (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
              BEETEES<span className="text-yellow-400"> CR</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md">
              Merch exclusivo de tus artistas favoritos. Próximamente productos disponibles.
            </p>
          </div>
        )}

        <footer className="bg-black border-t border-white/10 py-12 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white font-black text-2xl tracking-tighter mb-2">
              BEETEES<span className="text-yellow-400"> CR</span>
            </p>
            <p className="text-white/40 text-sm">© 2025 Beetees Costa Rica. Todos los derechos reservados.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
