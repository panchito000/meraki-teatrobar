-- Ejecutar en Supabase → SQL Editor → New query → Run.
-- Permite que cada usuario edite su propio nombre y que el propietario
-- pueda editar el nombre de cualquier cuenta. No borra nada.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'usuarios'
      and policyname = 'meraki_usuarios_editar_nombre'
  ) then
    create policy "meraki_usuarios_editar_nombre"
    on public.usuarios for update to authenticated
    using (
      id_usuario = auth.uid()
      or public.obtener_rol_usuario() = 'PROPIETARIO'
    )
    with check (
      id_usuario = auth.uid()
      or public.obtener_rol_usuario() = 'PROPIETARIO'
    );
  end if;
end $$;

grant update (nombre) on public.usuarios to authenticated;
