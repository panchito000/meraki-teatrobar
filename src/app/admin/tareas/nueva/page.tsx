import Link from 'next/link'

import { requirePropietario } from '@/lib/auth'
import type { Evento } from '@/lib/types'
import { crearTarea } from '../../actions'

const clase =
  'mt-2 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-fuchsia-500'

export default async function NuevaTarea() {
  const { supabase } = await requirePropietario()

  const { data } = await supabase
    .from('eventos')
    .select('id_evento, titulo')
    .order('fecha', { ascending: false })

  const eventos = (data ?? []) as Pick<Evento, 'id_evento' | 'titulo'>[]

  return (
    <div className="max-w-3xl">
      <Link href="/admin/tareas" className="text-sm text-zinc-400 hover:text-white">
        ← Volver a tareas
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Registrar tarea promocional</h1>
      <p className="mt-2 text-zinc-400">
        La tarea queda bajo responsabilidad del propietario y comienza en estado
        PENDIENTE.
      </p>

      <form action={crearTarea} className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="titulo" className="text-sm text-zinc-300">
            Título *
          </label>
          <input id="titulo" name="titulo" required className={clase} />
        </div>

        <div>
          <label htmlFor="fecha_limite" className="text-sm text-zinc-300">
            Fecha límite *
          </label>
          <input
            id="fecha_limite"
            name="fecha_limite"
            type="date"
            required
            className={clase}
          />
        </div>

        <div>
          <label htmlFor="id_evento" className="text-sm text-zinc-300">
            Evento asociado (opcional)
          </label>
          <select id="id_evento" name="id_evento" className={clase} defaultValue="">
            <option value="">Tarea general (sin evento)</option>
            {eventos.map((evento) => (
              <option key={evento.id_evento} value={evento.id_evento}>
                {evento.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="descripcion" className="text-sm text-zinc-300">
            Descripción
          </label>
          <textarea id="descripcion" name="descripcion" rows={4} className={clase} />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-fuchsia-600 px-6 py-3 font-semibold hover:bg-fuchsia-500"
          >
            Guardar tarea
          </button>
        </div>
      </form>
    </div>
  )
}
