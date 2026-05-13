"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { toast } from "sonner";

type Artist = { id: string; name: string };

type Props = {
  artists: Artist[];
  initial?: {
    id: string;
    name: string;
    date: string;
    venue: string;
    location: string | null;
    description: string | null;
    posterImage: string | null;
    artistId: string;
    isActive: boolean;
    order: number;
  };
};

export default function EventForm({ artists, initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [date, setDate] = useState(
    initial?.date ? new Date(initial.date).toISOString().slice(0, 16) : ""
  );
  const [venue, setVenue] = useState(initial?.venue ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [posterImage, setPosterImage] = useState(initial?.posterImage ?? "");
  const [artistId, setArtistId] = useState(initial?.artistId ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("El nombre es requerido");
    if (!date) return toast.error("La fecha es requerida");
    if (!venue.trim()) return toast.error("El venue es requerido");
    if (!artistId) return toast.error("Selecciona un artista");
    setSaving(true);

    const url = initial ? `/api/events/${initial.id}` : "/api/events";
    const method = initial ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, venue, location, description, posterImage, artistId, isActive, order }),
    });

    setSaving(false);

    if (res.ok) {
      toast.success(initial ? "Evento actualizado" : "Evento creado");
      router.push("/admin/events");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Error al guardar");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm text-white/70 mb-1.5 font-medium">Nombre del evento *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ej: Lollapalooza Costa Rica 2025"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/70 mb-1.5 font-medium">Fecha y hora *</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1.5 font-medium">Artista *</label>
          <select
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
          >
            <option value="">Seleccionar artista...</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1.5 font-medium">Venue *</label>
        <input
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
          placeholder="Ej: Estadio Nacional"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1.5 font-medium">Ubicación</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ej: San José, Costa Rica"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1.5 font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Detalles del evento..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1.5 font-medium">Imagen del evento (poster)</label>
        <ImageUploader
          value={posterImage}
          onUpload={setPosterImage}
          label="Subir poster del evento"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/70 mb-1.5 font-medium">Orden</label>
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
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
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
          {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear evento"}
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
