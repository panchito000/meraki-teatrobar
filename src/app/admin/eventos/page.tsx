import Link from 'next/link'

import { requireUsuario } from '@/lib/auth'
import type { Evento, EstadoEvento } from '@/lib/types'
import { cambiarEstadoEvento } from '../actions'

const estados: EstadoEvento[] = ['BORRADOR', 'PUBLICADO', 'OCULTO']

export default async function EventosAdmin() {
  const { supabase, rol } = await requireUsuario()
  const esPropietario = rol === 'PROPIETARIO'

  const { data } = await supabase
    .from('eventos')
    .select('*')
    .order('fecha', { ascending: false })

  const eventos = (data ?? []) as Evento[]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.25em] text-fuchsia-400">EVENTOS</p>
          <h1 className="mt-2 text-3xl font-semibold">Eventos registrados</h1>
        </div>
        {esPropietario && (
          <Link
            href="/admin/eventos/nuevo"
            className="rounded-lg bg-fuchsia-600 px-5 py-3 text-sm font-semibold hover:bg-fuchsia-500"
          >
            Registrar evento
          </Link>
        )}
      </div>

      {eventos.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-white/15 p-8 text-center text-zinc-400">
          Todavía no hay eventos registrados.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="px-4 py-3">Evento</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                {esPropietario && <th className="px-4 py-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id_evento} className="border-t border-white/10">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{evento.titulo}</p>
                    <p className="text-xs text-zinc-500">
                      {evento.organizador || 'Sin organizador'}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-zinc-300">
                    {evento.fecha?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">
                      {evento.estado_publicacion}
                    </span>
                  </td>
                  {esPropietario && (
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {estados.map((estado) => (
                          <form key={estado} action={cambiarEstadoEvento}>
                            <input
                              type="hidden"
                              name="id"
                              value={evento.id_evento}
                            />
                            <input type="hidden" name="estado" value={estado} />
                            <button
                              type="submit"
                              className={`rounded px-2 py-1 text-xs ${
                                evento.estado_publicacion === estado
                                  ? 'bg-fuchsia-600 text-white'
                                  : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                              }`}
                            >
                              {estado}
                            </button>
                          </form>
                        ))}
                        <Link
                          href={`/admin/eventos/${evento.id_evento}/editar`}
                          className="rounded px-2 py-1 text-xs text-fuchsia-300 hover:underline"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
