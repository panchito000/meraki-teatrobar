import Link from 'next/link'

import { requireUsuario } from '@/lib/auth'
import type { EstadoTarea, Tarea } from '@/lib/types'
import { cambiarEstadoTarea } from '../actions'

type TareaConEvento = Tarea & { eventos: { titulo: string } | null }

const estados: EstadoTarea[] = [
  'PENDIENTE',
  'EN_PROGRESO',
  'COMPLETADA',
  'CANCELADA',
]

export default async function TareasAdmin() {
  const { supabase, rol } = await requireUsuario()
  const esPropietario = rol === 'PROPIETARIO'

  const { data } = await supabase
    .from('tareas_promocionales')
    .select('*, eventos ( titulo )')
    .order('fecha_limite', { ascending: true })

  const tareas = (data ?? []) as TareaConEvento[]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.25em] text-fuchsia-400">
            TAREAS PROMOCIONALES
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Seguimiento de tareas</h1>
        </div>
        {esPropietario && (
          <Link
            href="/admin/tareas/nueva"
            className="rounded-lg bg-fuchsia-600 px-5 py-3 text-sm font-semibold hover:bg-fuchsia-500"
          >
            Registrar tarea
          </Link>
        )}
      </div>

      {tareas.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-white/15 p-8 text-center text-zinc-400">
          Todavía no hay tareas registradas.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="px-4 py-3">Tarea</th>
                <th className="px-4 py-3">Evento asociado</th>
                <th className="px-4 py-3">Fecha límite</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.id_tarea} className="border-t border-white/10">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{tarea.titulo}</p>
                    <p className="text-xs text-zinc-500">{tarea.descripcion}</p>
                  </td>
                  <td className="px-4 py-4 text-zinc-300">
                    {tarea.eventos?.titulo ?? 'Tarea general'}
                  </td>
                  <td className="px-4 py-4 text-zinc-300">
                    {tarea.fecha_limite?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-4">
                    {esPropietario ? (
                      <form action={cambiarEstadoTarea} className="flex gap-2">
                        <input
                          type="hidden"
                          name="id"
                          value={tarea.id_tarea}
                        />
                        <select
                          name="estado"
                          defaultValue={tarea.estado}
                          className="rounded bg-zinc-800 px-2 py-1 text-xs text-white"
                        >
                          {estados.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                        >
                          Actualizar
                        </button>
                      </form>
                    ) : (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {tarea.estado}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
