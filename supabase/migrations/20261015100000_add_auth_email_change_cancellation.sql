-- Add a tightly fenced administrative cancellation state for provider-accepted
-- Email Change requests whose provider-side pending state has been cleared.
-- This migration never clears provider state itself.

begin;

do $preconditions$
declare
  required_column text;
  has_legacy_provider_schema boolean;
  has_secure_provider_schema boolean;
  secure_provider_column_count integer;
begin
  if to_regclass('public.auth_email_change_requests') is null
    or to_regclass('public.auth_email_sync_jobs') is null
    or to_regclass('auth.users') is null then
    raise exception 'Required Email Change relations are missing' using errcode = '55000';
  end if;

  if to_regprocedure('public.begin_auth_email_change_request(uuid)') is null
    or to_regprocedure('public.get_own_auth_email_change_state()') is null
    or to_regprocedure('public.enforce_auth_email_change_session_boundary()') is null
    or to_regprocedure('public.enqueue_auth_email_sync_from_auth_user()') is null then
    raise exception 'Required Email Change functions are missing' using errcode = '55000';
  end if;

  if not exists (
    select 1 from pg_catalog.pg_constraint constraint_record
    where constraint_record.conrelid = 'public.auth_email_change_requests'::regclass
      and constraint_record.conname = 'auth_email_change_requests_status_check'
      and constraint_record.contype = 'c'
  ) then
    raise exception 'Required Email Change status constraint is missing' using errcode = '55000';
  end if;

  foreach required_column in array array['email', 'email_change', 'email_change_sent_at'] loop
    if not exists (
      select 1 from information_schema.columns column_record
      where column_record.table_schema = 'auth'
        and column_record.table_name = 'users'
        and column_record.column_name = required_column
    ) then
      raise exception 'Required Auth provider field is missing: %', required_column
        using errcode = '55000';
    end if;

  if not exists (
    select 1
    from pg_catalog.pg_trigger trigger_record
    where trigger_record.tgrelid = 'auth.users'::regclass
      and trigger_record.tgname = 'enqueue_auth_email_sync_after_confirmed_change'
      and not trigger_record.tgisinternal
      and trigger_record.tgenabled in ('O', 'A')
      and trigger_record.tgfoid =
        'public.enqueue_auth_email_sync_from_auth_user()'::regprocedure
  ) then
    raise exception 'Required canonical Email Change trigger is missing or disabled'
      using errcode = '55000';
  end if;
  end loop;

  select exists (
    select 1 from information_schema.columns column_record
    where column_record.table_schema = 'auth'
      and column_record.table_name = 'users'
      and column_record.column_name = 'email_change_token'
  ) into has_legacy_provider_schema;

  select count(*)
  into secure_provider_column_count
  from information_schema.columns column_record
  where column_record.table_schema = 'auth'
    and column_record.table_name = 'users'
    and column_record.column_name in (
      'email_change_token_current',
      'email_change_token_new',
      'email_change_confirm_status'
    );

  has_secure_provider_schema := secure_provider_column_count = 3;

  if not (
    (has_legacy_provider_schema and secure_provider_column_count = 0)
    or (not has_legacy_provider_schema and has_secure_provider_schema)
  ) then
    raise exception 'Unsupported Auth provider Email Change schema'
      using errcode = '55000';
  end if;

  if to_regclass('public.auth_email_change_remediation_events') is not null then
    raise exception 'Unexpected remediation audit relation collision' using errcode = '42710';
  end if;
  if exists (
    select 1 from pg_catalog.pg_proc function_record
    join pg_catalog.pg_namespace namespace_record
      on namespace_record.oid = function_record.pronamespace
    where namespace_record.nspname = 'public'
      and function_record.proname = 'cancel_auth_email_change_request'
  ) then
    raise exception 'Unexpected cancellation function collision' using errcode = '42710';
  end if;
end
$preconditions$;

alter table public.auth_email_change_requests
  add column cancelled_at timestamptz,
  add column cancellation_reason_code text,
  add column cancellation_actor_category text;

