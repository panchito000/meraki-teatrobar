import Link from 'next/link'
import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import type { Evento } from '@/lib/types'

type Props = {
  params: Promise<{ id: string }>
}

export default async function DetalleEvento({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('eventos')
    .select('*')
    .eq('id_evento', id)
    .eq('estado_publicacion', 'PUBLICADO')
    .single()

  if (!data) notFound()

  const evento = data as Evento

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-semibold tracking-[0.2em]">
            MERAKI <span className="text-fuchsia-400">TEATROBAR</span>
          </Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Volver a eventos
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        {evento.imagen && (
          <div
            className="h-72 rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${evento.imagen})` }}
            role="img"
            aria-label={`Imagen de ${evento.titulo}`}
          />
        )}

        <p className="mt-8 text-xs tracking-[0.25em] text-fuchsia-400">
          {evento.fecha?.slice(0, 10)}
        </p>
        <h1 className="mt-3 text-4xl font-semibold">{evento.titulo}</h1>

        <div className="mt-10 prose prose-invert max-w-none">
          <p className="whitespace-pre-line text-lg leading-8 text-zinc-300">
            {evento.descripcion}
          </p>
        </div>

        {evento.organizador && (
          <p className="mt-8 text-sm text-zinc-400">
            Organizado por: <span className="text-zinc-200">{evento.organizador}</span>
          </p>
        )}

        {evento.enlace_entradas && (
          <a
            href={evento.enlace_entradas}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-lg bg-fuchsia-600 px-6 py-3 font-semibold hover:bg-fuchsia-500"
          >
            Obtener entradas ↗
          </a>
        )}

        <p className="mt-12 text-xs text-zinc-500">
          Las entradas se gestionan en un sitio externo. Este sistema no procesa
          pagos.
        </p>
      </main>
    </div>
  )
}
