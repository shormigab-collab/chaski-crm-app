import Link from "next/link";
import { Check } from "lucide-react";
import Logo from "@/components/Logo";

export default function LandingPage() {
  const beneficios = [
    "Contactos y empresas en un solo lugar",
    "Pipeline visual por etapas, como te gusta trabajar",
    "Tareas y recordatorios de seguimiento",
    "Historial de llamadas, correos y notas por contacto",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="max-w-5xl mx-auto w-full px-4 py-6 flex items-center justify-between">
        <Logo size={30} mostrarCrm />
        <nav className="flex items-center gap-4 text-sm font-medium">
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
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight mb-5">
          El CRM simple para llevar tus ventas
        </h1>
        <p className="text-lg text-ink/60 mb-10 max-w-xl mx-auto">
          Contactos, pipeline y tareas de seguimiento en un solo lugar. Sin curva de aprendizaje, sin cosas de más.
        </p>
        <Link
          href="/registro"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white text-base font-semibold px-8 py-3.5 rounded-xl transition-colors"
        >
          Crear cuenta gratis
        </Link>

        <div className="mt-16 grid sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
          {beneficios.map((b) => (
            <div key={b} className="flex items-start gap-2.5 bg-white border border-border rounded-xl p-4">
              <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-sm text-ink/80">{b}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center text-xs text-ink/40 py-8">
        Un producto de <Link href="https://www.usechaski.com" className="hover:text-ink/60">chaski</Link>
      </footer>
    </div>
  );
}
