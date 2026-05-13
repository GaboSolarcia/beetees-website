"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/shop/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success(`¡Bienvenido, ${data.customer.name}!`);
      router.push("/mi-cuenta");
      router.refresh();
    } else {
      toast.error(data.error || "Error al iniciar sesión");
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Iniciar sesión</h1>
          <p className="text-white/40 text-sm mb-8">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-yellow-400 hover:underline">Regístrate gratis</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5 font-medium">Correo electrónico</label>
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
              <label className="block text-sm text-white/60 mb-1.5 font-medium">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Tu contraseña"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
