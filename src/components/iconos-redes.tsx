import type { ReactNode } from "react";

type NombreRed = "Instagram" | "TikTok" | "Facebook" | "Discos en la oscuridad";

const TRAZOS: Record<NombreRed, ReactNode> = {
  Instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.4" fill="currentColor" />
    </>
  ),
  TikTok: (
    <path
      d="M14.2 2h2.7c.2 1.8 1.2 3.2 3 3.5v2.8c-1.2 0-2.3-.4-3.3-1v5.9a6.3 6.3 0 1 1-6.2-6.3c.3 0 .6 0 .9.1v2.9a3.5 3.5 0 1 0 2.9 3.4V2Z"
      fill="currentColor"
    />
  ),
  Facebook: (
    <path
      d="M13.6 22v-8.3h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.5 1.6-1.5h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.4v3.2h2.8V22h3.4Z"
      fill="currentColor"
    />
  ),
  "Discos en la oscuridad": (
    <>
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      <path d="M12 2.5a9.5 9.5 0 0 1 0 19" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".55" />
    </>
  ),
};

export function IconoRed({ nombre }: { nombre: string }) {
  const trazo = TRAZOS[nombre as NombreRed];
  if (!trazo) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {trazo}
    </svg>
  );
}
