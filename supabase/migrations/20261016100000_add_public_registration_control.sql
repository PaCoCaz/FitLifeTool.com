-- Permanent, fail-closed control for public self-registration.
-- The hosted Before User Created hook must be configured separately after this
-- migration is released and verified.

do $$
begin
  if pg_catalog.to_regclass('public.profiles') is null
     or pg_catalog.to_regclass('auth.users') is null then
    raise exception 'Required identity relations are missing' using errcode = '55000';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name = 'id' and data_type = 'uuid'
  ) or not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name = 'role'
  ) then
    raise exception 'Canonical profile identity contract is missing' using errcode = '55000';
  end if;

  if pg_catalog.to_regclass('public.public_registration_control') is not null
     or pg_catalog.to_regclass('public.public_registration_control_events') is not null
     or pg_catalog.to_regprocedure('public.get_public_registration_status()') is not null
     or pg_catalog.to_regprocedure('public.get_admin_public_registration_status()') is not null
     or pg_catalog.to_regprocedure('public.set_public_registration_status(text,integer)') is not null
     or pg_catalog.to_regprocedure('public.hook_enforce_public_registration(jsonb)') is not null then
    raise exception 'Unexpected public registration control object collision' using errcode = '42710';
  end if;
end
$$;

create table public.public_registration_control (
  singleton_id smallint primary key default 1,
  is_open boolean not null default false,
  open_until timestamptz,
  version bigint not null default 1,
  updated_at timestamptz not null default pg_catalog.clock_timestamp(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint public_registration_control_singleton check (singleton_id = 1),
  constraint public_registration_control_shape check (
    (not is_open and open_until is null) or is_open
  ),
  constraint public_registration_control_version check (version > 0)
);

insert into public.public_registration_control (singleton_id, is_open)
values (1, false);

create table public.public_registration_control_events (
  event_id bigint generated always as identity primary key,
  occurred_at timestamptz not null default pg_catalog.clock_timestamp(),
  actor_user_id uuid not null,
  actor_role text not null check (actor_role in ('owner', 'admin')),
  action text not null check (action in ('open_temporary', 'open_indefinite', 'close')),
  previous_effective_open boolean not null,
  previous_open_until timestamptz,
  next_effective_open boolean not null,
  next_open_until timestamptz,
  control_version bigint not null check (control_version > 0)
);

alter table public.public_registration_control enable row level security;
alter table public.public_registration_control_events enable row level security;

revoke all on table public.public_registration_control from public, anon, authenticated;
revoke all on table public.public_registration_control_events from public, anon, authenticated;
revoke all on sequence public.public_registration_control_events_event_id_seq from public, anon, authenticated;

create function public.reject_public_registration_audit_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'Registration control audit is append-only' using errcode = '42501';
end
$$;

create trigger public_registration_control_events_append_only
before update or delete on public.public_registration_control_events
for each row execute function public.reject_public_registration_audit_mutation();

create function public.get_public_registration_status()
returns table (is_open boolean)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  control_count bigint;
  control_open boolean;
  control_until timestamptz;
begin
  select pg_catalog.count(*), pg_catalog.bool_or(control.is_open), pg_catalog.max(control.open_until)
    into control_count, control_open, control_until
  from public.public_registration_control as control;

  if control_count <> 1 then
    raise exception 'Registration control is unavailable' using errcode = '55000';
  end if;

  return query select (
    control_open and (control_until is null or control_until > pg_catalog.clock_timestamp())
  );
exception when others then
  return query select false;
end
$$;

create function public.get_admin_public_registration_status()
returns table (
  is_open boolean,
  open_until timestamptz,
  server_now timestamptz,
  version bigint
)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  caller_user_id uuid := auth.uid();
  caller_role text := auth.jwt() ->> 'role';
  application_role text;
  control_count bigint;
begin
  if caller_role <> 'authenticated' or caller_user_id is null then
    raise exception 'Registration administration is not authorized' using errcode = '42501';
  end if;

  select profile.role::text into application_role
  from public.profiles as profile
  where profile.id = caller_user_id;

  if application_role is null or application_role not in ('owner', 'admin') then
    raise exception 'Registration administration is not authorized' using errcode = '42501';
  end if;

  select pg_catalog.count(*) into control_count
  from public.public_registration_control;
  if control_count <> 1 then
    raise exception 'Registration control is unavailable' using errcode = '55000';
  end if;

  return query
  select
    control.is_open and (
      control.open_until is null or control.open_until > pg_catalog.clock_timestamp()
    ),
    control.open_until,
    pg_catalog.clock_timestamp(),
    control.version
  from public.public_registration_control as control
  where control.singleton_id = 1;
end
$$;

create function public.set_public_registration_status(
  p_action text,
  p_duration_minutes integer default null
)
returns table (
  is_open boolean,
  open_until timestamptz,
  server_now timestamptz,
  version bigint
)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  caller_user_id uuid := auth.uid();
  caller_role text := auth.jwt() ->> 'role';
  application_role text;
  control public.public_registration_control%rowtype;
  now_at timestamptz := pg_catalog.clock_timestamp();
  next_is_open boolean;
  next_open_until timestamptz;
begin
  if caller_role <> 'authenticated' or caller_user_id is null then
    raise exception 'Registration administration is not authorized' using errcode = '42501';
  end if;

  select profile.role::text into application_role
  from public.profiles as profile
  where profile.id = caller_user_id;

  if application_role is null or application_role not in ('owner', 'admin') then
    raise exception 'Registration administration is not authorized' using errcode = '42501';
  end if;

  if p_action = 'open_temporary' then
    if p_duration_minutes is null or p_duration_minutes < 1 or p_duration_minutes > 60 then
      raise exception 'Invalid registration duration' using errcode = '22023';
    end if;
    next_is_open := true;
    next_open_until := now_at + pg_catalog.make_interval(mins => p_duration_minutes);
  elsif p_action = 'open_indefinite' then
    if p_duration_minutes is not null then
      raise exception 'Duration is not allowed for indefinite registration' using errcode = '22023';
    end if;
    next_is_open := true;
    next_open_until := null;
  elsif p_action = 'close' then
    if p_duration_minutes is not null then
      raise exception 'Duration is not allowed when closing registration' using errcode = '22023';
    end if;
    next_is_open := false;
    next_open_until := null;
  else
    raise exception 'Invalid registration action' using errcode = '22023';
  end if;

  select * into strict control
  from public.public_registration_control
  where singleton_id = 1
  for update;

  update public.public_registration_control
  set is_open = next_is_open,
      open_until = next_open_until,
      version = control.version + 1,
      updated_at = now_at,
      updated_by = caller_user_id
  where singleton_id = 1;

  insert into public.public_registration_control_events (
    actor_user_id, actor_role, action,
    previous_effective_open, previous_open_until,
    next_effective_open, next_open_until, control_version
  ) values (
    caller_user_id, application_role, p_action,
    control.is_open and (control.open_until is null or control.open_until > now_at),
    control.open_until, next_is_open, next_open_until, control.version + 1
  );

  return query select next_is_open, next_open_until, now_at, control.version + 1;
exception
  when no_data_found or too_many_rows then
    raise exception 'Registration control is unavailable' using errcode = '55000';
end
$$;

create function public.hook_enforce_public_registration(input jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  control_count bigint;
  effective_open boolean;
begin
  if input is null
     or pg_catalog.jsonb_typeof(input) <> 'object'
     or not (input ? 'user')
     or pg_catalog.jsonb_typeof(input -> 'user') <> 'object'
     or pg_catalog.jsonb_typeof(input -> 'metadata') <> 'object'
     or input #>> '{metadata,name}' <> 'before-user-created'
     or coalesce(pg_catalog.jsonb_typeof(input #> '{user,id}'), 'null') <> 'string'
     or coalesce(pg_catalog.jsonb_typeof(input #> '{user,app_metadata}'), 'null') <> 'object'
     or coalesce(pg_catalog.jsonb_typeof(input #> '{user,app_metadata,provider}'), 'null') <> 'string'
     or pg_catalog.length(input #>> '{user,id}') = 0
     or pg_catalog.length(input #>> '{user,app_metadata,provider}') = 0 then
    return pg_catalog.jsonb_build_object(
      'error', pg_catalog.jsonb_build_object(
        'http_code', 403,
        'message', 'Public registration is not available.'
      )
    );
  end if;

  select pg_catalog.count(*), pg_catalog.bool_or(
    control.is_open and (
      control.open_until is null or control.open_until > pg_catalog.clock_timestamp()
    )
  ) into control_count, effective_open
  from public.public_registration_control as control;

  if control_count <> 1 or effective_open is not true then
    return pg_catalog.jsonb_build_object(
      'error', pg_catalog.jsonb_build_object(
        'http_code', 403,
        'message', 'Public registration is not available.'
      )
    );
  end if;

  return '{}'::jsonb;
exception when others then
  return pg_catalog.jsonb_build_object(
    'error', pg_catalog.jsonb_build_object(
      'http_code', 403,
      'message', 'Public registration is not available.'
    )
  );
end
$$;

alter table public.public_registration_control owner to postgres;
alter table public.public_registration_control_events owner to postgres;
alter function public.reject_public_registration_audit_mutation() owner to postgres;
alter function public.get_public_registration_status() owner to postgres;
alter function public.get_admin_public_registration_status() owner to postgres;
alter function public.set_public_registration_status(text, integer) owner to postgres;
alter function public.hook_enforce_public_registration(jsonb) owner to postgres;

revoke all on function public.reject_public_registration_audit_mutation() from public, anon, authenticated;
revoke all on function public.get_public_registration_status() from public;
revoke all on function public.get_admin_public_registration_status() from public, anon;
revoke all on function public.set_public_registration_status(text, integer) from public, anon;
revoke all on function public.hook_enforce_public_registration(jsonb) from public, anon, authenticated;

grant execute on function public.get_public_registration_status() to anon, authenticated;
grant execute on function public.get_admin_public_registration_status() to authenticated;
grant execute on function public.set_public_registration_status(text, integer) to authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_enforce_public_registration(jsonb) to supabase_auth_admin;

comment on function public.hook_enforce_public_registration(jsonb) is
  'Configure separately as the Supabase Before User Created hook. It gates public signup and admin invites; admin.createUser uses the separate authorized admin route.';
