-- Create the durable, Auth-owned outbox for confirmed email synchronization.
--
-- Canonical direction:
--   auth.users.email -> public.customers.email -> Stripe Customer.email
--
-- The trigger only records that confirmed Auth state changed. It never performs
-- downstream writes, so external Stripe availability cannot affect the Auth
-- confirmation transaction. The target email is deliberately not duplicated
-- in this table; workers must re-read the current confirmed Auth user.

begin;

do $preconditions$
declare
  protected_name text;
begin
  if to_regclass('public.customers') is null
    or to_regclass('auth.users') is null
    or to_regclass('auth.sessions') is null
    or to_regclass('auth.mfa_amr_claims') is null then
    raise exception 'Required Email Change source relations are missing'
      using errcode = '55000';
  end if;

  if not exists (
    select 1 from pg_catalog.pg_roles where rolname = 'authenticator'
  ) then
    raise exception 'Required authenticator role is missing'
      using errcode = '55000';
  end if;

  if not exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'customers'
      and c.column_name = 'user_id'
      and c.data_type = 'uuid'
  ) or not exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'customers'
      and c.column_name = 'stripe_customer_id'
      and c.data_type in ('text', 'character varying')
  ) then
    raise exception 'Required customer mapping columns are missing or incompatible'
      using errcode = '55000';
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_index i
    join pg_catalog.pg_class t on t.oid = i.indrelid
    join pg_catalog.pg_namespace n on n.oid = t.relnamespace
    join pg_catalog.pg_attribute a
      on a.attrelid = t.oid and a.attname = 'user_id'
    where n.nspname = 'public'
      and t.relname = 'customers'
      and i.indisunique
      and i.indisvalid
      and i.indisready
      and i.indislive
      and i.indimmediate
      and not i.indnullsnotdistinct
      and i.indpred is null
      and i.indexprs is null
      and i.indnkeyatts = 1
      and i.indkey[0] = a.attnum
  ) or not exists (
    select 1
    from pg_catalog.pg_index i
    join pg_catalog.pg_class t on t.oid = i.indrelid
    join pg_catalog.pg_namespace n on n.oid = t.relnamespace
    join pg_catalog.pg_attribute a
      on a.attrelid = t.oid and a.attname = 'stripe_customer_id'
    where n.nspname = 'public'
      and t.relname = 'customers'
      and i.indisunique
      and i.indisvalid
      and i.indisready
      and i.indislive
      and i.indimmediate
      and not i.indnullsnotdistinct
      and i.indpred is null
      and i.indexprs is null
      and i.indnkeyatts = 1
      and i.indkey[0] = a.attnum
  ) then
    raise exception 'Required unique customer mapping constraints are missing'
      using errcode = '55000';
  end if;

  if exists (
    select 1
    from pg_catalog.pg_db_role_setting setting
    left join pg_catalog.pg_roles role_record
      on role_record.oid = setting.setrole
    cross join lateral pg_catalog.unnest(setting.setconfig) configured(value)
    where configured.value like 'pgrst.db_pre_request=%'
      and (
        role_record.rolname = 'authenticator'
        or (
          setting.setrole = 0
          and setting.setdatabase = (
            select oid
            from pg_catalog.pg_database
            where datname = pg_catalog.current_database()
          )
        )
      )
  ) then
    raise exception 'Unexpected existing PostgREST pre-request configuration'
      using errcode = '55000';
  end if;

  foreach protected_name in array array[
    'auth_email_change_requests',
    'auth_email_sync_jobs'
  ] loop
    if exists (
      select 1
      from pg_catalog.pg_class c
      join pg_catalog.pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = protected_name
    ) then
      raise exception 'Unexpected protected relation collision: %', protected_name
        using errcode = '42710';
    end if;
  end loop;

  foreach protected_name in array array[
    'begin_auth_email_change_request',
    'release_auth_email_change_before_provider',
    'mark_auth_email_change_provider_mutation_started',
    'accept_auth_email_change_request',
    'fail_auth_email_change_request',
    'mark_auth_email_change_status_unknown',
    'get_own_auth_email_change_state',
    'is_current_auth_email_change_session_cleared',
    'enforce_auth_email_change_session_boundary',
    'enqueue_auth_email_sync_from_auth_user',
    'request_auth_email_reconciliation',
    'ensure_auth_email_reconciliation',
    'establish_customer_mapping',
    'replace_customer_mapping_if_current',
    'enqueue_auth_email_sync_from_customer_mapping',
    'claim_auth_email_sync_jobs',
    'is_auth_email_sync_lease_current',
    'sync_auth_email_local_if_current',
    'complete_auth_email_sync_verification',
    'complete_auth_email_sync_job',
    'fail_auth_email_sync_job'
  ] loop
    if exists (
      select 1
      from pg_catalog.pg_proc p
      join pg_catalog.pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = protected_name
    ) then
      raise exception 'Unexpected protected function collision: %', protected_name
        using errcode = '42710';
    end if;
  end loop;

  if exists (
    select 1
    from pg_catalog.pg_trigger t
    where t.tgname = 'enqueue_auth_email_sync_after_confirmed_change'
      and not t.tgisinternal
  ) then
    raise exception 'Unexpected protected trigger collision'
      using errcode = '42710';
  end if;


  if exists (
    select 1
    from pg_catalog.pg_trigger t
    where t.tgname = 'enqueue_auth_email_sync_after_customer_mapping'
      and not t.tgisinternal
  ) then
    raise exception 'Unexpected customer mapping trigger collision'
      using errcode = '42710';
  end if;
end
$preconditions$;

create table public.auth_email_change_requests (
  user_id uuid primary key references auth.users (id) on delete cascade,
  generation bigint not null default 1 check (generation > 0),
  correlation_id uuid not null default pg_catalog.gen_random_uuid() unique,
  status text not null check (status in (
    'requesting', 'request_failed', 'confirmation_pending', 'status_unknown',
    'canonical_changed', 'completed', 'manual_review'
  )),
  requested_at timestamptz not null default now(),
  reservation_expires_at timestamptz not null default (now() + interval '5 minutes'),
  provider_mutation_started_at timestamptz,
  provider_accepted_at timestamptz,
  canonical_changed_at timestamptz,
  canonical_changed_generation bigint
    check (
      canonical_changed_generation is null
      or (
        canonical_changed_generation > 0
        and canonical_changed_generation <= generation
      )
    ),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  last_error_code text
);
alter table public.auth_email_change_requests owner to postgres;
alter table public.auth_email_change_requests enable row level security;
revoke all on table public.auth_email_change_requests from public, anon, authenticated;
grant select, insert, update on table public.auth_email_change_requests to service_role;

