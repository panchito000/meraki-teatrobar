import Link from "next/link";

import { MerakiLogo, MerakiMark } from "@/components/meraki-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { fechaDeHoy, formatearFecha } from "@/lib/formato";
import { etiquetaPortada, estiloPortada } from "@/lib/portadas";
import { createClient } from "@/lib/supabase/server";
import type { Evento } from "@/lib/types";

const contacto = {
  correo: "merakiteatrobar@gmail.com",
  telefono: "+591 69253799",
  whatsapp: "https://wa.me/59169253799",
  direccion:
    "Calle Ballivián #159, entre La Paz y Chuquisaca, Santa Cruz de la Sierra, Bolivia",
  mapas: "https://maps.app.goo.gl/eXNiPvjBESA97J1F9",
};

const redes = [
  { nombre: "Instagram", href: "https://www.instagram.com/merakiteatrobar/" },
  { nombre: "TikTok", href: "https://www.tiktok.com/@merakiteatro" },
  { nombre: "Facebook", href: "https://www.facebook.com/merakiteatrobar" },
  {
    nombre: "Discos en la oscuridad",
    href: "https://www.instagram.com/discosenlaoscuridad/",
  },
];

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
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("estado_publicacion", "PUBLICADO")
    .order("fecha", { ascending: true });

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
              <span className="badge-pill">
                Música + Teatro + Comedia + Danza + Poesía
              </span>
              <h1>
                Escena en vivo y eventos culturales en Meraki Teatrobar.
              </h1>
              <p>
                Estamos en la calle Ballivián #159, en Santa Cruz de la Sierra.
                Aquí puedes ver lo que está en cartelera y también los eventos
                que ya pasaron por la sala, propios o de terceros.
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
            </div>

            <div className="about-info-card">
              <h3>Información General del Establecimiento</h3>
              <ul className="info-list">
                <li>
                  <span>📍 Dirección:</span> {contacto.direccion}
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
                  <a href={`mailto:${contacto.correo}`} className="link-btn">
                    {contacto.correo}
                  </a>
                </div>
                <div className="channel-card">
                  <span className="channel-label">WhatsApp</span>
                  <a
                    href={contacto.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-btn"
                  >
                    {contacto.telefono}
                  </a>
                </div>
                <div className="channel-card">
                  <span className="channel-label">Dirección</span>
                  <strong>{contacto.direccion}</strong>
                  <a
                    href={contacto.mapas}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-btn"
                  >
                    Ver en Google Maps
                  </a>
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
            <strong>Meraki Teatrobar</strong> — Calle Ballivián #159, Santa Cruz
            de la Sierra
          </div>
          <Link href="/login" className="link-btn">
            Iniciar sesión en el panel
          </Link>
        </div>
      </footer>
    </div>
  );
}
