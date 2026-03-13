# FitLifeTool Architecture

## Time

useDayNow.ts
→ bepaalt dagwissel
→ dayKey via getLocalDayKey

Dagwissel trigger:
dayKey change → DashboardStore refresh

## Store

DashboardStore.tsx

Haalt data via:
supabase.rpc("dashboard_day_summary")

State:

hydrationMl
hydrationGoalMl

nutritionKcal
calorieGoal

activityCalories
activityGoal

ready

## Flow

useDayNow
→ dayKey
→ DashboardStore refresh
→ scores
→ FitLifeScore
→ dashboard UI

## Scores

activityScore.ts
hydrationScore.ts
nutritionScore.ts
fitlifeScore.ts

FitLifeScore:

nutrition * 0.4
hydration * 0.3
activity * 0.3

## Reset

Geen reset in store
Geen reset in score

Reset = nieuwe dagKey → reload

## Providers

AuthProvider
LangProvider
GoalProvider
TimeProvider
ToastProvider
DashboardProvider