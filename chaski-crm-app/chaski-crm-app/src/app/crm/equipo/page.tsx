import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obtenerUsuarioActual } from "@/lib/auth";
import Avatar from "@/components/Avatar";
import InvitarMiembroForm from "./InvitarMiembroForm";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

export default async function EquipoPage() {
  const usuario = await obtenerUsuarioActual();
  if (!usuario || usuario.role !== "OWNER") redirect("/crm");

  const miembros = await db.usuario.findMany({
    where: { organizacionId: usuario.organizacionId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Equipo</h1>
      <p className="text-sm text-gray-500 mb-6">
        Todos los que invites aquí ven y editan los mismos contactos, empresas y tareas que tú.
      </p>
      <InvitarMiembroForm />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border rounded-2xl overflow-hidden bg-white shadow-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Desde</th>
            </tr>
          </thead>
          <tbody>
            {miembros.map((m: any) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <span className="flex items-center gap-2.5">
                    <Avatar nombre={m.nombre} size="sm" />
                    <span className="font-medium">{m.nombre}</span>
                  </span>
                </td>
                <td className="p-3 text-gray-500">{m.email}</td>
                <td className="p-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      m.role === "OWNER" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.role === "OWNER" ? "Dueño" : "Miembro"}
                  </span>
                </td>
                <td className="p-3 text-gray-500">{new Date(m.createdAt).toLocaleDateString("es-CO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
