import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { requireUsuario } from "@/lib/auth";
import { formatearFecha } from "@/lib/formato";
import type { EstadoTarea, Tarea } from "@/lib/types";
import { cambiarEstadoTarea } from "../actions";

type TareaConEvento = Tarea & { eventos: { titulo: string } | null };

const ESTADOS: EstadoTarea[] = [
  "PENDIENTE",
  "EN_PROGRESO",
  "COMPLETADA",
  "CANCELADA",
];

type Props = {
  searchParams: Promise<{ q?: string; estado?: string; tipo?: string }>;
};

export default async function TareasAdmin({ searchParams }: Props) {
  const { supabase, rol } = await requireUsuario();
  const esPropietario = rol === "PROPIETARIO";
  const { q = "", estado = "ALL", tipo = "ALL" } = await searchParams;

  const { data } = await supabase
    .from("tareas_promocionales")
    .select("*, eventos ( titulo )")
    .order("fecha_limite", { ascending: true });

  const consulta = q.trim().toLowerCase();
  const tareas = ((data ?? []) as TareaConEvento[]).filter((tarea) => {
    const coincideEstado = estado === "ALL" || tarea.estado === estado;
    const coincideTipo =
      tipo === "ALL" ||
      (tipo === "EVENT" && Boolean(tarea.id_evento)) ||
      (tipo === "GENERAL" && !tarea.id_evento);
    const texto = `${tarea.titulo} ${tarea.descripcion} ${tarea.eventos?.titulo ?? ""}`.toLowerCase();
    return coincideEstado && coincideTipo && (!consulta || texto.includes(consulta));
  });

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Tareas Promocionales</h1>
          <p className="subtitle">
            Organización de difusión, diseños, videos, agenda semanal, sonido e
            iluminación (Responsable: Propietario).
          </p>
        </div>
        {esPropietario && (
          <Link href="/admin/tareas/nueva" className="btn btn-primary">
            + Registrar Tarea
          </Link>
        )}
      </div>

      <form className="filters-bar" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar tarea por título o descripción..."
        />
        <select name="estado" defaultValue={estado}>
          <option value="ALL">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PROGRESO">En progreso</option>
          <option value="COMPLETADA">Completada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
        <select name="tipo" defaultValue={tipo}>
          <option value="ALL">Todas las tareas</option>
          <option value="EVENT">Asociadas a un evento</option>
          <option value="GENERAL">Tareas generales</option>
        </select>
        <button type="submit" className="btn btn-secondary">
          Filtrar
        </button>
      </form>

      {tareas.length === 0 ? (
        <div className="empty-state">
          No hay tareas promocionales que coincidan con el filtro.
        </div>
      ) : (
        <div className="tasks-stack">
          {tareas.map((tarea) => (
            <div className="task-card" key={tarea.id_tarea}>
              <div className="task-main">
                <div className="task-top-row">
                  <span className="task-title">{tarea.titulo}</span>
                  {esPropietario && <StatusBadge estado={tarea.estado} />}
                </div>
                <p className="task-desc">{tarea.descripcion}</p>
                <div className="task-meta">
                  <span>
                    {tarea.id_evento
                      ? `🎭 Evento: ${tarea.eventos?.titulo ?? "Evento asociado"}`
                      : "🏛️ Tarea general del establecimiento"}
                  </span>
                  <span>📅 Límite: {formatearFecha(tarea.fecha_limite)}</span>
                  <span>👤 Responsable: Propietario</span>
                </div>
              </div>
              <div className="task-controls">
                {esPropietario ? (
                  <form action={cambiarEstadoTarea} style={{ display: "flex", gap: "0.5rem" }}>
                    <input type="hidden" name="id" value={tarea.id_tarea} />
                    <select
                      name="estado"
                      defaultValue={tarea.estado}
                      className="task-status-select"
                      aria-label="Cambiar estado de tarea"
                    >
                      {ESTADOS.map((estadoTarea) => (
                        <option key={estadoTarea} value={estadoTarea}>
                          {estadoTarea === "EN_PROGRESO" ? "En progreso" : estadoTarea === "PENDIENTE" ? "Pendiente" : estadoTarea === "COMPLETADA" ? "Completada" : "Cancelada"}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-secondary btn-sm">
                      Actualizar
                    </button>
                  </form>
                ) : (
                  <StatusBadge estado={tarea.estado} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
