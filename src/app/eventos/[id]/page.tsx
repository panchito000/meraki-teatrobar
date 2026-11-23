import Link from "next/link";
import { notFound } from "next/navigation";

import { MerakiLogo } from "@/components/meraki-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { obtenerConfiguracion } from "@/lib/configuracion";
import { formatearFecha } from "@/lib/formato";
import { etiquetaPortada, estiloPortada } from "@/lib/portadas";
import { createClient } from "@/lib/supabase/server";
import type { Evento } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetalleEvento({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, configuracion] = await Promise.all([
    supabase
      .from("eventos")
      .select("*")
      .eq("id_evento", id)
      .eq("estado_publicacion", "PUBLICADO")
      .single(),
    obtenerConfiguracion(),
  ]);

  if (!data) notFound();

  const evento = data as Evento;

  return (
    <div className="flex-1">
      <header className="public-header">
        <div className="wrap nav-wrapper">
          <Link href="/" aria-label="Meraki Teatrobar">
            <MerakiLogo />
          </Link>
          <div className="nav-actions">
            <ThemeToggle />
            <Link href="/" className="btn btn-secondary btn-sm">
              ← Volver a la cartelera
            </Link>
          </div>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <span className="badge-pill">🎭 Detalle del evento</span>

        <div
          className="event-cover"
          style={{
            ...estiloPortada(evento.imagen, evento.id_evento),
            borderRadius: "14px",
            height: "260px",
            margin: "1.5rem 0",
          }}
        >
          <div className="event-cover-top">
            <span className="event-date-badge">
              📅 {formatearFecha(evento.fecha)}
            </span>
            <span className="gold-tag">
              {etiquetaPortada(evento.imagen, evento.id_evento)}
            </span>
          </div>
        </div>

        <span className="section-kicker">Cartelera Vigente</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", marginBottom: "1rem" }}>
          {evento.titulo}
        </h1>
        <p style={{ color: "var(--accent-gold)", fontWeight: 600, marginBottom: "1rem" }}>
          Organizador: {evento.organizador || "Meraki Teatrobar"}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "780px" }}>
          {evento.descripcion}
        </p>

        <div className="detail-grid" style={{ maxWidth: "780px", marginTop: "1.75rem" }}>
          <div>
            <strong>Fecha:</strong> {formatearFecha(evento.fecha)}
          </div>
          <div>
            <strong>Estado de publicación:</strong> Publicado
          </div>
          <div>
            <strong>Enlace de entradas:</strong>{" "}
            {evento.enlace_entradas ? (
              <a
                href={evento.enlace_entradas}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                {evento.enlace_entradas} ↗
              </a>
            ) : (
              <span style={{ color: "var(--text-muted)" }}>No configurado</span>
            )}
          </div>
        </div>

        <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {evento.enlace_entradas && (
            <a
              href={evento.enlace_entradas}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Adquirir Entradas (Enlace Externo) ↗
            </a>
          )}
          <Link href="/#eventos" className="btn btn-secondary">
            Volver a la cartelera
          </Link>
        </div>

        <p className="section-note" style={{ marginTop: "2rem" }}>
          Las entradas se gestionan en un sitio externo. Este sistema no procesa
          pagos.
        </p>
      </main>

      <footer className="public-footer">
        <div className="wrap footer-flex">
          <div>
            <strong>Meraki Teatrobar</strong> — {configuracion.direccion}
          </div>
          <Link href="/login" className="link-btn">
            Iniciar sesión en el panel
          </Link>
        </div>
      </footer>
    </div>
  );
}
