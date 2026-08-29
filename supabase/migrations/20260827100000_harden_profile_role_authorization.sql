-- Make the canonical FitLifeTool role server-controlled without repairing
-- invalid live values implicitly. The precondition intentionally aborts the
-- transaction before constraints or privileges change when drift exists.

do $$
begin
  if exists (
    select 1
    from public.profiles as p
    where p.role is null
       or p.role not in ('user', 'developer', 'admin', 'owner')
  ) then
    raise exception 'profiles.role contains values outside the approved role contract'
      using errcode = '23514';
  end if;
end
$$;

alter table public.profiles
  alter column role set default 'user',
  alter column role set not null;

alter table public.profiles
  drop constraint if exists profiles_role_allowed;

alter table public.profiles
  add constraint profiles_role_allowed
  check (role in ('user', 'developer', 'admin', 'owner'));

-- Remove broad client writes. Existing self-row RLS policies remain the row
-- boundary; column privileges below form the independent column boundary.
revoke insert, update on table public.profiles from public, anon, authenticated;

grant update (
  first_name,
  last_name,
  language,
  country_code,
  food_region,
  gender,
  birthdate,
  height_cm,
  weight_kg,
  calculation_sex,
  activity_level,
  goal,
  target_weight_kg,
  tdee,
  calorie_goal,
  activity_goal_kcal,
  water_goal_ml,
  bmi,
  updated_at
) on table public.profiles to authenticated;
