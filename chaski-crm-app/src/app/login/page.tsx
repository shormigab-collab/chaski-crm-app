"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8">
        <Logo size={30} mostrarCrm />
      </Link>
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white border border-border rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-center mb-4">Inicia sesión</h1>

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
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
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
  );
}
