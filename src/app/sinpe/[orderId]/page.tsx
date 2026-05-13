"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  items: { id: string; name: string; quantity: number; size: string | null }[];
};

const SINPE_NUMBER = "8519-0660";
const SINPE_NAME = "Beetees pedido";
const WHATSAPP_NUMBER = "50685190660";

export default function SinpePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then(setOrder);
  }, [orderId]);

  if (!order) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const message = encodeURIComponent(
    `Hola! Te envío el comprobante de pago SINPE para el pedido #${order.orderNumber} por ₡${order.total.toLocaleString("es-CR")}. Nombre: ${order.customerName}`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  function copyNumber() {
    navigator.clipboard.writeText("85190660");
    toast.success("Número copiado");
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle size={52} className="text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white tracking-tighter">¡Pedido creado!</h1>
          <p className="text-white/50 mt-1 text-sm">Pedido <span className="text-yellow-400 font-bold">#{order.orderNumber}</span></p>
        </div>

        {/* SINPE card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-5">
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Instrucciones de pago</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-black/40 rounded-2xl px-4 py-3">
              <div>
                <p className="text-white/40 text-xs mb-0.5">Número SINPE</p>
                <p className="text-white font-black text-xl tracking-widest">{SINPE_NUMBER}</p>
              </div>
              <button
                onClick={copyNumber}
                className="text-white/40 hover:text-yellow-400 transition-colors p-2"
              >
                <Copy size={18} />
              </button>
            </div>

            <div className="bg-black/40 rounded-2xl px-4 py-3">
              <p className="text-white/40 text-xs mb-0.5">Nombre del destinatario</p>
              <p className="text-white font-bold">{SINPE_NAME}</p>
            </div>

            <div className="bg-black/40 rounded-2xl px-4 py-3">
              <p className="text-white/40 text-xs mb-0.5">Monto exacto</p>
              <p className="text-yellow-400 font-black text-2xl">₡{order.total.toLocaleString("es-CR")}</p>
            </div>

            <div className="bg-black/40 rounded-2xl px-4 py-3">
              <p className="text-white/40 text-xs mb-0.5">Referencia (anótala en el mensaje)</p>
              <p className="text-white font-bold">Pedido #{order.orderNumber}</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Pasos a seguir</p>
          <ol className="space-y-2 text-sm text-white/70">
            <li className="flex gap-2"><span className="text-yellow-400 font-bold">1.</span> Abre tu app bancaria y realiza la transferencia SINPE al número indicado</li>
            <li className="flex gap-2"><span className="text-yellow-400 font-bold">2.</span> Toma un screenshot del comprobante de pago</li>
            <li className="flex gap-2"><span className="text-yellow-400 font-bold">3.</span> Envíanos el screenshot por WhatsApp con el botón de abajo</li>
            <li className="flex gap-2"><span className="text-yellow-400 font-bold">4.</span> Confirmamos tu pago y coordinamos la entrega</li>
          </ol>
        </div>

        {/* WhatsApp button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-400 text-white font-black py-4 rounded-2xl transition-colors text-base mb-4"
        >
          <MessageCircle size={22} />
          Enviar comprobante por WhatsApp
        </a>

        <Link
          href="/shop"
          className="block text-center text-white/30 hover:text-white text-sm transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}
