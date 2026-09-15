import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquemaCrear = z.object({
  contactoId: z.string().trim().min(1),
  titulo: z.string().trim().min(2),
  fechaLimite: z.string().trim().optional().or(z.literal("")),
});

export async function GET() {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const tareas = await db.tarea.findMany({
    where: { completada: false, contacto: { organizacionId: sesion.organizacionId } },
    include: { contacto: true },
    orderBy: [{ fechaLimite: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ tareas });
}

export async function POST(req: Request) {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const parsed = esquemaCrear.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const data = parsed.data;

  const contacto = await db.contacto.findUnique({ where: { id: data.contactoId } });
  if (!contacto || contacto.organizacionId !== sesion.organizacionId) {
    return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 });
  }

  const tarea = await db.tarea.create({
    data: {
      contactoId: data.contactoId,
      titulo: data.titulo,
      fechaLimite: data.fechaLimite ? new Date(data.fechaLimite) : undefined,
    },
  });

  return NextResponse.json({ ok: true, tarea });
}
