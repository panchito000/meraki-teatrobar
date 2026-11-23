import { createClient } from '@/lib/supabase/server'
import type { ConfiguracionPagina } from '@/lib/types'

export const CONFIGURACION_DEFAULT: ConfiguracionPagina = {
  id: 1,
  etiqueta_hero: 'Música + Teatro + Comedia + Danza + Poesía',
  titulo_hero: 'Escena en vivo y eventos culturales en Meraki Teatrobar.',
  bajada_hero:
    'Estamos en la calle Ballivián #159, en Santa Cruz de la Sierra. Aquí puedes ver lo que está en cartelera y también los eventos que ya pasaron por la sala, propios o de terceros.',
  imagen_hero: null,
  correo: 'merakiteatrobar@gmail.com',
  telefono: '+591 69253799',
  whatsapp: 'https://wa.me/59169253799',
  direccion:
    'Calle Ballivián #159, entre La Paz y Chuquisaca, Santa Cruz de la Sierra, Bolivia',
  mapas: 'https://maps.app.goo.gl/eXNiPvjBESA97J1F9',
  instagram: 'https://www.instagram.com/merakiteatrobar/',
  tiktok: 'https://www.tiktok.com/@merakiteatro',
  facebook: 'https://www.facebook.com/merakiteatrobar',
  discos: 'https://www.instagram.com/discosenlaoscuridad/',
  discos_titulo: 'Discos en la oscuridad',
  discos_descripcion:
    '𝗗𝗜𝗦𝗖𝗢𝗦 𝗘𝗡 𝗟𝗔 𝗢𝗦𝗖𝗨𝗥𝗜𝗗𝗔𝗗 te ofrece una experiencia auditiva distinta, en total oscuridad, sin distracciones y con la más alta calidad de sonido, con el sonido profesional de nuestra sala.',
  passline: 'https://www.passline.com/venue/meraki-teatro-bar',
  passline_titulo: 'Eventos en Passline',
  actualizado_en: null,
}

export function normalizarConfiguracion(
  fila?: Partial<ConfiguracionPagina> | null,
): ConfiguracionPagina {
  if (!fila) return CONFIGURACION_DEFAULT

  return {
    ...CONFIGURACION_DEFAULT,
    ...fila,
    id: 1,
    etiqueta_hero: fila.etiqueta_hero || CONFIGURACION_DEFAULT.etiqueta_hero,
    titulo_hero: fila.titulo_hero || CONFIGURACION_DEFAULT.titulo_hero,
    bajada_hero: fila.bajada_hero || CONFIGURACION_DEFAULT.bajada_hero,
    correo: fila.correo || CONFIGURACION_DEFAULT.correo,
    telefono: fila.telefono || CONFIGURACION_DEFAULT.telefono,
    discos_titulo: fila.discos_titulo || CONFIGURACION_DEFAULT.discos_titulo,
    discos_descripcion:
      fila.discos_descripcion || CONFIGURACION_DEFAULT.discos_descripcion,
    passline_titulo: fila.passline_titulo || CONFIGURACION_DEFAULT.passline_titulo,
  }
}

export async function obtenerConfiguracion(): Promise<ConfiguracionPagina> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('configuracion_pagina')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  return normalizarConfiguracion(data as Partial<ConfiguracionPagina> | null)
}
