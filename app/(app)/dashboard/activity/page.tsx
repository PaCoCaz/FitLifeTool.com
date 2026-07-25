// app/(app)/dashboard/activity/page.tsx

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import {
  ACTIVITY_TYPES,
  calculateActivityCalories,
  type ActivityType,
} from "@/lib/activityScore";
import {
  groupActivityRows,
  type ActivityRow,
} from "@/lib/activityLogs";
import { useUser } from "@/lib/AuthProvider";
import { useDashboard } from "@/lib/DashboardStore";
import { getLocalDayKey } from "@/lib/dayKey";
import { formatNumber } from "@/lib/formatNumber";
import { supabase } from "@/lib/supabaseClient";
import { uiText } from "@/lib/uiText";
import { useDayNow } from "@/lib/useDayNow";
import { useLang } from "@/lib/useLang";

const QUICK_DURATIONS = [
  5,
  10,
  15,
  20,
  25,
  30,
  45,
  60,
] as const;

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
  const [isInitialLoading, setIsInitialLoading] =
    useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoadError, setHasLoadError] =
    useState(false);
  const [hasSaveError, setHasSaveError] =
    useState(false);
  const savingRef = useRef(false);

  const customMinutesValue =
    customMinutes === ""
      ? null
      : Number(customMinutes);
  const finalMinutes =
    customMinutesValue ?? minutes;
  const validMinutes =
    finalMinutes !== null &&
    Number.isInteger(finalMinutes) &&
    finalMinutes > 0
      ? finalMinutes
      : null;
  const canSave =
    Boolean(
      user &&
      selectedType &&
      validMinutes !== null
    ) &&
    !isSaving;

  const totals = todayActivities.reduce(
    (accumulator, activity) => ({
      minutes:
        accumulator.minutes +
        activity.duration_minutes,
      calories:
        accumulator.calories +
        activity.calories,
    }),
    {
      minutes: 0,
      calories: 0,
    }
  );

  const previewCalories =
    selectedType && validMinutes !== null
      ? calculateActivityCalories(
          ACTIVITY_TYPES[selectedType].met,
          weightKg,
          validMinutes
        )
      : 0;

  const fetchTodayActivities = useCallback(
    async () => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("activity_logs")
        .select(
          "activity_type, duration_minutes, calories"
        )
        .eq("user_id", user.id)
        .eq("log_date", dayKey);

      if (error) {
        throw error;
      }

      return groupActivityRows(
        (data ?? []) as ActivityRow[]
      );
    },
    [user?.id, dayKey]
  );

  useEffect(() => {
    let cancelled = false;

    if (!user?.id) {
      setTodayActivities([]);
      setIsInitialLoading(false);
      return;
    }

    setIsInitialLoading(true);
    setHasLoadError(false);

    void fetchTodayActivities()
      .then((activities) => {
        if (cancelled) {
          return;
        }

        setTodayActivities(activities);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        console.error(
          "Activity load failed:",
          error
        );
        setTodayActivities([]);
        setHasLoadError(true);
      })
      .finally(() => {
        if (!cancelled) {
          setIsInitialLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, fetchTodayActivities]);

  async function retryLoad() {
    setIsInitialLoading(true);
    setHasLoadError(false);

    try {
      const activities =
        await fetchTodayActivities();
      setTodayActivities(activities);
    } catch (error) {
      console.error(
        "Activity retry failed:",
        error
      );
      setTodayActivities([]);
      setHasLoadError(true);
    } finally {
      setIsInitialLoading(false);
    }
  }

  function handleCustomMinutesChange(value: string) {
    if (!/^\d*$/.test(value)) {
      return;
    }

    setCustomMinutes(value);
    setMinutes(null);
  }

  async function addActivity() {
    if (
      savingRef.current ||
      !user ||
      !selectedType ||
      validMinutes === null
    ) {
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    setHasSaveError(false);

    try {
      const calories =
        calculateActivityCalories(
          ACTIVITY_TYPES[selectedType].met,
          weightKg,
          validMinutes
        );

      const { error: insertError } = await supabase
        .from("activity_logs")
        .insert({
          user_id: user.id,
          activity_type: selectedType,
          duration_minutes: validMinutes,
          calories,
          log_date: dayKey,
        });

      if (insertError) {
        console.error(
          "Activity insert failed:",
          insertError
        );
        setHasSaveError(true);
        return;
      }

      setSelectedType(null);
      setMinutes(null);
      setCustomMinutes("");

      let activities: ActivityRow[];

      try {
        activities =
          await fetchTodayActivities();
      } catch (loadError) {
        console.error(
          "Activity refresh failed:",
          loadError
        );
        setTodayActivities([]);
        setHasLoadError(true);
        return;
      }

      setTodayActivities(activities);
      setHasLoadError(false);

      await refreshDashboard();
      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Activity save failed:",
        error
      );
      setHasSaveError(true);
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 space-y-6">
        <Card
          header={
            <CardHeader
              icon="/activity.svg"
              title={t.activity.addActivity}
              as="h1"
            />
          }
        >
          <div className="mb-3 text-sm font-semibold text-[#64748B]">
            {t.activity.whichActivity}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              Object.keys(
                ACTIVITY_TYPES
              ) as ActivityType[]
            ).map((type) => {
              const isSelected =
                selectedType === type;

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedType(type)
                  }
                  className={`
                    app-action-button
                    min-w-0
                    w-full
                    px-3
                    text-sm
                    ${
                      isSelected
                        ? "app-action-button--active"
                        : ""
                    }
                  `}
                >
                  <span className="truncate">
                    {t.activity.labels[type]}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card
          header={
            <CardHeader
              title={t.activity.howLong}
              as="h2"
            />
          }
        >
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {QUICK_DURATIONS.map((duration) => {
              const isSelected =
                minutes === duration &&
                customMinutes === "";

              return (
                <button
                  key={duration}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setMinutes(duration);
                    setCustomMinutes("");
                  }}
                  className={`
                    app-action-button
                    w-full
                    min-w-0
                    px-2
                    text-xs
                    ${
                      isSelected
                        ? "app-action-button--active"
                        : ""
                    }
                  `}
                >
                  {duration} {t.activity.minutes}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <label
              htmlFor="custom-activity-minutes"
              className="mb-2 block text-sm font-semibold text-[#64748B]"
            >
              {t.activity.customMinutesLabel}
            </label>

            <div className="-mx-4">
              <input
                id="custom-activity-minutes"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={customMinutes}
                aria-invalid={
                  customMinutes !== "" &&
                  validMinutes === null
                }
                onChange={(event) =>
                  handleCustomMinutesChange(
                    event.target.value
                  )
                }
                className="
                  w-full
                  border-y
                  border-[#DBE4F0]
                  px-4
                  py-2
                  text-[#191970]
                  focus:border-[#0BA4E0]
                  focus:outline-none
                  focus:ring-0
                "
              />
            </div>
          </div>
        </Card>

        {selectedType && validMinutes !== null && (
          <Card
            header={
              <CardHeader
                title={t.activity.summary}
                as="h2"
              />
            }
          >
            <dl className="-mx-4">
              <div className="flex items-center justify-between gap-4 border-b border-[#DBE4F0] px-4 py-2">
                <dt className="text-sm text-[#64748B]">
                  {t.activity.activityLabel}
                </dt>
                <dd className="text-right text-sm font-semibold text-[#191970]">
                  {t.activity.labels[selectedType]}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-[#DBE4F0] px-4 py-2">
                <dt className="text-sm text-[#64748B]">
                  {t.activity.duration}
                </dt>
                <dd className="text-right text-sm font-semibold text-[#191970]">
                  {formatNumber(
                    validMinutes,
                    lang
                  )}{" "}
                  {t.activity.minutes}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-2">
                <dt className="text-sm text-[#64748B]">
                  {t.activity.calories}
                </dt>
                <dd className="text-right text-sm font-semibold text-[#191970]">
                  {formatNumber(
                    previewCalories,
                    lang
                  )}{" "}
                  kcal
                </dd>
              </div>
            </dl>
          </Card>
        )}

        <Card>
          <button
            type="button"
            disabled={!canSave}
            onClick={addActivity}
            className={`
              app-action-button
              w-full
              ${
                canSave
                  ? "app-action-button--active"
                  : "app-action-button--locked cursor-not-allowed opacity-70"
              }
            `}
          >
            {isSaving
              ? t.common.saving
              : t.activity.addActivity}
          </button>

          {hasSaveError && (
            <div
              role="alert"
              className="mt-3 rounded-[var(--radius)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {t.activity.saveError}
            </div>
          )}
        </Card>

        <Card
          header={
            <CardHeader
              icon="/activity.svg"
              title={t.activity.todayOverview}
              as="h2"
            />
          }
        >
          {isInitialLoading ? (
            <div
              className="-mx-4"
              aria-label={t.activity.loading}
            >
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-3 gap-3 border-b border-[#DBE4F0] px-4 py-3"
                >
                  <div className="h-4 animate-pulse rounded bg-[#DBE4F0]" />
                  <div className="ml-auto h-4 w-14 animate-pulse rounded bg-[#DBE4F0]" />
                  <div className="ml-auto h-4 w-16 animate-pulse rounded bg-[#DBE4F0]" />
                </div>
              ))}
            </div>
          ) : hasLoadError ? (
            <div
              role="alert"
              className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"
            >
              <p>{t.activity.loadError}</p>
              <button
                type="button"
                onClick={retryLoad}
                className="app-action-button mt-3 h-9 min-h-9 px-3 text-sm"
              >
                {t.activity.retry}
              </button>
            </div>
          ) : todayActivities.length === 0 ? (
            <div className="-mx-4 px-4 py-4 text-sm text-[#64748B]">
              {t.activity.emptyToday}
            </div>
          ) : (
            <div className="-mx-4">
              <div className="grid grid-cols-3 gap-3 border-b border-[#DBE4F0] px-4 py-2 text-xs font-semibold text-[#64748B]">
                <div>{t.activity.activityLabel}</div>
                <div className="text-right">
                  {t.activity.duration}
                </div>
                <div className="text-right">
                  {t.activity.calories}
                </div>
              </div>

              {todayActivities.map((activity) => (
                <div
                  key={activity.activity_type}
                  className="grid grid-cols-3 gap-3 border-b border-[#DBE4F0] px-4 py-2 text-sm text-[#191970]"
                >
                  <div className="min-w-0 truncate">
                    {
                      t.activity.labels[
                        activity.activity_type
                      ]
                    }
                  </div>
                  <div className="text-right">
                    {formatNumber(
                      activity.duration_minutes,
                      lang
                    )}{" "}
                    {t.activity.minutes}
                  </div>
                  <div className="text-right font-medium">
                    {formatNumber(
                      activity.calories,
                      lang
                    )}{" "}
                    kcal
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3 border-t border-[#DBE4F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#191970]">
                <div>{t.activity.total}</div>
                <div className="text-right">
                  {formatNumber(
                    totals.minutes,
                    lang
                  )}{" "}
                  {t.activity.minutes}
                </div>
                <div className="text-right">
                  {formatNumber(
                    totals.calories,
                    lang
                  )}{" "}
                  kcal
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
