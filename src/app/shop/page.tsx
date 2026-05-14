import { prisma } from "@/lib/db";
import Navbar from "@/components/shop/Navbar";
import ProductCard from "@/components/shop/ProductCard";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      images: { orderBy: { order: "asc" } },
      artist: true,
    },
  });

  const byArtist = products.reduce<Record<string, typeof products>>((acc, p) => {
    const key = p.artist.name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Tienda</h1>
          <p className="text-white/50 mb-12">Todos los productos disponibles</p>

          {Object.entries(byArtist).map(([artistName, prods]) => (
            <div key={artistName} className="mb-16">
              <h2 className="text-2xl font-black text-white tracking-tight mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-yellow-400 rounded-full inline-block" />
                {artistName}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {prods.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center py-20 text-white/40">
              Próximamente productos disponibles.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
