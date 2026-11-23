export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'OCULTO'
export type EstadoTarea =
  | 'PENDIENTE'
  | 'EN_PROGRESO'
  | 'COMPLETADA'
  | 'CANCELADA'

export type Evento = {
  id_evento: string
  titulo: string
  descripcion: string
  fecha: string
  organizador: string
  imagen: string | null
  estado_publicacion: EstadoEvento
  enlace_entradas: string | null
}

export type Tarea = {
  id_tarea: string
  titulo: string
  descripcion: string
  fecha_limite: string
  estado: EstadoTarea
  id_usuario: string
  id_evento: string | null
}

export type ConfiguracionPagina = {
  id: number
  etiqueta_hero: string
  titulo_hero: string
  bajada_hero: string
  imagen_hero: string | null
  correo: string
  telefono: string
  whatsapp: string | null
  direccion: string | null
  mapas: string | null
  instagram: string | null
  tiktok: string | null
  facebook: string | null
  discos: string | null
  actualizado_en: string | null
}
