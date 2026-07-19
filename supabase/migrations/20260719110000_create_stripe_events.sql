-- Create the Stripe webhook idempotency log expected by app/lib/stripe/webhook.ts.
--
-- The webhook currently:
-- - checks whether an event was processed by selecting public.stripe_events.id;
-- - writes an event after successful handling with id and type;
-- - treats primary-key duplicates as already recorded events.

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  created_at timestamptz not null default now()
);

create index if not exists stripe_events_created_at_idx
on public.stripe_events (created_at);

alter table public.stripe_events enable row level security;
