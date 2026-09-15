import Link from "next/link";
import { ArrowRight, Building, CheckCircle2, Columns3, History, ListChecks, Users } from "lucide-react";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";

const beneficios = [
  {
    icono: Users,
    titulo: "Contactos y empresas",
    detalle: "Todo en un solo lugar, sin hojas de cálculo sueltas.",
  },
  {
    icono: Columns3,
    titulo: "Pipeline visual",
    detalle: "Mueve tus negocios por etapas, como ya te gusta trabajar.",
  },
  {
    icono: ListChecks,
    titulo: "Tareas de seguimiento",
    detalle: "Recordatorios para no dejar enfriar ningún contacto.",
  },
  {
    icono: History,
    titulo: "Historial por contacto",
    detalle: "Llamadas, correos y notas, siempre a la mano.",
  },
];

const columnasPreview = [
  { etiqueta: "Nuevo", color: "bg-gray-300", chips: ["Laura R.", "Grupo Andes"] },
  { etiqueta: "Negociando", color: "bg-gold-500", chips: ["Carlos M."] },
  { etiqueta: "Ganado", color: "bg-emerald-500", chips: ["Studio Nova"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-clip">
      <header className="sticky top-0 z-20 bg-cream/80 backdrop-blur border-b border-border/70">
        <div className="max-w-6xl mx-auto w-full px-4 py-4 flex items-center justify-between">
          <Logo size={28} mostrarCrm />
          <nav className="flex items-center gap-3 sm:gap-5 text-sm font-medium">
            <Link href="/login" className="text-ink/60 hover:text-ink transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Crear cuenta gratis
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-blob-brand pointer-events-none" />
          <div className="absolute inset-0 bg-blob-coral pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full mb-5">
                Un producto de chaski
              </span>
              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight leading-[1.08] mb-5">
                El CRM simple para <span className="text-brand-500">llevar tus ventas</span>
              </h1>
              <p className="text-lg text-ink/60 mb-8 max-w-md">
                Contactos, pipeline y tareas de seguimiento en un solo lugar. Sin curva de aprendizaje, sin cosas de
                más.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-base font-semibold px-7 py-3.5 rounded-xl transition-colors"
                >
                  Crear cuenta gratis
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
                <span className="text-sm text-ink/40">Gratis, sin tarjeta de crédito</span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border border-border rounded-2xl shadow-xl shadow-brand-900/5 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-ink/40 uppercase tracking-wide">Pipeline</span>
                  <div className="flex -space-x-2">
                    <Avatar nombre="Laura Restrepo" size="sm" />
                    <Avatar nombre="Carlos Mora" size="sm" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {columnasPreview.map((col) => (
                    <div key={col.etiqueta} className="bg-gray-50 rounded-xl p-2">
                      <div className="flex items-center gap-1.5 mb-2 px-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                        <span className="text-[10px] font-semibold text-ink/50 truncate">{col.etiqueta}</span>
                      </div>
                      <div className="space-y-1.5">
                        {col.chips.map((chip) => (
                          <div key={chip} className="bg-white border border-border rounded-lg px-2 py-2">
                            <p className="text-[11px] font-medium text-ink truncate">{chip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border border-border rounded-xl shadow-lg px-3.5 py-2.5 hidden sm:flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-ink">Tarea completada</span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20 lg:pb-28">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {beneficios.map((b) => (
              <div
                key={b.titulo}
                className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <b.icono className="w-5 h-5 text-brand-600" strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{b.titulo}</h3>
                <p className="text-sm text-ink/55">{b.detalle}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-24 text-center">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl px-8 py-14 sm:px-14">
            <Building className="w-8 h-8 text-cream/50 mx-auto mb-4" strokeWidth={1.75} />
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-cream mb-3">
              Empieza a organizar tus ventas hoy
            </h2>
            <p className="text-cream/60 mb-7 max-w-md mx-auto">
              Crea tu cuenta en menos de un minuto e invita a tu equipo cuando quieras.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 bg-cream hover:bg-white text-brand-700 text-base font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="text-center text-xs text-ink/40 py-8 border-t border-border/70">
        Un producto de{" "}
        <Link href="https://www.usechaski.com" className="hover:text-ink/60">
          chaski
        </Link>
      </footer>
    </div>
  );
}
