import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, artists] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    prisma.artist.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) return notFound();

  return (
    <div className="max-w-2xl mt-10 md:mt-0">
      <Link href="/admin/products" className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft size={16} /> Volver a productos
      </Link>
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Editar: {product.name}</h1>
      <ProductForm artists={artists} initial={product} />
    </div>
  );
}
