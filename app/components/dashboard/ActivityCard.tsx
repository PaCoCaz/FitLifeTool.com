// app/components/dashboard/ActivityCard.tsx

"use client";

import {
  useEffect,
  useMemo,
} from "react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";

import { useNow } from "@/lib/TimeProvider";

import {
  calculateActivityScore,
  getActivityStatus,
} from "@/lib/activityScore";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";

import { useDashboard } from "@/lib/DashboardStore";
import { useScores } from "@/lib/ScoreContext";


/* ───────────────── Component ───────────────── */

export default function ActivityCard() {


  const {

    ready,

    activityCalories,
    activityGoal,

  } = useDashboard();



  const {

    setActivityScore,
    setActivityStatusColor,

  } = useScores();



  const lang =
    useLang();


  const t =
    uiText[lang];


  const now =
    useNow();



  /* ───────────────── Score ───────────────── */


  const activityScore =
    useMemo(() => {


      if (!activityGoal) {

        return 0;

      }


      return calculateActivityScore(

        activityCalories,
        activityGoal,
        now

      );


    }, [

      activityCalories,
      activityGoal,
      now.getHours(),
      now.getMinutes(),

    ]);



  /* ───────────────── Status ───────────────── */


  const activityStatus =
    useMemo(() => {


      if (!activityGoal) {

        return {

          color:
            "bg-gray-400 text-white",

          message:
            t.activity.status.noGoal,

          expectedProgress:
            0,

        };

      }


      return getActivityStatus(

        activityCalories,
        activityGoal,
        now,
        t,
        lang

      );


    }, [

      activityCalories,
      activityGoal,
      now.getHours(),
      now.getMinutes(),
      t,
      lang,

    ]);



  /* ───────────────── Publish to FitLifeScore ───────────────── */


  useEffect(() => {


    setActivityScore(
      activityScore
    );


  }, [

    activityScore,
    setActivityScore,

  ]);



  useEffect(() => {


    setActivityStatusColor(
      activityStatus.color
    );


  }, [

    activityStatus.color,
    setActivityStatusColor,

  ]);



  /* ───────────────── Loading ───────────────── */


  if (
    !ready ||
    activityGoal === null
  ) {


    return (

      <Card title={t.activity.title}>


        <div className="text-sm text-gray-500">

          {t.activity.loading}

        </div>


      </Card>

    );

  }



  /* ───────────────── UI values ───────────────── */


  const actualProgress =
    Math.min(

      activityCalories /
      activityGoal,

      1

    );



  const barColor =
    activityStatus.color.replace(
      "text-white",
      ""
    );



  /* ───────────────── Render ───────────────── */


  return (

    <Card

      header={

        <CardHeader

          icon="/activity.svg"

          title={t.activity.title}

          scoreLabel="FitLifeScore"

          score={activityScore}

          scoreColor={
            activityStatus.color
          }

        />

      }

    >


      <div className="h-full flex flex-col justify-between">


        <div className="space-y-1">


          <div className="text-2xl font-semibold text-[#191970]">


            {formatNumber(
              activityCalories,
              lang
            )} kcal


          </div>



          <div className="text-xs text-gray-500">


            {t.activity.goal}:{" "}


            {formatNumber(
              activityGoal,
              lang
            )} kcal


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
                    activityStatus.expectedProgress *
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
                ${barColor}
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


            {activityStatus.message}


          </div>


        </div>


      </div>


    </Card>

  );

}