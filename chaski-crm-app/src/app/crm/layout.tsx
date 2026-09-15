import { redirect } from "next/navigation";
import Link from "next/link";
import { obtenerUsuarioActual } from "@/lib/auth";
import Logo from "@/components/Logo";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) redirect("/login");

  const links = [
    { href: "/crm", label: "Pipeline" },
    { href: "/crm/contactos", label: "Contactos" },
    { href: "/crm/empresas", label: "Empresas" },
    { href: "/crm/tareas", label: "Tareas" },
    ...(usuario.role === "OWNER" ? [{ href: "/crm/equipo", label: "Equipo" }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/crm" className="flex items-center gap-2">
              <Logo size={22} mostrarCrm />
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-gray-600 hover:text-ink hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">{usuario.nombre}</span>
            <form action="/api/auth/logout" method="post">
              <button className="text-xs font-medium text-gray-500 hover:text-ink transition-colors">Salir</button>
            </form>
          </div>
        </div>
        <nav className="sm:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-ink hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
