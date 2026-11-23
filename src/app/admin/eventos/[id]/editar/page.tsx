import Link from "next/link";
import { notFound } from "next/navigation";

import { EventoForm } from "@/components/evento-form";
import { requirePropietario } from "@/lib/auth";
import type { Evento } from "@/lib/types";
import { actualizarEvento } from "../../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarEvento({ params }: Props) {
  const { supabase } = await requirePropietario();
  const { id } = await params;

  const { data } = await supabase
    .from("eventos")
    .select("*")
    .eq("id_evento", id)
    .single();

  if (!data) notFound();

  return (
    <div style={{ maxWidth: "720px" }}>
      <Link href="/admin/eventos" className="btn btn-secondary btn-sm">
        ← Volver a eventos
      </Link>
      <div className="admin-topbar" style={{ marginTop: "1.5rem" }}>
        <div>
          <span className="section-kicker">Gestión de Eventos</span>
          <h1>Editar Evento</h1>
          <p className="subtitle">Modifica los datos y el estado de publicación.</p>
        </div>
      </div>
      <div className="panel-box">
        <EventoForm
          action={actualizarEvento}
          evento={data as Evento}
          textoBoton="Guardar Evento"
        />
      </div>
    </div>
  );
}
