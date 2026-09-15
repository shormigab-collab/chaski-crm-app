import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { obtenerSesion, hashPassword } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquema = z.object({
  nombre: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(6),
});

// Solo el OWNER de la organizacion puede invitar compañeros. Los invitados
// entran con rol "MIEMBRO" a la MISMA organizacion (comparten los mismos
// contactos/empresas/tareas).
export async function GET() {
  const sesion = await obtenerSesion();
  if (!sesion) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const miembros = await db.usuario.findMany({
    where: { organizacionId: sesion.organizacionId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ miembros });
}

export async function POST(req: Request) {
  const sesion = await obtenerSesion();
  if (!sesion || sesion.role !== "OWNER") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = esquema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const existente = await db.usuario.findUnique({ where: { email: parsed.data.email } });
  if (existente) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo" }, { status: 409 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const miembro = await db.usuario.create({
    data: {
      organizacionId: sesion.organizacionId,
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      passwordHash,
      role: "MIEMBRO",
    },
  });

  return NextResponse.json({ ok: true, id: miembro.id });
}
