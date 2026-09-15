"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevaEmpresaForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [sitioWeb, setSitioWeb] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setError("");
    setCargando(true);
    const res = await fetch("/api/empresas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, sitioWeb }),
    });
    setCargando(false);
    if (res.ok) {
      setNombre("");
      setSitioWeb("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo crear la empresa");
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-2 mb-6">
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la empresa"
        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
      />
      <input
        value={sitioWeb}
        onChange={(e) => setSitioWeb(e.target.value)}
        placeholder="Sitio web (opcional)"
        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
      />
      <button
        type="submit"
        disabled={cargando}
        className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {cargando ? "Creando..." : "Agregar empresa"}
      </button>
      {error && <p className="text-xs text-coral-600 self-center">{error}</p>}
    </form>
  );
}
