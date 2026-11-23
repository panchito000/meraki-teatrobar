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

export function fechaDeHoy() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("/", "-");
}

export function formatearFecha(fecha?: string | null) {
  if (!fecha) return "Fecha por confirmar";
  const [anio, mes, dia] = fecha.slice(0, 10).split("-");
  const nombreMes = MESES[Number(mes) - 1] ?? mes;
  return `${dia} ${nombreMes} ${anio}`;
}
