import { prisma } from "@/lib/db";
import Link from "next/link";
import { Users, ShoppingBag, Image as ImageIcon, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const [artistCount, productCount, imageCount] = await Promise.all([
    prisma.artist.count(),
    prisma.product.count(),
    prisma.productImage.count(),
  ]);

  const recentArtists = await prisma.artist.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-5xl mt-10 md:mt-0">
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Artistas", value: artistCount, icon: Users, color: "bg-yellow-400" },
          { label: "Productos", value: productCount, icon: ShoppingBag, color: "bg-blue-500" },
          { label: "Imágenes", value: imageCount, icon: ImageIcon, color: "bg-purple-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <div className={`${color} rounded-xl p-3`}>
              <Icon size={22} className="text-black" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-white/50 text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/admin/artists/new"
          className="flex items-center gap-3 bg-yellow-400 text-black font-bold px-6 py-4 rounded-2xl hover:bg-yellow-300 transition-colors"
        >
          <Plus size={20} />
          Agregar nuevo artista
        </Link>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 bg-white/10 text-white font-bold px-6 py-4 rounded-2xl hover:bg-white/20 transition-colors border border-white/20"
        >
          <Plus size={20} />
          Agregar nuevo producto
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Artistas recientes</h2>
        <div className="space-y-3">
          {recentArtists.map((artist) => (
            <Link
              key={artist.id}
              href={`/admin/artists/${artist.id}`}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div>
                <p className="text-white font-medium group-hover:text-yellow-400 transition-colors">{artist.name}</p>
                <p className="text-white/40 text-xs">{artist._count.products} producto{artist._count.products !== 1 ? "s" : ""}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${artist.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {artist.isActive ? "Activo" : "Inactivo"}
              </span>
            </Link>
          ))}
          {recentArtists.length === 0 && (
            <p className="text-white/30 text-sm">No hay artistas aún. <Link href="/admin/artists/new" className="text-yellow-400">Crea el primero →</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}
