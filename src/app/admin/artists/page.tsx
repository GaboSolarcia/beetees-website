import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import DeleteArtistButton from "@/components/admin/DeleteArtistButton";

export default async function AdminArtists() {
  const artists = await prisma.artist.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-5xl mt-10 md:mt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Artistas</h1>
        <Link
          href="/admin/artists/new"
          className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors text-sm"
        >
          <Plus size={16} />
          Nuevo artista
        </Link>
      </div>

      <div className="space-y-3">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
              {artist.coverImage ? (
                <Image src={artist.coverImage} alt={artist.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Sin foto</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold truncate">{artist.name}</p>
              <p className="text-white/40 text-sm">{artist._count.products} producto{artist._count.products !== 1 ? "s" : ""}</p>
            </div>

            <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${artist.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {artist.isActive ? "Activo" : "Inactivo"}
            </span>

            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/admin/artists/${artist.id}`}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <Pencil size={14} />
                Editar
              </Link>
              <DeleteArtistButton id={artist.id} name={artist.name} />
            </div>
          </div>
        ))}

        {artists.length === 0 && (
          <div className="text-center py-20 text-white/30">
            No hay artistas aún.{" "}
            <Link href="/admin/artists/new" className="text-yellow-400">Crea el primero →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
