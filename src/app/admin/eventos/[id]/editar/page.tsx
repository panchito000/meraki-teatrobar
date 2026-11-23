import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EventoForm } from '@/components/evento-form'
import { requirePropietario } from '@/lib/auth'
import type { Evento } from '@/lib/types'
import { actualizarEvento } from '../../../actions'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditarEvento({ params }: Props) {
  const { supabase } = await requirePropietario()
  const { id } = await params

  const { data } = await supabase
    .from('eventos')
    .select('*')
    .eq('id_evento', id)
    .single()

  if (!data) notFound()

  return (
    <div className="max-w-3xl">
      <Link href="/admin/eventos" className="text-sm text-zinc-400 hover:text-white">
        ← Volver a eventos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Modificar evento</h1>
      <EventoForm
        action={actualizarEvento}
        evento={data as Evento}
        textoBoton="Guardar cambios"
      />
    </div>
  )
}
