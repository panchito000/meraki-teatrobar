import Link from "next/link";

import { requireUsuario } from "@/lib/auth";
import { actualizarMiPerfil } from "../actions";

type Props = {
  searchParams: Promise<{ guardado?: string; error?: string }>;
};

export default async function MiPerfil({ searchParams }: Props) {
  const { supabase, user, rol, nombre } = await requireUsuario();
  const params = await searchParams;

  const { data: perfil } = await supabase
    .from("usuarios")
    .select("nombre, correo, rol")
    .eq("id_usuario", user?.id ?? "")
    .maybeSingle();

  const nombreActual = perfil?.nombre ?? nombre;
  const correo = perfil?.correo ?? user?.email ?? "";

  return (
    <div style={{ maxWidth: "680px" }}>
      <Link href="/admin" className="btn btn-secondary btn-sm">
        ← Volver al panel
      </Link>

      <div className="admin-topbar" style={{ marginTop: "1.5rem" }}>
        <div>
          <span className="section-kicker">Mi cuenta</span>
          <h1>Mi perfil</h1>
          <p className="subtitle">
            Actualiza tu nombre visible en el panel y, si quieres, tu contraseña.
          </p>
        </div>
        <span className={`role-badge ${rol === "PROPIETARIO" ? "owner" : "viewer"}`}>
          {rol === "PROPIETARIO" ? "Propietario" : "Administradora"}
        </span>
      </div>

      {params.guardado && (
        <div className="alert-box success">✅ Perfil actualizado correctamente.</div>
      )}
      {params.error && (
        <div className="alert-box error">⚠️ {params.error}</div>
      )}

      <form action={actualizarMiPerfil} className="panel-box" style={{ marginTop: "1.25rem" }}>
        <div className="form-group">
          <label htmlFor="correo_actual">Correo (no editable)</label>
          <input id="correo_actual" type="text" value={correo} readOnly />
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre visible *</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            defaultValue={nombreActual}
            placeholder="Nombre que aparece en el panel"
          />
        </div>

        <h3 className="form-section-title">Cambiar contraseña (opcional)</h3>
        <p className="section-note">
          Deja ambos campos vacíos si solo quieres cambiar el nombre.
        </p>

        <div className="form-grid-dos">
          <div className="form-group">
            <label htmlFor="password">Nueva contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmar_password">Confirmar contraseña</label>
            <input
              id="confirmar_password"
              name="confirmar_password"
              type="password"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <button type="submit" className="btn btn-primary">
            Guardar mi perfil
          </button>
        </div>
      </form>
    </div>
  );
}
