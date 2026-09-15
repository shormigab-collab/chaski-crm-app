"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";

type Tarea = {
  id: string;
  titulo: string;
  fechaLimite: string | null;
  completada: boolean;
};

export default function TareasPanel({ contactoId, tareas }: { contactoId: string; tareas: Tarea[] }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [cargando, setCargando] = useState(false);

  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    setCargando(true);
    const res = await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactoId, titulo, fechaLimite: fecha }),
    });
    setCargando(false);
    if (res.ok) {
      setTitulo("");
      setFecha("");
      router.refresh();
    }
  }

  async function toggle(id: string, completada: boolean) {
    const res = await fetch(`/api/tareas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada: !completada }),
    });
    if (res.ok) router.refresh();
  }

  const pendientes = tareas.filter((t) => !t.completada);
  const completadas = tareas.filter((t) => t.completada);

  return (
    <div className="bg-white border rounded-xl p-5">
      <h2 className="font-semibold mb-3">Tareas</h2>

      <div className="space-y-2 mb-4">
        {pendientes.map((t) => (
          <label key={t.id} className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={false} onChange={() => toggle(t.id, t.completada)} className="mt-0.5" />
            <span>
              {t.titulo}
              {t.fechaLimite && (
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(t.fechaLimite).toLocaleDateString("es-CO")}
                </span>
              )}
            </span>
          </label>
        ))}
        {pendientes.length === 0 && <p className="text-xs text-gray-400">No hay tareas pendientes.</p>}
      </div>

      {completadas.length > 0 && (
        <details className="mb-4">
          <summary className="text-xs text-gray-400 cursor-pointer">
            {completadas.length} completada{completadas.length > 1 ? "s" : ""}
          </summary>
          <div className="space-y-2 mt-2">
            {completadas.map((t) => (
              <label key={t.id} className="flex items-start gap-2 text-sm cursor-pointer text-gray-400 line-through">
                <input type="checkbox" checked={true} onChange={() => toggle(t.id, t.completada)} className="mt-0.5" />
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> {t.titulo}
                </span>
              </label>
            ))}
          </div>
        </details>
      )}

      <form onSubmit={agregar} className="flex flex-col sm:flex-row gap-2">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nueva tarea..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
        />
        <button
          type="submit"
          disabled={cargando}
          className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-sm font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