create function public.begin_auth_email_change_request(p_user_id uuid)
returns table (generation bigint, correlation_id uuid)
language plpgsql security definer set search_path = '' as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  reserved_generation bigint;
  reserved_correlation_id uuid;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  -- Five minutes bounds only the isolated pre-provider authentication window.
  -- A started provider mutation and every later state remain non-expiring.
  insert into public.auth_email_change_requests (
    user_id, status, reservation_expires_at
  )
  values (p_user_id, 'requesting', now() + interval '5 minutes')
  on conflict (user_id) do update set
    generation = public.auth_email_change_requests.generation + 1,
    correlation_id = pg_catalog.gen_random_uuid(),
    status = 'requesting',
    requested_at = now(),
    reservation_expires_at = now() + interval '5 minutes',
    provider_mutation_started_at = null,
    provider_accepted_at = null,
    canonical_changed_generation = null,
    completed_at = null, updated_at = now(), last_error_code = null
  where public.auth_email_change_requests.status in ('request_failed', 'completed')
    or (
      public.auth_email_change_requests.status = 'requesting'
      and public.auth_email_change_requests.provider_mutation_started_at is null
      and public.auth_email_change_requests.canonical_changed_generation is null
      and public.auth_email_change_requests.reservation_expires_at <= now()
    )
  returning public.auth_email_change_requests.generation,
    public.auth_email_change_requests.correlation_id
  into reserved_generation, reserved_correlation_id;

  if not found then
    return;
  end if;

  return query select reserved_generation, reserved_correlation_id;
end $$;
alter function public.begin_auth_email_change_request(uuid) owner to postgres;
revoke all on function public.begin_auth_email_change_request(uuid) from public, anon, authenticated;
grant execute on function public.begin_auth_email_change_request(uuid) to service_role;

