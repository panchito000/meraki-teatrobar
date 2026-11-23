import type { Evento } from '@/lib/types'

type Props = {
  action: (formData: FormData) => void | Promise<void>
  evento?: Evento
  textoBoton: string
}

const clase =
  'mt-2 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-fuchsia-500'

export function EventoForm({ action, evento, textoBoton }: Props) {
  return (
    <form action={action} className="mt-8 grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="id" value={evento?.id_evento ?? ''} />

      <div className="sm:col-span-2">
        <label htmlFor="titulo" className="text-sm text-zinc-300">
          Título *
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          defaultValue={evento?.titulo}
          className={clase}
        />
      </div>

      <div>
        <label htmlFor="fecha" className="text-sm text-zinc-300">
          Fecha *
        </label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          required
          defaultValue={evento?.fecha?.slice(0, 10)}
          className={clase}
        />
      </div>

      <div>
        <label htmlFor="organizador" className="text-sm text-zinc-300">
          Organizador
        </label>
        <input
          id="organizador"
          name="organizador"
          defaultValue={evento?.organizador}
          className={clase}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="descripcion" className="text-sm text-zinc-300">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={5}
          defaultValue={evento?.descripcion}
          className={clase}
        />
      </div>

      <div>
        <label htmlFor="imagen" className="text-sm text-zinc-300">
          URL de la imagen (opcional)
        </label>
        <input
          id="imagen"
          name="imagen"
          type="url"
          defaultValue={evento?.imagen ?? ''}
          className={clase}
        />
      </div>

      <div>
        <label htmlFor="enlace_entradas" className="text-sm text-zinc-300">
          Enlace externo de entradas (opcional)
        </label>
        <input
          id="enlace_entradas"
          name="enlace_entradas"
          type="url"
          defaultValue={evento?.enlace_entradas ?? ''}
          className={clase}
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-lg bg-fuchsia-600 px-6 py-3 font-semibold hover:bg-fuchsia-500"
        >
          {textoBoton}
        </button>
      </div>
    </form>
  )
}
