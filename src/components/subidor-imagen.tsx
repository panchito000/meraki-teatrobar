"use client";

import { useMemo, useState } from "react";

import { esImagenUrl, estiloPortada } from "@/lib/portadas";
import { createClient } from "@/lib/supabase/client";

const LIMITE_BYTES = 5 * 1024 * 1024;
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Props = {
  name: string;
  value?: string | null;
  carpeta?: "eventos" | "sitio";
  etiqueta?: string;
  ayuda?: string;
  puedeEditar?: boolean;
};

export function SubidorImagen({
  name,
  value,
  carpeta = "eventos",
  etiqueta = "Imagen",
  ayuda = "Sube una imagen JPG, PNG, WEBP o GIF de hasta 5 MB. También puedes pegar una URL.",
  puedeEditar = true,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [url, setUrl] = useState(() =>
    esImagenUrl(value) ? (value as string) : "",
  );
  const [estado, setEstado] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  async function subir(archivo: File) {
    if (!TIPOS.includes(archivo.type)) {
      setEstado("Formato no permitido. Usa JPG, PNG, WEBP o GIF.");
      return;
    }
    if (archivo.size > LIMITE_BYTES) {
      setEstado("La imagen supera el límite de 5 MB.");
      return;
    }

    setSubiendo(true);
    setEstado("Subiendo imagen...");

    const extension = archivo.name.split(".").pop()?.toLowerCase() || "jpg";
    const nombre =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ruta = `${carpeta}/${nombre}.${extension}`;

    const { error } = await supabase.storage
      .from("imagenes")
      .upload(ruta, archivo, { contentType: archivo.type, upsert: false });

    if (error) {
      setEstado(`No se pudo subir: ${error.message}`);
      setSubiendo(false);
      return;
    }

    const { data } = supabase.storage.from("imagenes").getPublicUrl(ruta);
    setUrl(data.publicUrl);
    setEstado("Imagen lista y guardada.");
    setSubiendo(false);
  }

  return (
    <div className="form-group">
      <label htmlFor={name}>{etiqueta}</label>

      <input
        id={name}
        name={name}
        type="url"
        value={url}
        onChange={(evento) => {
          setUrl(evento.target.value);
          setEstado("");
        }}
        readOnly={!puedeEditar}
        placeholder="https://..."
      />

      {puedeEditar && (
        <div className="image-upload-actions">
          <input
            type="file"
            accept={TIPOS.join(",")}
            disabled={subiendo}
            onChange={(evento) => {
              const archivo = evento.target.files?.[0];
              if (archivo) void subir(archivo);
              evento.target.value = "";
            }}
          />
          {url && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setUrl("");
                setEstado("");
              }}
            >
              Quitar imagen
            </button>
          )}
        </div>
      )}

      {(url || value) && (
        <div
          className="image-preview"
          style={estiloPortada(url || value, name)}
          aria-label="Vista previa de la imagen"
        />
      )}

      {puedeEditar && <small className="field-help">{ayuda}</small>}
      {estado && <small className="field-help">{estado}</small>}
    </div>
  );
}