create function public.release_auth_email_change_before_provider(
  p_user_id uuid,
  p_generation bigint,
  p_correlation_id uuid
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  changed_generation bigint;
begin
  if caller_role is distinct from 'service_role' then raise exception 'Not authorized' using errcode='42501'; end if;

  select r.canonical_changed_generation
  into changed_generation
  from public.auth_email_change_requests r
  where r.user_id = p_user_id
    and r.generation = p_generation
    and r.correlation_id = p_correlation_id
    and r.status = 'requesting'
    and r.provider_mutation_started_at is null
  for update;

  if not found then return false; end if;
  if changed_generation is not null then
    update public.auth_email_change_requests r
    set status = 'manual_review', updated_at = now()
    where r.user_id = p_user_id
      and r.generation = p_generation
      and r.correlation_id = p_correlation_id
      and r.status = 'requesting'
      and r.provider_mutation_started_at is null;
    return found;
  end if;

  update public.auth_email_change_requests r
  set status = 'request_failed', updated_at = now()
  where r.user_id = p_user_id
    and r.generation = p_generation
    and r.correlation_id = p_correlation_id
    and r.status = 'requesting'
    and r.provider_mutation_started_at is null
    and r.canonical_changed_generation is null;
  return found;
end $$;
alter function public.release_auth_email_change_before_provider(uuid, bigint, uuid) owner to postgres;
revoke all on function public.release_auth_email_change_before_provider(uuid, bigint, uuid) from public, anon, authenticated;
grant execute on function public.release_auth_email_change_before_provider(uuid, bigint, uuid) to service_role;

create function public.mark_auth_email_change_provider_mutation_started(
  p_user_id uuid,
  p_generation bigint,
  p_correlation_id uuid
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  caller_role text := auth.jwt() ->> 'role';
begin
  if caller_role is distinct from 'service_role' then raise exception 'Not authorized' using errcode='42501'; end if;

  update public.auth_email_change_requests r
  set provider_mutation_started_at = coalesce(r.provider_mutation_started_at, now()),
      updated_at = now()
  where r.user_id = p_user_id
    and r.generation = p_generation
    and r.correlation_id = p_correlation_id
    and r.status = 'requesting'
    and r.canonical_changed_generation is null;
  return found;
end $$;
alter function public.mark_auth_email_change_provider_mutation_started(uuid, bigint, uuid) owner to postgres;
revoke all on function public.mark_auth_email_change_provider_mutation_started(uuid, bigint, uuid) from public, anon, authenticated;
grant execute on function public.mark_auth_email_change_provider_mutation_started(uuid, bigint, uuid) to service_role;

create function public.accept_auth_email_change_request(
  p_user_id uuid,
  p_generation bigint,
  p_correlation_id uuid
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  request_status text;
  change_epoch timestamptz;
  changed_generation bigint;
  mutation_started_at timestamptz;
  sync_completed boolean;
begin
  if caller_role is distinct from 'service_role' then raise exception 'Not authorized' using errcode='42501'; end if;

  select r.status, r.canonical_changed_at, r.canonical_changed_generation,
    r.provider_mutation_started_at
  into request_status, change_epoch, changed_generation, mutation_started_at
  from public.auth_email_change_requests r
  where r.user_id = p_user_id
    and r.generation = p_generation
    and r.correlation_id = p_correlation_id
  for update;

  if not found then return false; end if;
  if mutation_started_at is null then return false; end if;
  if request_status = 'confirmation_pending' and changed_generation is null then return true; end if;
  if request_status in ('canonical_changed', 'completed')
    and changed_generation = p_generation then return true; end if;
  if request_status <> 'requesting' then return false; end if;
  if changed_generation is not null
    and (changed_generation <> p_generation or change_epoch is null) then return false; end if;

  execute 'select exists (
    select 1 from public.auth_email_sync_jobs j
    where j.user_id = $1
      and j.request_generation = $2
      and j.status = ''completed''
  )' into sync_completed using p_user_id, p_generation;

  update public.auth_email_change_requests r
  set status = case
        when changed_generation = p_generation and sync_completed then 'completed'
        when changed_generation = p_generation then 'canonical_changed'
        else 'confirmation_pending'
      end,
      provider_accepted_at = coalesce(r.provider_accepted_at, now()),
      completed_at = case
        when changed_generation = p_generation and sync_completed
          then coalesce(r.completed_at, now())
        else r.completed_at
      end,
      updated_at = now()
  where r.user_id = p_user_id
    and r.generation = p_generation
    and r.correlation_id = p_correlation_id
    and r.status = 'requesting'
    and r.provider_mutation_started_at is not null;
  return found;
end $$;
alter function public.accept_auth_email_change_request(uuid, bigint, uuid) owner to postgres;
revoke all on function public.accept_auth_email_change_request(uuid, bigint, uuid) from public, anon, authenticated;
grant execute on function public.accept_auth_email_change_request(uuid, bigint, uuid) to service_role;

create function public.fail_auth_email_change_request(
  p_user_id uuid,
  p_generation bigint,
  p_correlation_id uuid
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  changed_generation bigint;
begin
  if caller_role is distinct from 'service_role' then raise exception 'Not authorized' using errcode='42501'; end if;
  update public.auth_email_change_requests r
  set status = case
        when r.canonical_changed_generation = p_generation
          then 'manual_review'
        else 'request_failed'
      end,
      updated_at = now()
  where r.user_id = p_user_id
    and r.generation = p_generation
    and r.correlation_id = p_correlation_id
    and r.status = 'requesting'
    and r.provider_mutation_started_at is not null
  returning r.canonical_changed_generation into changed_generation;
  return found;
end $$;
alter function public.fail_auth_email_change_request(uuid, bigint, uuid) owner to postgres;
revoke all on function public.fail_auth_email_change_request(uuid, bigint, uuid) from public, anon, authenticated;
grant execute on function public.fail_auth_email_change_request(uuid, bigint, uuid) to service_role;

create function public.mark_auth_email_change_status_unknown(
  p_user_id uuid,
  p_generation bigint,
  p_correlation_id uuid
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  request_status text;
  change_epoch timestamptz;
  changed_generation bigint;
  mutation_started_at timestamptz;
  sync_completed boolean;
begin
  if caller_role is distinct from 'service_role' then raise exception 'Not authorized' using errcode='42501'; end if;

  select r.status, r.canonical_changed_at, r.canonical_changed_generation,
    r.provider_mutation_started_at
  into request_status, change_epoch, changed_generation, mutation_started_at
  from public.auth_email_change_requests r
  where r.user_id = p_user_id
    and r.generation = p_generation
    and r.correlation_id = p_correlation_id
  for update;

  if not found then return false; end if;
  if mutation_started_at is null then return false; end if;
  if request_status = 'status_unknown' and changed_generation is null then return true; end if;
  if request_status in ('canonical_changed', 'completed')
    and changed_generation = p_generation then return true; end if;
  if request_status <> 'requesting' then return false; end if;
  if changed_generation is not null
    and (changed_generation <> p_generation or change_epoch is null) then return false; end if;

  execute 'select exists (
    select 1 from public.auth_email_sync_jobs j
    where j.user_id = $1
      and j.request_generation = $2
      and j.status = ''completed''
  )' into sync_completed using p_user_id, p_generation;

  update public.auth_email_change_requests r
  set status = case
        when changed_generation = p_generation and sync_completed then 'completed'
        when changed_generation = p_generation then 'canonical_changed'
        else 'status_unknown'
      end,
      completed_at = case
        when changed_generation = p_generation and sync_completed
          then coalesce(r.completed_at, now())
        else r.completed_at
      end,
      updated_at = now()
  where r.user_id = p_user_id
    and r.generation = p_generation
    and r.correlation_id = p_correlation_id
    and r.status = 'requesting'
    and r.provider_mutation_started_at is not null;
  return found;
end $$;
alter function public.mark_auth_email_change_status_unknown(uuid, bigint, uuid) owner to postgres;
revoke all on function public.mark_auth_email_change_status_unknown(uuid, bigint, uuid) from public, anon, authenticated;
grant execute on function public.mark_auth_email_change_status_unknown(uuid, bigint, uuid) to service_role;

create function public.is_current_auth_email_change_session_cleared(
  p_canonical_changed_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  claim jsonb := auth.jwt();
  session_id_text text;
  current_session_id uuid;
begin
  if p_canonical_changed_at is null
    or caller_id is null
    or claim ->> 'role' is distinct from 'authenticated' then
    return false;
  end if;

  session_id_text := claim ->> 'session_id';
  if session_id_text is null
    or session_id_text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return false;
  end if;
  current_session_id := session_id_text::uuid;

  return exists (
    select 1
    from auth.sessions session_record
    where session_record.id = current_session_id
      and session_record.user_id = caller_id
      and session_record.created_at > p_canonical_changed_at
      and exists (
        select 1
        from auth.mfa_amr_claims amr_record
        where amr_record.session_id = session_record.id
          and amr_record.authentication_method = 'password'
          and amr_record.updated_at > p_canonical_changed_at
      )
  );
end
$$;
alter function public.is_current_auth_email_change_session_cleared(timestamptz)
owner to postgres;
revoke all
on function public.is_current_auth_email_change_session_cleared(timestamptz)
from public, anon, authenticated, service_role;

create function public.get_own_auth_email_change_state()
returns table (
  status text,
  generation bigint,
  requires_reauthentication boolean,
  pre_provider_recovery_available boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  claim jsonb := auth.jwt();
begin
  if caller_id is null
    or claim ->> 'role' is distinct from 'authenticated' then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if exists (
    select 1
    from public.auth_email_change_requests request_record
    where request_record.user_id = caller_id
      and request_record.status in ('canonical_changed', 'completed')
      and request_record.canonical_changed_at is null
  ) then
    raise exception 'Auth email change state unavailable' using errcode = '55000';
  end if;

  return query
  select
    request_record.status,
    request_record.generation,
    case
      when request_record.status in (
        'requesting', 'confirmation_pending', 'status_unknown', 'manual_review'
      ) then true
      when request_record.canonical_changed_at is not null then
        not public.is_current_auth_email_change_session_cleared(
          request_record.canonical_changed_at
        )
      else false
    end,
    request_record.status = 'requesting'
      and request_record.reservation_expires_at <= now()
      and request_record.provider_mutation_started_at is null
      and request_record.canonical_changed_generation is null
  from public.auth_email_change_requests request_record
  where request_record.user_id = caller_id;
end
$$;
alter function public.get_own_auth_email_change_state() owner to postgres;
revoke all on function public.get_own_auth_email_change_state() from public, anon;
grant execute on function public.get_own_auth_email_change_state() to authenticated;

create function public.enforce_auth_email_change_session_boundary()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  claim jsonb := auth.jwt();
  request_path text := pg_catalog.current_setting('request.path', true);
  request_status text;
  change_epoch timestamptz;
begin
  if claim ->> 'role' is distinct from 'authenticated' then
    return;
  end if;

  if caller_id is null then
    raise sqlstate 'PGRST' using
      message = pg_catalog.json_build_object(
        'code', 'AUTH_STATE_UNAVAILABLE',
        'message', 'Authentication state unavailable',
        'details', null,
        'hint', null
      )::text,
      detail = pg_catalog.json_build_object(
        'status', 503,
        'headers', pg_catalog.json_build_object()
      )::text;
  end if;

  -- This read-only RPC is the sole controlled observation point used by the
  -- Next.js page/API guards to render the correct bounded response.
  if request_path = '/rpc/get_own_auth_email_change_state' then
    return;
  end if;

  select request_record.status, request_record.canonical_changed_at
  into request_status, change_epoch
  from public.auth_email_change_requests request_record
  where request_record.user_id = caller_id;

  if not found then
    return;
  end if;

  if request_status = 'request_failed' and change_epoch is null then
    return;
  end if;

  if request_status in (
    'requesting', 'confirmation_pending', 'status_unknown', 'manual_review'
  ) then
    raise sqlstate 'PGRST' using
      message = pg_catalog.json_build_object(
        'code', 'EMAIL_CHANGE_REAUTH_REQUIRED',
        'message', 'Email change reauthentication required',
        'details', null,
        'hint', null
      )::text,
      detail = pg_catalog.json_build_object(
        'status', 409,
        'headers', pg_catalog.json_build_object()
      )::text;
  end if;

  if change_epoch is null then
    raise sqlstate 'PGRST' using
      message = pg_catalog.json_build_object(
        'code', 'AUTH_STATE_UNAVAILABLE',
        'message', 'Authentication state unavailable',
        'details', null,
        'hint', null
      )::text,
      detail = pg_catalog.json_build_object(
        'status', 503,
        'headers', pg_catalog.json_build_object()
      )::text;
  end if;

  if not public.is_current_auth_email_change_session_cleared(change_epoch) then
    raise sqlstate 'PGRST' using
      message = pg_catalog.json_build_object(
        'code', 'EMAIL_CHANGE_REAUTH_REQUIRED',
        'message', 'Email change reauthentication required',
        'details', null,
        'hint', null
      )::text,
      detail = pg_catalog.json_build_object(
        'status', 409,
        'headers', pg_catalog.json_build_object()
      )::text;
  end if;
end
$$;
alter function public.enforce_auth_email_change_session_boundary()
owner to postgres;
revoke all
on function public.enforce_auth_email_change_session_boundary()
from public;
grant execute
on function public.enforce_auth_email_change_session_boundary()
to anon, authenticated, service_role;

create table public.auth_email_sync_jobs (
  user_id uuid primary key
    references auth.users (id)
    on delete cascade,
  generation bigint not null default 1
    check (generation > 0),
  request_generation bigint,
  status text not null default 'pending'
    check (
      status in (
        'pending',
        'processing',
        'retryable_failed',
        'completed',
        'manual_review'
      )
    ),
  work_kind text not null default 'sync'
    check (work_kind in ('sync', 'verify')),
  attempt_count integer not null default 0
    check (attempt_count >= 0),
  next_attempt_at timestamptz not null default now(),
  lease_token uuid,
  lease_expires_at timestamptz,
  local_synced_generation bigint not null default 0
    check (local_synced_generation >= 0),
  stripe_synced_generation bigint not null default 0
    check (stripe_synced_generation >= 0),
  completion_reason text
    check (
      completion_reason is null
      or completion_reason in ('synced', 'no_local_billing_relation')
    ),
  last_error_code text,
  last_retry_exhausted_generation bigint
    check (last_retry_exhausted_generation > 0),
  last_retry_exhausted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  check (
    (lease_token is null and lease_expires_at is null)
    or
    (lease_token is not null and lease_expires_at is not null)
  ),
  check (local_synced_generation <= generation),
  check (stripe_synced_generation <= generation),
  check (
    (last_retry_exhausted_generation is null and last_retry_exhausted_at is null)
    or
    (last_retry_exhausted_generation is not null and last_retry_exhausted_at is not null)
  )
);

alter table public.auth_email_sync_jobs owner to postgres;

create index auth_email_sync_jobs_ready_idx
on public.auth_email_sync_jobs (next_attempt_at, updated_at)
where status in ('pending', 'retryable_failed');

create index auth_email_sync_jobs_expired_lease_idx
on public.auth_email_sync_jobs (lease_expires_at)
where status = 'processing';

create index auth_email_sync_jobs_verification_idx
on public.auth_email_sync_jobs (next_attempt_at, updated_at)
where work_kind = 'verify'
  and status in ('completed', 'manual_review');

create index auth_email_sync_jobs_manual_review_idx
on public.auth_email_sync_jobs (next_attempt_at, updated_at)
where status = 'manual_review';

alter table public.auth_email_sync_jobs enable row level security;

revoke all on table public.auth_email_sync_jobs from public;
revoke all on table public.auth_email_sync_jobs from anon;
revoke all on table public.auth_email_sync_jobs from authenticated;
grant select
on table public.auth_email_sync_jobs
to service_role;

create function public.enqueue_auth_email_sync_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_request_generation bigint;
begin
  if old.email is distinct from new.email then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended('customer-user:' || new.id::text, 0)
    );

    insert into public.auth_email_change_requests (
      user_id,
      status,
      canonical_changed_at,
      canonical_changed_generation,
      updated_at
    )
    values (
      new.id,
      'manual_review',
      now(),
      null,
      now()
    )
    on conflict (user_id) do update
    set
      status = case
        when public.auth_email_change_requests.status = 'requesting'
          then 'requesting'
        when public.auth_email_change_requests.status in (
          'confirmation_pending', 'status_unknown'
        ) then 'canonical_changed'
        else 'manual_review'
      end,
      canonical_changed_at = case
        when public.auth_email_change_requests.canonical_changed_at is null
          or public.auth_email_change_requests.canonical_changed_at < now()
          then now()
        else public.auth_email_change_requests.canonical_changed_at
      end,
      canonical_changed_generation = case
        when public.auth_email_change_requests.status in (
          'requesting', 'confirmation_pending', 'status_unknown'
        ) then public.auth_email_change_requests.generation
        else null
      end,
      completed_at = case
        when public.auth_email_change_requests.status in (
          'requesting', 'confirmation_pending', 'status_unknown'
        ) then public.auth_email_change_requests.completed_at
        else null
      end,
      updated_at = now()
    returning public.auth_email_change_requests.canonical_changed_generation
    into active_request_generation;

    insert into public.auth_email_sync_jobs (
      user_id,
      generation,
      request_generation,
      status,
      work_kind,
      attempt_count,
      next_attempt_at,
      lease_token,
      lease_expires_at,
      completion_reason,
      last_error_code,
      updated_at,
      completed_at
    )
    values (
      new.id,
      1,
      active_request_generation,
      'pending',
      'sync',
      0,
      pg_catalog.now(),
      null,
      null,
      null,
      null,
      pg_catalog.now(),
      null
    )
    on conflict (user_id) do update
    set
      generation = public.auth_email_sync_jobs.generation + 1,
      request_generation = excluded.request_generation,
      status = 'pending',
      work_kind = 'sync',
      attempt_count = 0,
      next_attempt_at = pg_catalog.now(),
      lease_token = null,
      lease_expires_at = null,
      completion_reason = null,
      last_error_code = null,
      updated_at = pg_catalog.now(),
      completed_at = null;
  end if;

  return new;
end;
$$;

alter function public.enqueue_auth_email_sync_from_auth_user()
owner to postgres;

revoke all
on function public.enqueue_auth_email_sync_from_auth_user()
from public, anon, authenticated, service_role;

create trigger enqueue_auth_email_sync_after_confirmed_change
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.enqueue_auth_email_sync_from_auth_user();

create function public.request_auth_email_reconciliation(
  p_user_id uuid
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  next_generation bigint;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to request Auth email reconciliation'
      using errcode = '42501';
  end if;

  insert into public.auth_email_sync_jobs (
    user_id,
    generation,
    status,
    work_kind,
    attempt_count,
    next_attempt_at,
    lease_token,
    lease_expires_at,
    completion_reason,
    last_error_code,
    updated_at,
    completed_at
  )
  values (
    p_user_id,
    1,
    'pending',
    'sync',
    0,
    pg_catalog.now(),
    null,
    null,
    null,
    null,
    pg_catalog.now(),
    null
  )
  on conflict (user_id) do update
  set
    generation = public.auth_email_sync_jobs.generation + 1,
    request_generation = null,
    status = 'pending',
    work_kind = 'sync',
    attempt_count = 0,
    next_attempt_at = pg_catalog.now(),
    lease_token = null,
    lease_expires_at = null,
    completion_reason = null,
    last_error_code = null,
    updated_at = pg_catalog.now(),
    completed_at = null
  returning generation into next_generation;

  return next_generation;
end;
$$;

alter function public.request_auth_email_reconciliation(uuid)
owner to postgres;

revoke all
on function public.request_auth_email_reconciliation(uuid)
from public, anon, authenticated;
grant execute
on function public.request_auth_email_reconciliation(uuid)
to service_role;

create function public.ensure_auth_email_reconciliation(
  p_user_id uuid,
  p_observed_generation bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  current_job public.auth_email_sync_jobs%rowtype;
  ensured_generation bigint;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to ensure Auth email reconciliation'
      using errcode = '42501';
  end if;

  select j.*
  into current_job
  from public.auth_email_sync_jobs j
  where j.user_id = p_user_id
  for update;

  if not found then
    insert into public.auth_email_sync_jobs (
      user_id, generation, request_generation, status, work_kind,
      attempt_count, next_attempt_at, lease_token, lease_expires_at,
      completion_reason, last_error_code, updated_at, completed_at
    ) values (
      p_user_id, 1, null, 'pending', 'sync',
      0, pg_catalog.now(), null, null,
      null, null, pg_catalog.now(), null
    )
    returning generation into ensured_generation;
    return ensured_generation;
  end if;

  if current_job.generation > p_observed_generation
    and current_job.work_kind = 'sync'
    and current_job.status in ('pending', 'processing', 'retryable_failed') then
    return current_job.generation;
  end if;

  update public.auth_email_sync_jobs j
  set generation = j.generation + 1,
      request_generation = null,
      status = 'pending',
      work_kind = 'sync',
      attempt_count = 0,
      next_attempt_at = pg_catalog.now(),
      lease_token = null,
      lease_expires_at = null,
      completion_reason = null,
      last_error_code = null,
      updated_at = pg_catalog.now(),
      completed_at = null
  where j.user_id = p_user_id
  returning j.generation into ensured_generation;

  return ensured_generation;
end;
$$;

alter function public.ensure_auth_email_reconciliation(uuid, bigint)
owner to postgres;

revoke all
on function public.ensure_auth_email_reconciliation(uuid, bigint)
from public, anon, authenticated;
grant execute
on function public.ensure_auth_email_reconciliation(uuid, bigint)
to service_role;

create function public.enqueue_auth_email_sync_from_customer_mapping()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_request_generation bigint;
begin
  if new.user_id is null
    or new.stripe_customer_id is null
    or new.stripe_customer_id !~ '^cus_[A-Za-z0-9]+$' then
    return new;
  end if;

  if tg_op = 'UPDATE'
    and old.user_id is not distinct from new.user_id
    and old.stripe_customer_id is not distinct from new.stripe_customer_id then
    return new;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('customer-user:' || new.user_id::text, 0)
  );

  select r.generation
  into active_request_generation
  from public.auth_email_change_requests r
  where r.user_id = new.user_id
    and r.canonical_changed_at is not null
    and r.canonical_changed_generation = r.generation
    and r.status in (
      'requesting',
      'confirmation_pending',
      'status_unknown',
      'canonical_changed'
    )
  for update;

  insert into public.auth_email_sync_jobs (
    user_id,
    generation,
    request_generation,
    status,
    work_kind,
    attempt_count,
    next_attempt_at,
    lease_token,
    lease_expires_at,
    completion_reason,
    last_error_code,
    updated_at,
    completed_at
  )
  values (
    new.user_id,
    1,
    active_request_generation,
    'pending',
    'sync',
    0,
    pg_catalog.now(),
    null,
    null,
    null,
    null,
    pg_catalog.now(),
    null
  )
  on conflict (user_id) do update
  set generation = public.auth_email_sync_jobs.generation + 1,
      request_generation = active_request_generation,
      status = 'pending',
      work_kind = 'sync',
      attempt_count = 0,
      next_attempt_at = pg_catalog.now(),
      lease_token = null,
      lease_expires_at = null,
      completion_reason = null,
      last_error_code = null,
      updated_at = pg_catalog.now(),
      completed_at = null;

  return new;
end;
$$;

alter function public.enqueue_auth_email_sync_from_customer_mapping()
owner to postgres;

revoke all
on function public.enqueue_auth_email_sync_from_customer_mapping()
from public, anon, authenticated, service_role;

create trigger enqueue_auth_email_sync_after_customer_mapping
after insert or update of user_id, stripe_customer_id
on public.customers
for each row
execute function public.enqueue_auth_email_sync_from_customer_mapping();

create function public.establish_customer_mapping(
  p_user_id uuid,
  p_stripe_customer_id text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  user_mapping public.customers%rowtype;
  stripe_mapping public.customers%rowtype;
  user_mapping_found boolean;
  stripe_mapping_found boolean;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to establish customer mapping'
      using errcode = '42501';
  end if;

  if p_user_id is null
    or p_stripe_customer_id is null
    or p_stripe_customer_id !~ '^cus_[A-Za-z0-9]+$' then
    raise exception 'Invalid customer mapping identifiers'
      using errcode = '22023';
  end if;

  if not exists (
    select 1 from auth.users u where u.id = p_user_id
  ) then
    raise exception 'Auth user does not exist'
      using errcode = '23503';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('customer-user:' || p_user_id::text, 0)
  );
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'stripe-customer:' || p_stripe_customer_id,
      0
    )
  );

  select c.*
  into user_mapping
  from public.customers c
  where c.user_id = p_user_id
  for update;
  user_mapping_found := found;

  select c.*
  into stripe_mapping
  from public.customers c
  where c.stripe_customer_id = p_stripe_customer_id
  for update;
  stripe_mapping_found := found;

  if user_mapping_found and stripe_mapping_found
    and user_mapping.id is distinct from stripe_mapping.id then
    raise exception 'Conflicting customer mapping rows'
      using errcode = '23505';
  end if;

  if user_mapping_found then
    if user_mapping.stripe_customer_id = p_stripe_customer_id then
      return 'existing';
    end if;
    if user_mapping.stripe_customer_id is not null then
      raise exception 'User already has a different Stripe customer mapping'
        using errcode = '23505';
    end if;
    if stripe_mapping_found then
      raise exception 'Stripe customer placeholder conflicts with user row'
        using errcode = '23505';
    end if;

    update public.customers c
    set stripe_customer_id = p_stripe_customer_id
    where c.id = user_mapping.id;
    return 'established';
  end if;

  if stripe_mapping_found then
    if stripe_mapping.user_id is not null
      and stripe_mapping.user_id <> p_user_id then
      raise exception 'Stripe customer belongs to another user'
        using errcode = '23505';
    end if;
    if stripe_mapping.user_id = p_user_id then
      return 'existing';
    end if;

    update public.customers c
    set user_id = p_user_id
    where c.id = stripe_mapping.id
      and c.user_id is null;
    if not found then
      raise exception 'Stripe customer placeholder changed concurrently'
        using errcode = '40001';
    end if;
    return 'established';
  end if;

  insert into public.customers (user_id, stripe_customer_id)
  values (p_user_id, p_stripe_customer_id);
  return 'established';
end;
$$;

alter function public.establish_customer_mapping(uuid, text)
owner to postgres;

revoke all
on function public.establish_customer_mapping(uuid, text)
from public, anon, authenticated;
grant execute
on function public.establish_customer_mapping(uuid, text)
to service_role;

create function public.replace_customer_mapping_if_current(
  p_user_id uuid,
  p_expected_stripe_customer_id text,
  p_new_stripe_customer_id text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  current_mapping public.customers%rowtype;
  new_stripe_mapping public.customers%rowtype;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to replace customer mapping'
      using errcode = '42501';
  end if;

  if p_user_id is null
    or p_expected_stripe_customer_id is null
    or p_expected_stripe_customer_id !~ '^cus_[A-Za-z0-9]+$'
    or p_new_stripe_customer_id is null
    or p_new_stripe_customer_id !~ '^cus_[A-Za-z0-9]+$' then
    raise exception 'Invalid customer mapping identifiers'
      using errcode = '22023';
  end if;

  if not exists (
    select 1 from auth.users u where u.id = p_user_id
  ) then
    raise exception 'Auth user does not exist'
      using errcode = '23503';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('customer-user:' || p_user_id::text, 0)
  );
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      'stripe-customer:' || least(
        p_expected_stripe_customer_id,
        p_new_stripe_customer_id
      ),
      0
    )
  );
  if p_expected_stripe_customer_id <> p_new_stripe_customer_id then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(
        'stripe-customer:' || greatest(
          p_expected_stripe_customer_id,
          p_new_stripe_customer_id
        ),
        0
      )
    );
  end if;

  select c.*
  into current_mapping
  from public.customers c
  where c.user_id = p_user_id
  for update;

  if not found then
    raise exception 'Current customer mapping does not exist'
      using errcode = 'P0002';
  end if;

  if current_mapping.stripe_customer_id = p_new_stripe_customer_id then
    return 'existing';
  end if;

  if current_mapping.stripe_customer_id is distinct from
    p_expected_stripe_customer_id then
    raise exception 'Current customer mapping does not match expectation'
      using errcode = '40001';
  end if;

  select c.*
  into new_stripe_mapping
  from public.customers c
  where c.stripe_customer_id = p_new_stripe_customer_id
  for update;

  if found and new_stripe_mapping.id is distinct from current_mapping.id then
    raise exception 'New Stripe customer is already mapped'
      using errcode = '23505';
  end if;

  update public.customers c
  set stripe_customer_id = p_new_stripe_customer_id
  where c.id = current_mapping.id
    and c.stripe_customer_id = p_expected_stripe_customer_id;

  if not found then
    raise exception 'Current customer mapping changed concurrently'
      using errcode = '40001';
  end if;

  return 'replaced';
