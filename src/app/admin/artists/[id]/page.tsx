import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ArtistForm from "@/components/admin/ArtistForm";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import ProductMiniCard from "@/components/admin/ProductMiniCard";

export default async function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: { order: "asc" },
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
      },
    },
  });

  if (!artist) return notFound();

  return (
    <div className="max-w-4xl mt-10 md:mt-0">
      <Link href="/admin/artists" className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft size={16} /> Volver a artistas
      </Link>
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Editar: {artist.name}</h1>

      <ArtistForm initial={artist} />

      <div className="mt-12 border-t border-white/10 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Productos de {artist.name}</h2>
          <Link
            href={`/admin/products/new?artistId=${artist.id}`}
            className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors text-sm"
          >
            <Plus size={15} />
            Agregar producto
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {artist.products.map((product) => (
            <ProductMiniCard key={product.id} product={product} />
          ))}
          {artist.products.length === 0 && (
            <p className="text-white/30 text-sm col-span-2">
              No hay productos aún.{" "}
              <Link href={`/admin/products/new?artistId=${artist.id}`} className="text-yellow-400">Agrega el primero →</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
