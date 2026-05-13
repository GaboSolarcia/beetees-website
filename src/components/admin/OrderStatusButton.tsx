"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TRANSITIONS: Record<string, { label: string; next: string; style: string }[]> = {
  pending: [
    { label: "Marcar como pagado", next: "paid", style: "bg-green-500/20 hover:bg-green-500/40 text-green-400" },
    { label: "Cancelar", next: "cancelled", style: "bg-red-500/10 hover:bg-red-500/20 text-red-400" },
  ],
  paid: [
    { label: "Marcar como enviado", next: "shipped", style: "bg-blue-500/20 hover:bg-blue-500/40 text-blue-400" },
    { label: "Cancelar", next: "cancelled", style: "bg-red-500/10 hover:bg-red-500/20 text-red-400" },
  ],
  shipped: [],
  cancelled: [],
};

export default function OrderStatusButton({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const actions = TRANSITIONS[currentStatus] ?? [];

  if (actions.length === 0) return null;

  async function update(next: string) {
    setLoading(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Estado actualizado");
      router.refresh();
    } else {
      toast.error("Error al actualizar");
    }
  }

  return (
    <div className="flex gap-2 flex-wrap justify-end">
      {actions.map((action) => (
        <button
          key={action.next}
          onClick={() => update(action.next)}
          disabled={loading}
          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors disabled:opacity-50 ${action.style}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
