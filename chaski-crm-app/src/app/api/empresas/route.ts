import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquemaCrear = z.object({
  nombre: z.string().trim().min(2),
  sitioWeb: z.string().trim().max(200).optional().or(z.literal("")),
  notas: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function GET() {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const empresas = await db.empresa.findMany({
    where: { organizacionId: sesion.organizacionId },
    include: { _count: { select: { contactos: true } } },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json({ empresas });
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

  const empresa = await db.empresa.create({
    data: {
      organizacionId: sesion.organizacionId,
      nombre: data.nombre,
      sitioWeb: data.sitioWeb || undefined,
      notas: data.notas || undefined,
    },
  });

  return NextResponse.json({ ok: true, empresa });
}
