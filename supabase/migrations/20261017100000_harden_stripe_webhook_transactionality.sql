begin;

do $$
declare relation_name text;
begin
  foreach relation_name in array array[
    'public.stripe_events','public.customers','public.subscriptions',
    'public.subscription_items','public.products','public.prices',
    'public.price_plan_map','public.profiles'
  ] loop
    if pg_catalog.to_regclass(relation_name) is null then
      raise exception 'Required Stripe relation is missing: %', relation_name
        using errcode = '55000';
    end if;
  end loop;
  if pg_catalog.to_regprocedure(
    'public.establish_customer_mapping(uuid,text)'
  ) is null then
    raise exception 'Required customer mapping function is missing'
      using errcode = '55000';
  end if;
  if not exists (
    select 1 from pg_catalog.pg_indexes
    where schemaname='public' and tablename='customers'
      and indexdef ~* 'unique.*\(user_id\)'
  ) or not exists (
    select 1 from pg_catalog.pg_indexes
    where schemaname='public' and tablename='customers'
      and indexdef ~* 'unique.*\(stripe_customer_id\)'
  ) then
    raise exception 'Canonical customer uniqueness is missing'
      using errcode = '55000';
  end if;
end;
$$;

create sequence public.stripe_webhook_processing_generation_seq;

alter table public.stripe_events
  add column status text,
  add column attempt_count integer,
  add column processing_generation bigint,
  add column lease_token uuid,
  add column lease_expires_at timestamptz,
  add column next_retry_at timestamptz,
  add column completed_at timestamptz,
  add column last_failed_at timestamptz,
  add column last_error_code text,
  add column outcome_code text,
  add column stripe_created_at timestamptz,
  add column livemode boolean,
  add column payload_sha256 text;

update public.stripe_events
set status='completed',attempt_count=1,completed_at=created_at,
    outcome_code='historical';

alter table public.stripe_events
  alter column status set default 'processing',
  alter column status set not null,
  alter column attempt_count set default 1,
  alter column attempt_count set not null,
  add constraint stripe_events_status_check check (
    status in ('processing','completed','retryable','manual_review')
  ),
  add constraint stripe_events_attempt_count_check check (attempt_count >= 1),
  add constraint stripe_events_payload_sha256_check check (
    payload_sha256 is null or payload_sha256 ~ '^[0-9a-f]{64}$'
  ),
  add constraint stripe_events_lease_shape_check check (
    status <> 'processing' or (
      processing_generation is not null and lease_token is not null
      and lease_expires_at is not null
    )
  );

create index stripe_events_retry_idx on public.stripe_events(status,next_retry_at)
  where status='retryable';
create index stripe_events_lease_idx on public.stripe_events(lease_expires_at)
  where status='processing';
create index stripe_events_completed_idx on public.stripe_events(completed_at)
  where status='completed';

alter table public.subscriptions
  add column cancel_at_period_end boolean not null default false,
  add column last_webhook_generation bigint not null default 0,
  add column last_stripe_event_id text,
  add column last_stripe_event_created_at timestamptz;
alter table public.products
  add column last_webhook_generation bigint not null default 0,
  add column last_stripe_event_id text,
  add column last_stripe_event_created_at timestamptz;
alter table public.prices
  add column last_webhook_generation bigint not null default 0,
  add column last_stripe_event_id text,
  add column last_stripe_event_created_at timestamptz;

