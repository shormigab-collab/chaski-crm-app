"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ETAPAS_CRM } from "@/lib/crm";

type Empresa = { id: string; nombre: string };

export default function EditarContactoForm({
  contacto,
  empresas,
}: {
  contacto: {
    id: string;
    nombre: string;
    email: string | null;
    telefono: string | null;
    empresaId: string | null;
    etapa: string;
    origen: string | null;
    notas: string | null;
  };
  empresas: Empresa[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: contacto.nombre,
    email: contacto.email || "",
    telefono: contacto.telefono || "",
    empresaId: contacto.empresaId || "",
    etapa: contacto.etapa,
    origen: contacto.origen || "",
    notas: contacto.notas || "",
  });
  const [cargando, setCargando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setGuardado(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    const res = await fetch(`/api/contactos/${contacto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCargando(false);
    if (res.ok) {
      setGuardado(true);
      router.refresh();
    }
  }

  async function onEliminar() {
    if (!confirm(`¿Eliminar a ${contacto.nombre} del CRM? Esto no se puede deshacer.`)) return;
    const res = await fetch(`/api/contactos/${contacto.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/crm/contactos");
      router.refresh();
    }
  }

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white";

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-xl p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
        <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required className={inputClass} />
      </div>
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
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Origen</label>
        <input value={form.origen} onChange={(e) => set("origen", e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Notas</label>
        <textarea
          value={form.notas}
          onChange={(e) => set("notas", e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={cargando}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {cargando ? "Guardando..." : "Guardar"}
        </button>
        {guardado && <span className="text-xs text-emerald-600">Guardado ✓</span>}
        <button type="button" onClick={onEliminar} className="ml-auto text-xs text-coral-600 hover:underline">
          Eliminar contacto
        </button>
      </div>
    </form>
  );
}
