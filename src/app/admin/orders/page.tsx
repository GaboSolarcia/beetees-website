import { prisma } from "@/lib/db";
import OrderStatusButton from "@/components/admin/OrderStatusButton";
import { Package } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-500/20 text-yellow-400",
  paid:      "bg-green-500/20 text-green-400",
  shipped:   "bg-blue-500/20 text-blue-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "Pendiente",
  paid:      "Pagado",
  shipped:   "Enviado",
  cancelled: "Cancelado",
};

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="max-w-5xl mt-10 md:mt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Pedidos</h1>
        <span className="text-white/40 text-sm">{orders.length} pedido{orders.length !== 1 ? "s" : ""}</span>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-20 text-white/30 flex flex-col items-center gap-3">
          <Package size={40} className="opacity-30" />
          <p>No hay pedidos aún.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-black text-lg">#{order.orderNumber}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${STATUS_STYLES[order.status] ?? "bg-white/10 text-white/40"}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className="text-white/30 text-xs bg-white/5 px-2 py-1 rounded-full">
                    {order.paymentMethod === "sinpe" ? "SINPE" : "Tarjeta"}
                  </span>
                </div>
                <p className="text-white/70 text-sm">{order.customerName} · {order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="text-white/40 text-xs mt-0.5">{order.customerPhone}</p>
                )}
                <p className="text-white/30 text-xs mt-0.5">
                  {order.deliveryType === "delivery" ? "🚚 Delivery" : "🏪 Retiro en tienda"}
                  {order.deliveryAddress && ` · ${order.deliveryAddress}`}
                </p>
                <p className="text-white/30 text-xs mt-1">
                  {new Date(order.createdAt).toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-yellow-400 font-black text-xl mb-2">₡{order.total.toLocaleString("es-CR")}</p>
                <OrderStatusButton id={order.id} currentStatus={order.status} />
              </div>
            </div>

            {/* Items */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {order.items.map((item) => (
                  <span key={item.id} className="text-xs bg-white/5 text-white/50 px-3 py-1 rounded-full">
                    {item.name}{item.size ? ` (${item.size})` : ""} ×{item.quantity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
