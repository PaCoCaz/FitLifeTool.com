begin;

do $preconditions$
declare
  required_profile_columns constant text[] := array[
    'id', 'gender', 'birthdate', 'height_cm', 'weight_kg',
    'calculation_sex', 'activity_level', 'country_code', 'food_region',
    'goal', 'tdee', 'calorie_goal', 'water_goal_ml',
    'activity_goal_kcal', 'goals_last_calculated_on',
    'goals_calculated_for_weight', 'updated_at'
  ];
  required_goal_columns constant text[] := array[
    'id', 'user_id', 'goal_key', 'start_at', 'end_at'
  ];
  column_name text;
begin
  if pg_catalog.to_regclass('public.profiles') is null
     or pg_catalog.to_regclass('public.user_goal_periods') is null
     or pg_catalog.to_regclass('public.countries') is null then
    raise exception 'AUTH_JOURNEY_04E_SCHEMA_PRECONDITION_FAILED';
  end if;

  foreach column_name in array required_profile_columns loop
    if not exists (
      select 1
      from information_schema.columns as c
      where c.table_schema = 'public'
        and c.table_name = 'profiles'
        and c.column_name = column_name
    ) then
      raise exception 'AUTH_JOURNEY_04E_PROFILE_COLUMN_PRECONDITION_FAILED';
    end if;
  end loop;

  foreach column_name in array required_goal_columns loop
    if not exists (
      select 1
      from information_schema.columns as c
      where c.table_schema = 'public'
        and c.table_name = 'user_goal_periods'
        and c.column_name = column_name
    ) then
      raise exception 'AUTH_JOURNEY_04E_GOAL_COLUMN_PRECONDITION_FAILED';
    end if;
  end loop;

  if not exists (
    select 1
    from information_schema.columns as c
    where c.table_schema = 'public'
      and c.table_name = 'countries'
      and c.column_name in ('country_code', 'is_active')
    group by c.table_schema, c.table_name
    having pg_catalog.count(*) = 2
  ) then
    raise exception 'AUTH_JOURNEY_04E_COUNTRY_COLUMN_PRECONDITION_FAILED';
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_constraint as constraint_record
    where constraint_record.conrelid = 'public.user_goal_periods'::pg_catalog.regclass
      and constraint_record.contype = 'x'
      and pg_catalog.pg_get_constraintdef(constraint_record.oid) ilike '%user_id%'
      and pg_catalog.pg_get_constraintdef(constraint_record.oid) ilike '%start_at%'
      and pg_catalog.pg_get_constraintdef(constraint_record.oid) ilike '%end_at%'
  ) then
    raise exception 'AUTH_JOURNEY_04E_GOAL_EXCLUSION_PRECONDITION_FAILED';
  end if;

  if pg_catalog.to_regprocedure('public.recalculate_user_targets(uuid)') is null
     or pg_catalog.to_regprocedure('public.trigger_recalculate_targets()') is null then
    raise exception 'AUTH_JOURNEY_04E_RECALCULATION_PRECONDITION_FAILED';
  end if;

  if (
    select pg_catalog.count(*)
    from pg_catalog.pg_proc as procedure_record
    join pg_catalog.pg_namespace as namespace_record
      on namespace_record.oid = procedure_record.pronamespace
    where namespace_record.nspname = 'public'
      and procedure_record.proname = 'recalculate_user_targets'
  ) <> 1
     or (
       select pg_catalog.count(*)
       from pg_catalog.pg_proc as procedure_record
       join pg_catalog.pg_namespace as namespace_record
         on namespace_record.oid = procedure_record.pronamespace
       where namespace_record.nspname = 'public'
         and procedure_record.proname = 'trigger_recalculate_targets'
     ) <> 1 then
    raise exception 'AUTH_JOURNEY_04E_FUNCTION_OVERLOAD_PRECONDITION_FAILED';
  end if;

  if exists (
    select 1
    from pg_catalog.pg_proc as procedure_record
    where procedure_record.oid = 'public.recalculate_user_targets(uuid)'::pg_catalog.regprocedure
      and (
        procedure_record.prorettype <> 'pg_catalog.void'::pg_catalog.regtype
        or procedure_record.prosecdef
      )
  ) then
    raise exception 'AUTH_JOURNEY_04E_RECALCULATION_SIGNATURE_PRECONDITION_FAILED';
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_trigger as trigger_record
    where trigger_record.tgrelid = 'public.profiles'::pg_catalog.regclass
      and trigger_record.tgname = 'recalc_targets_on_profile_update'
      and not trigger_record.tgisinternal
      and trigger_record.tgfoid = 'public.trigger_recalculate_targets()'::pg_catalog.regprocedure
      and pg_catalog.pg_get_triggerdef(trigger_record.oid) ilike '%after update of weight_kg, activity_level%'
  ) then
    raise exception 'AUTH_JOURNEY_04E_TRIGGER_PRECONDITION_FAILED';
  end if;

  if exists (
    select 1
    from pg_catalog.pg_proc as procedure_record
    join pg_catalog.pg_namespace as namespace_record
      on namespace_record.oid = procedure_record.pronamespace
    where namespace_record.nspname = 'public'
      and procedure_record.proname in (
        'recalculate_user_targets_internal',
        'complete_user_onboarding'
      )
  ) then
    raise exception 'AUTH_JOURNEY_04E_FUNCTION_COLLISION';
  end if;
