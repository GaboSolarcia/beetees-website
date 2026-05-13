"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/customer/me")
      .then((r) => r.json())
      .then((data) => { if (data?.name) setCustomerName(data.name); });
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white font-black text-xl tracking-tighter">
              BEETEES<span className="text-yellow-400"> CR</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Inicio
            </Link>
            <Link href="/events" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Eventos
            </Link>
            <Link href="/artists" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Artistas
            </Link>
            <Link href="/shop" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Tienda
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative text-white/80 hover:text-white transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Account */}
            {customerName ? (
              <Link
                href="/mi-cuenta"
                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
              >
                <User size={15} />
                {customerName.split(" ")[0]}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
              >
                <User size={15} />
                Ingresar
              </Link>
            )}

            <button
              className="md:hidden text-white"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-white/80 hover:text-white text-sm font-medium" onClick={() => setOpen(false)}>Inicio</Link>
          <Link href="/events" className="text-white/80 hover:text-white text-sm font-medium" onClick={() => setOpen(false)}>Eventos</Link>
          <Link href="/artists" className="text-white/80 hover:text-white text-sm font-medium" onClick={() => setOpen(false)}>Artistas</Link>
          <Link href="/shop" className="text-white/80 hover:text-white text-sm font-medium" onClick={() => setOpen(false)}>Tienda</Link>
          <div className="border-t border-white/10 pt-3">
            {customerName ? (
              <Link href="/mi-cuenta" className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2" onClick={() => setOpen(false)}>
                <User size={15} /> Mi cuenta
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-white/80 hover:text-white text-sm font-medium block mb-2" onClick={() => setOpen(false)}>Iniciar sesión</Link>
                <Link href="/registro" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium block" onClick={() => setOpen(false)}>Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
