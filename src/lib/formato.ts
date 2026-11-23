const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function formatearFecha(fecha?: string | null) {
  if (!fecha) return "Fecha por confirmar";
  const [anio, mes, dia] = fecha.slice(0, 10).split("-");
  const nombreMes = MESES[Number(mes) - 1] ?? mes;
  return `${dia} ${nombreMes} ${anio}`;
}
