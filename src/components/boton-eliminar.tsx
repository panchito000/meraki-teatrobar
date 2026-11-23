"use client";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  nombre: string;
  etiqueta?: string;
  mensaje?: string;
};

export function BotonEliminar({
  action,
  id,
  nombre,
  etiqueta = "Eliminar",
  mensaje,
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(evento) => {
        const confirmado = window.confirm(
          mensaje ?? `¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`,
        );
        if (!confirmado) evento.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger btn-sm">
        {etiqueta}
      </button>
    </form>
  );
}