create function public.claim_stripe_webhook_event(
  p_event_id text,p_event_type text,p_stripe_created_at timestamptz,
  p_livemode boolean,p_payload_sha256 text,p_lease_token uuid,
  p_lease_seconds integer default 120
)
returns table(decision text,processing_generation bigint)
language plpgsql security definer set search_path='' as $$
declare event_row public.stripe_events%rowtype; new_generation bigint;
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe event claim is not authorized' using errcode='42501';
  end if;
  if p_event_id !~ '^evt_[A-Za-z0-9_]+$' or p_event_type is null
    or p_stripe_created_at is null or p_livemode is null
    or p_payload_sha256 !~ '^[0-9a-f]{64}$' or p_lease_token is null
    or p_lease_seconds not between 30 and 300 then
    raise exception 'Invalid Stripe event claim' using errcode='22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('stripe_event:' || p_event_id,0)
  );
  select e.* into event_row from public.stripe_events e
  where e.id=p_event_id for update;
  if not found then
    new_generation:=nextval('public.stripe_webhook_processing_generation_seq');
    insert into public.stripe_events(
      id,type,status,attempt_count,processing_generation,lease_token,
      lease_expires_at,stripe_created_at,livemode,payload_sha256
    ) values (
      p_event_id,p_event_type,'processing',1,new_generation,p_lease_token,
      pg_catalog.clock_timestamp()+pg_catalog.make_interval(secs=>p_lease_seconds),
      p_stripe_created_at,p_livemode,p_payload_sha256
    );
    return query select 'acquired'::text,new_generation; return;
  end if;
  if event_row.type is distinct from p_event_type
    or event_row.stripe_created_at is distinct from p_stripe_created_at
    or event_row.livemode is distinct from p_livemode
    or event_row.payload_sha256 is distinct from p_payload_sha256 then
    update public.stripe_events set status='manual_review',lease_token=null,
      lease_expires_at=null,next_retry_at=null,
      last_failed_at=pg_catalog.clock_timestamp(),
      last_error_code='METADATA_CONFLICT' where id=p_event_id;
    return query select 'metadata_conflict'::text,null::bigint; return;
  end if;
  if event_row.status='completed' then
    return query select 'duplicate_completed'::text,event_row.processing_generation;
    return;
  elsif event_row.status='manual_review' then
    return query select 'manual_review'::text,null::bigint; return;
  elsif event_row.status='processing'
    and event_row.lease_expires_at>pg_catalog.clock_timestamp() then
    return query select 'busy'::text,event_row.processing_generation; return;
  elsif event_row.status='retryable'
    and event_row.next_retry_at>pg_catalog.clock_timestamp() then
    return query select 'retry_later'::text,event_row.processing_generation; return;
  end if;
  new_generation:=nextval('public.stripe_webhook_processing_generation_seq');
  update public.stripe_events set status='processing',
    attempt_count=attempt_count+1,processing_generation=new_generation,
    lease_token=p_lease_token,
    lease_expires_at=pg_catalog.clock_timestamp()+
      pg_catalog.make_interval(secs=>p_lease_seconds),
    next_retry_at=null,last_error_code=null where id=p_event_id;
  return query select 'acquired'::text,new_generation;
end; $$;

create function public.claim_recoverable_stripe_webhook_event(
  p_lease_token uuid,p_lease_seconds integer default 120
)
returns table(event_id text,event_type text,stripe_created_at timestamptz,
  livemode boolean,processing_generation bigint,lease_token uuid)
language plpgsql security definer set search_path='' as $$
declare candidate public.stripe_events%rowtype; new_generation bigint;
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe recovery claim is not authorized' using errcode='42501';
  end if;
  if p_lease_token is null or p_lease_seconds not between 30 and 300 then
    raise exception 'Invalid Stripe recovery claim' using errcode='22023';
  end if;
  select e.* into candidate from public.stripe_events e
  where (e.status='processing' and e.lease_expires_at<=pg_catalog.clock_timestamp())
     or (e.status='retryable' and e.next_retry_at<=pg_catalog.clock_timestamp())
  order by coalesce(e.next_retry_at,e.lease_expires_at),e.created_at,e.id
  for update skip locked limit 1;
  if not found then return; end if;
  new_generation:=nextval('public.stripe_webhook_processing_generation_seq');
  update public.stripe_events set status='processing',
    attempt_count=attempt_count+1,processing_generation=new_generation,
    lease_token=p_lease_token,
    lease_expires_at=pg_catalog.clock_timestamp()+
      pg_catalog.make_interval(secs=>p_lease_seconds),
    next_retry_at=null,last_error_code=null where id=candidate.id;
  return query select candidate.id,candidate.type,candidate.stripe_created_at,
    candidate.livemode,new_generation,p_lease_token;
