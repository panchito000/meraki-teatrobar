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
