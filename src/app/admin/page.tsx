import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { requireUsuario } from "@/lib/auth";
import { formatearFecha } from "@/lib/formato";
import type { Evento, Tarea } from "@/lib/types";

export default async function Panel() {
  const { supabase, rol, nombre } = await requireUsuario();
  const esPropietario = rol === "PROPIETARIO";

  const [{ data: datosEventos }, { data: datosTareas }] = await Promise.all([
    supabase.from("eventos").select("*"),
    supabase.from("tareas_promocionales").select("*"),
  ]);

  const eventos = (datosEventos ?? []) as Evento[];
  const tareas = (datosTareas ?? []) as Tarea[];

  const totalEventos = eventos.length;
  const publicados = eventos.filter((e) => e.estado_publicacion === "PUBLICADO").length;
  const borradores = eventos.filter((e) => e.estado_publicacion === "BORRADOR").length;
  const pendientes = tareas.filter((t) => t.estado === "PENDIENTE").length;
  const enProgreso = tareas.filter((t) => t.estado === "EN_PROGRESO").length;
  const completadas = tareas.filter((t) => t.estado === "COMPLETADA").length;
  const canceladas = tareas.filter((t) => t.estado === "CANCELADA").length;

  const totalTareas = tareas.length;
  const porcentaje = (cantidad: number) =>
    totalTareas ? (cantidad / totalTareas) * 100 : 0;

  const proximosEventos = [...eventos]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 3);

  const tareasProximas = tareas
    .filter((t) => t.estado === "PENDIENTE" || t.estado === "EN_PROGRESO")
    .sort((a, b) => a.fecha_limite.localeCompare(b.fecha_limite))
    .slice(0, 3);

  const kpis = [
    { etiqueta: "Total Eventos Registrados", valor: totalEventos, pie: "Todos los estados", estilo: "" },
    { etiqueta: "Eventos Publicados", valor: publicados, pie: "Visibles al público", estilo: "accent-border", color: "text-accent" },
    { etiqueta: "Eventos en Borrador", valor: borradores, pie: "En preparación", estilo: "", color: "text-gold" },
    { etiqueta: "Tareas Pendientes", valor: pendientes, pie: "Aún no iniciadas", estilo: "", color: "text-warning" },
    { etiqueta: "Tareas En Progreso", valor: enProgreso, pie: "En ejecución", estilo: "", color: "text-accent" },
    { etiqueta: "Tareas Completadas", valor: completadas, pie: "Concluidas", estilo: "", color: "text-success" },
  ];

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Hola, {nombre}</h1>
          <p className="subtitle">
            {esPropietario
              ? "Rol: Propietario — Control total de eventos y tareas promocionales."
              : "Rol: Administradora — Vista de consulta de solo lectura."}
          </p>
        </div>
        <div className="topbar-actions">
          {esPropietario ? (
            <>
              <Link href="/admin/eventos/nuevo" className="btn btn-primary btn-sm">
                + Nuevo Evento
              </Link>
              <Link href="/admin/tareas/nueva" className="btn btn-secondary btn-sm">
                + Nueva Tarea
              </Link>
            </>
          ) : (
            <span className="badge-pill">Solo lectura</span>
          )}
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div className={`kpi-card ${kpi.estilo}`} key={kpi.etiqueta}>
            <span className="kpi-label">{kpi.etiqueta}</span>
            <strong className={`kpi-value ${kpi.color ?? ""}`}>{kpi.valor}</strong>
            <span className="kpi-foot">{kpi.pie}</span>
          </div>
        ))}
      </div>

      <div className="panel-box">
        <div className="panel-box-header">
          <h3>Resumen Visual del Estado de Tareas Promocionales</h3>
          <span className="badge-pill">
            {totalTareas ? Math.round((completadas / totalTareas) * 100) : 0}% completadas ({completadas}/{totalTareas})
          </span>
        </div>
        <div className="progress-bar-track">
          <div style={{ width: `${porcentaje(completadas)}%`, background: "#10b981" }} />
          <div style={{ width: `${porcentaje(enProgreso)}%`, background: "var(--accent-primary)" }} />
          <div style={{ width: `${porcentaje(pendientes)}%`, background: "#f59e0b" }} />
          <div style={{ width: `${porcentaje(canceladas)}%`, background: "#ef4444" }} />
        </div>
        <div className="progress-legend">
          <span><i style={{ background: "#10b981" }} /> Completada</span>
          <span><i style={{ background: "var(--accent-primary)" }} /> En progreso</span>
          <span><i style={{ background: "#f59e0b" }} /> Pendiente</span>
          <span><i style={{ background: "#ef4444" }} /> Cancelada</span>
        </div>
      </div>

      <div className="dashboard-split">
        <div className="panel-box">
          <div className="panel-box-header">
            <h3>Próximos Eventos</h3>
            <Link href="/admin/eventos" className="link-btn">
              Gestionar eventos →
            </Link>
          </div>
          <div className="compact-list">
            {proximosEventos.length === 0 ? (
              <div className="empty-state">No hay eventos registrados.</div>
            ) : (
              proximosEventos.map((evento) => (
                <div className="compact-item" key={evento.id_evento}>
                  <div>
                    <strong>{evento.titulo}</strong>
                    <small>
                      📅 {formatearFecha(evento.fecha)} · {evento.organizador || "Meraki Teatrobar"}
                    </small>
                  </div>
                  <StatusBadge estado={evento.estado_publicacion} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel-box">
          <div className="panel-box-header">
            <h3>Tareas Próximas a Vencer</h3>
            <Link href="/admin/tareas" className="link-btn">
              Ver tareas →
            </Link>
          </div>
          <div className="compact-list">
            {tareasProximas.length === 0 ? (
              <div className="empty-state">No hay tareas pendientes o en progreso.</div>
            ) : (
              tareasProximas.map((tarea) => (
                <div className="compact-item" key={tarea.id_tarea}>
                  <div>
                    <strong>{tarea.titulo}</strong>
                    <small>
                      ⏳ Límite: {formatearFecha(tarea.fecha_limite)} · Resp: Propietario
                    </small>
                  </div>
                  <StatusBadge estado={tarea.estado} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
