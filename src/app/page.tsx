import Link from "next/link";

import { MerakiLogo, MerakiMark } from "@/components/meraki-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { obtenerConfiguracion } from "@/lib/configuracion";
import { fechaDeHoy, formatearFecha } from "@/lib/formato";
import { etiquetaPortada, estiloPortada } from "@/lib/portadas";
import { createClient } from "@/lib/supabase/server";
import type { Evento } from "@/lib/types";

function TarjetaEvento({ evento }: { evento: Evento }) {
  return (
    <article className="event-card">
      <div
        className="event-cover"
        style={estiloPortada(evento.imagen, evento.id_evento)}
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
      <div className="event-body">
        <div className="event-meta-line">
          Organiza: {evento.organizador || "Meraki Teatrobar"}
        </div>
        <h3>{evento.titulo}</h3>
        <p className="event-desc">{evento.descripcion}</p>
        <div className="event-card-actions">
          <Link
            href={`/eventos/${evento.id_evento}`}
            className="btn btn-secondary btn-sm"
          >
            Ver detalles
          </Link>
          {evento.enlace_entradas && (
            <a
              href={evento.enlace_entradas}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              Entradas ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const [{ data, error }, configuracion] = await Promise.all([
    supabase
      .from("eventos")
      .select("*")
      .eq("estado_publicacion", "PUBLICADO")
      .order("fecha", { ascending: true }),
    obtenerConfiguracion(),
  ]);

  const redes = [
    { nombre: "Instagram", href: configuracion.instagram },
    { nombre: "TikTok", href: configuracion.tiktok },
    { nombre: "Facebook", href: configuracion.facebook },
    { nombre: "Discos en la oscuridad", href: configuracion.discos },
  ].filter((red): red is { nombre: string; href: string } => Boolean(red.href));

  const eventos = (data ?? []) as Evento[];
  const hoy = fechaDeHoy();
  const actuales = eventos.filter((evento) => evento.fecha.slice(0, 10) >= hoy);
  const realizados = eventos
    .filter((evento) => evento.fecha.slice(0, 10) < hoy)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div className="flex-1">
      <header className="public-header">
        <div className="wrap nav-wrapper">
          <Link href="/" aria-label="Meraki Teatrobar">
            <MerakiLogo />
          </Link>

          <nav className="public-nav">
            <a href="#inicio">Inicio</a>
            <a href="#eventos">Eventos</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <Link href="/login" className="btn btn-outline-accent btn-sm">
              Panel Gestión
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero-section">
          <div className="hero-glow" />
          <div className="wrap hero-grid">
            <div className="hero-content">
              <span className="badge-pill">{configuracion.etiqueta_hero}</span>
              <h1>{configuracion.titulo_hero}</h1>
              <p>{configuracion.bajada_hero}</p>
              <div className="hero-buttons">
                <a href="#eventos" className="btn btn-primary">
                  Ver Eventos Publicados
                </a>
                <a href="#contacto" className="btn btn-secondary">
                  Alquiler y Contacto
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card-showcase">
                <div
                  className={`showcase-gradient ${configuracion.imagen_hero ? "con-imagen" : ""}`}
                  style={estiloPortada(configuracion.imagen_hero, "meraki-hero")}
                >
                  <MerakiMark className="meraki-svg-large" color="#F5F3F0" />
                  <h3>MERAKI</h3>
                  <p>TEATRO BAR</p>
                  <span className="gold-tag">Producciones &amp; Alquileres</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="eventos" className="section-block">
          <div className="wrap">
            <div className="section-header">
              <div>
                <span className="section-kicker">Cartelera vigente</span>
                <h2>En cartelera</h2>
              </div>
              <p className="section-note">
                Aquí aparecen los eventos publicados con fecha de hoy o posterior.
                Los borradores y ocultos no se muestran.
              </p>
            </div>

            {error ? (
              <div className="empty-state">
                No se pudo cargar la cartelera. Intenta de nuevo en unos minutos.
              </div>
            ) : actuales.length === 0 ? (
              <div className="empty-state">
                No hay eventos en cartelera en este momento.
              </div>
            ) : (
              <div className="events-grid">
                {actuales.map((evento) => (
                  <TarjetaEvento key={evento.id_evento} evento={evento} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="realizados" className="section-block section-alt">
          <div className="wrap">
            <div className="section-header">
              <div>
                <span className="section-kicker">Lo que pasa por la sala</span>
                <h2>Eventos ya realizados</h2>
              </div>
              <p className="section-note">
                Siguen publicados para que se vea el tipo de actividades que
                pasan por Meraki Teatrobar.
              </p>
            </div>

            {error ? null : realizados.length === 0 ? (
              <div className="empty-state">
                Todavía no hay eventos publicados con fecha pasada.
              </div>
            ) : (
              <div className="events-grid">
                {realizados.map((evento) => (
                  <TarjetaEvento key={evento.id_evento} evento={evento} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="nosotros" className="section-block section-alt">
          <div className="wrap about-grid">
            <div>
              <span className="section-kicker">Sobre Meraki Teatrobar</span>
              <h2>
                Teatro, música y eventos culturales en Santa Cruz de la Sierra
              </h2>
              <p>
                <strong>Meraki Teatrobar</strong> funciona desde hace unos diez
                años en la calle Ballivián #159, entre La Paz y Chuquisaca. Es
                un espacio de entretenimiento para presentaciones artísticas,
                eventos propios y eventos organizados por terceros.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <span className="highlight-dot" />
                  <div>
                    <strong>Eventos propios</strong>
                    <p>
                      Música, teatro, comedia, danza y poesía, con programación
                      preparada por el establecimiento.
                    </p>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-dot gold" />
                  <div>
                    <strong>Eventos de terceros</strong>
                    <p>
                      La sala también se alquila para actividades de otros
                      organizadores. A veces la publicación se comparte con la
                      cuenta del evento, como Discos en la oscuridad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="discos-card">
                <span className="section-kicker">Ciclo destacado</span>
                <h3>{configuracion.discos_titulo}</h3>
                <p>{configuracion.discos_descripcion}</p>
                <div className="discos-links">
                  {configuracion.passline && (
                    <a
                      href={configuracion.passline}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      {configuracion.passline_titulo} ↗
                    </a>
                  )}
                  {configuracion.discos && (
                    <a
                      href={configuracion.discos}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Instagram ↗
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="about-info-card">
              <h3>Información General del Establecimiento</h3>
              <ul className="info-list">
                <li>
                  <span>📍 Dirección:</span> {configuracion.direccion}
                </li>
                <li>
                  <span>🎭 Programación:</span> Música, teatro, comedia, danza
                  y poesía
                </li>
                <li>
                  <span>🎟️ Entradas:</span> El enlace de cada evento lleva al
                  medio donde se reservan o se compran, cuando existe
                </li>
                <li>
                  <span>🎧 Discos en la oscuridad:</span> Ciclo con cuenta
                  propia de Instagram, además de la de Meraki Teatrobar
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contacto" className="section-block">
          <div className="wrap">
            <div className="contact-banner">
              <div>
                <span className="section-kicker">Contacto y Consultas</span>
                <h2>
                  ¿Consultas sobre eventos, entradas o alquiler de la sala?
                </h2>
                <p>
                  Escríbenos para consultar funciones, entradas o el uso de la
                  sala. La reserva de algunos eventos se coordina por WhatsApp.
                </p>
              </div>

              <div className="contact-channels">
                <div className="channel-card">
                  <span className="channel-label">Correo electrónico</span>
                  <a href={`mailto:${configuracion.correo}`} className="link-btn">
                    {configuracion.correo}
                  </a>
                </div>
                <div className="channel-card">
                  <span className="channel-label">WhatsApp</span>
                  {configuracion.whatsapp ? (
                    <a
                      href={configuracion.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                    >
                      {configuracion.telefono}
                    </a>
                  ) : (
                    <strong>{configuracion.telefono}</strong>
                  )}
                </div>
                <div className="channel-card">
                  <span className="channel-label">Dirección</span>
                  <strong>{configuracion.direccion}</strong>
                  {configuracion.mapas && (
                    <a
                      href={configuracion.mapas}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                    >
                      Ver en Google Maps
                    </a>
                  )}
                </div>
                <div className="social-row">
                  {redes.map((red) => (
                    <a
                      key={red.href}
                      href={red.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-chip"
                    >
                      {red.nombre}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
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
