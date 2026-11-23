import Link from 'next/link'

import { requireUsuario } from '@/lib/auth'

export default async function Panel() {
  const { supabase, rol, nombre } = await requireUsuario()
  const esPropietario = rol === 'PROPIETARIO'

  const [{ count: totalEventos }, { count: publicados }, { count: pendientes }] =
    await Promise.all([
      supabase.from('eventos').select('*', { count: 'exact', head: true }),
      supabase
        .from('eventos')
        .select('*', { count: 'exact', head: true })
        .eq('estado_publicacion', 'PUBLICADO'),
      supabase
        .from('tareas_promocionales')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'PENDIENTE'),
    ])

  const tarjetas = [
    { etiqueta: 'Eventos registrados', valor: totalEventos ?? 0 },
    { etiqueta: 'Eventos publicados', valor: publicados ?? 0 },
    { etiqueta: 'Tareas pendientes', valor: pendientes ?? 0 },
  ]

  return (
    <div>
      <p className="text-sm tracking-[0.25em] text-fuchsia-400">PANEL PRINCIPAL</p>
      <h1 className="mt-2 text-3xl font-semibold">Hola, {nombre}</h1>
      <p className="mt-2 text-zinc-400">
        {esPropietario
          ? 'Tienes permisos completos para gestionar eventos y tareas.'
          : 'Tu acceso es de consulta. Puedes revisar eventos y tareas, pero no modificarlos.'}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {tarjetas.map((tarjeta) => (
          <div
            key={tarjeta.etiqueta}
            className="rounded-xl border border-white/10 bg-zinc-900 p-6"
          >
            <p className="text-4xl font-semibold text-white">{tarjeta.valor}</p>
            <p className="mt-2 text-sm text-zinc-400">{tarjeta.etiqueta}</p>
          </div>
        ))}
      </div>

      {esPropietario && (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin/eventos/nuevo"
            className="rounded-lg bg-fuchsia-600 px-5 py-3 text-sm font-semibold hover:bg-fuchsia-500"
          >
            Registrar evento
          </Link>
          <Link
            href="/admin/tareas/nueva"
            className="rounded-lg border border-white/15 px-5 py-3 text-sm hover:bg-white/5"
          >
            Registrar tarea
          </Link>
        </div>
      )}
    </div>
  )
}
