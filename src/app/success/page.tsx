"use client";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, []);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-6" />
        <h1 className="text-4xl font-black text-white tracking-tighter mb-3">¡Pago exitoso!</h1>
        <p className="text-white/50 mb-8">
          Gracias por tu compra. Recibirás un correo de confirmación con los detalles de tu pedido.
        </p>
        <Link
          href="/shop"
          className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </main>
  );
}