end;
$$;

alter function public.replace_customer_mapping_if_current(uuid, text, text)
owner to postgres;

revoke all
on function public.replace_customer_mapping_if_current(uuid, text, text)
from public, anon, authenticated;
grant execute
on function public.replace_customer_mapping_if_current(uuid, text, text)
to service_role;

create function public.claim_auth_email_sync_jobs(
  p_limit integer default 10,
  p_lease_seconds integer default 120
)
returns table (
  user_id uuid,
  generation bigint,
  lease_token uuid,
  attempt_count integer,
  work_kind text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to claim Auth email synchronization jobs'
      using errcode = '42501';
  end if;

  with exhausted_candidates as (
    select j.user_id
    from public.auth_email_sync_jobs j
    where j.attempt_count >= 5
      and (
        (
          j.status in ('pending', 'retryable_failed')
          and j.lease_token is null
        )
        or (
          j.status = 'processing'
          and j.lease_expires_at <= pg_catalog.now()
        )
      )
    order by j.next_attempt_at, j.updated_at, j.user_id
    for update skip locked
    limit least(greatest(p_limit, 1), 50)
  )
  update public.auth_email_sync_jobs j
  set
    status = 'manual_review',
    last_error_code = 'WORKER_ATTEMPTS_EXHAUSTED',
    last_retry_exhausted_generation = j.generation,
    last_retry_exhausted_at = pg_catalog.now(),
    next_attempt_at = pg_catalog.now()
      + pg_catalog.make_interval(secs => 86400),
    lease_token = null,
    lease_expires_at = null,
    completed_at = null,
    updated_at = pg_catalog.now()
  from exhausted_candidates c
  where j.user_id = c.user_id;

  return query
  with candidates as (
    select j.user_id, j.status as previous_status, j.work_kind
    from public.auth_email_sync_jobs j
    where (
      j.attempt_count < 5
      and (
        (
          j.status in ('pending', 'retryable_failed')
          and j.next_attempt_at <= pg_catalog.now()
          and j.lease_token is null
        )
        or (
          j.status = 'processing'
          and j.lease_expires_at <= pg_catalog.now()
        )
      )
    ) or (
      (
        (j.work_kind = 'verify' and j.status = 'completed')
        or j.status = 'manual_review'
      )
      and j.next_attempt_at <= pg_catalog.now()
      and j.lease_token is null
    )
    order by j.next_attempt_at, j.updated_at, j.user_id
    for update skip locked
    limit least(greatest(p_limit, 1), 50)
  ),
  claimed as (
    update public.auth_email_sync_jobs j
    set
      status = 'processing',
      attempt_count = case
        when c.previous_status = 'manual_review'
          or (c.work_kind = 'verify' and c.previous_status = 'completed')
          then 1
        else j.attempt_count + 1
      end,
      lease_token = pg_catalog.gen_random_uuid(),
      lease_expires_at = pg_catalog.now()
        + pg_catalog.make_interval(
            secs => least(
              greatest(p_lease_seconds, 30),
              900
            )
          ),
      updated_at = pg_catalog.now()
    from candidates c
    where j.user_id = c.user_id
    returning
      j.user_id,
      j.generation,
      j.lease_token,
      j.attempt_count,
      j.work_kind
  )
  select
    c.user_id,
    c.generation,
    c.lease_token,
    c.attempt_count,
    c.work_kind
  from claimed c;
end;
$$;

alter function public.claim_auth_email_sync_jobs(integer, integer)
owner to postgres;

revoke all
on function public.claim_auth_email_sync_jobs(integer, integer)
from public, anon, authenticated;
grant execute
on function public.claim_auth_email_sync_jobs(integer, integer)
to service_role;

create function public.is_auth_email_sync_lease_current(
  p_user_id uuid,
  p_generation bigint,
  p_lease_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to inspect Auth email synchronization leases'
      using errcode = '42501';
  end if;

  return exists (
    select 1
    from public.auth_email_sync_jobs j
    where j.user_id = p_user_id
      and j.generation = p_generation
      and j.status = 'processing'
      and j.lease_token = p_lease_token
      and j.lease_expires_at > pg_catalog.now()
  );
end;
$$;

alter function public.is_auth_email_sync_lease_current(uuid, bigint, uuid)
owner to postgres;

revoke all
on function public.is_auth_email_sync_lease_current(uuid, bigint, uuid)
from public, anon, authenticated;
grant execute
on function public.is_auth_email_sync_lease_current(uuid, bigint, uuid)
to service_role;

create function public.sync_auth_email_local_if_current(
  p_user_id uuid,
  p_generation bigint,
  p_lease_token uuid,
  p_stripe_customer_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  canonical_email text;
  changed_rows integer;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to update Auth email synchronization jobs'
      using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('customer-user:' || p_user_id::text, 0)
  );

  perform 1
  from public.auth_email_sync_jobs j
  where j.user_id = p_user_id
    and j.generation = p_generation
    and j.status = 'processing'
    and j.work_kind = 'sync'
    and j.lease_token = p_lease_token
    and j.lease_expires_at > pg_catalog.now()
  for update;

  if not found then
    return false;
  end if;

  select u.email
  into canonical_email
  from auth.users u
  where u.id = p_user_id;

  if canonical_email is null then
    return false;
  end if;

  update public.customers c
  set email = canonical_email
  where c.user_id = p_user_id
    and c.stripe_customer_id = p_stripe_customer_id;

  get diagnostics changed_rows = row_count;
  if changed_rows <> 1 then
    raise exception 'Customer mapping changed during Auth email synchronization'
      using errcode = '55000';
  end if;

  update public.auth_email_sync_jobs j
  set local_synced_generation = p_generation,
      updated_at = pg_catalog.now()
  where j.user_id = p_user_id
    and j.generation = p_generation
    and j.status = 'processing'
    and j.work_kind = 'sync'
    and j.lease_token = p_lease_token
    and j.lease_expires_at > pg_catalog.now();

  get diagnostics changed_rows = row_count;
  if changed_rows <> 1 then
    raise exception 'Auth email synchronization lease changed unexpectedly'
      using errcode = '55000';
  end if;

  return true;
end;
$$;

alter function public.sync_auth_email_local_if_current(uuid, bigint, uuid, text)
owner to postgres;

revoke all
on function public.sync_auth_email_local_if_current(uuid, bigint, uuid, text)
from public, anon, authenticated;
grant execute
on function public.sync_auth_email_local_if_current(uuid, bigint, uuid, text)
to service_role;

create function public.complete_auth_email_sync_verification(
  p_user_id uuid,
  p_generation bigint,
  p_lease_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  changed_rows integer;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to complete Auth email verification'
      using errcode = '42501';
  end if;

  update public.auth_email_sync_jobs j
  set status = 'completed',
      attempt_count = 0,
      next_attempt_at = pg_catalog.now()
        + pg_catalog.make_interval(secs => 86400),
      lease_token = null,
      lease_expires_at = null,
      last_error_code = null,
      completed_at = pg_catalog.now(),
      updated_at = pg_catalog.now()
  where j.user_id = p_user_id
    and j.generation = p_generation
    and j.status = 'processing'
    and j.work_kind = 'verify'
    and j.lease_token = p_lease_token
    and j.lease_expires_at > pg_catalog.now();

  get diagnostics changed_rows = row_count;
  return changed_rows = 1;
end;
$$;

alter function public.complete_auth_email_sync_verification(uuid, bigint, uuid)
owner to postgres;

revoke all
on function public.complete_auth_email_sync_verification(uuid, bigint, uuid)
from public, anon, authenticated;
grant execute
on function public.complete_auth_email_sync_verification(uuid, bigint, uuid)
to service_role;

create function public.complete_auth_email_sync_job(
  p_user_id uuid,
  p_generation bigint,
  p_lease_token uuid,
  p_completion_reason text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  changed_rows integer;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to complete Auth email synchronization jobs'
      using errcode = '42501';
  end if;

  if p_completion_reason not in ('synced', 'no_local_billing_relation') then
    raise exception 'Invalid Auth email synchronization completion reason'
      using errcode = '22023';
  end if;

  update public.auth_email_sync_jobs j
  set
    status = 'completed',
    work_kind = case
      when p_completion_reason = 'synced' then 'verify'
      else 'sync'
    end,
    attempt_count = 0,
    stripe_synced_generation = p_generation,
    completion_reason = p_completion_reason,
    last_error_code = null,
    lease_token = null,
    lease_expires_at = null,
    completed_at = pg_catalog.now(),
    next_attempt_at = case
      when p_completion_reason = 'synced'
        then pg_catalog.now() + pg_catalog.make_interval(secs => 86400)
      else j.next_attempt_at
    end,
    updated_at = pg_catalog.now()
  where j.user_id = p_user_id
    and j.generation = p_generation
    and j.status = 'processing'
    and j.work_kind = 'sync'
    and j.lease_token = p_lease_token
    and j.lease_expires_at > pg_catalog.now()
    and (
      p_completion_reason = 'no_local_billing_relation'
      or j.local_synced_generation = p_generation
    );

  get diagnostics changed_rows = row_count;
  if changed_rows = 1 then
    update public.auth_email_change_requests r
    set status = 'completed', completed_at = pg_catalog.now(),
        updated_at = pg_catalog.now(), last_error_code = null
    from public.auth_email_sync_jobs j
    where j.user_id = p_user_id
      and j.user_id = r.user_id
      and j.generation = p_generation
      and j.request_generation = r.generation
      and r.status = 'canonical_changed';
  end if;
  return changed_rows = 1;
end;
$$;

alter function public.complete_auth_email_sync_job(uuid, bigint, uuid, text)
owner to postgres;

revoke all
on function public.complete_auth_email_sync_job(uuid, bigint, uuid, text)
from public, anon, authenticated;
grant execute
on function public.complete_auth_email_sync_job(uuid, bigint, uuid, text)
to service_role;

create function public.fail_auth_email_sync_job(
  p_user_id uuid,
  p_generation bigint,
  p_lease_token uuid,
  p_error_code text,
  p_retryable boolean,
  p_delay_seconds integer default 300
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  changed_rows integer;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized to fail Auth email synchronization jobs'
      using errcode = '42501';
  end if;

  if p_error_code is null
    or p_error_code !~ '^[A-Z0-9_]{1,64}$' then
    raise exception 'Invalid Auth email synchronization error code'
      using errcode = '22023';
  end if;

  update public.auth_email_sync_jobs j
  set
    status = case
      when p_retryable then 'retryable_failed'
      else 'manual_review'
    end,
    next_attempt_at = case
      when p_retryable then
        pg_catalog.now()
          + pg_catalog.make_interval(
            secs => least(
                greatest(p_delay_seconds, 30),
                86400
              )
            )
      else pg_catalog.now() + pg_catalog.make_interval(secs => 86400)
    end,
    last_error_code = p_error_code,
    last_retry_exhausted_generation = case
      when p_error_code ~ '_RETRY_EXHAUSTED$' then j.generation
      else j.last_retry_exhausted_generation
    end,
    last_retry_exhausted_at = case
      when p_error_code ~ '_RETRY_EXHAUSTED$' then pg_catalog.now()
      else j.last_retry_exhausted_at
    end,
    lease_token = null,
    lease_expires_at = null,
    completed_at = null,
    updated_at = pg_catalog.now()
  where j.user_id = p_user_id
    and j.generation = p_generation
    and j.status = 'processing'
    and j.lease_token = p_lease_token
    and j.lease_expires_at > pg_catalog.now();

  get diagnostics changed_rows = row_count;
  return changed_rows = 1;
end;
$$;

alter function public.fail_auth_email_sync_job(
  uuid,
  bigint,
  uuid,
  text,
  boolean,
  integer
)
owner to postgres;

revoke all
on function public.fail_auth_email_sync_job(
  uuid,
  bigint,
  uuid,
  text,
  boolean,
  integer
)
from public, anon, authenticated;
grant execute
on function public.fail_auth_email_sync_job(
  uuid,
  bigint,
  uuid,
  text,
  boolean,
  integer
)
to service_role;

-- Seed only complete historical mappings. Future valid mapping transitions are
-- transactionally coupled to reconciliation by the customer-mapping trigger.
insert into public.auth_email_sync_jobs (user_id)
select c.user_id
from public.customers c
join auth.users u on u.id = c.user_id
where c.user_id is not null
  and c.stripe_customer_id is not null
  and c.stripe_customer_id ~ '^cus_[A-Za-z0-9]+$'
on conflict (user_id) do nothing;

do $configure_postgrest$
begin
  execute pg_catalog.format(
    'alter role authenticator in database %I set pgrst.db_pre_request = %L',
    pg_catalog.current_database(),
    'public.enforce_auth_email_change_session_boundary'
  );
end
$configure_postgrest$;

notify pgrst, 'reload config';

commit;
