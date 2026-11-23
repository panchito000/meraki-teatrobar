const ESTADOS: Record<string, { etiqueta: string; clase: string }> = {
  BORRADOR: { etiqueta: "Borrador", clase: "st-borrador" },
  PUBLICADO: { etiqueta: "Publicado", clase: "st-publicado" },
  OCULTO: { etiqueta: "Oculto", clase: "st-oculto" },
  PENDIENTE: { etiqueta: "Pendiente", clase: "st-pendiente" },
  EN_PROGRESO: { etiqueta: "En progreso", clase: "st-progreso" },
  COMPLETADA: { etiqueta: "Completada", clase: "st-completada" },
  CANCELADA: { etiqueta: "Cancelada", clase: "st-cancelada" },
};

export function StatusBadge({ estado }: { estado: string }) {
  const info = ESTADOS[estado] ?? { etiqueta: estado, clase: "st-oculto" };
  return <span className={`status-badge ${info.clase}`}>{info.etiqueta}</span>;
}
