import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { infoEtapa } from "@/lib/crm";
import Avatar from "@/components/Avatar";
import EditarContactoForm from "./EditarContactoForm";
import TareasPanel from "./TareasPanel";
import ActividadPanel from "./ActividadPanel";

// "as any": ver nota en src/lib/auth.ts
const db = prisma as any;

export default async function ContactoDetallePage({ params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();

  const [contacto, empresas] = await Promise.all([
    db.contacto.findUnique({
      where: { id: params.id },
      include: {
        tareas: { orderBy: { fechaLimite: "asc" } },
        actividades: { include: { autor: true }, orderBy: { createdAt: "desc" } },
      },
    }),
    db.empresa.findMany({ where: { organizacionId: sesion!.organizacionId }, orderBy: { nombre: "asc" } }),
  ]);

  if (!contacto || contacto.organizacionId !== sesion!.organizacionId) notFound();
  const et = infoEtapa(contacto.etapa);

  return (
    <div>
      <Link href="/crm/contactos" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-ink mb-4">
        <ArrowLeft className="w-4 h-4" />
        Contactos
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <Avatar nombre={contacto.nombre} size="lg" />
        <div>
          <h1 className="text-2xl font-bold leading-tight">{contacto.nombre}</h1>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${et.bg} ${et.color}`}>
            {et.etiqueta}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <EditarContactoForm contacto={contacto} empresas={empresas} />
        <div className="space-y-6">
          <TareasPanel
            contactoId={contacto.id}
            tareas={contacto.tareas.map((t: any) => ({
              ...t,
              fechaLimite: t.fechaLimite ? t.fechaLimite.toISOString() : null,
            }))}
          />
          <ActividadPanel
            contactoId={contacto.id}
            actividades={contacto.actividades.map((a: any) => ({
              ...a,
              createdAt: a.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
