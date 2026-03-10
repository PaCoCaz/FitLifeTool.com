// app/lib/ScoreContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

/* ───────────────── Types ───────────────── */

type ScoreContextType = {
  hydrationScore: number;
  nutritionScore: number;
  activityScore: number;

  setHydrationScore: (v: number) => void;
  setNutritionScore: (v: number) => void;
  setActivityScore: (v: number) => void;
};

/* ───────────────── Context ───────────────── */

const ScoreContext = createContext<ScoreContextType | null>(
  null
);

/* ───────────────── Provider ───────────────── */

export function ScoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrationScore, setHydrationScore] =
    useState(0);

  const [nutritionScore, setNutritionScore] =
    useState(0);

  const [activityScore, setActivityScore] =
    useState(0);

  return (
    <ScoreContext.Provider
      value={{
        hydrationScore,
        nutritionScore,
        activityScore,
        setHydrationScore,
        setNutritionScore,
        setActivityScore,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

/* ───────────────── Hook ───────────────── */

export function useScores() {
  const ctx = useContext(ScoreContext);

  if (!ctx) {
    throw new Error("ScoreProvider missing");
  }

  return ctx;
}