alter table public.auth_email_change_requests
  drop constraint auth_email_change_requests_status_check,
  add constraint auth_email_change_requests_status_check check (status in (
    'requesting', 'request_failed', 'confirmation_pending', 'status_unknown',
    'canonical_changed', 'completed', 'manual_review', 'cancelled'
  )),
  add constraint auth_email_change_requests_cancellation_check check (
    (
      status = 'cancelled'
      and cancelled_at is not null
      and cancellation_reason_code = 'PROVIDER_PENDING_CLEARED'
      and cancellation_actor_category = 'service_role_remediation'
      and provider_mutation_started_at is not null
      and provider_accepted_at is not null
      and canonical_changed_at is null
      and canonical_changed_generation is null
      and completed_at is null
    )
    or (
      status <> 'cancelled'
      and cancelled_at is null
      and cancellation_reason_code is null
      and cancellation_actor_category is null
    )
    or (
      status = 'manual_review'
      and cancelled_at is not null
      and cancellation_reason_code = 'PROVIDER_PENDING_CLEARED'
      and cancellation_actor_category = 'service_role_remediation'
    )
  );

create table public.auth_email_change_remediation_events (
  event_id uuid primary key default pg_catalog.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  generation bigint not null check (generation > 0),
  correlation_id uuid not null,
  action_code text not null check (action_code = 'CANCEL_PROVIDER_CLEARED_REQUEST'),
  reason_code text not null check (reason_code = 'PROVIDER_PENDING_CLEARED'),
  actor_category text not null check (actor_category = 'service_role_remediation'),
  previous_status text not null check (previous_status = 'confirmation_pending'),
  resulting_status text not null check (resulting_status = 'cancelled'),
  created_at timestamptz not null default now(),
  unique (user_id, generation, correlation_id)
);
alter table public.auth_email_change_remediation_events owner to postgres;
alter table public.auth_email_change_remediation_events enable row level security;
revoke all on table public.auth_email_change_remediation_events
from public, anon, authenticated, service_role;
grant select on table public.auth_email_change_remediation_events to service_role;

-- Request mutations are mediated by narrowly scoped security-definer functions.
revoke insert, update on table public.auth_email_change_requests from service_role;

create or replace function public.begin_auth_email_change_request(p_user_id uuid)
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

  insert into public.auth_email_change_requests (user_id, status, reservation_expires_at)
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
    completed_at = null,
    cancelled_at = null,
    cancellation_reason_code = null,
    cancellation_actor_category = null,
    updated_at = now(),
    last_error_code = null
  where public.auth_email_change_requests.status in ('request_failed', 'completed', 'cancelled')
    or (
      public.auth_email_change_requests.status = 'requesting'
      and public.auth_email_change_requests.provider_mutation_started_at is null
      and public.auth_email_change_requests.canonical_changed_generation is null
      and public.auth_email_change_requests.reservation_expires_at <= now()
    )
  returning public.auth_email_change_requests.generation,
    public.auth_email_change_requests.correlation_id
  into reserved_generation, reserved_correlation_id;

  if not found then return; end if;
  return query select reserved_generation, reserved_correlation_id;
end $$;
alter function public.begin_auth_email_change_request(uuid) owner to postgres;
revoke all on function public.begin_auth_email_change_request(uuid)
from public, anon, authenticated;
grant execute on function public.begin_auth_email_change_request(uuid) to service_role;

