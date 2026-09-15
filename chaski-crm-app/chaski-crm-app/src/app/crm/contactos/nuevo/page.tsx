import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import NuevoContactoForm from "./NuevoContactoForm";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

export default async function NuevoContactoPage() {
  const sesion = await obtenerSesion();
  const empresas = await db.empresa.findMany({
    where: { organizacionId: sesion!.organizacionId },
    orderBy: { nombre: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo contacto</h1>
      <NuevoContactoForm empresas={empresas} />
    </div>
  );
}
