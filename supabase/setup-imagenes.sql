-- Ejecutar en Supabase → SQL Editor → New query → Run.
-- Crea el bucket de imágenes, sus políticas RLS y la tabla de configuración
-- de la página pública. Es reejecutable: no borra tablas, datos ni políticas.

-- 1) Bucket público para imágenes de eventos y de la portada.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'imagenes',
  'imagenes',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2) Políticas del bucket. Solo el PROPIETARIO puede escribir/borrar.
-- Se crean solo si no existen, para no reemplazar nada.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'meraki_imagenes_publicas'
  ) then
    create policy "meraki_imagenes_publicas"
    on storage.objects for select to anon, authenticated
    using (bucket_id = 'imagenes');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'meraki_imagenes_insertar_propietario'
  ) then
    create policy "meraki_imagenes_insertar_propietario"
    on storage.objects for insert to authenticated
    with check (
      bucket_id = 'imagenes'
      and public.obtener_rol_usuario() = 'PROPIETARIO'
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'meraki_imagenes_actualizar_propietario'
  ) then
    create policy "meraki_imagenes_actualizar_propietario"
    on storage.objects for update to authenticated
    using (
      bucket_id = 'imagenes'
      and public.obtener_rol_usuario() = 'PROPIETARIO'
    )
    with check (
      bucket_id = 'imagenes'
      and public.obtener_rol_usuario() = 'PROPIETARIO'
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'meraki_imagenes_borrar_propietario'
  ) then
    create policy "meraki_imagenes_borrar_propietario"
    on storage.objects for delete to authenticated
    using (
      bucket_id = 'imagenes'
      and public.obtener_rol_usuario() = 'PROPIETARIO'
    );
  end if;
end $$;

-- 3) Contenido editable de la página pública (una sola fila: id = 1).
create table if not exists public.configuracion_pagina (
  id smallint primary key default 1 check (id = 1),
  etiqueta_hero text not null default 'Música + Teatro + Comedia + Danza + Poesía',
  titulo_hero text not null default 'Escena en vivo y eventos culturales en Meraki Teatrobar.',
  bajada_hero text not null default 'Estamos en la calle Ballivián #159, en Santa Cruz de la Sierra. Aquí puedes ver lo que está en cartelera y también los eventos que ya pasaron por la sala, propios o de terceros.',
  imagen_hero text,
  correo text not null default 'merakiteatrobar@gmail.com',
  telefono text not null default '+591 69253799',
  whatsapp text default 'https://wa.me/59169253799',
  direccion text default 'Calle Ballivián #159, entre La Paz y Chuquisaca, Santa Cruz de la Sierra, Bolivia',
  mapas text default 'https://maps.app.goo.gl/eXNiPvjBESA97J1F9',
  instagram text default 'https://www.instagram.com/merakiteatrobar/',
  tiktok text default 'https://www.tiktok.com/@merakiteatro',
  facebook text default 'https://www.facebook.com/merakiteatrobar',
  discos text default 'https://www.instagram.com/discosenlaoscuridad/',
  discos_titulo text not null default 'Discos en la oscuridad',
  discos_descripcion text not null default '𝗗𝗜𝗦𝗖𝗢𝗦 𝗘𝗡 𝗟𝗔 𝗢𝗦𝗖𝗨𝗥𝗜𝗗𝗔𝗗 te ofrece una experiencia auditiva distinta, en total oscuridad, sin distracciones y con la más alta calidad de sonido, con el sonido profesional de nuestra sala.',
  passline text default 'https://www.passline.com/venue/meraki-teatro-bar',
  passline_titulo text not null default 'Eventos en Passline',
  actualizado_en timestamptz
);

alter table public.configuracion_pagina add column if not exists etiqueta_hero text;
alter table public.configuracion_pagina add column if not exists titulo_hero text;
alter table public.configuracion_pagina add column if not exists bajada_hero text;
alter table public.configuracion_pagina add column if not exists imagen_hero text;
alter table public.configuracion_pagina add column if not exists correo text;
alter table public.configuracion_pagina add column if not exists telefono text;
alter table public.configuracion_pagina add column if not exists whatsapp text;
alter table public.configuracion_pagina add column if not exists direccion text;
alter table public.configuracion_pagina add column if not exists mapas text;
alter table public.configuracion_pagina add column if not exists instagram text;
alter table public.configuracion_pagina add column if not exists tiktok text;
alter table public.configuracion_pagina add column if not exists facebook text;
alter table public.configuracion_pagina add column if not exists discos text;
alter table public.configuracion_pagina add column if not exists discos_titulo text;
alter table public.configuracion_pagina add column if not exists discos_descripcion text;
alter table public.configuracion_pagina add column if not exists passline text;
alter table public.configuracion_pagina add column if not exists passline_titulo text;
alter table public.configuracion_pagina add column if not exists actualizado_en timestamptz;

insert into public.configuracion_pagina (id) values (1)
on conflict (id) do nothing;

grant select on public.configuracion_pagina to anon, authenticated;
grant update on public.configuracion_pagina to authenticated;

alter table public.configuracion_pagina enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'configuracion_pagina'
      and policyname = 'meraki_config_publica'
  ) then
    create policy "meraki_config_publica"
    on public.configuracion_pagina for select to anon, authenticated
    using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'configuracion_pagina'
      and policyname = 'meraki_config_propietario_edita'
  ) then
    create policy "meraki_config_propietario_edita"
    on public.configuracion_pagina for update to authenticated
    using (public.obtener_rol_usuario() = 'PROPIETARIO')
    with check (public.obtener_rol_usuario() = 'PROPIETARIO');
  end if;
end $$;