create function public.cancel_auth_email_change_request(
  p_user_id uuid,
  p_generation bigint,
  p_correlation_id uuid,
  p_reason_code text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
  provider_record jsonb;
  request_record public.auth_email_change_requests%rowtype;
  has_legacy_provider_schema boolean;
  has_any_secure_provider_field boolean;
  has_secure_provider_schema boolean;
begin
  if caller_role is distinct from 'service_role' then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if p_user_id is null or p_generation is null or p_generation < 1
    or p_correlation_id is null
    or p_reason_code is distinct from 'PROVIDER_PENDING_CLEARED' then
    return false;
  end if;

  select pg_catalog.to_jsonb(user_record)
  into provider_record
  from auth.users user_record
  where user_record.id = p_user_id
  for update;

  if not found then return false; end if;

  -- A normal Auth UPDATE locks auth.users before its AFTER trigger acquires
  -- this advisory lock. Keep the same order to avoid a lock-order deadlock.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('customer-user:' || p_user_id::text, 0)
  );

  if not exists (
    select 1
    from pg_catalog.pg_trigger trigger_record
    where trigger_record.tgrelid = 'auth.users'::regclass
      and trigger_record.tgname = 'enqueue_auth_email_sync_after_confirmed_change'
      and not trigger_record.tgisinternal
      and trigger_record.tgenabled in ('O', 'A')
      and trigger_record.tgfoid =
        'public.enqueue_auth_email_sync_from_auth_user()'::regprocedure
  ) then
    return false;
  end if;

  if nullif(pg_catalog.btrim(coalesce(provider_record ->> 'email_change', '')), '') is not null
    or provider_record ->> 'email_change_sent_at' is not null then
    return false;
  end if;

  has_legacy_provider_schema := provider_record ? 'email_change_token';
  has_any_secure_provider_field := provider_record ? 'email_change_token_current'
    or provider_record ? 'email_change_token_new'
    or provider_record ? 'email_change_confirm_status';
  has_secure_provider_schema := provider_record ? 'email_change_token_current'
    and provider_record ? 'email_change_token_new'
    and provider_record ? 'email_change_confirm_status';

  if not (
    (has_legacy_provider_schema and not has_any_secure_provider_field)
    or (not has_legacy_provider_schema and has_secure_provider_schema)
  ) then
    return false;
  end if;

  if has_secure_provider_schema then
    if nullif(pg_catalog.btrim(coalesce(
        provider_record ->> 'email_change_token_current', ''
      )), '') is not null
      or nullif(pg_catalog.btrim(coalesce(
        provider_record ->> 'email_change_token_new', ''
      )), '') is not null
      or coalesce((provider_record ->> 'email_change_confirm_status')::integer, 0) <> 0 then
      return false;
    end if;
  elsif has_legacy_provider_schema then
    if nullif(pg_catalog.btrim(coalesce(
        provider_record ->> 'email_change_token', ''
      )), '') is not null then
      return false;
    end if;
  end if;

  select request_row.* into request_record
  from public.auth_email_change_requests request_row
  where request_row.user_id = p_user_id
    and request_row.generation = p_generation
    and request_row.correlation_id = p_correlation_id
  for update;

  if not found then return false; end if;

  if request_record.status = 'cancelled' then
    return request_record.cancelled_at is not null
      and request_record.cancellation_reason_code = p_reason_code
      and request_record.cancellation_actor_category = 'service_role_remediation'
      and request_record.canonical_changed_at is null
      and request_record.canonical_changed_generation is null
      and request_record.completed_at is null
      and exists (
        select 1 from public.auth_email_change_remediation_events event_record
        where event_record.user_id = p_user_id
          and event_record.generation = p_generation
          and event_record.correlation_id = p_correlation_id
          and event_record.reason_code = p_reason_code
          and event_record.resulting_status = 'cancelled'
      );
  end if;

  if request_record.status <> 'confirmation_pending'
    or request_record.provider_mutation_started_at is null
    or request_record.provider_accepted_at is null
    or request_record.canonical_changed_at is not null
    or request_record.canonical_changed_generation is not null
    or request_record.completed_at is not null
    or exists (
      select 1 from public.auth_email_sync_jobs job_record
      where job_record.user_id = p_user_id
        and job_record.request_generation = p_generation
    ) then
    return false;
  end if;

  update public.auth_email_change_requests request_row
  set status = 'cancelled', cancelled_at = now(),
      cancellation_reason_code = p_reason_code,
      cancellation_actor_category = 'service_role_remediation', updated_at = now()
  where request_row.user_id = p_user_id
    and request_row.generation = p_generation
    and request_row.correlation_id = p_correlation_id
    and request_row.status = 'confirmation_pending'
    and request_row.provider_mutation_started_at is not null
    and request_row.provider_accepted_at is not null
    and request_row.canonical_changed_at is null
    and request_row.canonical_changed_generation is null
    and request_row.completed_at is null;

  if not found then return false; end if;

  insert into public.auth_email_change_remediation_events (
    user_id, generation, correlation_id, action_code, reason_code,
    actor_category, previous_status, resulting_status
  ) values (
    p_user_id, p_generation, p_correlation_id,
    'CANCEL_PROVIDER_CLEARED_REQUEST', p_reason_code,
    'service_role_remediation', 'confirmation_pending', 'cancelled'
  );
  return true;