end
$preconditions$;

create function public.recalculate_user_targets_internal(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  profile_birthdate date;
  profile_height_cm numeric;
  profile_weight_kg numeric;
  profile_calculation_sex text;
  profile_activity_level text;
  active_goal_count integer;
  active_goal_key text;
  calculated_age integer;
  calculated_bmr numeric;
  calculated_tdee numeric;
  calculated_calorie_goal numeric;
  calculated_activity_goal numeric;
  minimum_calorie_goal integer;
begin
  select
    profile.birthdate,
    profile.height_cm,
    profile.weight_kg,
    profile.calculation_sex,
    profile.activity_level
  into
    profile_birthdate,
    profile_height_cm,
    profile_weight_kg,
    profile_calculation_sex,
    profile_activity_level
  from public.profiles as profile
  where profile.id = p_user_id
  for update;

  if not found
     or profile_birthdate is null
     or profile_height_cm is null
     or profile_height_cm::text = 'NaN'
     or profile_height_cm <= 0
     or profile_weight_kg is null
     or profile_weight_kg::text = 'NaN'
     or profile_weight_kg <= 0
     or profile_calculation_sex is null
     or profile_calculation_sex not in ('male', 'female')
     or profile_activity_level is null
     or profile_activity_level not in (
       'sedentary', 'light', 'moderate', 'active', 'very_active'
     ) then
    raise exception 'TARGET_RECALCULATION_PREREQUISITE_FAILED';
  end if;

  select pg_catalog.count(*)
  into active_goal_count
  from public.user_goal_periods as goal_period
  where goal_period.user_id = p_user_id
    and goal_period.end_at is null;

  if active_goal_count <> 1 then
    raise exception 'TARGET_RECALCULATION_ACTIVE_GOAL_FAILED';
  end if;

  select goal_period.goal_key
  into active_goal_key
  from public.user_goal_periods as goal_period
  where goal_period.user_id = p_user_id
    and goal_period.end_at is null
  for update;

  if active_goal_key is null
     or active_goal_key not in ('LOSE', 'MAINTAIN', 'GAIN', 'HOLIDAY') then
    raise exception 'TARGET_RECALCULATION_ACTIVE_GOAL_FAILED';
  end if;

  calculated_age := pg_catalog.date_part(
    'year',
    pg_catalog.age(current_date, profile_birthdate)
  )::integer;

  calculated_bmr :=
    (10 * profile_weight_kg)
    + (6.25 * profile_height_cm)
    - (5 * calculated_age)
    + case profile_calculation_sex when 'male' then 5 else -161 end;

  calculated_tdee := calculated_bmr * case profile_activity_level
    when 'sedentary' then 1.15
    when 'light' then 1.25
    when 'moderate' then 1.35
    when 'active' then 1.45
    when 'very_active' then 1.55
  end;

  minimum_calorie_goal := case profile_calculation_sex
    when 'male' then 1600
    else 1200
  end;

  calculated_calorie_goal := pg_catalog.greatest(
    minimum_calorie_goal,
    pg_catalog.round(
      calculated_tdee + case active_goal_key
        when 'LOSE' then -400
        when 'GAIN' then 400
        else 0
      end
    )
  );

  calculated_activity_goal := pg_catalog.round(
    pg_catalog.least(
      900,
      pg_catalog.greatest(250, calculated_tdee * 0.20)
    )
  );

  update public.profiles as profile
  set
    tdee = pg_catalog.round(calculated_tdee),
    calorie_goal = calculated_calorie_goal,
    water_goal_ml = pg_catalog.round(profile_weight_kg * 35),
    activity_goal_kcal = calculated_activity_goal,
    goals_last_calculated_on = current_date,
    goals_calculated_for_weight = profile_weight_kg,
    goal = active_goal_key
  where profile.id = p_user_id;
end
$function$;

alter function public.recalculate_user_targets_internal(uuid) owner to postgres;
revoke all on function public.recalculate_user_targets_internal(uuid)
  from public, anon, authenticated, service_role;

create or replace function public.recalculate_user_targets(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  caller_user_id uuid := auth.uid();
  caller_role text := auth.jwt() ->> 'role';
begin
  if caller_role = 'authenticated' and caller_user_id = p_user_id then
    perform public.recalculate_user_targets_internal(p_user_id);
    return;
  end if;

  if caller_role = 'service_role' then
    perform public.recalculate_user_targets_internal(p_user_id);
    return;
  end if;

  raise exception using
    errcode = '42501',
    message = 'insufficient_privilege';
end
$function$;

alter function public.recalculate_user_targets(uuid) owner to postgres;
revoke all on function public.recalculate_user_targets(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.recalculate_user_targets(uuid)
  to authenticated, service_role;

create or replace function public.trigger_recalculate_targets()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if not exists (
    select 1
    from public.user_goal_periods as goal_period
    where goal_period.user_id = new.id
      and goal_period.end_at is null
  ) then
    return new;
  end if;

  perform public.recalculate_user_targets_internal(new.id);
  return new;
end
$function$;

alter function public.trigger_recalculate_targets() owner to postgres;
revoke all on function public.trigger_recalculate_targets()
  from public, anon, authenticated, service_role;

create function public.complete_user_onboarding(
  p_activity_level text,
  p_goal text
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  caller_user_id uuid := auth.uid();
  caller_role text := auth.jwt() ->> 'role';
  profile_row public.profiles%rowtype;
  active_goal_count integer;
  active_goal_id uuid;
  active_goal_key text;
  already_complete boolean;
  targets_ready boolean;
begin
  if caller_role is distinct from 'authenticated'
     or caller_user_id is null then
    raise exception using
      errcode = '42501',
      message = 'insufficient_privilege';
  end if;

  if p_activity_level is null
     or p_activity_level not in (
    'sedentary', 'light', 'moderate', 'active', 'very_active'
  )
     or p_goal is null
     or p_goal not in ('LOSE', 'MAINTAIN', 'GAIN') then
    return 'INVALID_INPUT';
  end if;

  select profile.*
  into profile_row
  from public.profiles as profile
  where profile.id = caller_user_id
  for update;

  if not found
     or profile_row.gender is null
     or profile_row.gender not in ('male', 'female', 'other')
     or profile_row.birthdate is null
     or profile_row.birthdate > current_date
     or profile_row.height_cm is null
     or profile_row.height_cm::text = 'NaN'
     or profile_row.height_cm <= 0
     or profile_row.weight_kg is null
     or profile_row.weight_kg::text = 'NaN'
     or profile_row.weight_kg <= 0
     or profile_row.calculation_sex is null
     or profile_row.calculation_sex not in ('male', 'female')
     or profile_row.country_code is null
     or profile_row.food_region is null
     or not exists (
       select 1
       from public.countries as country
       where country.country_code = profile_row.country_code
         and country.is_active = true
     )
     or not exists (
       select 1
       from public.countries as food_region
       where food_region.country_code = profile_row.food_region
         and food_region.is_active = true
     ) then
    return 'PREREQUISITE_INCOMPLETE';
  end if;

  select pg_catalog.count(*)
  into active_goal_count
  from public.user_goal_periods as goal_period
  where goal_period.user_id = caller_user_id
    and goal_period.end_at is null;

  if active_goal_count > 1 then
    return 'STATE_CONFLICT';
  end if;

  if active_goal_count = 1 then
    select goal_period.id, goal_period.goal_key
    into active_goal_id, active_goal_key
    from public.user_goal_periods as goal_period
    where goal_period.user_id = caller_user_id
      and goal_period.end_at is null
    for update;
  end if;

  already_complete :=
    profile_row.activity_level is not null and active_goal_count = 1;

  if already_complete
     and (
       profile_row.activity_level <> p_activity_level
       or active_goal_key <> p_goal
     ) then
    return 'STATE_CONFLICT';
  end if;

  targets_ready :=
    profile_row.tdee is not null
    and profile_row.calorie_goal is not null
    and profile_row.water_goal_ml is not null
    and profile_row.activity_goal_kcal is not null
    and profile_row.goals_last_calculated_on is not null
    and profile_row.goals_calculated_for_weight is not distinct from profile_row.weight_kg
    and profile_row.goal = active_goal_key;

  if already_complete and targets_ready then
    return 'ALREADY_COMPLETE';
  end if;

  if active_goal_count = 0 then
    insert into public.user_goal_periods (
      user_id,
      goal_key,
      start_at,
      end_at
    ) values (
      caller_user_id,
      p_goal,
      pg_catalog.transaction_timestamp(),
      null
    );
  elsif active_goal_key <> p_goal then
    update public.user_goal_periods as goal_period
    set goal_key = p_goal
    where goal_period.id = active_goal_id
      and goal_period.user_id = caller_user_id
      and goal_period.end_at is null;
  end if;

  update public.profiles as profile
  set
    activity_level = p_activity_level,
    goal = p_goal,
    updated_at = pg_catalog.transaction_timestamp()
  where profile.id = caller_user_id;

  select
    profile.tdee is not null
    and profile.calorie_goal is not null
    and profile.water_goal_ml is not null
    and profile.activity_goal_kcal is not null
    and profile.goals_last_calculated_on is not null
    and profile.goals_calculated_for_weight is not distinct from profile.weight_kg
    and profile.goal = p_goal
  into targets_ready
  from public.profiles as profile
  where profile.id = caller_user_id;

  if not pg_catalog.coalesce(targets_ready, false) then
    raise exception 'ONBOARDING_TARGET_CALCULATION_FAILED';
  end if;

  return 'COMPLETED';
end
$function$;

alter function public.complete_user_onboarding(text, text) owner to postgres;
revoke all on function public.complete_user_onboarding(text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.complete_user_onboarding(text, text)
  to authenticated;

commit;
