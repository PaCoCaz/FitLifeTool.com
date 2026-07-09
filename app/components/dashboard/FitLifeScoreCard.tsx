// app/components/dashboard/FitLifeScoreCard.tsx

"use client";

import {
  useMemo,
  useState,
  useEffect,
} from "react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";

import { useClockNow } from "@/lib/useClockNow";

import { getExpectedHydrationProgress } from "@/lib/hydrationScore";

import {
  calculateDailyFitLifeScore,
  getFitLifeStatusColor,
} from "@/lib/fitlifeScore";

import { useScores } from "@/lib/ScoreContext";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";


/* ───────────────── Helpers ───────────────── */

function formatTime(
  now: Date
): string {

  return now.toLocaleTimeString(
    "nl-NL",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );

}


/* ───────────────── Component ───────────────── */

export default function FitLifeScoreCard() {


  const clockNow =
    useClockNow();


  const langCode =
    useLang();


  const t =
    uiText[langCode];


  const {

    hydrationScore,
    nutritionScore,
    activityScore,

    hydrationStatusColor,
    nutritionStatusColor,
    activityStatusColor,

  } = useScores();



  const [
    mounted,
    setMounted,

  ] = useState(false);



  useEffect(() => {

    setMounted(true);

  }, []);



  /* ───────────────── FitLifeScore ───────────────── */


  const fitLifeScore =
    useMemo(() => {


      return calculateDailyFitLifeScore({

        hydrationScore,
        nutritionScore,
        activityScore,

      });


    }, [

      hydrationScore,
      nutritionScore,
      activityScore,

    ]);



  /* ───────────────── Status kleur uit cards ───────────────── */


  const statusColor =
    useMemo(() => {


      return getFitLifeStatusColor([

        hydrationStatusColor,
        activityStatusColor,
        nutritionStatusColor,

      ]);


    }, [

      hydrationStatusColor,
      activityStatusColor,
      nutritionStatusColor,

    ]);



  /* ───────────────── Dagprogress ───────────────── */


  const expectedProgress =
    getExpectedHydrationProgress(
      clockNow
    );


  const actualProgressWithinSchedule =

    expectedProgress *

    (
      fitLifeScore / 100
    );



  const progressBarColor =
    statusColor.replace(
      "text-white",
      ""
    );



  /* ───────────────── UI ───────────────── */


  return (

    <Card

      header={

        <CardHeader

          icon="/heart.svg"

          title="FitLifeScore"

          rightContent={

            <div

              className={`
                rounded-[var(--radius)]
                px-3 py-1
                text-xs
                font-semibold
                min-w-[130px]
                text-center
                ${statusColor}
              `}

            >

              {t.common.today}
              {" | "}
              {mounted
                ? formatTime(clockNow)
                : "—"}

            </div>

          }

        />

      }

    >


      <div className="h-full flex flex-col justify-between">


        <div className="text-3xl font-semibold text-[#191970]">

          {fitLifeScore}

        </div>



        <div className="mt-4">


          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">


            <div

              className="absolute left-0 top-0 h-2 bg-[#B8CAE0]"

              style={{

                width:
                  `${expectedProgress * 100}%`,

              }}

            />



            <div

              className={`
                absolute left-0 top-0 h-2
                ${progressBarColor}
              `}

              style={{

                width:
                  `${
                    actualProgressWithinSchedule *
                    100
                  }%`,

              }}

            />


          </div>


        </div>


      </div>


    </Card>

  );

}