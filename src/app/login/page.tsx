"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { MerakiMark } from "@/components/meraki-logo";
import { createClient } from "@/lib/supabase/client";

const CUENTAS = [
  {
    rol: "Propietario",
    descripcion: "Gestión completa de eventos y tareas promocionales",
    correo: "propietario@meraki.test",
    clave: "Meraki2026!",
  },
  {
    rol: "Administradora",
    descripcion: "Acceso de solo lectura (consulta de eventos y tareas)",
    correo: "propietario1@meraki.test",
    clave: "Meraki2026!",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCargando(true);
    setError(null);

    const { error } = await createClient().auth.signInWithPassword({
      email: correo,
      password: clave,
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
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
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
              value={clave}
              onChange={(evento) => setClave(evento.target.value)}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
            {cargando ? "Ingresando…" : "Iniciar Sesión"}
          </button>
        </form>

        <div className="demo-accounts-box">
          <p className="demo-title">Cuentas de demostración (clic para llenar):</p>
          <div className="demo-grid">
            {CUENTAS.map((cuenta) => (
              <button
                key={cuenta.correo}
                type="button"
                className="demo-btn"
                onClick={() => {
                  setCorreo(cuenta.correo);
                  setClave(cuenta.clave);
                  setError(null);
                }}
              >
                <strong>{cuenta.rol}</strong>
                <span>{cuenta.descripcion}</span>
                <code>{cuenta.correo} / {cuenta.clave}</code>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