end; $$;

create function public.fail_stripe_webhook_event(
  p_event_id text,p_generation bigint,p_lease_token uuid,
  p_retryable boolean,p_error_code text,p_retry_after_seconds integer default 60
)
returns text language plpgsql security definer set search_path='' as $$
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe event failure is not authorized' using errcode='42501';
  end if;
  if p_error_code not in ('PROCESSING_FAILED','INVARIANT_FAILED')
    or p_retry_after_seconds not between 0 and 3600 then
    raise exception 'Invalid Stripe failure transition' using errcode='22023';
  end if;
  update public.stripe_events set
    status=case when p_retryable then 'retryable' else 'manual_review' end,
    lease_token=null,lease_expires_at=null,
    next_retry_at=case when p_retryable then pg_catalog.clock_timestamp()+
      pg_catalog.make_interval(secs=>p_retry_after_seconds) else null end,
    last_failed_at=pg_catalog.clock_timestamp(),last_error_code=p_error_code
  where id=p_event_id and status='processing'
    and processing_generation=p_generation and lease_token=p_lease_token;
  return case when found then 'failed' else 'stale_ignored' end;
end; $$;

create function public.complete_stripe_webhook_event(
  p_event_id text,p_generation bigint,p_lease_token uuid,p_outcome_code text
)
returns text language plpgsql security definer set search_path='' as $$
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe event completion is not authorized' using errcode='42501';
  end if;
  if p_outcome_code not in ('applied','stale_ignored','unhandled') then
    raise exception 'Invalid Stripe event outcome' using errcode='22023';
  end if;
  update public.stripe_events set status='completed',
    completed_at=pg_catalog.clock_timestamp(),outcome_code=p_outcome_code,
    lease_token=null,lease_expires_at=null,next_retry_at=null,last_error_code=null
  where id=p_event_id and status='processing'
    and processing_generation=p_generation and lease_token=p_lease_token;
  return case when found then 'completed' else 'stale_ignored' end;
end; $$;

create function public.reconcile_stripe_customer_entitlements(
  p_stripe_customer_id text
)
returns text language plpgsql security definer set search_path='' as $$
declare customer_row public.customers%rowtype; selected_plan text;
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe entitlement reconciliation is not authorized'
      using errcode='42501';
  end if;
  select c.* into customer_row from public.customers c
  where c.stripe_customer_id=p_stripe_customer_id for update;
  if not found then return 'customer_missing'; end if;
  if customer_row.user_id is null then return 'unbound'; end if;
  select candidate.plan_id into selected_plan from (
    select ppm.plan_id,s.status,s.current_period_end,s.id,
      case ppm.plan_id when 'coach' then 3 when 'pro' then 2
        when 'premium' then 1 else 0 end plan_priority,
      case s.status when 'active' then 1 else 0 end status_priority
    from public.subscriptions s
    join public.subscription_items si on si.subscription_id=s.id
    join public.price_plan_map ppm on ppm.price_id=si.price_id
    where s.customer_id=customer_row.id
      and s.status in ('active','trialing')
      and ppm.plan_id in ('premium','pro','coach')
    order by plan_priority desc,status_priority desc,
      s.current_period_end desc nulls last,s.id asc limit 1
  ) candidate;
  update public.profiles set abonnement=coalesce(selected_plan,'free')
  where id=customer_row.user_id;
  if not found then raise exception 'Mapped profile is missing' using errcode='23503'; end if;
  return coalesce(selected_plan,'free');
end; $$;

