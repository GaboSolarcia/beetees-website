"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shop/Navbar";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Truck, Store } from "lucide-react";
import { formatPhone, isValidPhone } from "@/lib/utils";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clear } = useCart();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/customer/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setCustomer(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone ?? "");
        setDeliveryAddress(data.address ?? "");
      });
  }, []);

  if (totalItems === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/40 mb-4">Tu carrito está vacío</p>
            <Link href="/shop" className="text-yellow-400 hover:underline">Ir a la tienda</Link>
          </div>
        </main>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return toast.error("Nombre y correo son requeridos");
    if (phone && !isValidPhone(phone)) return toast.error("El teléfono debe tener el formato 6120-2210");
    if (deliveryType === "delivery" && !deliveryAddress.trim()) return toast.error("Ingresa tu dirección de entrega");
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: customer?.id ?? null,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        total: totalPrice,
        paymentMethod: "sinpe",
        deliveryType,
        deliveryAddress: deliveryType === "delivery" ? deliveryAddress : null,
        items,
      }),
    });

    if (!res.ok) {
      toast.error("Error al crear el pedido");
      setLoading(false);
      return;
    }

    const order = await res.json();
    clear();
    router.push(`/sinpe/${order.id}`);
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Finalizar pedido</h1>
          {!customer && (
            <p className="text-white/40 text-sm mb-8">
              <Link href="/login" className="text-yellow-400 hover:underline">Inicia sesión</Link> para pre-llenar tus datos y ver tu historial de pedidos.
            </p>
          )}
          {customer && <p className="text-white/40 text-sm mb-8">Comprando como <span className="text-white">{customer.name}</span></p>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5 font-medium">Nombre completo *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Juan Pérez"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5 font-medium">Correo electrónico *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="juan@correo.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
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

                {/* Delivery type */}
                <div>
                  <label className="block text-sm text-white/60 mb-3 font-medium">Método de entrega *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        deliveryType === "pickup"
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <Store size={24} className={deliveryType === "pickup" ? "text-yellow-400" : "text-white/40"} />
                      <span className={`text-sm font-bold ${deliveryType === "pickup" ? "text-yellow-400" : "text-white/50"}`}>
                        Retiro en tienda
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("delivery")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        deliveryType === "delivery"
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <Truck size={24} className={deliveryType === "delivery" ? "text-yellow-400" : "text-white/40"} />
                      <span className={`text-sm font-bold ${deliveryType === "delivery" ? "text-yellow-400" : "text-white/50"}`}>
                        Delivery
                      </span>
                    </button>
                  </div>
                </div>

                {deliveryType === "delivery" && (
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5 font-medium">Dirección de entrega *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                      rows={3}
                      placeholder="Ej: San José, Escazú, de la iglesia 200m norte, casa azul"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                    />
                    {customer && !customer.address && (
                      <p className="text-white/30 text-xs mt-1">
                        Guarda tu dirección en{" "}
                        <Link href="/mi-cuenta" className="text-yellow-400/70 hover:text-yellow-400">Mi cuenta</Link>{" "}
                        para no tener que ingresarla cada vez.
                      </p>
                    )}
                  </div>
                )}

                {/* SINPE info */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                  <p className="text-green-400 font-bold text-sm mb-1">Pago por SINPE Móvil</p>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Al confirmar te mostramos el número SINPE y un botón de WhatsApp para enviar tu comprobante. El pedido se confirma cuando verifiquemos el pago.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 text-base"
                >
                  {loading ? "Procesando..." : "Confirmar pedido →"}
                </button>
              </form>
            </div>

            {/* Order summary */}
            <div>
              <h2 className="text-white font-black text-lg mb-5">Tu pedido</h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{item.name}</p>
                      <p className="text-white/40 text-xs">
                        {item.size ? `Talla ${item.size} · ` : ""}x{item.quantity}
                      </p>
                    </div>
                    <p className="text-white text-sm font-bold flex-shrink-0">
                      ₡{(item.price * item.quantity).toLocaleString("es-CR")}
                    </p>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="text-white font-black">Total</span>
                  <span className="text-yellow-400 font-black text-xl">₡{totalPrice.toLocaleString("es-CR")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
