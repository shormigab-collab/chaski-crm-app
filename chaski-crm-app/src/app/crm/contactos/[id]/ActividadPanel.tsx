"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIPOS_ACTIVIDAD } from "@/lib/crm";

type Actividad = {
  id: string;
  tipo: string;
  contenido: string;
  createdAt: string;
  autor: { nombre: string } | null;
};

export default function ActividadPanel({ contactoId, actividades }: { contactoId: string; actividades: Actividad[] }) {
  const router = useRouter();
  const [tipo, setTipo] = useState("NOTA");
  const [contenido, setContenido] = useState("");
  const [cargando, setCargando] = useState(false);

  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!contenido.trim()) return;
    setCargando(true);
    const res = await fetch("/api/actividades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactoId, tipo, contenido }),
    });
    setCargando(false);
    if (res.ok) {
      setContenido("");
      router.refresh();
    }
  }

  return (
    <div className="bg-white border rounded-xl p-5">
      <h2 className="font-semibold mb-3">Actividad</h2>

      <form onSubmit={agregar} className="mb-5 space-y-2">
        <div className="flex gap-2">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white"
          >
            {TIPOS_ACTIVIDAD.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.etiqueta}
              </option>
            ))}
          </select>
          <input
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="¿Qué pasó?"
            className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <button
          type="submit"
          disabled={cargando}
          className="bg-gray-100 hover:bg-gray-200 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {cargando ? "Guardando..." : "Registrar"}
        </button>
      </form>

      <div className="space-y-3">
        {actividades.map((a) => {
          const info = TIPOS_ACTIVIDAD.find((t) => t.valor === a.tipo);
          return (
            <div key={a.id} className="border-l-2 border-gray-200 pl-3 text-sm">
              <p>
                <span className="font-medium">{info?.etiqueta || a.tipo}</span>
                {": "}
                {a.contenido}
              </p>
              <p className="text-xs text-gray-400">
                {a.autor?.nombre || "—"} · {new Date(a.createdAt).toLocaleString("es-CO")}
              </p>
            </div>
          );
        })}
        {actividades.length === 0 && <p className="text-xs text-gray-400">Sin actividad registrada todavía.</p>}
      </div>
    </div>
  );
}
