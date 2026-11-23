import Link from "next/link";

import { EventoForm } from "@/components/evento-form";
import { requirePropietario } from "@/lib/auth";
import { crearEvento } from "../../actions";

export default async function NuevoEvento() {
  await requirePropietario();

  return (
    <div style={{ maxWidth: "720px" }}>
      <Link href="/admin/eventos" className="btn btn-secondary btn-sm">
        ← Volver a eventos
      </Link>
      <div className="admin-topbar" style={{ marginTop: "1.5rem" }}>
        <div>
          <span className="section-kicker">Gestión de Eventos</span>
          <h1>Registrar Nuevo Evento</h1>
          <p className="subtitle">
            El evento se crea en Borrador por omisión y no aparece en la cartelera
            pública hasta que lo publiques.
          </p>
        </div>
      </div>
      <div className="panel-box">
        <EventoForm action={crearEvento} textoBoton="Guardar Evento" />
      </div>
    </div>
  );
}
