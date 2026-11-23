import Link from "next/link";

import { requirePropietario } from "@/lib/auth";
import type { Evento } from "@/lib/types";
import { crearTarea } from "../../actions";

export default async function NuevaTarea() {
  const { supabase } = await requirePropietario();

  const { data } = await supabase
    .from("eventos")
    .select("id_evento, titulo")
    .order("fecha", { ascending: false });

  const eventos = (data ?? []) as Pick<Evento, "id_evento" | "titulo">[];

  return (
    <div style={{ maxWidth: "720px" }}>
      <Link href="/admin/tareas" className="btn btn-secondary btn-sm">
        ← Volver a tareas
      </Link>
      <div className="admin-topbar" style={{ marginTop: "1.5rem" }}>
        <div>
          <span className="section-kicker">Tareas Promocionales</span>
          <h1>Registrar Nueva Tarea Promocional</h1>
          <p className="subtitle">
            La tarea queda bajo responsabilidad del propietario y comienza en
            estado Pendiente.
          </p>
        </div>
      </div>

      <div className="panel-box">
        <form action={crearTarea}>
          <div className="form-group">
            <label htmlFor="titulo">Título de la tarea *</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              required
              placeholder="Ej. Preparar reel promocional o revisar iluminación"
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              required
              placeholder="Detalle de la actividad promocional o técnica..."
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.8rem" }}>
            <div className="form-group">
              <label htmlFor="fecha_limite">Fecha límite *</label>
              <input id="fecha_limite" name="fecha_limite" type="date" required />
            </div>
            <div className="form-group">
              <label htmlFor="id_evento">Evento asociado (opcional)</label>
              <select id="id_evento" name="id_evento" defaultValue="">
                <option value="">— Tarea general (sin evento asociado) —</option>
                {eventos.map((evento) => (
                  <option key={evento.id_evento} value={evento.id_evento}>
                    {evento.titulo}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="responsable">Responsable</label>
            <input id="responsable" type="text" readOnly value="Propietario" />
          </div>
          <div style={{ display: "flex", gap: "0.65rem", marginTop: "1.35rem" }}>
            <button type="submit" className="btn btn-primary">
              Guardar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
