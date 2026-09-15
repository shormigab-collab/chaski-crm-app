import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import TareaGlobalItem from "./TareaGlobalItem";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

export default async function TareasPage() {
  const sesion = await obtenerSesion();
  const tareas = await db.tarea.findMany({
    where: { completada: false, contacto: { organizacionId: sesion!.organizacionId } },
    include: { contacto: true },
    orderBy: [{ fechaLimite: "asc" }, { createdAt: "asc" }],
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const vencidas = tareas.filter((t: any) => t.fechaLimite && new Date(t.fechaLimite) < hoy);
  const proximas = tareas.filter((t: any) => !t.fechaLimite || new Date(t.fechaLimite) >= hoy);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Tareas</h1>
      <p className="text-sm text-gray-500 mb-6">{tareas.length} pendientes en total</p>

      {vencidas.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-coral-600 mb-2">Vencidas ({vencidas.length})</h2>
          <div className="space-y-2">
            {vencidas.map((t: any) => (
              <TareaGlobalItem
                key={t.id}
                id={t.id}
                titulo={t.titulo}
                fechaLimite={t.fechaLimite ? t.fechaLimite.toISOString() : null}
                contactoId={t.contacto.id}
                contactoNombre={t.contacto.nombre}
                vencida
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-2">Próximas</h2>
        <div className="space-y-2">
          {proximas.map((t: any) => (
            <TareaGlobalItem
              key={t.id}
              id={t.id}
              titulo={t.titulo}
              fechaLimite={t.fechaLimite ? t.fechaLimite.toISOString() : null}
              contactoId={t.contacto.id}
              contactoNombre={t.contacto.nombre}
              vencida={false}
            />
          ))}
          {proximas.length === 0 && vencidas.length === 0 && (
            <p className="text-sm text-gray-400">No tienes tareas pendientes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
