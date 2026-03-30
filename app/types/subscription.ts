// types/subscription.ts

export type PlanFeatures = {
  has_ai_coach: boolean
  has_advanced_stats: boolean
  has_custom_goals: boolean
  has_health_sync: boolean
  has_export_data: boolean
  has_dark_mode: boolean
  has_badges: boolean

  has_full_food_database: boolean
  can_add_custom_foods: boolean
  can_import_foods: boolean

  has_training_schemas: boolean
}

export type PlanLimits = {
  max_favorite_drinks: number | null
  max_drink_combinations: number | null

  max_favorite_foods: number | null
  max_food_combinations: number | null
  max_food_products: number | null

  max_activity_types: number | null

  max_weight_history_days: number | null
  max_bmi_history_days: number | null

  max_active_goals: number | null
}