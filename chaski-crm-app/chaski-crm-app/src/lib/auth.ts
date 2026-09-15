import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";

// "as any": Usuario/Organizacion son modelos de un schema nuevo que este
// entorno de desarrollo (sandbox) no puede regenerar por falta de acceso a
// internet (ver nota igual en las rutas de la API). En Vercel, el deploy
// real corre "prisma generate" y queda todo tipado normal.
const db = prisma as any;

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-cambia-esto";
const COOKIE_NAME = "chaski_crm_sesion";

export type SessionPayload = {
  userId: string;
  organizacionId: string;
  role: "OWNER" | "MIEMBRO";
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function crearToken(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verificarToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function crearSesion(payload: SessionPayload) {
  const token = crearToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function obtenerSesion(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verificarToken(token);
}

export async function obtenerUsuarioActual() {
  const sesion = await obtenerSesion();
  if (!sesion) return null;
  const usuario = await db.usuario.findUnique({ where: { id: sesion.userId } });
  if (!usuario) return null;
  return { ...usuario, role: usuario.role as SessionPayload["role"] };
}
