import { Building } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import NuevaEmpresaForm from "./NuevaEmpresaForm";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

export default async function EmpresasPage() {
  const sesion = await obtenerSesion();
  const empresas = await db.empresa.findMany({
    where: { organizacionId: sesion!.organizacionId },
    include: { _count: { select: { contactos: true } } },
    orderBy: { nombre: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Empresas</h1>
      <NuevaEmpresaForm />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border rounded-2xl overflow-hidden bg-white shadow-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Sitio web</th>
              <th className="p-3">Contactos</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e: any) => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-brand-600" strokeWidth={2} />
                    </span>
                    <span className="font-medium">{e.nombre}</span>
                  </span>
                </td>
                <td className="p-3 text-gray-500">
                  {e.sitioWeb ? (
                    <a href={e.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                      {e.sitioWeb}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 tabular-nums">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {e._count.contactos}
                  </span>
                </td>
              </tr>
            ))}
            {empresas.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={3}>
                  Aún no hay empresas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
