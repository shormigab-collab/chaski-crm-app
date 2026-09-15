import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquemaEditar = z.object({
  completada: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const existente = await db.tarea.findUnique({ where: { id: params.id }, include: { contacto: true } });
  if (!existente || existente.contacto.organizacionId !== sesion.organizacionId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = esquemaEditar.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const tarea = await db.tarea.update({
    where: { id: params.id },
    data: { ...(parsed.data.completada !== undefined ? { completada: parsed.data.completada } : {}) },
  });

  return NextResponse.json({ ok: true, tarea });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const existente = await db.tarea.findUnique({ where: { id: params.id }, include: { contacto: true } });
  if (!existente || existente.contacto.organizacionId !== sesion.organizacionId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  await db.tarea.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
