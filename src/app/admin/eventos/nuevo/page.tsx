import Link from 'next/link'

import { EventoForm } from '@/components/evento-form'
import { requirePropietario } from '@/lib/auth'
import { crearEvento } from '../../actions'

export default async function NuevoEvento() {
  await requirePropietario()

  return (
    <div className="max-w-3xl">
      <Link href="/admin/eventos" className="text-sm text-zinc-400 hover:text-white">
        ← Volver a eventos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Registrar evento</h1>
      <p className="mt-2 text-zinc-400">
        El evento se crea en estado BORRADOR y no aparece públicamente hasta que lo
        publiques.
      </p>
      <EventoForm action={crearEvento} textoBoton="Guardar evento" />
    </div>
  )
}
