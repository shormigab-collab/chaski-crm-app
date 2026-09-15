// Avatar circular con iniciales, usado donde antes solo había texto plano
// (tarjetas de contacto, tablas, equipo). Sin fotos reales todavía, pero
// da mucha más textura visual que un nombre suelto.

const PALETAS = [
  "bg-brand-100 text-brand-700",
  "bg-coral-100 text-coral-700",
  "bg-gold-100 text-gold-600",
  "bg-emerald-100 text-emerald-700",
];

function inicialesDe(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function paletaDe(nombre: string) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = (hash * 31 + nombre.charCodeAt(i)) % PALETAS.length;
  return PALETAS[Math.abs(hash)];
}

export default function Avatar({
  nombre,
  size = "md",
}: {
  nombre: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = size === "sm" ? "w-7 h-7 text-[11px]" : size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-xs";
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-full font-semibold ${dims} ${paletaDe(
        nombre
      )}`}
    >
      {inicialesDe(nombre)}
    </span>
  );
}
