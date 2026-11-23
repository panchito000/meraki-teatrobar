import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { requireUsuario } from "@/lib/auth";
import { formatearFecha } from "@/lib/formato";
import { estiloPortada } from "@/lib/portadas";
import type { EstadoEvento, Evento } from "@/lib/types";
import { cambiarEstadoEvento } from "../actions";

const ESTADOS: EstadoEvento[] = ["BORRADOR", "PUBLICADO", "OCULTO"];

type Props = {
  searchParams: Promise<{ q?: string; estado?: string }>;
};

export default async function EventosAdmin({ searchParams }: Props) {
  const { supabase, rol } = await requireUsuario();
  const esPropietario = rol === "PROPIETARIO";
  const { q = "", estado = "ALL" } = await searchParams;

  const { data } = await supabase
    .from("eventos")
    .select("*")
    .order("fecha", { ascending: false });

  const consulta = q.trim().toLowerCase();
  const eventos = ((data ?? []) as Evento[]).filter((evento) => {
    const coincideEstado = estado === "ALL" || evento.estado_publicacion === estado;
    const coincideTexto =
      !consulta ||
      evento.titulo.toLowerCase().includes(consulta) ||
      evento.organizador.toLowerCase().includes(consulta) ||
      evento.descripcion.toLowerCase().includes(consulta);
    return coincideEstado && coincideTexto;
  });

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Gestión de Eventos</h1>
          <p className="subtitle">
            Consulta y administra eventos propios y de terceros de Meraki Teatrobar.
          </p>
        </div>
        {esPropietario && (
          <Link href="/admin/eventos/nuevo" className="btn btn-primary">
            + Registrar Evento
          </Link>
        )}
      </div>

      <form className="filters-bar" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por título u organizador..."
        />
        <select name="estado" defaultValue={estado}>
          <option value="ALL">Todos los estados</option>
          <option value="BORRADOR">Borrador</option>
          <option value="PUBLICADO">Publicado</option>
          <option value="OCULTO">Oculto</option>
        </select>
        <button type="submit" className="btn btn-secondary">
          Filtrar
        </button>
      </form>

      {eventos.length === 0 ? (
        <div className="empty-state">No se encontraron eventos con los filtros seleccionados.</div>
      ) : (
        <div className="admin-cards-grid">
          {eventos.map((evento) => (
            <article className="admin-event-card" key={evento.id_evento}>
              <div
                className="event-cover"
                style={{
                  ...estiloPortada(evento.imagen, evento.id_evento),
                  height: "140px",
                }}
              >
                <div className="event-cover-top">
                  <span className="event-date-badge">
                    📅 {formatearFecha(evento.fecha)}
                  </span>
                  <StatusBadge estado={evento.estado_publicacion} />
                </div>
              </div>
              <div className="admin-event-body">
                <span style={{ fontSize: "0.75rem", color: "var(--accent-gold)", fontWeight: 600 }}>
                  {evento.organizador || "Meraki Teatrobar"}
                </span>
                <h3 style={{ fontSize: "1.05rem", margin: "0.25rem 0 0.4rem" }}>
                  {evento.titulo}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", flex: 1 }}>
                  {evento.descripcion}
                </p>
                <div className="admin-event-actions">
                  <Link
                    href={`/admin/eventos/${evento.id_evento}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Ver detalles
                  </Link>
                  {esPropietario && (
                    <>
                      <Link
                        href={`/admin/eventos/${evento.id_evento}/editar`}
                        className="btn btn-gold btn-sm"
                      >
                        Editar
                      </Link>
                      {ESTADOS.map((estadoEvento) =>
                        estadoEvento === evento.estado_publicacion ? null : (
                          <form
                            key={estadoEvento}
                            action={cambiarEstadoEvento}
                          >
                            <input type="hidden" name="id" value={evento.id_evento} />
                            <input type="hidden" name="estado" value={estadoEvento} />
                            <button type="submit" className="btn btn-secondary btn-sm">
                              {estadoEvento === "PUBLICADO"
                                ? "Publicar"
                                : estadoEvento === "OCULTO"
                                  ? "Ocultar"
                                  : "Borrador"}
                            </button>
                          </form>
                        ),
                      )}
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
