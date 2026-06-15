-- ============================================================
-- 0015 — Auth: custom access-token hook (SPEC §5.1–§5.2)
--
-- Injects tenant_id / role / person_id into the JWT so the NestJS
-- SupabaseJwtGuard and Postgres RLS can resolve the caller. Resolves the
-- auth user across the three identity tables (management_users,
-- maintenance_workers, people) by supabase_user_id.
--
-- Enable in Supabase: Authentication → Hooks → "Custom Access Token" →
-- select public.custom_access_token_hook. (Cannot be enabled from SQL alone.)
-- ============================================================

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  uid uuid := (event ->> 'user_id')::uuid;
  claims jsonb := coalesce(event -> 'claims', '{}'::jsonb);
  v_tenant_id uuid;
  v_role text;
  v_person_id uuid;
begin
  -- Management users (admin / member): role stored on the row.
  select tenant_id, role, null::uuid
    into v_tenant_id, v_role, v_person_id
  from public.management_users
  where supabase_user_id = uid and deleted_at is null
  limit 1;

  -- Maintenance workers.
  if v_tenant_id is null then
    select tenant_id, 'maintenance', null::uuid
      into v_tenant_id, v_role, v_person_id
    from public.maintenance_workers
    where supabase_user_id = uid and deleted_at is null
    limit 1;
  end if;

  -- Residents (people).
  if v_tenant_id is null then
    select tenant_id, 'resident', id
      into v_tenant_id, v_role, v_person_id
    from public.people
    where supabase_user_id = uid and deleted_at is null
    limit 1;
  end if;

  if v_tenant_id is not null then
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(v_tenant_id));
    claims := jsonb_set(claims, '{role}', to_jsonb(v_role));
    if v_person_id is not null then
      claims := jsonb_set(claims, '{person_id}', to_jsonb(v_person_id));
    end if;
    event := jsonb_set(event, '{claims}', claims);
  end if;

  return event;
end;
$$;

-- The auth admin role runs the hook; lock it down from everyone else.
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

-- Let the hook read the identity tables.
grant select on public.management_users to supabase_auth_admin;
grant select on public.maintenance_workers to supabase_auth_admin;
grant select on public.people to supabase_auth_admin;
