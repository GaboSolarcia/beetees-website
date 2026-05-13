"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/shop/Navbar";
import { formatPhone, isValidPhone } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return toast.error("Las contraseñas no coinciden");
    if (password.length < 6) return toast.error("La contraseña debe tener al menos 6 caracteres");
    if (phone && !isValidPhone(phone)) return toast.error("El teléfono debe tener el formato 6120-2210");
    setLoading(true);

    const res = await fetch("/api/auth/customer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success("¡Cuenta creada!");
      router.push("/mi-cuenta");
      router.refresh();
    } else {
      toast.error(data.error || "Error al crear la cuenta");
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Crear cuenta</h1>
          <p className="text-white/40 text-sm mb-8">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-yellow-400 hover:underline">Inicia sesión</Link>
          </p>

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
            <div>
              <label className="block text-sm text-white/60 mb-1.5 font-medium">Contraseña *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5 font-medium">Confirmar contraseña *</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repite la contraseña"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
