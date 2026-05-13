"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shop/Navbar";
import { toast } from "sonner";
import { Package, User, LogOut } from "lucide-react";
import { formatPhone, isValidPhone } from "@/lib/utils";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

type OrderItem = { id: string; name: string; quantity: number; size: string | null };

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentMethod: string;
  deliveryType: string;
  deliveryAddress: string | null;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-500/20 text-yellow-400",
  paid:      "bg-green-500/20 text-green-400",
  shipped:   "bg-blue-500/20 text-blue-400",
  cancelled: "bg-red-500/20 text-red-400",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente de pago",
  paid: "Pago confirmado",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

export default function MiCuentaPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetch("/api/auth/customer/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data) { router.push("/login"); return; }
        setCustomer(data);
        setName(data.name);
        setPhone(data.phone ?? "");
        setAddress(data.address ?? "");
        setLoading(false);
      });
  }, [router]);

  useEffect(() => {
    if (!customer) return;
    fetch(`/api/customers/${customer.id}/orders`)
      .then((r) => r.json())
      .then(setOrders);
  }, [customer]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) return;
    if (phone && !isValidPhone(phone)) return toast.error("El teléfono debe tener el formato 6120-2210");
    setSaving(true);
    const res = await fetch(`/api/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address }),
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setCustomer(updated);
      toast.success("Perfil actualizado");
    } else {
      toast.error("Error al guardar");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    toast.success("Sesión cerrada");
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Hola, {customer?.name.split(" ")[0]} 👋</h1>
              <p className="text-white/40 text-sm mt-1">{customer?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/30 hover:text-red-400 text-sm transition-colors"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8 w-fit">
            <button
              onClick={() => setTab("orders")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "orders" ? "bg-yellow-400 text-black" : "text-white/50 hover:text-white"}`}
            >
              <Package size={16} />
              Mis pedidos
            </button>
            <button
              onClick={() => setTab("profile")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "profile" ? "bg-yellow-400 text-black" : "text-white/50 hover:text-white"}`}
            >
              <User size={16} />
              Mi perfil
            </button>
          </div>

          {/* Orders tab */}
          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 && (
                <div className="text-center py-20 text-white/30">
                  <Package size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Aún no tienes pedidos.</p>
                </div>
              )}
              {orders.map((order) => (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-black">Pedido #{order.orderNumber}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${STATUS_STYLES[order.status] ?? "bg-white/10 text-white/40"}`}>
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>
                      <p className="text-white/30 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" })}
                        {" · "}
                        {order.deliveryType === "delivery" ? "🚚 Delivery" : "🏪 Retiro en tienda"}
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-white/40 text-xs mt-1">📍 {order.deliveryAddress}</p>
                      )}
                    </div>
                    <p className="text-yellow-400 font-black text-xl">₡{order.total.toLocaleString("es-CR")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="text-xs bg-white/5 text-white/50 px-3 py-1 rounded-full">
                        {item.name}{item.size ? ` (${item.size})` : ""} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Profile tab */}
          {tab === "profile" && (
            <form onSubmit={handleSaveProfile} className="max-w-lg space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1.5 font-medium">Nombre completo</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5 font-medium">Correo</label>
                <input
                  value={customer?.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/30 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5 font-medium">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="8888-8888"
                  maxLength={9}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5 font-medium">Dirección de entrega</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Ej: San José, Escazú, de la iglesia 200m norte, casa azul"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                />
                <p className="text-white/30 text-xs mt-1">Esta dirección se pre-llenará automáticamente al hacer un pedido con delivery.</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-yellow-400 text-black font-black px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
