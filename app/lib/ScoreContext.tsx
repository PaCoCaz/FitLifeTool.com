// app/lib/ScoreContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";


/* ───────────────── Types ───────────────── */

type ScoreContextType = {

  // Numerieke scores (0–100)
  hydrationScore: number;
  nutritionScore: number;
  activityScore: number;


  // Semantische statuskleuren uit cards
  hydrationStatusColor: string | null;
  nutritionStatusColor: string | null;
  activityStatusColor: string | null;


  // Score publishers
  setHydrationScore: (v: number) => void;
  setNutritionScore: (v: number) => void;
  setActivityScore: (v: number) => void;


  // Status publishers
  setHydrationStatusColor: (v: string) => void;
  setNutritionStatusColor: (v: string) => void;
  setActivityStatusColor: (v: string) => void;

};


/* ───────────────── Context ───────────────── */

const ScoreContext =
  createContext<ScoreContextType | null>(null);



/* ───────────────── Provider ───────────────── */

export function ScoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {


  const dayNow =
    useDayNow();


  const dayKey =
    getLocalDayKey(dayNow);


  const currentDayRef =
    useRef(dayKey);



  /* ───────── Scores ───────── */


  const [
    hydrationScore,
    setHydrationScore,

  ] = useState(0);



  const [
    nutritionScore,
    setNutritionScore,

  ] = useState(0);



  const [
    activityScore,
    setActivityScore,

  ] = useState(0);



  /* ───────── Status colors ───────── */


  const [

    hydrationStatusColor,
    setHydrationStatusColor,

  ] = useState<string | null>(null);



  const [

    nutritionStatusColor,
    setNutritionStatusColor,

  ] = useState<string | null>(null);



  const [

    activityStatusColor,
    setActivityStatusColor,

  ] = useState<string | null>(null);



  /* ───────────────── Day reset ───────────────── */


  useEffect(() => {


    if (
      currentDayRef.current === dayKey
    ) {

      return;

    }


    currentDayRef.current =
      dayKey;



    // Reset scores

    setHydrationScore(0);
    setNutritionScore(0);
    setActivityScore(0);



    // Reset status

    setHydrationStatusColor(null);
    setNutritionStatusColor(null);
    setActivityStatusColor(null);



  }, [
    dayKey,
  ]);



  /* ───────────────── Provider ───────────────── */


  return (

    <ScoreContext.Provider

      value={{


        // scores

        hydrationScore,
        nutritionScore,
        activityScore,



        // status

        hydrationStatusColor,
        nutritionStatusColor,
        activityStatusColor,



        // score setters

        setHydrationScore,
        setNutritionScore,
        setActivityScore,



        // status setters

        setHydrationStatusColor,
        setNutritionStatusColor,
        setActivityStatusColor,


      }}

    >

      {children}

    </ScoreContext.Provider>

  );

}



/* ───────────────── Hook ───────────────── */

export function useScores() {


  const ctx =
    useContext(
      ScoreContext
    );


  if (!ctx) {

    throw new Error(
      "ScoreProvider missing"
    );

  }


  return ctx;

}