import type { CSSProperties } from "react";

export type Portada = {
  id: string;
  etiqueta: string;
  degradado: string;
  etiquetaCorta: string;
};

export const PORTADAS: Portada[] = [
  {
    id: "magenta-escena",
    etiqueta: "Escena Magenta",
    degradado: "linear-gradient(135deg, #D90368 0%, #5E0B4C 100%)",
    etiquetaCorta: "Producción Meraki",
  },
  {
    id: "telon-purpura",
    etiqueta: "Telón Púrpura",
    degradado: "linear-gradient(135deg, #5E0B4C 0%, #1F071A 100%)",
    etiquetaCorta: "Teatro & Noche",
  },
  {
    id: "dorado-coctel",
    etiqueta: "Gala Dorada",
    degradado: "linear-gradient(135deg, #8A0646 0%, #3B1E10 100%)",
    etiquetaCorta: "Evento Especial",
  },
];

function portadaPorId(id: string | null | undefined) {
  return PORTADAS.find((portada) => portada.id === id) ?? PORTADAS[0];
}

function portadaPorSemilla(semilla: string) {
  let suma = 0;
  for (const caracter of semilla) suma += caracter.charCodeAt(0);
  return PORTADAS[suma % PORTADAS.length];
}

export function esImagenUrl(valor?: string | null) {
  return Boolean(valor && /^(https?:\/\/|\/|data:image\/)/i.test(valor));
}

export function estiloPortada(
  imagen: string | null | undefined,
  semilla = "",
): CSSProperties {
  if (esImagenUrl(imagen)) {
    return { backgroundImage: `url("${imagen}")` };
  }
  if (imagen && PORTADAS.some((portada) => portada.id === imagen)) {
    return { backgroundImage: portadaPorId(imagen).degradado };
  }
  return { backgroundImage: portadaPorSemilla(semilla).degradado };
}

export function etiquetaPortada(
  imagen: string | null | undefined,
  semilla = "",
) {
  if (imagen && PORTADAS.some((portada) => portada.id === imagen)) {
    return portadaPorId(imagen).etiquetaCorta;
  }
  if (esImagenUrl(imagen)) {
    return "Imagen del evento";
  }
  return portadaPorSemilla(semilla).etiquetaCorta;
}
