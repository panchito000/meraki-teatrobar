'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requirePropietario, requireUsuario } from '@/lib/auth'

const ESTADOS_EVENTO = ['BORRADOR', 'PUBLICADO', 'OCULTO'] as const
const ESTADOS_TAREA = [
  'PENDIENTE',
  'EN_PROGRESO',
  'COMPLETADA',
  'CANCELADA',
] as const

function campo(formData: FormData, nombre: string) {
  return String(formData.get(nombre) ?? '').trim()
}

function opcional(formData: FormData, nombre: string) {
  const valor = campo(formData, nombre)
  return valor === '' ? null : valor
}

function imagenEvento(formData: FormData) {
  return opcional(formData, 'imagen_url') ?? opcional(formData, 'imagen')
}

function estadoEvento(formData: FormData) {
  const valor = campo(formData, 'estado_publicacion') || 'BORRADOR'
  return ESTADOS_EVENTO.includes(valor as (typeof ESTADOS_EVENTO)[number])
    ? valor
    : 'BORRADOR'
}

export async function cerrarSesion() {
  const { supabase } = await requireUsuario()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function crearEvento(formData: FormData) {
  const { supabase } = await requirePropietario()
  const titulo = campo(formData, 'titulo')
  const fecha = campo(formData, 'fecha')
  if (!titulo) throw new Error('El título del evento es obligatorio.')
  if (!fecha) throw new Error('La fecha del evento es obligatoria.')

  const { error } = await supabase.from('eventos').insert({
    titulo,
    descripcion: campo(formData, 'descripcion'),
    fecha,
    organizador: campo(formData, 'organizador'),
    imagen: imagenEvento(formData),
    enlace_entradas: opcional(formData, 'enlace_entradas'),
    estado_publicacion: estadoEvento(formData),
  })
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  revalidatePath('/')
  redirect('/admin/eventos')
}

export async function actualizarEvento(formData: FormData) {
  const { supabase } = await requirePropietario()
  const id = campo(formData, 'id')
  const titulo = campo(formData, 'titulo')
  const fecha = campo(formData, 'fecha')
  if (!id || !titulo) throw new Error('Datos incompletos.')
  if (!fecha) throw new Error('La fecha del evento es obligatoria.')

  const { error } = await supabase
    .from('eventos')
    .update({
      titulo,
      descripcion: campo(formData, 'descripcion'),
      fecha,
      organizador: campo(formData, 'organizador'),
      imagen: imagenEvento(formData),
      enlace_entradas: opcional(formData, 'enlace_entradas'),
      estado_publicacion: estadoEvento(formData),
    })
    .eq('id_evento', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  revalidatePath('/')
  revalidatePath(`/eventos/${id}`)
  redirect('/admin/eventos')
}

export async function cambiarEstadoEvento(formData: FormData) {
  const { supabase } = await requirePropietario()
  const id = campo(formData, 'id')
  const estado = campo(formData, 'estado')
  if (!id || !ESTADOS_EVENTO.includes(estado as (typeof ESTADOS_EVENTO)[number])) {
    throw new Error('Estado de evento no válido.')
  }

  const { error } = await supabase
    .from('eventos')
    .update({ estado_publicacion: estado })
    .eq('id_evento', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  revalidatePath('/')
}

export async function crearTarea(formData: FormData) {
  const { supabase, user } = await requirePropietario()
  const titulo = campo(formData, 'titulo')
  const fechaLimite = campo(formData, 'fecha_limite')
  if (!titulo || !user) throw new Error('El título de la tarea es obligatorio.')
  if (!fechaLimite) throw new Error('La fecha límite es obligatoria.')

  const { error } = await supabase.from('tareas_promocionales').insert({
    titulo,
    descripcion: campo(formData, 'descripcion'),
    fecha_limite: fechaLimite,
    id_usuario: user.id,
    id_evento: opcional(formData, 'id_evento'),
  })
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/tareas')
  redirect('/admin/tareas')
}

export async function cambiarEstadoTarea(formData: FormData) {
  const { supabase } = await requirePropietario()
  const id = campo(formData, 'id')
  const estado = campo(formData, 'estado')
  if (!id || !ESTADOS_TAREA.includes(estado as (typeof ESTADOS_TAREA)[number])) {
    throw new Error('Estado de tarea no válido.')
  }

  const { error } = await supabase
    .from('tareas_promocionales')
    .update({ estado })
    .eq('id_tarea', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/tareas')
}
