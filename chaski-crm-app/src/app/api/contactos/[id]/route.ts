import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquemaEditar = z.object({
  nombre: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  empresaId: z.string().trim().optional().or(z.literal("")).nullable(),
  etapa: z.enum(["NUEVO", "CONTACTADO", "NEGOCIANDO", "GANADO", "PERDIDO"]).optional(),
  origen: z.string().trim().max(80).optional().or(z.literal("")),
  notas: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const contacto = await db.contacto.findUnique({
    where: { id: params.id },
    include: {
      empresa: true,
      propietario: true,
      tareas: { orderBy: { fechaLimite: "asc" } },
      actividades: { include: { autor: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!contacto || contacto.organizacionId !== sesion.organizacionId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({ contacto });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const existente = await db.contacto.findUnique({ where: { id: params.id } });
  if (!existente || existente.organizacionId !== sesion.organizacionId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = esquemaEditar.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const data = parsed.data;

  const contacto = await db.contacto.update({
    where: { id: params.id },
    data: {
      ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
      ...(data.email !== undefined ? { email: data.email || null } : {}),
      ...(data.telefono !== undefined ? { telefono: data.telefono || null } : {}),
      ...(data.empresaId !== undefined ? { empresaId: data.empresaId || null } : {}),
      ...(data.etapa !== undefined ? { etapa: data.etapa } : {}),
      ...(data.origen !== undefined ? { origen: data.origen || null } : {}),
      ...(data.notas !== undefined ? { notas: data.notas || null } : {}),
    },
  });

  return NextResponse.json({ ok: true, contacto });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const existente = await db.contacto.findUnique({ where: { id: params.id } });
  if (!existente || existente.organizacionId !== sesion.organizacionId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  await db.contacto.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
