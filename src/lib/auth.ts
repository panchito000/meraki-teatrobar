import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export type Rol = 'PROPIETARIO' | 'ADMINISTRADORA'

export async function getSesion() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { supabase, user: null, rol: null as Rol | null, nombre: '' }
  }

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('nombre, rol')
    .eq('id_usuario', user.id)
    .single()

  return {
    supabase,
    user,
    rol: (perfil?.rol as Rol) ?? null,
    nombre: perfil?.nombre ?? user.email ?? '',
  }
}

export async function requireUsuario() {
  const sesion = await getSesion()
  if (!sesion.user) redirect('/login')
  return sesion
}

export async function requirePropietario() {
  const sesion = await requireUsuario()
  if (sesion.rol !== 'PROPIETARIO') redirect('/admin')
  return sesion
}
