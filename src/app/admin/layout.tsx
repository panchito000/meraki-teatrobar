import type { ReactNode } from "react";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { MerakiLogo } from "@/components/meraki-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { requireUsuario } from "@/lib/auth";
import { cerrarSesion } from "./actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { rol, nombre } = await requireUsuario();
  const esPropietario = rol === "PROPIETARIO";

  return (
    <div className="admin-layout flex-1">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link href="/admin" aria-label="Panel de Meraki Teatrobar">
            <MerakiLogo />
          </Link>
        </div>

        <div className="user-role-card">
          <div className="user-avatar">{nombre.charAt(0).toUpperCase()}</div>
          <div className="user-meta">
            <strong>{nombre}</strong>
            <span className={`role-badge ${esPropietario ? "owner" : "viewer"}`}>
              {esPropietario ? "Propietario" : "Administradora (Solo lectura)"}
            </span>
          </div>
        </div>

        <AdminNav />

        <div className="sidebar-footer">
          <Link href="/" className="nav-item">
            🌐 Página Pública
          </Link>
          <div className="nav-item">
            <ThemeToggle /> Modo Claro/Oscuro
          </div>
          <form action={cerrarSesion}>
            <button type="submit" className="nav-item logout-btn">
              🚪 Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-main">
        {!esPropietario && (
          <div className="readonly-banner">
            🔒 <strong>Acceso de Solo Lectura (Administradora):</strong> Puedes
            consultar el panel, los eventos y las tareas promocionales. Las
            acciones de creación, edición, publicación/ocultamiento y cambio de
            estado están restringidas al Propietario.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
