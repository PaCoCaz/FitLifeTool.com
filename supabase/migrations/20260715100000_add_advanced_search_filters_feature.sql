-- Add the explicit advanced search filter entitlement.
--
-- Canonical entitlement rule is unchanged:
-- - active/trialing subscriptions grant paid access
-- - highest active/trialing plan wins: free < premium < pro < coach
-- - no active/trialing subscription falls back to plan_config.free

alter table public.plan_config
add column if not exists has_advanced_search_filters boolean not null default false;

update public.plan_config
set has_advanced_search_filters = case
  when id in ('premium', 'pro', 'coach') then true
  else false
end
where id in ('free', 'premium', 'pro', 'coach');

drop function if exists public.get_user_plan_features(uuid);

create or replace function public.get_user_plan_features(
  p_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  with plan_priority(plan_id, priority) as (
    values
      ('free', 0),
      ('premium', 1),
      ('pro', 2),
      ('coach', 3)
  ),

  customer_row as (
    select c.id
    from public.customers c
    where c.user_id = p_user_id
    order by c.id
    limit 1
  ),

  eligible_plan as (
    select
      pc.id,
      pc.has_ai_coach,
      pc.has_advanced_search_filters,
      pc.has_advanced_stats,
      pc.has_custom_goals,
      pc.has_health_sync,
      pc.has_export_data,
      pc.has_dark_mode,
      pc.has_badges,
      pc.has_full_food_database,
      pc.can_add_custom_foods,
      pc.can_import_foods,
      pc.has_training_schemas,
      pc.max_favorite_drinks,
      pc.max_drink_combinations,
      pc.max_favorite_foods,
      pc.max_food_combinations,
      pc.max_food_products,
      pc.max_activity_types,
      pc.max_weight_history_days,
      pc.max_bmi_history_days,
      pc.max_active_goals
    from customer_row c
    join public.subscriptions s
      on s.customer_id = c.id
    join public.subscription_items si
      on si.subscription_id = s.id
    join public.price_plan_map ppm
      on ppm.price_id = si.price_id
    join public.plan_config pc
      on pc.id = ppm.plan_id
    join plan_priority pp
      on pp.plan_id = pc.id
    where s.status in ('active', 'trialing')
    order by
      pp.priority desc,
      s.created_at desc nulls last,
      s.id desc
    limit 1
  ),

  selected_plan as (
    select ep.*
    from eligible_plan ep

    union all

    select
      pc.id,
      pc.has_ai_coach,
      pc.has_advanced_search_filters,
      pc.has_advanced_stats,
      pc.has_custom_goals,
      pc.has_health_sync,
      pc.has_export_data,
      pc.has_dark_mode,
      pc.has_badges,
      pc.has_full_food_database,
      pc.can_add_custom_foods,
      pc.can_import_foods,
      pc.has_training_schemas,
      pc.max_favorite_drinks,
      pc.max_drink_combinations,
      pc.max_favorite_foods,
      pc.max_food_combinations,
      pc.max_food_products,
      pc.max_activity_types,
      pc.max_weight_history_days,
      pc.max_bmi_history_days,
      pc.max_active_goals
    from public.plan_config pc
    where pc.id = 'free'
      and not exists (
        select 1
        from eligible_plan
      )
    limit 1
  )

  select jsonb_build_object(
    'plan_id',
    sp.id,

    'features',
    jsonb_build_object(
      'has_ai_coach',
      coalesce(sp.has_ai_coach, false),

      'has_advanced_search_filters',
      coalesce(sp.has_advanced_search_filters, false),

      'has_advanced_stats',
      coalesce(sp.has_advanced_stats, false),

      'has_custom_goals',
      coalesce(sp.has_custom_goals, false),

      'has_health_sync',
      coalesce(sp.has_health_sync, false),

      'has_export_data',
      coalesce(sp.has_export_data, false),

      'has_dark_mode',
      coalesce(sp.has_dark_mode, false),

      'has_badges',
      coalesce(sp.has_badges, false),

      'has_full_food_database',
      coalesce(sp.has_full_food_database, false),

      'can_add_custom_foods',
      coalesce(sp.can_add_custom_foods, false),

      'can_import_foods',
      coalesce(sp.can_import_foods, false),

      'has_training_schemas',
      coalesce(sp.has_training_schemas, false)
    ),

    'limits',
    jsonb_build_object(
      'max_favorite_drinks',
      sp.max_favorite_drinks,

      'max_drink_combinations',
      sp.max_drink_combinations,

      'max_favorite_foods',
      sp.max_favorite_foods,

      'max_food_combinations',
      sp.max_food_combinations,

      'max_food_products',
      sp.max_food_products,

      'max_activity_types',
      sp.max_activity_types,

      'max_weight_history_days',
      sp.max_weight_history_days,

      'max_bmi_history_days',
      sp.max_bmi_history_days,

      'max_active_goals',
      sp.max_active_goals
    )
  )
  into result
  from selected_plan sp
  limit 1;

  if result is null then
    raise exception
      'Missing required plan_config.free row for get_user_plan_features';
  end if;

  return result;
end;
$$;

revoke all
on function public.get_user_plan_features(uuid)
from public;

grant execute
on function public.get_user_plan_features(uuid)
to authenticated, service_role;
