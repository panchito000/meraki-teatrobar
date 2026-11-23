"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [icono, setIcono] = useState("☀️");

  useEffect(() => {
    const tema = localStorage.getItem("meraki_tema") ?? "dark";
    document.documentElement.dataset.theme = tema;
    setIcono(tema === "dark" ? "☀️" : "🌙");
  }, []);

  function alternar() {
    const actual = document.documentElement.dataset.theme ?? "dark";
    const siguiente = actual === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = siguiente;
    localStorage.setItem("meraki_tema", siguiente);
    setIcono(siguiente === "dark" ? "☀️" : "🌙");
  }

  return (
    <button
      type="button"
      className="btn-icon"
      onClick={alternar}
      title="Alternar modo oscuro / claro"
      aria-label="Alternar modo oscuro o claro"
    >
      <span aria-hidden="true">{icono}</span>
    </button>
  );
}
