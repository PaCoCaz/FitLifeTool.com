-- Harden nutrition favorites for plan-limit locking.
--
-- Existing favorite rows are preserved. Locked state is not stored;
-- it is derived from plan limit + stable position.
--
-- Required existing columns:
-- - public.nutrition_favorites(id, user_id, product_key)
-- - public.nutrition_products(product_key, is_drink)

alter table public.nutrition_favorites
add column if not exists created_at timestamptz not null default now();

create unique index if not exists nutrition_favorites_user_product_key_key
on public.nutrition_favorites (user_id, product_key);

create index if not exists nutrition_favorites_user_created_id_idx
on public.nutrition_favorites (user_id, created_at, id);

create index if not exists nutrition_favorites_product_key_idx
on public.nutrition_favorites (product_key);
