"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { MerakiMark } from "@/components/meraki-logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCargando(true);
    setError(null);

    const datos = new FormData(evento.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(datos.get("correo") ?? ""),
      password: String(datos.get("clave") ?? ""),
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setCargando(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="login-container flex-1">
      <div className="hero-glow" />
      <div className="login-card">
        <Link href="/" className="back-public-btn">
          ← Volver a la página pública
        </Link>

        <div className="login-brand">
          <MerakiMark className="meraki-svg" />
          <h2>MERAKI</h2>
          <span>ACCESO AL ÁREA ADMINISTRATIVA</span>
        </div>

        <form onSubmit={entrar}>
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              required
              autoComplete="email"
              placeholder="correo@meraki.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="clave">Contraseña</label>
            <input
              id="clave"
              name="clave"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
            {cargando ? "Ingresando…" : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}
