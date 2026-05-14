"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { toast } from "sonner";
import { X, Star } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["Camiseta", "Hoodie", "Gorra", "Bolso", "Accesorio", "Otro"];

type ProductImage = { id: string; url: string; isPrimary: boolean; order: number };

type Props = {
  artists: { id: string; name: string }[];
  initial?: {
    id: string;
    artistId: string;
    name: string;
    description: string | null;
    price: number | null;
    category: string;
    sizes: string | null;
    isActive: boolean;
    order: number;
    images: ProductImage[];
  };
  defaultArtistId?: string;
};

export default function ProductForm({ artists, initial, defaultArtistId }: Props) {
  const router = useRouter();
  const [artistId, setArtistId] = useState(initial?.artistId ?? defaultArtistId ?? artists[0]?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [sizes, setSizes] = useState(initial?.sizes ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [images, setImages] = useState<ProductImage[]>(initial?.images ?? []);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("El nombre es requerido");
    if (!artistId) return toast.error("Selecciona un artista");
    setSaving(true);

    const url = initial ? `/api/products/${initial.id}` : "/api/products";
    const method = initial ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId, name, description, price, category, sizes, isActive, order }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Error al guardar");
      setSaving(false);
      return;
    }

    const product = await res.json();
    toast.success(initial ? "Producto actualizado" : "Producto creado");

    if (!initial) {
      router.push(`/admin/products/${product.id}`);
    } else {
      router.refresh();
    }
    setSaving(false);
  }

  async function handleImageUpload(url: string) {
    if (!initial) return toast.error("Guarda el producto primero para agregar imágenes");
    const isPrimary = images.length === 0;
    const res = await fetch(`/api/products/${initial.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, isPrimary, order: images.length }),
    });
    if (res.ok) {
      const img = await res.json();
      setImages((prev) => [...prev, img]);
      toast.success("Imagen agregada");
    }
  }

  async function handleSetPrimary(imageId: string) {
    if (!initial) return;
    await fetch(`/api/products/${initial.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: images.find(i => i.id === imageId)?.url, isPrimary: true, order: 0 }),
    });
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })));
  }

  async function handleDeleteImage(imageId: string) {
    if (!initial) return;
    await fetch(`/api/products/${initial.id}/images?imageId=${imageId}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    toast.success("Imagen eliminada");
  }

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-white/70 mb-1.5 font-medium">Artista *</label>
          <select
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            required
            className="w-full bg-zinc-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
          >
            {artists.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1.5 font-medium">Nombre del producto *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Camiseta Bad Bunny Tour 2025"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1.5 font-medium">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descripción del producto..."
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1.5 font-medium">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1.5 font-medium">Precio (₡)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 15000"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1.5 font-medium">Tallas disponibles</label>
            <input
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="XS, S, M, L, XL, XXL"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1.5 font-medium">Estado</label>
            <select
              value={isActive ? "1" : "0"}
              onChange={(e) => setIsActive(e.target.value === "1")}
              className="w-full bg-zinc-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option value="1">Activo (visible)</option>
              <option value="0">Inactivo (oculto)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear producto"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white/10 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      {initial && (
        <div className="border-t border-white/10 pt-8">
          <h2 className="text-lg font-bold text-white mb-4">
            Imágenes del producto
            <span className="text-white/40 text-sm font-normal ml-2">({images.length} fotos)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/20">
                <div className="relative h-32">
                  <Image src={img.url} alt="producto" fill className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      className="bg-yellow-400 text-black p-1.5 rounded-lg"
                      title="Hacer principal"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="bg-red-500 text-white p-1.5 rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
                {img.isPrimary && (
                  <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Star size={9} /> Principal
                  </div>
                )}
              </div>
            ))}
          </div>

          <ImageUploader
            onUpload={handleImageUpload}
            label="Agregar imagen al producto"
          />
          <p className="text-white/30 text-xs mt-2">La primera imagen agregada será la principal. Puedes cambiarla haciendo clic en la estrella.</p>
        </div>
      )}
    </div>
  );
}
