"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ETAPAS_CRM } from "@/lib/crm";

type Empresa = { id: string; nombre: string };

export default function NuevoContactoForm({ empresas }: { empresas: Empresa[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresaId: "",
    etapa: "NUEVO",
    origen: "",
    notas: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    const res = await fetch("/api/contactos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCargando(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/crm/contactos/${data.contacto.id}`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo crear el contacto");
    }
  }

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white";

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-xl p-6 max-w-xl space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
        <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required className={inputClass} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Correo</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
          <input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Empresa</label>
          <select value={form.empresaId} onChange={(e) => set("empresaId", e.target.value)} className={inputClass}>
            <option value="">Sin empresa</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Etapa</label>
          <select value={form.etapa} onChange={(e) => set("etapa", e.target.value)} className={inputClass}>
            {ETAPAS_CRM.map((et) => (
              <option key={et.valor} value={et.valor}>
                {et.etiqueta}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Origen (ej: LinkedIn, Referido)</label>
        <input value={form.origen} onChange={(e) => set("origen", e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Notas</label>
        <textarea
          value={form.notas}
          onChange={(e) => set("notas", e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>
      {error && <p className="text-xs text-coral-600">{error}</p>}
      <button
        type="submit"
        disabled={cargando}
        className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {cargando ? "Creando..." : "Crear contacto"}
      </button>
    </form>
  );
}