create function public.apply_stripe_subscription_snapshot(
  p_event_id text,p_generation bigint,p_lease_token uuid,
  p_stripe_event_created_at timestamptz,p_snapshot_is_current boolean,
  p_subscription_id text,p_stripe_customer_id text,p_status text,
  p_current_period_start timestamptz,p_current_period_end timestamptz,
  p_cancel_at timestamptz,p_canceled_at timestamptz,
  p_trial_start timestamptz,p_trial_end timestamptz,
  p_cancel_at_period_end boolean,p_items jsonb
)
returns text language plpgsql security definer set search_path='' as $$
declare event_row public.stripe_events%rowtype;
  customer_row public.customers%rowtype;
  subscription_row public.subscriptions%rowtype; is_stale boolean:=false;
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe subscription apply is not authorized' using errcode='42501';
  end if;
  if p_subscription_id !~ '^sub_[A-Za-z0-9_]+$'
    or p_stripe_customer_id !~ '^cus_[A-Za-z0-9_]+$'
    or p_status is null or p_items is null or jsonb_typeof(p_items)<>'array' then
    raise exception 'Invalid Stripe subscription snapshot' using errcode='22023';
  end if;
  select e.* into event_row from public.stripe_events e where e.id=p_event_id for update;
  if not found or event_row.status<>'processing'
    or event_row.processing_generation<>p_generation
    or event_row.lease_token<>p_lease_token then
    raise exception 'Stale Stripe event lease' using errcode='40001';
  end if;
  insert into public.customers(stripe_customer_id) values(p_stripe_customer_id)
  on conflict(stripe_customer_id) do nothing;
  select c.* into customer_row from public.customers c
  where c.stripe_customer_id=p_stripe_customer_id for update;
  select s.* into subscription_row from public.subscriptions s
  where s.id=p_subscription_id for update;
  if found then
    is_stale:=subscription_row.last_webhook_generation>p_generation
      or (not p_snapshot_is_current
        and subscription_row.last_stripe_event_created_at is not null
        and (subscription_row.last_stripe_event_created_at,
             coalesce(subscription_row.last_stripe_event_id,''))
          >(p_stripe_event_created_at,p_event_id));
  end if;
  if is_stale then
    perform public.complete_stripe_webhook_event(
      p_event_id,p_generation,p_lease_token,'stale_ignored');
    return 'stale_ignored';
  end if;
  insert into public.subscriptions(
    id,customer_id,status,current_period_start,current_period_end,
    cancel_at,canceled_at,trial_start,trial_end,metadata,
    cancel_at_period_end,last_webhook_generation,
    last_stripe_event_id,last_stripe_event_created_at
  ) values(
    p_subscription_id,customer_row.id,p_status,p_current_period_start,
    p_current_period_end,p_cancel_at,p_canceled_at,p_trial_start,p_trial_end,
    '{}'::jsonb,p_cancel_at_period_end,p_generation,p_event_id,
    p_stripe_event_created_at
  ) on conflict(id) do update set customer_id=excluded.customer_id,
    status=excluded.status,current_period_start=excluded.current_period_start,
    current_period_end=excluded.current_period_end,cancel_at=excluded.cancel_at,
    canceled_at=excluded.canceled_at,trial_start=excluded.trial_start,
    trial_end=excluded.trial_end,
    cancel_at_period_end=excluded.cancel_at_period_end,
    last_webhook_generation=excluded.last_webhook_generation,
    last_stripe_event_id=excluded.last_stripe_event_id,
    last_stripe_event_created_at=coalesce(
      greatest(public.subscriptions.last_stripe_event_created_at,
        excluded.last_stripe_event_created_at),
      public.subscriptions.last_stripe_event_created_at,
      excluded.last_stripe_event_created_at);
  insert into public.subscription_items(id,subscription_id,price_id,quantity)
  select item.id,p_subscription_id,item.price_id,item.quantity
  from jsonb_to_recordset(p_items) item(id text,price_id text,quantity integer)
  where item.id is not null and item.price_id is not null
  on conflict(id) do update set subscription_id=excluded.subscription_id,
    price_id=excluded.price_id,quantity=excluded.quantity;
  delete from public.subscription_items si
  where si.subscription_id=p_subscription_id and not exists(
    select 1 from jsonb_to_recordset(p_items) item(id text) where item.id=si.id
  );
  perform public.reconcile_stripe_customer_entitlements(p_stripe_customer_id);
  perform public.complete_stripe_webhook_event(
    p_event_id,p_generation,p_lease_token,'applied');
  return 'applied';
