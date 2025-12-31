"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import {
  calculateAge,
  calculateBMR,
  activityMultiplier,
  adjustForGoal,
  calculateWaterGoal,
  calculateBMI,
  calculateActivityGoal,
} from "../../lib/calculations";

/* ───────────────── Types ───────────────── */

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

type Goal = "lose_weight" | "maintain" | "gain_weight";

type ProfileForCalculation = {
  birthdate: string;
  height_cm: number;
  weight_kg: number;
  calculation_sex: "male" | "female";
  activity_level: ActivityLevel;
  goal: Goal;
};

/* ───────────────── Component ───────────────── */

export default function OnboardingStep3() {
  const router = useRouter();
  const { user, loading } = useUser();

  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel | "">("");
  const [goal, setGoal] = useState<Goal | "">("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/register");
    }
  }, [user, loading, router]);

  const handleFinish = async () => {
    if (!activityLevel || !goal) {
      setError("Kies je activiteitsniveau en doel");
      return;
    }

    if (!user) return;

    setSaving(true);
    setError(null);

    /* 1️⃣ Activiteitsniveau + doel opslaan */
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        activity_level: activityLevel,
        goal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    /* 2️⃣ Profiel ophalen voor berekeningen */
    const {
      data: profile,
      error: profileError,
    }: {
      data: ProfileForCalculation | null;
      error: { message: string } | null;
    } = await supabase
      .from("profiles")
      .select(`
        birthdate,
        height_cm,
        weight_kg,
        calculation_sex,
        activity_level,
        goal
      `)
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      setError("Kon profiel niet laden voor berekening");
      setSaving(false);
      return;
    }

    /* 3️⃣ Berekeningen */
    const age = calculateAge(profile.birthdate);

    const bmr = calculateBMR(
      profile.calculation_sex,
      profile.weight_kg,
      profile.height_cm,
      age
    );

    const tdee =
      bmr * activityMultiplier(profile.activity_level);

    const calorieGoal = Math.round(
      adjustForGoal(tdee, profile.goal)
    );

    const activityGoal = calculateActivityGoal(
      tdee,
      profile.goal
    );

    const waterGoal = calculateWaterGoal(profile.weight_kg);

    const bmi = calculateBMI(
      profile.weight_kg,
      profile.height_cm
    );

    /* 4️⃣ Doelen opslaan */
    const { error: goalsError } = await supabase
      .from("profiles")
      .update({
        calorie_goal: calorieGoal,
        activity_goal_kcal: activityGoal,
        water_goal_ml: waterGoal,
        bmi,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (goalsError) {
      setError(goalsError.message);
      setSaving(false);
      return;
    }

    router.replace("/dashboard");
  };

  if (loading || !user) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-2 text-lg font-semibold text-[#191970]">
          Je doelen
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Op basis hiervan stellen we je persoonlijke dagdoelen in.
        </p>

        <div className="space-y-4">
          {/* Activiteitsniveau */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Activiteitsniveau
            </label>
            <select
              value={activityLevel}
              onChange={(e) =>
                setActivityLevel(
                  e.target.value as ActivityLevel
                )
              }
              className="w-full rounded border px-3 py-2 text-base"
            >
              <option value="">Selecteer</option>
              <option value="sedentary">
                Weinig tot geen beweging
              </option>
              <option value="light">
                Licht actief (1–3× per week)
              </option>
              <option value="moderate">
                Gemiddeld actief (3–5× per week)
              </option>
              <option value="active">
                Zeer actief (6–7× per week)
              </option>
              <option value="very_active">
                Extreem actief (fysiek werk / sport)
              </option>
            </select>
          </div>

          {/* Doel */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Wat is je doel?
            </label>

            <div className="space-y-2 text-base">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={goal === "lose_weight"}
                  onChange={() => setGoal("lose_weight")}
                />
                Afvallen
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={goal === "maintain"}
                  onChange={() => setGoal("maintain")}
                />
                Gewicht behouden
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={goal === "gain_weight"}
                  onChange={() => setGoal("gain_weight")}
                />
                Aankomen
              </label>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleFinish}
            disabled={saving}
            className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition"
          >
            {saving ? "Instellen…" : "Naar dashboard"}
          </button>
        </div>
      </div>
    </main>
  );
}
