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
        .order("start_at", { ascending: false })
        .limit(1)
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
      const now = new Date().toISOString(); // ✅ FIX
  
      if (newGoal === goal) return;
  
      // actieve periode zoeken
  
      const { data: active } = await supabase
        .from("user_goal_periods")
        .select("id")
        .eq("user_id", userId)
        .is("end_at", null)
        .maybeSingle();
  
      if (active) {
        await supabase
          .from("user_goal_periods")
          .update({ end_at: now }) // ✅ FIX
          .eq("id", active.id);
      }
  
      // nieuwe periode
  
      const { error } = await supabase
        .from("user_goal_periods")
        .insert({
          user_id: userId,
          goal_key: newGoal,
          start_at: now, // ✅ FIX
          end_at: null,
        });
  
      if (error) {
        console.error(error);
        return;
      }
  
      // sync profile
  
      await supabase
        .from("profiles")
        .update({ goal: newGoal })
        .eq("id", userId);
  
      // recalc

      const { error: rpcError } = await supabase.rpc(
        "recalculate_user_targets",
        {
          p_user_id: userId,
        }
      );

      if (rpcError) {
        console.error(rpcError);
        return;
      }

      // force DB sync

      await supabase
        .from("profiles")
        .select("calorie_goal")
        .eq("id", userId)
        .single();

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