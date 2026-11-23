import type { ReactNode } from 'react'
import Link from 'next/link'

import { requireUsuario } from '@/lib/auth'
import { cerrarSesion } from './actions'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { rol, nombre } = await requireUsuario()
  const esPropietario = rol === 'PROPIETARIO'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-white/10 bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold tracking-wide">
              MERAKI <span className="text-fuchsia-400">TEATROBAR</span>
            </Link>
            <nav className="flex gap-4 text-sm text-zinc-300">
              <Link href="/admin" className="hover:text-white">
                Panel
              </Link>
              <Link href="/admin/eventos" className="hover:text-white">
                Eventos
              </Link>
              <Link href="/admin/tareas" className="hover:text-white">
                Tareas
              </Link>
              <Link href="/" className="hover:text-white">
                Ver sitio público
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-400">{nombre}</span>
            <span className="rounded-full border border-fuchsia-500/40 px-3 py-1 text-xs text-fuchsia-300">
              {esPropietario ? 'Propietario' : 'Administradora'}
            </span>
            <form action={cerrarSesion}>
              <button className="text-zinc-400 hover:text-white" type="submit">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
