import type { Evento } from "@/lib/types";
import { PORTADAS } from "@/lib/portadas";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  evento?: Evento;
  textoBoton: string;
};

export function EventoForm({ action, evento, textoBoton }: Props) {
  return (
    <form action={action} style={{ marginTop: "1.5rem" }}>
      <input type="hidden" name="id" value={evento?.id_evento ?? ""} />

      <div className="form-group">
        <label htmlFor="titulo">Título del evento *</label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          defaultValue={evento?.titulo}
          placeholder="Ej. Noche de Microteatro"
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción *</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          required
          defaultValue={evento?.descripcion}
          placeholder="Qué se presenta, horario, precio, cupos y cómo reservar. Si otra cuenta difunde el evento, indícalo aquí."
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.8rem" }}>
        <div className="form-group">
          <label htmlFor="fecha">Fecha *</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={evento?.fecha?.slice(0, 10)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="organizador">Organizador *</label>
          <input
            id="organizador"
            name="organizador"
            type="text"
            required
            defaultValue={evento?.organizador || "Meraki Teatrobar"}
            placeholder="Propio o tercero"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Imagen o portada (selección visual)</label>
        <div className="cover-presets">
          {PORTADAS.map((portada) => (
            <label
              key={portada.id}
              className="cover-option"
              style={{ backgroundImage: portada.degradado }}
            >
              <input
                type="radio"
                name="imagen"
                value={portada.id}
                defaultChecked={
                  evento ? evento.imagen === portada.id : portada.id === PORTADAS[0].id
                }
                style={{ position: "absolute", opacity: 0 }}
              />
              {portada.etiqueta}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.8rem" }}>
        <div className="form-group">
          <label htmlFor="imagen_url">URL de imagen propia (opcional)</label>
          <input
            id="imagen_url"
            name="imagen_url"
            type="url"
            defaultValue={evento?.imagen?.startsWith("http") ? evento.imagen : ""}
            placeholder="https://..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="enlace_entradas">Enlace externo para entradas (opcional)</label>
          <input
            id="enlace_entradas"
            name="enlace_entradas"
            type="url"
            defaultValue={evento?.enlace_entradas ?? ""}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="estado_publicacion">Estado de publicación</label>
        <select
          id="estado_publicacion"
          name="estado_publicacion"
          defaultValue={evento?.estado_publicacion ?? "BORRADOR"}
        >
          <option value="BORRADOR">Borrador</option>
          <option value="PUBLICADO">Publicado</option>
          <option value="OCULTO">Oculto</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginTop: "1.35rem" }}>
        <button type="submit" className="btn btn-primary">
          {textoBoton}
        </button>
      </div>
    </form>
  );
}
