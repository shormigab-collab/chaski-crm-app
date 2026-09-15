"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Logo from "@/components/Logo";

const beneficios = [
  "Contactos y empresas en un solo lugar",
  "Pipeline visual por etapas",
  "Tareas y recordatorios de seguimiento",
  "Invita a tu equipo cuando quieras",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setCargando(false);
    if (res.ok) {
      router.push("/crm");
      router.refresh();
    } else {
      setError("Correo o contraseña incorrectos");
    }
  }

  const inputClass =
    "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white";

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-900 text-cream px-12 py-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-coral-500/10" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />
        <Link href="/" className="relative">
          <Logo size={28} dark mostrarCrm />
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-heading font-extrabold mb-6 leading-tight">
            El CRM simple para llevar tus ventas
          </h2>
          <div className="space-y-3.5">
            {beneficios.map((b) => (
              <div key={b} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-cream/70 shrink-0" strokeWidth={2} />
                <span className="text-cream/80 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-cream/40">Un producto de chaski</p>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 lg:hidden">
          <Logo size={30} mostrarCrm />
        </Link>
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-heading font-bold mb-6">Inicia sesión</h1>

          <div>
            <label className="block text-xs font-medium text-ink/50 mb-1">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink/50 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {error && <p className="text-xs text-coral-600">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {cargando ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-sm text-ink/50">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-brand-600 font-medium hover:underline">
              Crea una gratis
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
