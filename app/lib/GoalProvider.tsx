// app/lib/GoalProvider.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

export type GoalKey = "LOSE" | "MAINTAIN" | "GAIN" | "HOLIDAY";

type GoalContextType = {
  goal: GoalKey | null;
  isLoading: boolean;
  setUserGoal: (newGoal: GoalKey) => Promise<void>;
};

const GoalContext = createContext<GoalContextType | null>(null);

export function GoalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const [goal, setGoal] = useState<GoalKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* LOAD ACTIVE GOAL */

  useEffect(() => {
    if (!user) {
      setGoal(null);
      setIsLoading(false);
      return;
    }

    const userId = user.id;

    async function loadGoal() {
      setIsLoading(true);

      const { data } = await supabase
        .from("user_goal_periods")
        .select("goal_key")
        .eq("user_id", userId)
        .is("end_at", null)
        .maybeSingle();

      setGoal(data?.goal_key ?? null);
      setIsLoading(false);
    }

    loadGoal();
  }, [user]);

  /* CHANGE GOAL */

  const setUserGoal = useCallback(
    async (newGoal: GoalKey) => {
      if (!user) return;

      const userId = user.id;
      const todayStr = new Date().toISOString().split("T")[0];

      if (newGoal === goal) return;

      // 1️⃣ Check actieve periode
      const { data: active } = await supabase
        .from("user_goal_periods")
        .select("id, start_at")
        .eq("user_id", userId)
        .is("end_at", null)
        .maybeSingle();

      if (active) {
        const activeStart = new Date(active.start_at)
          .toISOString()
          .split("T")[0];

        if (activeStart > todayStr) {
          // Future periode → gewoon verwijderen
          await supabase
            .from("user_goal_periods")
            .delete()
            .eq("id", active.id);
        } else {
          // Lopende periode → sluiten vandaag
          await supabase
            .from("user_goal_periods")
            .update({ end_at: todayStr })
            .eq("id", active.id);
        }
      }

      // 2️⃣ Nieuwe periode starten
      const { error } = await supabase
        .from("user_goal_periods")
        .insert({
          user_id: userId,
          goal_key: newGoal,
          start_at: todayStr,
          end_at: null,
        });

      if (error) {
        console.error("Error creating new goal:", error);
        return;
      }

      // 3️⃣ Targets opnieuw berekenen
      await supabase.rpc("recalculate_user_targets", {
        p_user_id: userId,
      });

      setGoal(newGoal);
    },
    [user, goal]
  );

  return (
    <GoalContext.Provider value={{ goal, isLoading, setUserGoal }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoalContext() {
  const ctx = useContext(GoalContext);

  if (!ctx) {
    return {
      goal: null,
      isLoading: true,
      setUserGoal: async () => {},
    };
  }

  return ctx;
}