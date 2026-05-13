"use client";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/shop/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQty, clear } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart size={48} className="text-white/20 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white mb-2">Tu carrito está vacío</h1>
            <p className="text-white/40 mb-8">Agrega productos para continuar</p>
            <Link
              href="/shop"
              className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-white tracking-tighter">Tu Carrito</h1>
            <button
              onClick={clear}
              className="text-white/30 hover:text-red-400 text-sm transition-colors"
            >
              Vaciar carrito
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-900">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">—</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-xs mb-0.5">{item.artistName}</p>
                    <p className="text-white font-bold truncate">{item.name}</p>
                    {item.size && (
                      <p className="text-white/50 text-xs mt-0.5">Talla: {item.size}</p>
                    )}
                    <p className="text-yellow-400 font-bold text-sm mt-1">
                      ₡{item.price.toLocaleString("es-CR")}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQty(item.productId, item.size, item.quantity - 1)
                            : removeItem(item.productId, item.size)
                        }
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-white font-bold w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <p className="text-white/60 text-sm font-bold">
                      ₡{(item.price * item.quantity).toLocaleString("es-CR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="text-white font-black text-lg mb-4">Resumen del pedido</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Productos ({totalItems})</span>
                    <span className="text-white">₡{totalPrice.toLocaleString("es-CR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Envío</span>
                    <span className="text-white/50">A coordinar</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white font-black">Total</span>
                    <span className="text-yellow-400 font-black text-xl">
                      ₡{totalPrice.toLocaleString("es-CR")}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center bg-yellow-400 text-black font-black py-4 rounded-xl hover:bg-yellow-300 transition-colors text-sm"
                >
                  Proceder al pago →
                </Link>

                <Link
                  href="/shop"
                  className="block text-center text-white/40 hover:text-white text-sm mt-4 transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
