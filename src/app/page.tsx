import Link from "next/link";

import { MerakiLogo, MerakiMark } from "@/components/meraki-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatearFecha } from "@/lib/formato";
import { etiquetaPortada, estiloPortada } from "@/lib/portadas";
import { createClient } from "@/lib/supabase/server";
import type { Evento } from "@/lib/types";

const contacto = {
  correo: "contacto@merakiteatrobar.com",
  telefono: "+591 700-12345",
};

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos")
    .select("*")
    .eq("estado_publicacion", "PUBLICADO")
    .order("fecha", { ascending: true });

  const eventos = (data ?? []) as Evento[];

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
              <span className="badge-pill">🎭 Cartelera Oficial · Prototipo Visual</span>
              <h1>
                Escena en vivo, atmósfera nocturna y eventos en Meraki Teatrobar.
              </h1>
              <p>
                Descubre nuestras próximas funciones propias y eventos especiales
                en sala. Consulta los detalles de cada espectáculo y accede a sus
                enlaces oficiales de entradas.
              </p>
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
                <div className="showcase-gradient">
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
                <span className="section-kicker">Cartelera Vigente</span>
                <h2>Eventos Publicados</h2>
              </div>
              <p className="section-note">
                Solo se muestran eventos con estado <strong>Publicado</strong>.
                Los borradores y ocultos son privados.
              </p>
            </div>

            {eventos.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
                No hay eventos publicados en este momento.
              </div>
            ) : (
              <div className="events-grid">
                {eventos.map((evento) => (
                  <article className="event-card" key={evento.id_evento}>
                    <div
                      className="event-cover"
                      style={estiloPortada(
                        evento.imagen,
                        evento.id_evento,
                      )}
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
                Un escenario cercano para propuestas propias y de terceros
              </h2>
              <p>
                <strong>Meraki Teatrobar</strong> combina la calidez de un bar
                cultural con la puesta en escena de espectáculos en vivo.
                Realizamos producciones propias —como comedia, teatro y noches
                musicales— y también ponemos nuestras instalaciones a
                disposición de organizadores externos.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <span className="highlight-dot" />
                  <div>
                    <strong>Eventos Propios</strong>
                    <p>
                      Temporadas teatrales, stand-up, ciclos acústicos y
                      programación semanal.
                    </p>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-dot gold" />
                  <div>
                    <strong>Alquiler para Terceros</strong>
                    <p>
                      Espacio escénico equipado con sonido e iluminación para
                      lanzamientos, elencos y eventos privados.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-info-card">
              <h3>Información General del Establecimiento</h3>
              <ul className="info-list">
                <li>
                  <span>🎭 Modalidad:</span> Teatro bar con funciones propias y
                  alquiler de sala
                </li>
                <li>
                  <span>🎟️ Entradas:</span> Enlaces externos habilitados por
                  cada evento cuando corresponde
                </li>
                <li>
                  <span>💡 Técnica:</span> Iluminación escénica y sistema de
                  audio para presentaciones en vivo
                </li>
                <li>
                  <span>📌 Nota del prototipo:</span> Información y eventos de
                  demostración
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
                  Escríbenos o comunícate por nuestros canales oficiales para
                  coordinar fechas, conocer requerimientos técnicos o consultar
                  información general de la cartelera.
                </p>
              </div>

              <div className="contact-channels">
                <div className="channel-card">
                  <span className="channel-label">Correo Electrónico</span>
                  <strong>{contacto.correo}</strong>
                </div>
                <div className="channel-card">
                  <span className="channel-label">Teléfono de Contacto</span>
                  <strong>{contacto.telefono}</strong>
                </div>
                <div className="social-row">
                  <span className="social-chip">Instagram @merakiteatrobar</span>
                  <span className="social-chip">Facebook Meraki</span>
                  <span className="social-chip">TikTok</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="wrap footer-flex">
          <div>
            <strong>MERAKI TEATRO BAR</strong> — Sistema de Gestión de Eventos y
            Tareas Promocionales (Prototipo)
          </div>
          <Link href="/login" className="link-btn">
            Iniciar sesión en el panel
          </Link>
        </div>
      </footer>
    </div>
  );
}
