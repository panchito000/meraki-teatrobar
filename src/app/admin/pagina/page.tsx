import Link from "next/link";

import { SubidorImagen } from "@/components/subidor-imagen";
import { requirePropietario } from "@/lib/auth";
import { normalizarConfiguracion } from "@/lib/configuracion";
import type { ConfiguracionPagina } from "@/lib/types";
import { actualizarPagina } from "../actions";

type Props = {
  searchParams: Promise<{ guardado?: string; error?: string }>;
};

export default async function EditarPagina({ searchParams }: Props) {
  const { supabase } = await requirePropietario();
  const [{ data, error: configError }, params] = await Promise.all([
    supabase.from("configuracion_pagina").select("*").eq("id", 1).maybeSingle(),
    searchParams,
  ]);

  const configuracion = normalizarConfiguracion(
    data as Partial<ConfiguracionPagina> | null,
  );

  return (
    <div style={{ maxWidth: "760px" }}>
      <Link href="/admin" className="btn btn-secondary btn-sm">
        ← Volver al panel
      </Link>

      <div className="admin-topbar" style={{ marginTop: "1.5rem" }}>
        <div>
          <span className="section-kicker">Sitio público</span>
          <h1>Editar página e imágenes</h1>
          <p className="subtitle">
            Solo el propietario puede cambiar estos contenidos. Los cambios se
            reflejan en la portada y en el pie de las páginas públicas.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-outline-accent btn-sm">
          Ver página ↗
        </Link>
      </div>

      {configError && (
        <div className="alert-box error">
          ⚠️ Falta la configuración en Supabase. Ejecuta el archivo{" "}
          <code>supabase/setup-imagenes.sql</code> en el SQL Editor para habilitar
          la subida de imágenes y la edición de la portada.
        </div>
      )}
      {params.guardado && (
        <div className="alert-box success">✅ Cambios guardados correctamente.</div>
      )}
      {params.error && (
        <div className="alert-box error">
          ⚠️ No se pudo guardar: {params.error}
          <br />
          Si es la primera vez, ejecuta el archivo{" "}
          <code>supabase/setup-imagenes.sql</code> en el SQL Editor de Supabase.
        </div>
      )}

      <form action={actualizarPagina} className="panel-box" style={{ marginTop: "1.25rem" }}>
        <h3 className="form-section-title">Portada</h3>

        <div className="form-group">
          <label htmlFor="etiqueta_hero">Etiqueta superior</label>
          <input
            id="etiqueta_hero"
            name="etiqueta_hero"
            type="text"
            defaultValue={configuracion.etiqueta_hero}
          />
        </div>

        <div className="form-group">
          <label htmlFor="titulo_hero">Título principal</label>
          <textarea
            id="titulo_hero"
            name="titulo_hero"
            rows={2}
            defaultValue={configuracion.titulo_hero}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bajada_hero">Texto de presentación</label>
          <textarea
            id="bajada_hero"
            name="bajada_hero"
            rows={4}
            defaultValue={configuracion.bajada_hero}
          />
        </div>

        <SubidorImagen
          name="imagen_hero"
          value={configuracion.imagen_hero}
          carpeta="sitio"
          etiqueta="Imagen de presentación de la portada"
          ayuda="Si subes una imagen, se muestra en el panel derecho del hero. Si la quitas, vuelve el diseño de gradiente Meraki."
        />

        <h3 className="form-section-title">Contacto</h3>

        <div className="form-grid-dos">
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input id="correo" name="correo" type="text" defaultValue={configuracion.correo} />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono / WhatsApp</label>
            <input id="telefono" name="telefono" type="text" defaultValue={configuracion.telefono} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="whatsapp">Enlace de WhatsApp (opcional)</label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="url"
            defaultValue={configuracion.whatsapp ?? ""}
            placeholder="https://wa.me/..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            defaultValue={configuracion.direccion ?? ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mapas">Enlace de Google Maps (opcional)</label>
          <input
            id="mapas"
            name="mapas"
            type="url"
            defaultValue={configuracion.mapas ?? ""}
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>

        <h3 className="form-section-title">Redes sociales</h3>

        <div className="form-grid-dos">
          <div className="form-group">
            <label htmlFor="instagram">Instagram</label>
            <input id="instagram" name="instagram" type="url" defaultValue={configuracion.instagram ?? ""} />
          </div>
          <div className="form-group">
            <label htmlFor="tiktok">TikTok</label>
            <input id="tiktok" name="tiktok" type="url" defaultValue={configuracion.tiktok ?? ""} />
          </div>
          <div className="form-group">
            <label htmlFor="facebook">Facebook</label>
            <input id="facebook" name="facebook" type="url" defaultValue={configuracion.facebook ?? ""} />
          </div>
          <div className="form-group">
            <label htmlFor="discos">Cuenta de Discos en la oscuridad</label>
            <input id="discos" name="discos" type="url" defaultValue={configuracion.discos ?? ""} />
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <button type="submit" className="btn btn-primary">
            Guardar cambios de la página
          </button>
        </div>
      </form>
    </div>
  );
}
