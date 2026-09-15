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
        <table className="w-full text-sm border rounded-xl overflow-hidden bg-white">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Sitio web</th>
              <th className="p-3">Contactos</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e: any) => (
              <tr key={e.id} className="border-t">
                <td className="p-3 font-medium">{e.nombre}</td>
                <td className="p-3 text-gray-500">
                  {e.sitioWeb ? (
                    <a href={e.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                      {e.sitioWeb}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 tabular-nums">{e._count.contactos}</td>
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
