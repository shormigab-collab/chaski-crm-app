"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TareaGlobalItem({
  id,
  titulo,
  fechaLimite,
  contactoId,
  contactoNombre,
  vencida,
}: {
  id: string;
  titulo: string;
  fechaLimite: string | null;
  contactoId: string;
  contactoNombre: string;
  vencida: boolean;
}) {
  const router = useRouter();

  async function completar() {
    const res = await fetch(`/api/tareas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada: true }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-start gap-3 bg-white border rounded-lg p-3">
      <input type="checkbox" checked={false} onChange={completar} className="mt-1" />
      <div className="flex-1">
        <p className="text-sm">{titulo}</p>
        <Link href={`/crm/contactos/${contactoId}`} className="text-xs text-brand-600 hover:underline">
          {contactoNombre}
        </Link>
      </div>
      {fechaLimite && (
        <span className={`text-xs whitespace-nowrap ${vencida ? "text-coral-600 font-medium" : "text-gray-400"}`}>
          {new Date(fechaLimite).toLocaleDateString("es-CO")}
        </span>
      )}
    </div>
  );
}
