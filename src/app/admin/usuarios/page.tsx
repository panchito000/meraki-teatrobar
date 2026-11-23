import Link from "next/link";

import { requirePropietario } from "@/lib/auth";
import { actualizarNombreUsuario } from "../actions";

type Usuario = {
  id_usuario: string;
  nombre: string;
  correo: string;
  rol: "PROPIETARIO" | "ADMINISTRADORA";
};

type Props = {
  searchParams: Promise<{ guardado?: string; error?: string }>;
};

export default async function Usuarios({ searchParams }: Props) {
  const { supabase, user, nombre } = await requirePropietario();
  const [{ data }, params] = await Promise.all([
    supabase
      .from("usuarios")
      .select("id_usuario, nombre, correo, rol")
      .order("rol", { ascending: true }),
    searchParams,
  ]);

  const usuarios = ((data ?? []) as Usuario[]).map((usuario) =>
    usuario.id_usuario === user?.id
      ? {
          ...usuario,
          nombre: nombre || usuario.nombre,
          correo: user.new_email ?? user.email ?? usuario.correo,
        }
      : usuario,
  );

  return (
    <div style={{ maxWidth: "860px" }}>
      <Link href="/admin" className="btn btn-secondary btn-sm">
        ← Volver al panel
      </Link>

      <div className="admin-topbar" style={{ marginTop: "1.5rem" }}>
        <div>
          <span className="section-kicker">Accesos</span>
          <h1>Usuarios del sistema</h1>
          <p className="subtitle">
            Edita el nombre visible de cada cuenta. Tu correo se cambia en{" "}
            <Link href="/admin/perfil" className="link-inline">
              Mi perfil
            </Link>
            ; el rol se gestiona en Supabase Auth.
          </p>
        </div>
        <Link href="/admin/perfil" className="btn btn-outline-accent btn-sm">
          👤 Mi perfil
        </Link>
      </div>

      {params.guardado && (
        <div className="alert-box success">✅ Nombre actualizado correctamente.</div>
      )}
      {params.error && (
        <div className="alert-box error">⚠️ {params.error}</div>
      )}

      <div className="panel-box" style={{ marginTop: "1.25rem" }}>
        <div className="panel-box-header">
          <h3>Cuentas registradas ({usuarios.length})</h3>
          <span className="badge-pill">Rol: solo lectura para administradora</span>
        </div>

        <div className="compact-list">
          {usuarios.length === 0 ? (
            <div className="empty-state">No hay usuarios registrados.</div>
          ) : (
            usuarios.map((usuario) => (
              <div className="compact-item" key={usuario.id_usuario}>
                <div>
                  <strong>{usuario.nombre}</strong>
                  <small>{usuario.correo}</small>
                  <div style={{ marginTop: "0.45rem" }}>
                    <span
                      className={`role-badge ${usuario.rol === "PROPIETARIO" ? "owner" : "viewer"}`}
                    >
                      {usuario.rol === "PROPIETARIO" ? "Propietario" : "Administradora"}
                    </span>
                  </div>
                </div>

                <form action={actualizarNombreUsuario} className="user-edit-row">
                  <input type="hidden" name="id" value={usuario.id_usuario} />
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={usuario.nombre}
                    aria-label={`Nombre de ${usuario.correo}`}
                    required
                  />
                  <button type="submit" className="btn btn-secondary btn-sm">
                    Guardar
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