end
$$;
alter function public.cancel_auth_email_change_request(uuid, bigint, uuid, text)
owner to postgres;
revoke all on function public.cancel_auth_email_change_request(uuid, bigint, uuid, text)
from public, anon, authenticated;
grant execute on function public.cancel_auth_email_change_request(uuid, bigint, uuid, text)
to service_role;

create or replace function public.get_own_auth_email_change_state()
returns table (
  status text,
  generation bigint,
  requires_reauthentication boolean,
  pre_provider_recovery_available boolean
)
language plpgsql security definer set search_path = '' as $$
declare
  caller_id uuid := auth.uid();
  claim jsonb := auth.jwt();
begin
  if caller_id is null or claim ->> 'role' is distinct from 'authenticated' then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if exists (
    select 1 from public.auth_email_change_requests request_record
    where request_record.user_id = caller_id
      and request_record.status in ('canonical_changed', 'completed')
      and request_record.canonical_changed_at is null
  ) then
    raise exception 'Auth email change state unavailable' using errcode = '55000';
  end if;
  return query
  select request_record.status, request_record.generation,
    case
      when request_record.status in (
        'requesting', 'confirmation_pending', 'status_unknown', 'manual_review'
      ) then true
      when request_record.canonical_changed_at is not null then
        not public.is_current_auth_email_change_session_cleared(request_record.canonical_changed_at)
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

create or replace function public.enforce_auth_email_change_session_boundary()
returns void
language plpgsql security definer set search_path = '' as $$
declare
  caller_id uuid := auth.uid();
  claim jsonb := auth.jwt();
  request_path text := pg_catalog.current_setting('request.path', true);
  request_status text;
  change_epoch timestamptz;
begin
  if claim ->> 'role' is distinct from 'authenticated' then return; end if;
  if caller_id is null then
    raise sqlstate 'PGRST' using
      message = pg_catalog.json_build_object(
        'code', 'AUTH_STATE_UNAVAILABLE', 'message', 'Authentication state unavailable',
        'details', null, 'hint', null
      )::text,
      detail = pg_catalog.json_build_object(
        'status', 503, 'headers', pg_catalog.json_build_object()
      )::text;
  end if;
  if request_path = '/rpc/get_own_auth_email_change_state' then return; end if;

  select request_record.status, request_record.canonical_changed_at
  into request_status, change_epoch
  from public.auth_email_change_requests request_record
  where request_record.user_id = caller_id;
  if not found then return; end if;

  if request_status in ('request_failed', 'cancelled') and change_epoch is null then
    return;
  end if;
  if request_status in (
    'requesting', 'confirmation_pending', 'status_unknown', 'manual_review'
  ) then
    raise sqlstate 'PGRST' using
      message = pg_catalog.json_build_object(
        'code', 'EMAIL_CHANGE_REAUTH_REQUIRED',
        'message', 'Email change reauthentication required',
        'details', null, 'hint', null
      )::text,
      detail = pg_catalog.json_build_object(
        'status', 409, 'headers', pg_catalog.json_build_object()
      )::text;
  end if;
  if change_epoch is null then
    raise sqlstate 'PGRST' using
      message = pg_catalog.json_build_object(
        'code', 'AUTH_STATE_UNAVAILABLE', 'message', 'Authentication state unavailable',
        'details', null, 'hint', null
      )::text,
      detail = pg_catalog.json_build_object(
        'status', 503, 'headers', pg_catalog.json_build_object()
      )::text;
  end if;
  if not public.is_current_auth_email_change_session_cleared(change_epoch) then
    raise sqlstate 'PGRST' using
      message = pg_catalog.json_build_object(
        'code', 'EMAIL_CHANGE_REAUTH_REQUIRED',
        'message', 'Email change reauthentication required',
        'details', null, 'hint', null
      )::text,
      detail = pg_catalog.json_build_object(
        'status', 409, 'headers', pg_catalog.json_build_object()
      )::text;
  end if;
end
$$;
alter function public.enforce_auth_email_change_session_boundary() owner to postgres;
revoke all on function public.enforce_auth_email_change_session_boundary() from public;
grant execute on function public.enforce_auth_email_change_session_boundary()
to anon, authenticated, service_role;

notify pgrst, 'reload schema';

commit;
