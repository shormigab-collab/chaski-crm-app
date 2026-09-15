import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquemaCrear = z.object({
  nombre: z.string().trim().min(2),
  email: z.string().trim().email().optional().or(z.literal("")),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  empresaId: z.string().trim().optional().or(z.literal("")),
  etapa: z.enum(["NUEVO", "CONTACTADO", "NEGOCIANDO", "GANADO", "PERDIDO"]).optional(),
  origen: z.string().trim().max(80).optional().or(z.literal("")),
  notas: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function GET(req: Request) {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const etapa = searchParams.get("etapa");
  const q = searchParams.get("q");

  const contactos = await db.contacto.findMany({
    where: {
      organizacionId: sesion.organizacionId,
      ...(etapa ? { etapa } : {}),
      ...(q
        ? {
            OR: [
              { nombre: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { empresa: true, propietario: true, tareas: { where: { completada: false } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ contactos });
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

  const contacto = await db.contacto.create({
    data: {
      organizacionId: sesion.organizacionId,
      nombre: data.nombre,
      email: data.email || undefined,
      telefono: data.telefono || undefined,
      empresaId: data.empresaId || undefined,
      etapa: data.etapa || "NUEVO",
      origen: data.origen || undefined,
      notas: data.notas || undefined,
      propietarioId: sesion.userId,
    },
  });

  return NextResponse.json({ ok: true, contacto });
}
