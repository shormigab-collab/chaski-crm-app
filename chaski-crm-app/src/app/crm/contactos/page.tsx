import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { infoEtapa, ETAPAS_CRM } from "@/lib/crm";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

export default async function ContactosPage({
  searchParams,
}: {
  searchParams: { q?: string; etapa?: string };
}) {
  const sesion = await obtenerSesion();
  const { q, etapa } = searchParams;

  const contactos = await db.contacto.findMany({
    where: {
      organizacionId: sesion!.organizacionId,
      ...(etapa ? { etapa } : {}),
      ...(q
        ? {
            OR: [
              { nombre: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { empresa: true, propietario: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contactos</h1>
        <Link
          href="/crm/contactos/nuevo"
          className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Nuevo contacto
        </Link>
      </div>

      <form className="flex flex-wrap gap-2 mb-4" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o correo..."
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300 flex-1 min-w-[200px]"
        />
        <select
          name="etapa"
          defaultValue={etapa || ""}
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white"
        >
          <option value="">Todas las etapas</option>
          {ETAPAS_CRM.map((et) => (
            <option key={et.valor} value={et.valor}>
              {et.etiqueta}
            </option>
          ))}
        </select>
        <button type="submit" className="border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100">
          Filtrar
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-xl overflow-hidden bg-white">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Empresa</th>
              <th className="p-3">Etapa</th>
              <th className="p-3">Dueño</th>
              <th className="p-3">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((c: any) => {
              const et = infoEtapa(c.etapa);
              return (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <Link href={`/crm/contactos/${c.id}`} className="font-medium text-ink hover:text-brand-600">
                      {c.nombre}
                    </Link>
                    {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                  </td>
                  <td className="p-3 text-gray-500">{c.empresa?.nombre || "—"}</td>
                  <td className="p-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${et.bg} ${et.color}`}>
                      {et.etiqueta}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{c.propietario?.nombre || "—"}</td>
                  <td className="p-3 text-gray-500">{new Date(c.updatedAt).toLocaleDateString("es-CO")}</td>
                </tr>
              );
            })}
            {contactos.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={5}>
                  No hay contactos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
