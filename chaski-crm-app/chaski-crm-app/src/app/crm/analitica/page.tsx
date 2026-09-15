import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { ETAPAS_CRM, TIPOS_ACTIVIDAD } from "@/lib/crm";
import AnaliticaCharts from "./AnaliticaCharts";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const COLOR_ETAPA: Record<string, string> = {
  NUEVO: "#9CA3AF",
  CONTACTADO: "#3B2F8F",
  NEGOCIANDO: "#F5A524",
  GANADO: "#10B981",
  PERDIDO: "#FF6B5F",
};

function inicioDeSemana(fecha: Date) {
  const d = new Date(fecha);
  const dia = d.getDay();
  const diff = (dia === 0 ? -6 : 1) - dia; // lunes como inicio de semana
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function AnaliticaPage() {
  const sesion = await obtenerSesion();
  const organizacionId = sesion!.organizacionId;

  const [contactos, actividades, tareas] = await Promise.all([
    db.contacto.findMany({
      where: { organizacionId },
      select: { id: true, etapa: true, createdAt: true },
    }),
    db.actividad.findMany({
      where: { contacto: { organizacionId } },
      select: { id: true, tipo: true },
    }),
    db.tarea.findMany({
      where: { contacto: { organizacionId } },
      select: { id: true, completada: true },
    }),
  ]);

  const porEtapa = ETAPAS_CRM.map((et) => ({
    etapa: et.etiqueta,
    valor: contactos.filter((c: any) => c.etapa === et.valor).length,
    color: COLOR_ETAPA[et.valor],
  }));

  const porTipoActividad = TIPOS_ACTIVIDAD.map((t) => ({
    tipo: t.etiqueta,
    valor: actividades.filter((a: any) => a.tipo === t.valor).length,
  }));

  // Contactos nuevos por semana, últimas 8 semanas.
  const hoy = new Date();
  const semanas: { inicio: Date; etiqueta: string; valor: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const ref = new Date(hoy);
    ref.setDate(ref.getDate() - i * 7);
    const inicio = inicioDeSemana(ref);
    semanas.push({
      inicio,
      etiqueta: inicio.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }),
      valor: 0,
    });
  }
  for (const c of contactos as any[]) {
    const inicioContacto = inicioDeSemana(new Date(c.createdAt)).getTime();
    const bucket = semanas.find((s) => s.inicio.getTime() === inicioContacto);
    if (bucket) bucket.valor += 1;
  }

  const tareasCompletadas = tareas.filter((t: any) => t.completada).length;
  const tareasPendientes = tareas.length - tareasCompletadas;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Analítica</h1>
      <p className="text-sm text-gray-500 mb-6">Un vistazo rápido a cómo va tu pipeline.</p>

      {contactos.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-white">
          <p className="text-gray-500">Agrega contactos para empezar a ver estadísticas aquí.</p>
        </div>
      ) : (
        <AnaliticaCharts
          porEtapa={porEtapa}
          porTipoActividad={porTipoActividad}
          porSemana={semanas.map((s) => ({ etiqueta: s.etiqueta, valor: s.valor }))}
          tareasCompletadas={tareasCompletadas}
          tareasPendientes={tareasPendientes}
          totalContactos={contactos.length}
          totalActividades={actividades.length}
        />
      )}
    </div>
  );
}