end; $$;

create function public.apply_stripe_product_snapshot(
  p_event_id text,p_generation bigint,p_lease_token uuid,
  p_stripe_event_created_at timestamptz,p_product_id text,p_name text,p_active boolean
)
returns text language plpgsql security definer set search_path='' as $$
declare existing public.products%rowtype;
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe product apply is not authorized' using errcode='42501'; end if;
  perform 1 from public.stripe_events where id=p_event_id and status='processing'
    and processing_generation=p_generation and lease_token=p_lease_token for update;
  if not found then raise exception 'Stale Stripe event lease' using errcode='40001'; end if;
  select p.* into existing from public.products p where p.id=p_product_id for update;
  if found and (existing.last_stripe_event_created_at,
      coalesce(existing.last_stripe_event_id,''))>(p_stripe_event_created_at,p_event_id) then
    perform public.complete_stripe_webhook_event(p_event_id,p_generation,p_lease_token,'stale_ignored');
    return 'stale_ignored'; end if;
  insert into public.products(id,name,active,metadata,last_webhook_generation,
    last_stripe_event_id,last_stripe_event_created_at)
  values(p_product_id,p_name,p_active,'{}',p_generation,p_event_id,p_stripe_event_created_at)
  on conflict(id) do update set name=excluded.name,active=excluded.active,
    last_webhook_generation=excluded.last_webhook_generation,
    last_stripe_event_id=excluded.last_stripe_event_id,
    last_stripe_event_created_at=excluded.last_stripe_event_created_at;
  perform public.complete_stripe_webhook_event(p_event_id,p_generation,p_lease_token,'applied');
  return 'applied';
end; $$;

create function public.apply_stripe_price_snapshot(
  p_event_id text,p_generation bigint,p_lease_token uuid,
  p_stripe_event_created_at timestamptz,p_price_id text,p_product_id text,
  p_unit_amount bigint,p_currency text,p_interval text,
  p_interval_count integer,p_active boolean
)
returns text language plpgsql security definer set search_path='' as $$
declare existing public.prices%rowtype;
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe price apply is not authorized' using errcode='42501'; end if;
  perform 1 from public.stripe_events where id=p_event_id and status='processing'
    and processing_generation=p_generation and lease_token=p_lease_token for update;
  if not found then raise exception 'Stale Stripe event lease' using errcode='40001'; end if;
  select p.* into existing from public.prices p where p.id=p_price_id for update;
  if found and (existing.last_stripe_event_created_at,
      coalesce(existing.last_stripe_event_id,''))>(p_stripe_event_created_at,p_event_id) then
    perform public.complete_stripe_webhook_event(p_event_id,p_generation,p_lease_token,'stale_ignored');
    return 'stale_ignored'; end if;
  insert into public.prices(id,product_id,unit_amount,currency,interval,interval_count,
    active,metadata,last_webhook_generation,last_stripe_event_id,last_stripe_event_created_at)
  values(p_price_id,p_product_id,p_unit_amount,p_currency,p_interval,p_interval_count,
    p_active,'{}',p_generation,p_event_id,p_stripe_event_created_at)
  on conflict(id) do update set product_id=excluded.product_id,
    unit_amount=excluded.unit_amount,currency=excluded.currency,
    interval=excluded.interval,interval_count=excluded.interval_count,
    active=excluded.active,last_webhook_generation=excluded.last_webhook_generation,
    last_stripe_event_id=excluded.last_stripe_event_id,
    last_stripe_event_created_at=excluded.last_stripe_event_created_at;
  perform public.complete_stripe_webhook_event(p_event_id,p_generation,p_lease_token,'applied');
  return 'applied';
