import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ artistId?: string }>;
}) {
  const { artistId } = await searchParams;
  const artists = await prisma.artist.findMany({ orderBy: { name: "asc" } });

  if (artists.length === 0) {
    return (
      <div className="max-w-2xl mt-10 md:mt-0">
        <h1 className="text-3xl font-black text-white tracking-tight mb-4">Nuevo producto</h1>
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-6 text-yellow-400">
          <p className="font-bold mb-2">Primero debes crear un artista</p>
          <p className="text-sm opacity-80">Los productos pertenecen a un artista. Crea al menos uno antes de agregar productos.</p>
          <Link href="/admin/artists/new" className="mt-4 inline-block bg-yellow-400 text-black font-bold px-5 py-2 rounded-xl text-sm hover:bg-yellow-300 transition-colors">
            Crear artista →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mt-10 md:mt-0">
      <Link href="/admin/products" className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft size={16} /> Volver a productos
      </Link>
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Nuevo producto</h1>
      <ProductForm artists={artists} defaultArtistId={artistId} />
    </div>
  );
}
