import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import type { Evento } from '@/lib/types'

// Información fija mientras no exista un módulo para administrarla.
// Reemplaza los datos de contacto cuando tengas los valores reales.
const contacto = {
  ciudad: 'Santa Cruz de la Sierra, Bolivia',
  whatsapp: 'Por completar',
  instagram: 'Por completar',
}

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('eventos')
    .select('*')
    .eq('estado_publicacion', 'PUBLICADO')
    .order('fecha', { ascending: true })

  const eventos = (data ?? []) as Evento[]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-semibold tracking-[0.2em]">
            MERAKI <span className="text-fuchsia-400">TEATROBAR</span>
          </span>
          <nav className="flex items-center gap-6 text-sm text-zinc-300">
            <a href="#eventos" className="hover:text-white">
              Eventos
            </a>
            <a href="#contacto" className="hover:text-white">
              Contacto
            </a>
            <Link href="/login" className="text-zinc-500 hover:text-white">
              Ingreso
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="py-24">
          <p className="text-xs tracking-[0.35em] text-fuchsia-400">
            TEATRO · CULTURA · ENCUENTROS
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
            Un lugar para vivir el arte en {contacto.ciudad.split(',')[0]}.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Meraki Teatrobar es un espacio de cultura y espectáculos. Aquí
            encontrarás nuestros eventos publicados y podrás acceder a sus detalles.
          </p>
        </section>

        <section id="eventos" className="border-t border-white/10 py-20">
          <h2 className="text-3xl font-semibold">Próximos eventos</h2>
          <p className="mt-2 text-zinc-400">
            Solo mostramos los eventos que el propietario ha publicado.
          </p>

          {eventos.length === 0 ? (
            <p className="mt-10 rounded-xl border border-dashed border-white/15 p-10 text-center text-zinc-400">
              No hay eventos publicados en este momento.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventos.map((evento) => (
                <Link
                  key={evento.id_evento}
                  href={`/eventos/${evento.id_evento}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition hover:border-fuchsia-500/60"
                >
                  <div
                    className="h-44 bg-cover bg-center bg-zinc-800"
                    style={
                      evento.imagen
                        ? { backgroundImage: `url(${evento.imagen})` }
                        : undefined
                    }
                  />
                  <div className="p-6">
                    <p className="text-xs text-fuchsia-400">
                      {evento.fecha?.slice(0, 10)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold group-hover:text-fuchsia-300">
                      {evento.titulo}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                      {evento.descripcion}
                    </p>
                    <span className="mt-5 inline-block text-sm text-fuchsia-300">
                      Ver detalles →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section
          id="contacto"
          className="border-t border-white/10 py-20"
        >
          <h2 className="text-3xl font-semibold">Contacto</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">Ubicación</p>
              <p className="mt-2">{contacto.ciudad}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">WhatsApp</p>
              <p className="mt-2">{contacto.whatsapp}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">Instagram</p>
              <p className="mt-2">{contacto.instagram}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Meraki Teatrobar · miaudata
      </footer>
    </div>
  )
}
