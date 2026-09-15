// Constantes del CRM: centralizadas aca para que el orden/color/etiqueta
// de cada etapa sea consistente entre el pipeline, el detalle de contacto
// y cualquier filtro.

export type EtapaCrm = "NUEVO" | "CONTACTADO" | "NEGOCIANDO" | "GANADO" | "PERDIDO";

export const ETAPAS_CRM: { valor: EtapaCrm; etiqueta: string; color: string; bg: string }[] = [
  { valor: "NUEVO", etiqueta: "Nuevo", color: "text-gray-600", bg: "bg-gray-100" },
  { valor: "CONTACTADO", etiqueta: "Contactado", color: "text-brand-700", bg: "bg-brand-50" },
  { valor: "NEGOCIANDO", etiqueta: "Negociando", color: "text-gold-600", bg: "bg-gold-50" },
  { valor: "GANADO", etiqueta: "Ganado", color: "text-emerald-700", bg: "bg-emerald-50" },
  { valor: "PERDIDO", etiqueta: "Perdido", color: "text-coral-700", bg: "bg-coral-50" },
];

export function infoEtapa(etapa: string) {
  return ETAPAS_CRM.find((e) => e.valor === etapa) ?? ETAPAS_CRM[0];
}

export type TipoActividad = "NOTA" | "LLAMADA" | "CORREO" | "REUNION";

export const TIPOS_ACTIVIDAD: { valor: TipoActividad; etiqueta: string }[] = [
  { valor: "NOTA", etiqueta: "Nota" },
  { valor: "LLAMADA", etiqueta: "Llamada" },
  { valor: "CORREO", etiqueta: "Correo" },
  { valor: "REUNION", etiqueta: "Reunión" },
];
