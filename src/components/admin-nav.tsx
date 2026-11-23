"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/admin", etiqueta: "📊 Panel Principal" },
  { href: "/admin/eventos", etiqueta: "🎭 Gestión de Eventos" },
  { href: "/admin/tareas", etiqueta: "📣 Tareas Promocionales" },
];

export function AdminNav({ esPropietario = false }: { esPropietario?: boolean }) {
  const ruta = usePathname();

  const enlaces = esPropietario
    ? [...ENLACES, { href: "/admin/pagina", etiqueta: "🖼️ Página e Imágenes" }]
    : ENLACES;

  return (
    <nav className="sidebar-nav">
      {enlaces.map((enlace) => {
        const activo =
          enlace.href === "/admin"
            ? ruta === "/admin"
            : ruta.startsWith(enlace.href);
        return (
          <Link
            key={enlace.href}
            href={enlace.href}
            className={`nav-item ${activo ? "active" : ""}`}
          >
            {enlace.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
