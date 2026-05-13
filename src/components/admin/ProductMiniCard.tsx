import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  isActive: boolean;
  images: { url: string }[];
};

export default function ProductMiniCard({ product }: { product: Product }) {
  const img = product.images[0];
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
        {img ? (
          <Image src={img.url} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Sin foto</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{product.name}</p>
        <p className="text-white/40 text-xs">{product.category}{product.price ? ` · ₡${product.price.toLocaleString()}` : ""}</p>
      </div>
      <Link
        href={`/admin/products/${product.id}`}
        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors flex-shrink-0"
      >
        <Pencil size={13} />
      </Link>
    </div>
  );
}
