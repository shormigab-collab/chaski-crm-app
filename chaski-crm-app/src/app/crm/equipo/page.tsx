import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obtenerUsuarioActual } from "@/lib/auth";
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
        <table className="w-full text-sm border rounded-xl overflow-hidden bg-white">
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
              <tr key={m.id} className="border-t">
                <td className="p-3 font-medium">{m.nombre}</td>
                <td className="p-3 text-gray-500">{m.email}</td>
                <td className="p-3 text-gray-500">{m.role === "OWNER" ? "Dueño" : "Miembro"}</td>
                <td className="p-3 text-gray-500">{new Date(m.createdAt).toLocaleDateString("es-CO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
