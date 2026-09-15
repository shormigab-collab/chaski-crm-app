import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquemaCrear = z.object({
  contactoId: z.string().trim().min(1),
  tipo: z.enum(["NOTA", "LLAMADA", "CORREO", "REUNION"]),
  contenido: z.string().trim().min(1).max(2000),
});

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

  const actividad = await db.actividad.create({
    data: {
      contactoId: data.contactoId,
      tipo: data.tipo,
      contenido: data.contenido,
      autorId: sesion.userId,
    },
  });

  // Tocamos "updatedAt" del contacto para que suba en las listas ordenadas
  // por actividad reciente.
  await db.contacto.update({ where: { id: data.contactoId }, data: {} });

  return NextResponse.json({ ok: true, actividad });
}
