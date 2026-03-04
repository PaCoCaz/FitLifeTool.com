// app/components/auth/OnboardingFinalStep.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

/* ───────────────── Types ───────────────── */

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

type Goal = "LOSE" | "MAINTAIN" | "GAIN";

type ProfileForCalculation = {
  birthdate: string;
  height_cm: number;
  weight_kg: number;
  calculation_sex: "male" | "female";
  activity_level: ActivityLevel;
  goal: Goal;
};

/* ───────────────── Component ───────────────── */

type Props = {
  onBack: () => void;
};

export default function OnboardingFinalStep({ onBack }: Props) {
  const router = useRouter();
  const { user } = useUser();

  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel | "">("");
  const [goal, setGoal] = useState<Goal | "">("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ───────────────── Handler ───────────────── */

  const handleFinish = async () => {
    if (!activityLevel || !goal) {
      setError("Kies je activiteitsniveau en doel");
      return;
    }

    if (!user) {
      setError("Geen gebruiker gevonden");
      return;
    }

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

    /* 2️⃣ Eerste goal periode aanmaken */
    const todayStr = new Date().toISOString().split("T")[0];

    const { error: goalError } = await supabase
      .from("user_goal_periods")
      .insert({
        user_id: user.id,
        goal_key: goal,
        start_date: todayStr,
        end_date: null,
      });

    if (goalError) {
      setError(goalError.message);
      setSaving(false);
      return;
    }

    /* 3️⃣ Alle doelen opnieuw laten berekenen */
    const { error: recalcError } = await supabase.rpc(
      "recalculate_user_targets",
      {
        p_user_id: user.id,
      }
    );

    if (recalcError) {
      setError(recalcError.message);
      setSaving(false);
      return;
    }

    /* 4️⃣ Klaar */
    router.replace("/dashboard");
  };

  if (!user) return null;

  /* ───────────────── Render ───────────────── */

  return (
    <div className="space-y-6">
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
          className="w-full rounded border px-3 py-2"
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
            Extreem actief
          </option>
        </select>
      </div>

      {/* Doel */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Wat is je doel?
        </label>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={goal === "LOSE"}
              onChange={() => setGoal("LOSE")}
            />
            Afvallen
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={goal === "MAINTAIN"}
              onChange={() => setGoal("MAINTAIN")}
            />
            Gewicht behouden
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={goal === "GAIN"}
              onChange={() => setGoal("GAIN")}
            />
            Aankomen
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-sm text-gray-500"
        >
          Terug
        </button>

        <button
          onClick={handleFinish}
          disabled={saving}
          className="
            rounded-[var(--radius)]
            bg-[#191970]
            px-4 py-2
            text-sm
            font-medium
            text-white
            hover:bg-[#0BA4E0]
          "
        >
          {saving ? "Instellen…" : "Naar dashboard"}
        </button>
      </div>
    </div>
  );
}