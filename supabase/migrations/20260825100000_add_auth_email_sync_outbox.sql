-- Create the durable, Auth-owned outbox for confirmed email synchronization.
--
-- Canonical direction:
--   auth.users.email -> public.customers.email -> Stripe Customer.email
--
-- The trigger only records that confirmed Auth state changed. It never performs
-- downstream writes, so external Stripe availability cannot affect the Auth
-- confirmation transaction. The target email is deliberately not duplicated
-- in this table; workers must re-read the current confirmed Auth user.

create table public.auth_email_sync_jobs (
  user_id uuid primary key
    references auth.users (id)
    on delete cascade,
  generation bigint not null default 1
    check (generation > 0),
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  check (
    (lease_token is null and lease_expires_at is null)
    or
    (lease_token is not null and lease_expires_at is not null)
  ),
  check (local_synced_generation <= generation),
  check (stripe_synced_generation <= generation)
);

alter table public.auth_email_sync_jobs owner to postgres;

create index auth_email_sync_jobs_ready_idx
on public.auth_email_sync_jobs (next_attempt_at, updated_at)
where status in ('pending', 'retryable_failed');

create index auth_email_sync_jobs_expired_lease_idx
on public.auth_email_sync_jobs (lease_expires_at)
where status = 'processing';

alter table public.auth_email_sync_jobs enable row level security;

revoke all on table public.auth_email_sync_jobs from public;
revoke all on table public.auth_email_sync_jobs from anon;
revoke all on table public.auth_email_sync_jobs from authenticated;
grant select
on table public.auth_email_sync_jobs
to service_role;

create or replace function public.enqueue_auth_email_sync_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.email is distinct from new.email then
    insert into public.auth_email_sync_jobs (
      user_id,
      generation,
      status,
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
      'pending',
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
      status = 'pending',
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

create or replace function public.request_auth_email_reconciliation(
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
  if caller_role <> 'service_role' then
    raise exception 'Not authorized to request Auth email reconciliation'
      using errcode = '42501';
  end if;

  insert into public.auth_email_sync_jobs (
    user_id,
    generation,
    status,
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
    status = 'pending',
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

create or replace function public.claim_auth_email_sync_jobs(
  p_limit integer default 10,
  p_lease_seconds integer default 120
)
returns table (
  user_id uuid,
  generation bigint,
  lease_token uuid,
  attempt_count integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := auth.jwt() ->> 'role';
begin
  if caller_role <> 'service_role' then
    raise exception 'Not authorized to claim Auth email synchronization jobs'
      using errcode = '42501';
  end if;

  update public.auth_email_sync_jobs j
  set
    status = 'manual_review',
    last_error_code = 'WORKER_ATTEMPTS_EXHAUSTED',
    lease_token = null,
    lease_expires_at = null,
    completed_at = null,
    updated_at = pg_catalog.now()
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
    );

  return query
  with candidates as (
    select j.user_id
    from public.auth_email_sync_jobs j
    where j.attempt_count < 5
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
    order by j.next_attempt_at, j.updated_at, j.user_id
    for update skip locked
    limit pg_catalog.least(pg_catalog.greatest(p_limit, 1), 50)
  ),
  claimed as (
    update public.auth_email_sync_jobs j
    set
      status = 'processing',
      attempt_count = j.attempt_count + 1,
      lease_token = pg_catalog.gen_random_uuid(),
      lease_expires_at = pg_catalog.now()
        + pg_catalog.make_interval(
            secs => pg_catalog.least(
              pg_catalog.greatest(p_lease_seconds, 30),
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
      j.attempt_count
  )
  select
    c.user_id,
    c.generation,
    c.lease_token,
    c.attempt_count
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

create or replace function public.is_auth_email_sync_lease_current(
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
  if caller_role <> 'service_role' then
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

create or replace function public.mark_auth_email_local_synced(
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
  if caller_role <> 'service_role' then
    raise exception 'Not authorized to update Auth email synchronization jobs'
      using errcode = '42501';
  end if;

  update public.auth_email_sync_jobs j
  set
    local_synced_generation = p_generation,
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

alter function public.mark_auth_email_local_synced(uuid, bigint, uuid)
owner to postgres;

revoke all
on function public.mark_auth_email_local_synced(uuid, bigint, uuid)
from public, anon, authenticated;
grant execute
on function public.mark_auth_email_local_synced(uuid, bigint, uuid)
to service_role;

create or replace function public.complete_auth_email_sync_job(
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
  if caller_role <> 'service_role' then
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
    stripe_synced_generation = p_generation,
    completion_reason = p_completion_reason,
    last_error_code = null,
    lease_token = null,
    lease_expires_at = null,
    completed_at = pg_catalog.now(),
    updated_at = pg_catalog.now()
  where j.user_id = p_user_id
    and j.generation = p_generation
    and j.status = 'processing'
    and j.lease_token = p_lease_token
    and j.lease_expires_at > pg_catalog.now()
    and (
      p_completion_reason = 'no_local_billing_relation'
      or j.local_synced_generation = p_generation
    );

  get diagnostics changed_rows = row_count;
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

create or replace function public.fail_auth_email_sync_job(
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
  if caller_role <> 'service_role' then
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
              secs => pg_catalog.least(
                pg_catalog.greatest(p_delay_seconds, 30),
                86400
              )
            )
      else j.next_attempt_at
    end,
    last_error_code = p_error_code,
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

-- Seed reconciliation for existing billing mappings without copying email PII.
-- New mappings enqueue through request_auth_email_reconciliation().
insert into public.auth_email_sync_jobs (user_id)
select c.user_id
from public.customers c
on conflict (user_id) do nothing;
