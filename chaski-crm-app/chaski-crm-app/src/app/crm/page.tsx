import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { ETAPAS_CRM } from "@/lib/crm";
import CambiarEtapaSelect from "./CambiarEtapaSelect";
import Avatar from "@/components/Avatar";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const BARRA_ETAPA: Record<string, string> = {
  NUEVO: "bg-gray-300",
  CONTACTADO: "bg-brand-500",
  NEGOCIANDO: "bg-gold-500",
  GANADO: "bg-emerald-500",
  PERDIDO: "bg-coral-500",
};

type ContactoPipeline = {
  id: string;
  nombre: string;
  etapa: string;
  empresa: { nombre: string } | null;
  propietario: { nombre: string } | null;
  tareas: { id: string }[];
};

export default async function CrmPipelinePage() {
  const sesion = await obtenerSesion();
  const contactos: ContactoPipeline[] = await db.contacto.findMany({
    where: { organizacionId: sesion!.organizacionId },
    include: { empresa: true, propietario: true, tareas: { where: { completada: false } } },
    orderBy: { updatedAt: "desc" },
  });

  const columnas = ETAPAS_CRM.map((et) => ({
    ...et,
    contactos: contactos.filter((c) => c.etapa === et.valor),
  }));

  const ganados = contactos.filter((c) => c.etapa === "GANADO").length;
  const enNegociacion = contactos.filter((c) => c.etapa === "NEGOCIANDO").length;
  const tareasPendientes = contactos.reduce((acc, c) => acc + c.tareas.length, 0);

  const stats = [
    { etiqueta: "Contactos totales", valor: contactos.length },
    { etiqueta: "En negociación", valor: enNegociacion },
    { etiqueta: "Ganados", valor: ganados },
    { etiqueta: "Tareas pendientes", valor: tareasPendientes },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-sm text-gray-500">{contactos.length} contactos en total</p>
        </div>
        <Link
          href="/crm/contactos/nuevo"
          className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Nuevo contacto
        </Link>
      </div>

      {contactos.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.etiqueta} className="bg-white border rounded-xl p-4">
              <p className="text-2xl font-bold tabular-nums">{s.valor}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.etiqueta}</p>
            </div>
          ))}
        </div>
      )}

      {contactos.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-white">
          <p className="text-gray-500 mb-4">Aún no tienes contactos en el CRM.</p>
          <Link href="/crm/contactos/nuevo" className="text-brand-600 font-medium hover:underline">
            Agrega el primero →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {columnas.map((col) => (
            <div key={col.valor} className="bg-gray-100/70 rounded-xl overflow-hidden min-h-[200px]">
              <div className={`h-1 ${BARRA_ETAPA[col.valor]}`} />
              <div className="p-3">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${col.bg} ${col.color}`}>
                    {col.etiqueta}
                  </span>
                  <span className="text-xs text-gray-400 tabular-nums">{col.contactos.length}</span>
                </div>
                <div className="space-y-2">
                  {col.contactos.map((c) => (
                    <div key={c.id} className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <Link href={`/crm/contactos/${c.id}`} className="flex items-start gap-2 mb-2">
                        <Avatar nombre={c.nombre} size="sm" />
                        <span className="min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">{c.nombre}</p>
                          {c.empresa && <p className="text-xs text-gray-400 truncate">{c.empresa.nombre}</p>}
                          {c.tareas.length > 0 && (
                            <p className="text-[11px] text-gold-600 mt-0.5">
                              {c.tareas.length} tarea{c.tareas.length > 1 ? "s" : ""} pendiente
                              {c.tareas.length > 1 ? "s" : ""}
                            </p>
                          )}
                        </span>
                      </Link>
                      <CambiarEtapaSelect contactoId={c.id} etapaActual={c.etapa} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
