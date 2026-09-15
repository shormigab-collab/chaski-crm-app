import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, crearSesion } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquema = z.object({
  organizacionNombre: z.string().trim().min(2),
  nombre: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(6),
});

// Registrar una cuenta nueva crea, en un solo paso, la organizacion (el
// "workspace" aislado de contactos/empresas) y el primer usuario, que
// queda como OWNER de esa organizacion.
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = esquema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const data = parsed.data;

  const existente = await db.usuario.findUnique({ where: { email: data.email } });
  if (existente) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo" }, { status: 409 });
  }

  const passwordHash = await hashPassword(data.password);

  const organizacion = await db.organizacion.create({
    data: {
      nombre: data.organizacionNombre,
      usuarios: {
        create: {
          nombre: data.nombre,
          email: data.email,
          passwordHash,
          role: "OWNER",
        },
      },
    },
    include: { usuarios: true },
  });

  const usuario = organizacion.usuarios[0];
  await crearSesion({ userId: usuario.id, organizacionId: organizacion.id, role: "OWNER" });

  return NextResponse.json({ ok: true });
}
