"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, LogOut, Menu, X, CalendarDays, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pedidos", icon: Package },
  { href: "/admin/artists", label: "Artistas", icon: Users },
  { href: "/admin/products", label: "Productos", icon: ShoppingBag },
  { href: "/admin/events", label: "Eventos", icon: CalendarDays },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Sesión cerrada");
    router.push("/admin/login");
  }

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-white/10 flex items-center justify-between px-4 h-14">
        <span className="text-white font-black tracking-tighter">BEETEES<span className="text-yellow-400"> Admin</span></span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-white/10 flex flex-col z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-6 border-b border-white/10">
          <p className="text-white font-black text-lg tracking-tighter">
            BEETEES<span className="text-yellow-400"> Admin</span>
          </p>
          <p className="text-white/40 text-xs mt-0.5">Panel de control</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-yellow-400 text-black"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white transition-colors mb-2"
          >
            Ver tienda →
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/50 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
