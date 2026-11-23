'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setCargando(true)
    setError(null)

    const datos = new FormData(evento.currentTarget)
    const { error } = await createClient().auth.signInWithPassword({
      email: String(datos.get('correo') ?? ''),
      password: String(datos.get('clave') ?? ''),
    })

    if (error) {
      setError('Correo o contraseña incorrectos.')
      setCargando(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-950 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-fuchsia-400">
          MERAKI TEATROBAR
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Ingreso al sistema
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Área administrativa exclusiva para el propietario y la administradora.
        </p>

        <form onSubmit={entrar} className="mt-8 space-y-5">
          <div>
            <label htmlFor="correo" className="block text-sm text-zinc-300">
              Correo electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label htmlFor="clave" className="block text-sm text-zinc-300">
              Contraseña
            </label>
            <input
              id="clave"
              name="clave"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-fuchsia-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-fuchsia-600 px-4 py-3 font-semibold text-white transition hover:bg-fuchsia-500 disabled:opacity-60"
          >
            {cargando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-zinc-400 hover:text-white"
        >
          Volver a la página pública
        </Link>
      </div>
    </main>
  )
}
