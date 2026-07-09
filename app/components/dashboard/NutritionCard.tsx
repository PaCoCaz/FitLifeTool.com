// app/components/dashboard/NutritionCard.tsx

"use client";

import {
  useEffect,
  useMemo,
} from "react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";

import { useNow } from "@/lib/TimeProvider";

import {
  calculateNutritionScore,
  getNutritionStatus,
} from "@/lib/nutritionScore";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";

import { useDashboard } from "@/lib/DashboardStore";
import { useScores } from "@/lib/ScoreContext";


/* ───────────────── Types ───────────────── */

type ScoreGoal =
  | "lose_weight"
  | "maintain"
  | "gain_weight";


/* ───────────────── Helpers ───────────────── */

function mapGoalToScoreGoal(
  goal: string | null
): ScoreGoal {

  if (goal === "LOSE") {
    return "lose_weight";
  }

  if (goal === "GAIN") {
    return "gain_weight";
  }

  return "maintain";

}


/* ───────────────── Component ───────────────── */

export default function NutritionCard() {


  const {

    ready,

    nutritionKcal,
    calorieGoal,
    activityCalories,
    goal,

  } = useDashboard();



  const {

    setNutritionScore,
    setNutritionStatusColor,

  } = useScores();



  const now =
    useNow();


  const lang =
    useLang();


  const t =
    uiText[lang];



  /* ───────────────── Derived values ───────────────── */


  const currentCalories =
    nutritionKcal ?? 0;


  const activityBonus =
    activityCalories ?? 0;


  const scoreGoal =
    mapGoalToScoreGoal(goal);


  const dailyLimit =
    calorieGoal !== null
      ? calorieGoal + activityBonus
      : 0;



  /* ───────────────── Score ───────────────── */


  const nutritionScore =
    useMemo(() => {


      if (!dailyLimit) {

        return 0;

      }


      return calculateNutritionScore(

        currentCalories,
        dailyLimit,
        scoreGoal,
        now

      );


    }, [

      currentCalories,
      dailyLimit,
      scoreGoal,
      now.getHours(),
      now.getMinutes(),

    ]);



  /* ───────────────── Status ───────────────── */


  const nutritionStatus =
    useMemo(() => {


      if (!dailyLimit) {


        return {

          color:
            "bg-gray-400 text-white",

          message:
            "",

          expectedProgress:
            0,

        };


      }



      return getNutritionStatus(

        currentCalories,
        dailyLimit,
        scoreGoal,
        now,
        t,
        lang

      );


    }, [

      currentCalories,
      dailyLimit,
      scoreGoal,
      now.getHours(),
      now.getMinutes(),
      t,
      lang,

    ]);



  /* ───────────────── Publish to FitLifeScore ───────────────── */


  useEffect(() => {


    setNutritionScore(
      nutritionScore
    );


  }, [

    nutritionScore,
    setNutritionScore,

  ]);



  useEffect(() => {


    setNutritionStatusColor(

      nutritionStatus.color

    );


  }, [

    nutritionStatus.color,
    setNutritionStatusColor,

  ]);



  /* ───────────────── Loading ───────────────── */


  if (
    !ready ||
    calorieGoal === null
  ) {


    return (

      <Card title={t.nutrition.title}>


        <div className="text-sm text-gray-500">

          {t.nutrition.loading}

        </div>


      </Card>

    );


  }



  /* ───────────────── UI values ───────────────── */


  const pillScore =

    nutritionStatus.color ===
    "bg-green-600 text-white"

      ? nutritionScore

      : Math.min(
          nutritionScore,
          99
        );



  const actualProgress =
    Math.min(

      currentCalories /
      dailyLimit,

      1

    );



  const progressBarColor =
    nutritionStatus.color.replace(
      "text-white",
      ""
    );



  /* ───────────────── Render ───────────────── */


  return (

    <Card

      header={

        <CardHeader

          icon="/nutrition.svg"

          title={t.nutrition.title}

          scoreLabel="FitLifeScore"

          score={pillScore}

          scoreColor={
            nutritionStatus.color
          }

        />

      }

    >


      <div className="h-full flex flex-col justify-between">


        <div className="space-y-1">


          <div className="text-2xl font-semibold text-[#191970]">


            {formatNumber(
              Math.round(currentCalories),
              lang
            )} kcal


          </div>



          <div className="text-xs text-gray-500">


            {t.nutrition.goal}:{" "}


            {formatNumber(
              Math.round(dailyLimit),
              lang
            )} kcal


          </div>



          <div className="text-[11px] text-gray-400">


            {t.nutrition.basePlusActivity

              .replace(

                "{{base}}",

                formatNumber(
                  Math.round(calorieGoal),
                  lang
                )

              )

              .replace(

                "{{activity}}",

                formatNumber(
                  Math.round(activityBonus),
                  lang
                )

              )}


          </div>


        </div>



        <div className="mt-4 space-y-2">


          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">


            <div

              className="
                absolute
                left-0
                top-0
                h-full
                bg-[#B8CAE0]
              "

              style={{

                width:
                  `${
                    nutritionStatus.expectedProgress *
                    100
                  }%`,

              }}

            />



            <div

              className={`
                absolute
                left-0
                top-0
                h-full
                transition-all
                ${progressBarColor}
              `}

              style={{

                width:
                  `${
                    actualProgress *
                    100
                  }%`,

              }}

            />


          </div>



          <div className="text-xs text-gray-600">


            {nutritionStatus.message}


          </div>


        </div>


      </div>


    </Card>

  );

}