end; $$;

create function public.apply_stripe_customer_snapshot(
  p_event_id text,p_generation bigint,p_lease_token uuid,p_stripe_customer_id text
)
returns text language plpgsql security definer set search_path='' as $$
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe customer apply is not authorized' using errcode='42501'; end if;
  perform 1 from public.stripe_events where id=p_event_id and status='processing'
    and processing_generation=p_generation and lease_token=p_lease_token for update;
  if not found then raise exception 'Stale Stripe event lease' using errcode='40001'; end if;
  insert into public.customers(stripe_customer_id) values(p_stripe_customer_id)
  on conflict(stripe_customer_id) do nothing;
  perform public.complete_stripe_webhook_event(p_event_id,p_generation,p_lease_token,'applied');
  return 'applied';
end; $$;

create function public.apply_stripe_checkout_mapping(
  p_event_id text,p_generation bigint,p_lease_token uuid,
  p_user_id uuid,p_stripe_customer_id text
)
returns text language plpgsql security definer set search_path='' as $$
declare mapping_result text;
begin
  if (auth.jwt()->>'role') is distinct from 'service_role' then
    raise exception 'Stripe checkout apply is not authorized' using errcode='42501'; end if;
  perform 1 from public.stripe_events where id=p_event_id and status='processing'
    and processing_generation=p_generation and lease_token=p_lease_token for update;
  if not found then raise exception 'Stale Stripe event lease' using errcode='40001'; end if;
  mapping_result:=public.establish_customer_mapping(p_user_id,p_stripe_customer_id);
  perform public.reconcile_stripe_customer_entitlements(p_stripe_customer_id);
  perform public.complete_stripe_webhook_event(p_event_id,p_generation,p_lease_token,'applied');
  return mapping_result;
end; $$;

alter table public.stripe_events enable row level security;
revoke all on table public.stripe_events from public,anon,authenticated;
revoke all on sequence public.stripe_webhook_processing_generation_seq
  from public,anon,authenticated,service_role;

do $$
declare fn regprocedure;
begin
  foreach fn in array array[
    'public.claim_stripe_webhook_event(text,text,timestamptz,boolean,text,uuid,integer)'::regprocedure,
    'public.claim_recoverable_stripe_webhook_event(uuid,integer)'::regprocedure,
    'public.fail_stripe_webhook_event(text,bigint,uuid,boolean,text,integer)'::regprocedure,
    'public.complete_stripe_webhook_event(text,bigint,uuid,text)'::regprocedure,
    'public.reconcile_stripe_customer_entitlements(text)'::regprocedure,
    'public.apply_stripe_subscription_snapshot(text,bigint,uuid,timestamptz,boolean,text,text,text,timestamptz,timestamptz,timestamptz,timestamptz,timestamptz,timestamptz,boolean,jsonb)'::regprocedure,
    'public.apply_stripe_product_snapshot(text,bigint,uuid,timestamptz,text,text,boolean)'::regprocedure,
    'public.apply_stripe_price_snapshot(text,bigint,uuid,timestamptz,text,text,bigint,text,text,integer,boolean)'::regprocedure,
    'public.apply_stripe_customer_snapshot(text,bigint,uuid,text)'::regprocedure,
    'public.apply_stripe_checkout_mapping(text,bigint,uuid,uuid,text)'::regprocedure
  ] loop
    execute format('alter function %s owner to postgres',fn);
    execute format('revoke all on function %s from public,anon,authenticated',fn);
    execute format('grant execute on function %s to service_role',fn);
  end loop;
end;
$$;

commit;
