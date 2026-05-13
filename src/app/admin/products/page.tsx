import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      artist: true,
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });

  return (
    <div className="max-w-5xl mt-10 md:mt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Productos</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors text-sm"
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => {
          const img = product.images[0];
          return (
            <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
                {img ? (
                  <Image src={img.url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Sin foto</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{product.name}</p>
                <p className="text-white/40 text-sm">{product.artist.name} · {product.category}</p>
              </div>

              {product.price && (
                <span className="text-yellow-400 font-bold text-sm flex-shrink-0">₡{product.price.toLocaleString()}</span>
              )}

              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {product.isActive ? "Activo" : "Inactivo"}
              </span>

              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/admin/products/${product.id}`} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  <Pencil size={14} />
                  Editar
                </Link>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="text-center py-20 text-white/30">
            No hay productos aún.{" "}
            <Link href="/admin/products/new" className="text-yellow-400">Crea el primero →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
