"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Columns3, Users, Building, ListChecks, UsersRound, TrendingUp, type LucideIcon } from "lucide-react";

const ICONOS: Record<string, LucideIcon> = {
  "/crm": Columns3,
  "/crm/contactos": Users,
  "/crm/empresas": Building,
  "/crm/tareas": ListChecks,
  "/crm/analitica": TrendingUp,
  "/crm/equipo": UsersRound,
};

export default function NavLinks({
  links,
  vertical = false,
}: {
  links: { href: string; label: string }[];
  vertical?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className={vertical ? "flex items-center gap-1 overflow-x-auto" : "hidden sm:flex items-center gap-1"}>
      {links.map((l) => {
        const activo = l.href === "/crm" ? pathname === "/crm" : pathname?.startsWith(l.href);
        const Icono = ICONOS[l.href];
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activo ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:text-ink hover:bg-gray-100"
            }`}
          >
            {Icono && <Icono className="w-4 h-4" strokeWidth={2} />}
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
