"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ETAPAS_CRM } from "@/lib/crm";

export default function CambiarEtapaSelect({ contactoId, etapaActual }: { contactoId: string; etapaActual: string }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const etapa = e.target.value;
    setCargando(true);
    const res = await fetch(`/api/contactos/${contactoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etapa }),
    });
    setCargando(false);
    if (res.ok) router.refresh();
  }

  return (
    <select
      value={etapaActual}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      disabled={cargando}
      className="text-xs border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-brand-300 bg-white disabled:opacity-50 w-full"
    >
      {ETAPAS_CRM.map((et) => (
        <option key={et.valor} value={et.valor}>
          Mover a: {et.etiqueta}
        </option>
      ))}
    </select>
  );
}
