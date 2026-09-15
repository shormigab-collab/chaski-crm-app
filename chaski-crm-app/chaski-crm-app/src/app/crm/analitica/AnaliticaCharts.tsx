"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PorEtapa = { etapa: string; valor: number; color: string };
type PorTipo = { tipo: string; valor: number };
type PorSemana = { etiqueta: string; valor: number };

export default function AnaliticaCharts({
  porEtapa,
  porTipoActividad,
  porSemana,
  tareasCompletadas,
  tareasPendientes,
  totalContactos,
  totalActividades,
}: {
  porEtapa: PorEtapa[];
  porTipoActividad: PorTipo[];
  porSemana: PorSemana[];
  tareasCompletadas: number;
  tareasPendientes: number;
  totalContactos: number;
  totalActividades: number;
}) {
  const totalTareas = tareasCompletadas + tareasPendientes;
  const pctCompletadas = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard etiqueta="Contactos totales" valor={totalContactos} />
        <StatCard etiqueta="Actividades registradas" valor={totalActividades} />
        <StatCard etiqueta="Tareas completadas" valor={tareasCompletadas} />
        <StatCard etiqueta="% tareas al día" valor={`${pctCompletadas}%`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Contactos nuevos por semana</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={porSemana} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2EF" />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 11, fill: "#8178BA" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8178BA" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #E7E2EF", fontSize: 12 }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="valor" stroke="#3B2F8F" strokeWidth={2.5} dot={{ r: 3 }} name="Contactos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Contactos por etapa</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={porEtapa} dataKey="valor" nameKey="etapa" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {porEtapa.map((e) => (
                    <Cell key={e.etapa} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E2EF", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 flex-1">
              {porEtapa.map((e) => (
                <div key={e.etapa} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                  <span className="text-ink/70 flex-1 truncate">{e.etapa}</span>
                  <span className="font-semibold tabular-nums">{e.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-sm mb-4">Actividad registrada por tipo</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={porTipoActividad} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2EF" />
              <XAxis dataKey="tipo" tick={{ fontSize: 11, fill: "#8178BA" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8178BA" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E2EF", fontSize: 12 }} />
              <Bar dataKey="valor" name="Actividades" fill="#FF6B5F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ etiqueta, valor }: { etiqueta: string; valor: number | string }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <p className="text-2xl font-bold tabular-nums">{valor}</p>
      <p className="text-xs text-gray-500 mt-0.5">{etiqueta}</p>
    </div>
  );
}
