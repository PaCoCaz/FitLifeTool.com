// app/(app)/dashboard/activity/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useRouter } from "next/navigation";

import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";

import {
  ACTIVITY_TYPES,
  ActivityType,
  calculateActivityCalories,
} from "@/lib/activityScore";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";

import { useDashboard } from "@/lib/DashboardStore";

type ActivityRow = {
  activity_type: ActivityType;
  duration_minutes: number;
  calories: number;
};

const QUICK_DURATIONS = [5, 10, 15, 20, 25, 30, 45, 60];

export default function ActivityPage() {
  const { user } = useUser();
  const router = useRouter();
  const { refreshDashboard } = useDashboard();

  const lang = useLang();
  const t = uiText[lang];

  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  const weightKg = user?.user_metadata?.weight_kg ?? 75;

  const [selectedType, setSelectedType] =
    useState<ActivityType | null>(null);

  const [minutes, setMinutes] =
    useState<number | null>(null);

  const [customMinutes, setCustomMinutes] =
    useState("");

  const [todayActivities, setTodayActivities] =
    useState<ActivityRow[]>([]);

  /* totals */

  const totals = todayActivities.reduce(
    (acc, a) => {
      acc.minutes += a.duration_minutes;
      acc.calories += a.calories;
      return acc;
    },
    { minutes: 0, calories: 0 }
  );

  const finalMinutes =
    customMinutes.trim() !== ""
      ? Number(customMinutes)
      : minutes;

  /* load today */

  useEffect(() => {
    if (!user) return;

    supabase
      .from("activity_logs")
      .select("activity_type, duration_minutes, calories")
      .eq("user_id", user.id)
      .eq("log_date", dayKey)
      .then(({ data }: { data: ActivityRow[] | null }) => {

        const rows = (data ?? []) as ActivityRow[];

        const grouped: Partial<
          Record<
            ActivityType,
            { minutes: number; calories: number }
          >
        > = {};

        for (const row of rows) {

          const type = row.activity_type as ActivityType;

          if (!grouped[type]) {
            grouped[type] = {
              minutes: 0,
              calories: 0,
            };
          }

          grouped[type]!.minutes +=
            row.duration_minutes;

          grouped[type]!.calories +=
            row.calories;
        }

        const merged = Object.entries(grouped).map(
          ([type, values]) => ({
            activity_type: type as ActivityType,
            duration_minutes: Math.round(
              values!.minutes
            ),
            calories: Math.round(
              values!.calories
            ),
          })
        );

        merged.sort(
          (a, b) => b.calories - a.calories
        );

        setTodayActivities(merged);
      });

  }, [user, dayKey]);

  /* preview */

  const previewCalories =
    selectedType &&
    finalMinutes &&
    finalMinutes > 0
      ? calculateActivityCalories(
          ACTIVITY_TYPES[selectedType].met,
          weightKg,
          finalMinutes
        )
      : 0;

  /* save */

  async function addActivity() {

    if (
      !user ||
      !selectedType ||
      !finalMinutes ||
      finalMinutes <= 0
    )
      return;

    const calories =
      calculateActivityCalories(
        ACTIVITY_TYPES[selectedType].met,
        weightKg,
        finalMinutes
      );

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      activity_type: selectedType,
      duration_minutes: finalMinutes,
      calories,
      log_date: dayKey,
    });

    const { data } = await supabase
      .from("activity_logs")
      .select("activity_type, duration_minutes, calories")
      .eq("user_id", user.id)
      .eq("log_date", dayKey);

    const rows = (data ?? []) as ActivityRow[];

    const grouped: Partial<
      Record<
        ActivityType,
        { minutes: number; calories: number }
      >
    > = {};

    for (const row of rows) {

      const type = row.activity_type as ActivityType;

      if (!grouped[type]) {
        grouped[type] = {
          minutes: 0,
          calories: 0,
        };
      }

      grouped[type]!.minutes +=
        row.duration_minutes;

      grouped[type]!.calories +=
        row.calories;
    }

    const merged = Object.entries(grouped).map(
      ([type, values]) => ({
        activity_type: type as ActivityType,
        duration_minutes: Math.round(
          values!.minutes
        ),
        calories: Math.round(
          values!.calories
        ),
      })
    );

    merged.sort(
      (a, b) => b.calories - a.calories
    );

    setTodayActivities(merged);

    await refreshDashboard();

    router.push("/dashboard");
  }

  return (

    <div className="grid grid-cols-12 gap-6">

      <div className="col-span-12">

        <div className="bg-white rounded-[var(--radius)] shadow-sm border">

          <div className="px-6 py-4 border-b">

            <h1 className="flex items-center gap-2 text-lg font-semibold text-[#191970]">

              <Image
                src="/activity.svg"
                alt=""
                width={18}
                height={18}
              />

              {t.activity.addActivity}

            </h1>

          </div>

          <div className="px-6 py-6 space-y-6">


            {/* type */}

            <div>

              <div className="text-xs font-medium text-gray-500 mb-2">
                {t.activity.whichActivity}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">

                {(Object.keys(
                  ACTIVITY_TYPES
                ) as ActivityType[]).map((type) => {

                  const isActive =
                    selectedType === type;

                  return (

                    <button
                      key={type}
                      onClick={() =>
                        setSelectedType(type)
                      }
                      className={`rounded-[var(--radius)] border px-3 py-2 text-xs font-medium transition ${
                        isActive
                          ? "bg-[#0095D3] text-white border-[#0095D3]"
                          : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                      }`}
                    >

                      {t.activity.labels[type]}

                    </button>

                  );

                })}

              </div>

            </div>


            {/* duration */}

            <div>

              <div className="text-xs font-medium text-gray-500 mb-2">
                {t.activity.howLong}
              </div>

              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">

                {QUICK_DURATIONS.map((d) => (

                  <button
                    key={d}
                    onClick={() => {
                      setMinutes(d);
                      setCustomMinutes("");
                    }}
                    className={`rounded-[var(--radius)] border py-2 text-xs font-medium transition ${
                      minutes === d
                        ? "bg-[#0095D3] text-white border-[#0095D3]"
                        : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                    }`}
                  >
                    {d} {t.activity.minutes}
                  </button>

                ))}

              </div>


              <div className="mt-3">

                <div className="text-xs font-medium text-gray-500 mb-1">
                  Of vul zelf minuten in
                </div>

                <input
                  type="number"
                  min={1}
                  value={customMinutes}
                  onChange={(e) => {
                    setCustomMinutes(e.target.value);
                    setMinutes(null);
                  }}
                  className="w-full rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 text-sm"
                />

              </div>

            </div>


            {/* preview */}

            {previewCalories > 0 && (

              <div className="text-sm text-gray-600">

                {t.activity.burnPreview}{" "}

                <span className="font-semibold text-[#191970]">
                  {formatNumber(
                    previewCalories,
                    lang
                  )} kcal
                </span>

              </div>

            )}


            <button
              onClick={addActivity}
              className="w-full rounded-[var(--radius)] border border-[#0095D3] px-4 py-3 text-sm font-semibold text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
            >
              {t.activity.addActivity}
            </button>


            {/* today */}

            {todayActivities.length > 0 && (

              <div className="mt-8 border-t pt-6">

                <div className="text-sm font-semibold text-[#191970] mb-3">
                  {t.activity.todayOverview}
                </div>


                <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 mb-2">

                  <div>{t.activity.activityLabel}</div>

                  <div className="text-right">
                    {t.activity.duration}
                  </div>

                  <div className="text-right">
                    kcal
                  </div>

                </div>


                <div className="space-y-2 text-sm text-[#191970]">

                  {todayActivities.map((a, i) => (

                    <div
                      key={i}
                      className="grid grid-cols-3 gap-2"
                    >

                      <div>
                        {t.activity.labels[a.activity_type]}
                      </div>

                      <div className="text-right">
                        {a.duration_minutes} {t.activity.minutes}
                      </div>

                      <div className="text-right font-medium">
                        {formatNumber(
                          a.calories,
                          lang
                        )} kcal
                      </div>

                    </div>

                  ))}


                  <div className="mt-4 pt-3 border-t grid grid-cols-3 gap-2 font-semibold">

                    <div>{t.activity.total}</div>

                    <div className="text-right">
                      {totals.minutes} {t.activity.minutes}
                    </div>

                    <div className="text-right">
                      {formatNumber(
                        totals.calories,
                        lang
                      )} kcal
                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}