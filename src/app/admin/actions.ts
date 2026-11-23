'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requirePropietario, requireUsuario } from '@/lib/auth'
import { CONFIGURACION_DEFAULT } from '@/lib/configuracion'

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

export async function actualizarPagina(formData: FormData) {
  const { supabase } = await requirePropietario()

  const valores: Record<string, string | null> = {
    etiqueta_hero: campo(formData, 'etiqueta_hero') || CONFIGURACION_DEFAULT.etiqueta_hero,
    titulo_hero: campo(formData, 'titulo_hero') || CONFIGURACION_DEFAULT.titulo_hero,
    bajada_hero: campo(formData, 'bajada_hero') || CONFIGURACION_DEFAULT.bajada_hero,
    imagen_hero: opcional(formData, 'imagen_hero'),
    imagen_logo_hero: opcional(formData, 'imagen_logo_hero'),
    correo: campo(formData, 'correo') || CONFIGURACION_DEFAULT.correo,
    telefono: campo(formData, 'telefono') || CONFIGURACION_DEFAULT.telefono,
    whatsapp: opcional(formData, 'whatsapp'),
    direccion: opcional(formData, 'direccion'),
    mapas: opcional(formData, 'mapas'),
    instagram: opcional(formData, 'instagram'),
    tiktok: opcional(formData, 'tiktok'),
    facebook: opcional(formData, 'facebook'),
    discos: opcional(formData, 'discos'),
    discos_titulo: campo(formData, 'discos_titulo') || CONFIGURACION_DEFAULT.discos_titulo,
    discos_descripcion:
      campo(formData, 'discos_descripcion') || CONFIGURACION_DEFAULT.discos_descripcion,
    passline: opcional(formData, 'passline'),
    passline_titulo: campo(formData, 'passline_titulo') || CONFIGURACION_DEFAULT.passline_titulo,
    actualizado_en: new Date().toISOString(),
  }

  let { error } = await supabase
    .from('configuracion_pagina')
    .update(valores)
    .eq('id', 1)

  // Si todavía no se ejecutó el SQL que agrega la columna nueva, guarda el resto.
  let avisoColumna = false
  if (error && /imagen_logo_hero/i.test(error.message)) {
    delete valores.imagen_logo_hero
    const reintento = await supabase
      .from('configuracion_pagina')
      .update(valores)
      .eq('id', 1)
    error = reintento.error
    avisoColumna = !error
  }

  if (error) {
    redirect(`/admin/pagina?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/')
  revalidatePath('/admin/pagina')
  revalidatePath('/admin')
  redirect(
    avisoColumna
      ? '/admin/pagina?guardado=1&aviso=columna'
      : '/admin/pagina?guardado=1',
  )
}

export async function eliminarEvento(formData: FormData) {
  const { supabase } = await requirePropietario()
  const id = campo(formData, 'id')
  if (!id) redirect('/admin/eventos?error=Datos%20incompletos.')

  // Desvincula tareas antes de borrar el evento para no dejar referencias rotas.
  await supabase
    .from('tareas_promocionales')
    .update({ id_evento: null })
    .eq('id_evento', id)

  const { data, error } = await supabase
    .from('eventos')
    .delete()
    .eq('id_evento', id)
    .select('id_evento')
  if (error) {
    redirect(`/admin/eventos?error=${encodeURIComponent(error.message)}`)
  }
  if (!data?.length) {
    redirect('/admin/eventos?error=No%20se%20pudo%20eliminar%20el%20evento.')
  }

  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  revalidatePath('/')
  redirect('/admin/eventos?eliminado=1')
}

export async function eliminarTarea(formData: FormData) {
  const { supabase } = await requirePropietario()
  const id = campo(formData, 'id')
  if (!id) redirect('/admin/tareas?error=Datos%20incompletos.')

  const { data, error } = await supabase
    .from('tareas_promocionales')
    .delete()
    .eq('id_tarea', id)
    .select('id_tarea')
  if (error) {
    redirect(`/admin/tareas?error=${encodeURIComponent(error.message)}`)
  }
  if (!data?.length) {
    redirect('/admin/tareas?error=No%20se%20pudo%20eliminar%20la%20tarea.')
  }

  revalidatePath('/admin')
  revalidatePath('/admin/tareas')
  redirect('/admin/tareas?eliminado=1')
}

export async function actualizarMiPerfil(formData: FormData) {
  const { supabase, user } = await requireUsuario()
  if (!user) redirect('/login')

  const nombre = campo(formData, 'nombre')
  const password = campo(formData, 'password')
  const confirmar = campo(formData, 'confirmar_password')

  if (!nombre) redirect('/admin/perfil?error=El%20nombre%20es%20obligatorio.')
  if (password && password !== confirmar) {
    redirect('/admin/perfil?error=Las%20contrase%C3%B1as%20no%20coinciden.')
  }
  if (password && password.length < 8) {
    redirect('/admin/perfil?error=La%20contrase%C3%B1a%20debe%20tener%20al%20menos%208%20caracteres.')
  }

  const { error: errorAuth } = await supabase.auth.updateUser({
    data: { nombre },
    ...(password ? { password } : {}),
  })
  if (errorAuth) {
    redirect(`/admin/perfil?error=${encodeURIComponent(errorAuth.message)}`)
  }

  // Si la política RLS de perfiles ya está aplicada, esto sincroniza la tabla.
  // Si no, el nombre visible sigue funcionando desde el perfil de Auth.
  await supabase
    .from('usuarios')
    .update({ nombre })
    .eq('id_usuario', user.id)

  revalidatePath('/admin')
  revalidatePath('/admin/perfil')
  revalidatePath('/admin/usuarios')
  revalidatePath('/')
  redirect('/admin/perfil?guardado=1')
}

export async function actualizarNombreUsuario(formData: FormData) {
  const { supabase } = await requirePropietario()
  const id = campo(formData, 'id')
  const nombre = campo(formData, 'nombre')

  if (!id || !nombre) {
    redirect('/admin/usuarios?error=Datos%20incompletos.')
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update({ nombre })
    .eq('id_usuario', id)
    .select('id_usuario')
  if (error) {
    redirect(`/admin/usuarios?error=${encodeURIComponent(error.message)}`)
  }
  if (!data?.length) {
    redirect('/admin/usuarios?error=Falta%20ejecutar%20supabase%2Fsetup-perfiles.sql%20en%20Supabase.')
  }

  revalidatePath('/admin')
  revalidatePath('/admin/perfil')
  revalidatePath('/admin/usuarios')
  revalidatePath('/')
  redirect('/admin/usuarios?guardado=1')
}
