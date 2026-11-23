import Link from "next/link";
import { notFound } from "next/navigation";

import { BotonEliminar } from "@/components/boton-eliminar";
import { StatusBadge } from "@/components/status-badge";
import { requireUsuario } from "@/lib/auth";
import { formatearFecha } from "@/lib/formato";
import { etiquetaPortada, estiloPortada } from "@/lib/portadas";
import type { Evento } from "@/lib/types";
import { eliminarEvento } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetalleAdminEvento({ params }: Props) {
  const { supabase, rol } = await requireUsuario();
  const esPropietario = rol === "PROPIETARIO";
  const { id } = await params;

  const { data } = await supabase
    .from("eventos")
    .select("*")
    .eq("id_evento", id)
    .single();

  if (!data) notFound();

  const evento = data as Evento;
  const { count: tareasAsociadas } = await supabase
    .from("tareas_promocionales")
    .select("id_tarea", { count: "exact", head: true })
    .eq("id_evento", evento.id_evento);

  return (
    <div>
      <Link href="/admin/eventos" className="btn btn-secondary btn-sm">
        ← Volver a gestión de eventos
      </Link>

      <div className="admin-topbar" style={{ marginTop: "1.5rem" }}>
        <div>
          <h1>Detalle del Evento</h1>
          <p className="subtitle">Información registrada en el sistema.</p>
        </div>
        {esPropietario && (
          <div className="topbar-actions">
            <Link
              href={`/admin/eventos/${evento.id_evento}/editar`}
              className="btn btn-gold btn-sm"
            >
              Editar
            </Link>
            <BotonEliminar
              action={eliminarEvento}
              id={evento.id_evento}
              nombre={evento.titulo}
              mensaje={`¿Eliminar el evento "${evento.titulo}"? Sus tareas asociadas quedarán como tareas generales. Esta acción no se puede deshacer.`}
            />
          </div>
        )}
      </div>

      <div
        className="event-cover"
        style={{
          ...estiloPortada(evento.imagen, evento.id_evento),
          borderRadius: "10px",
          height: "200px",
          marginBottom: "1rem",
        }}
      >
        <div className="event-cover-top">
          <span className="event-date-badge">📅 {formatearFecha(evento.fecha)}</span>
          <StatusBadge estado={evento.estado_publicacion} />
        </div>
      </div>

      <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{evento.titulo}</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
        {evento.descripcion}
      </p>

      <div className="detail-grid">
        <div><strong>Fecha:</strong> {formatearFecha(evento.fecha)} ({evento.fecha?.slice(0, 10)})</div>
        <div><strong>Organizador:</strong> {evento.organizador || "Meraki Teatrobar"}</div>
        <div><strong>Estado de publicación:</strong> {" "}<StatusBadge estado={evento.estado_publicacion} /></div>
        <div><strong>Portada:</strong> {etiquetaPortada(evento.imagen, evento.id_evento)}</div>
        <div>
          <strong>Enlace de entradas:</strong>{" "}
          {evento.enlace_entradas ? (
            <a href={evento.enlace_entradas} target="_blank" rel="noopener noreferrer" className="link-btn">
              {evento.enlace_entradas} ↗
            </a>
          ) : (
            <span style={{ color: "var(--text-muted)" }}>No configurado</span>
          )}
        </div>
        <div><strong>Tareas promocionales asociadas:</strong> {tareasAsociadas ?? 0}</div>
      </div>
    </div>
  );
}
