"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteArtistButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const res = await fetch(`/api/artists/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(`${name} eliminado`);
      router.refresh();
    } else {
      toast.error("Error al eliminar");
    }
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div className="flex gap-1">
        <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors">
          Confirmar
        </button>
        <button onClick={() => setConfirming(false)} className="bg-white/10 text-white px-3 py-2 rounded-lg text-xs hover:bg-white/20 transition-colors">
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors"
    >
      <Trash2 size={14} />
    </button>
  );
}
