"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { toast } from "sonner";

type Props = {
  initial?: {
    id: string;
    name: string;
    description: string | null;
    coverImage: string | null;
    isActive: boolean;
    order: number;
  };
};

export default function ArtistForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("El nombre es requerido");
    setSaving(true);

    const url = initial ? `/api/artists/${initial.id}` : "/api/artists";
    const method = initial ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, coverImage, isActive, order }),
    });

    setSaving(false);

    if (res.ok) {
      toast.success(initial ? "Artista actualizado" : "Artista creado");
      router.push("/admin/artists");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Error al guardar");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm text-white/70 mb-1.5 font-medium">Nombre del artista *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ej: Bad Bunny"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1.5 font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Breve descripción de la colección..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1.5 font-medium">Imagen de portada</label>
        <ImageUploader
          value={coverImage}
          onUpload={setCoverImage}
          label="Subir foto del artista"
        />
        {coverImage && (
          <input type="hidden" value={coverImage} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/70 mb-1.5 font-medium">Orden (número)</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
          />
          <p className="text-white/30 text-xs mt-1">El número más bajo aparece primero</p>
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
          {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear artista"}
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
  );
}
