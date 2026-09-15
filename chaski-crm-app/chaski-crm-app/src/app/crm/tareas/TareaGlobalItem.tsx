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
    <div className="flex items-start gap-3 bg-white border border-border rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={false}
        onChange={completar}
        className="mt-1 w-4 h-4 accent-brand-500 cursor-pointer"
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{titulo}</p>
        <Link href={`/crm/contactos/${contactoId}`} className="text-xs text-brand-600 hover:underline">
          {contactoNombre}
        </Link>
      </div>
      {fechaLimite && (
        <span
          className={`text-xs font-medium whitespace-nowrap px-2 py-1 rounded-full ${
            vencida ? "text-coral-700 bg-coral-50" : "text-gray-500 bg-gray-100"
          }`}
        >
          {new Date(fechaLimite).toLocaleDateString("es-CO")}
        </span>
      )}
    </div>
  );
}
