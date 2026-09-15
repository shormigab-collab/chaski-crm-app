"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvitarMiembroForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);
    const res = await fetch("/api/equipo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    setCargando(false);
    if (res.ok) {
      setExito(`Cuenta creada para ${email}. Ya puede iniciar sesión.`);
      setNombre("");
      setEmail("");
      setPassword("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo crear la cuenta");
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-border rounded-2xl p-5 shadow-sm grid sm:grid-cols-4 gap-3 items-end mb-6">
      <div className="sm:col-span-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>
      <div className="sm:col-span-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>
      <div className="sm:col-span-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">Contraseña temporal</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>
      <div className="sm:col-span-1">
        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {cargando ? "Creando..." : "Invitar"}
        </button>
      </div>
      {error && <p className="sm:col-span-4 text-xs text-coral-600">{error}</p>}
      {exito && <p className="sm:col-span-4 text-xs text-emerald-600">{exito}</p>}
    </form>
  );
}
