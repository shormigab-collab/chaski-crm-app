import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, crearSesion } from "@/lib/auth";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

const esquema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = esquema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const usuario = await db.usuario.findUnique({ where: { email: parsed.data.email } });
  if (!usuario) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const passwordOk = await verifyPassword(parsed.data.password, usuario.passwordHash);
  if (!passwordOk) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  await crearSesion({
    userId: usuario.id,
    organizacionId: usuario.organizacionId,
    role: usuario.role as "OWNER" | "MIEMBRO",
  });

  return NextResponse.json({ ok: true });
}
