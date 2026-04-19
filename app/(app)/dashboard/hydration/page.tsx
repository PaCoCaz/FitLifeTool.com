// app/(app)/dashboard/hydration/page.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useLangContext } from "@/lib/LangProvider";
import { getLocalDayKey } from "@/lib/dayKey";
import { useDashboard } from "@/lib/DashboardStore";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

import { useNow } from "@/lib/TimeProvider";
import { getHydrationStatus } from "@/lib/hydrationScore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Scatter,
} from "recharts";

import { getExpectedHydrationProgress } from "@/lib/hydrationScore";

const toHalfHour = (date: Date) => {
  const h = date.getHours() + date.getMinutes() / 60;
  return Math.round(h * 2) / 2;
};

/* ───────────────── Types ───────────────── */

type DrinkLog = {
  product_key: string;
  ml: number;
  water: number;
  preparation_key: string;
  unit_key: string;
  created_at: string;
};

type Product = {
  product_key: string;
  is_drink: boolean;
};

type ProductTranslation = {
  product_key: string;
  name: string;
};

type PrepTranslation = {
  preparation_key: string;
  label: string;
};

type UnitTranslation = {
  unit_key: string;
  label: string;
};

type DrinkItem = {
  product_key: string;
  preparation_key: string;
  unit_key: string;
  name: string;
  total_ml: number;
  preparation: string;
  unit: string;
};

/* ───────────────── Page ───────────────── */

export default function DrinkTodayPage() {
  const { user } = useUser();
  const { lang } = useLangContext();

  const langCode = useLang();
  const t = uiText[langCode];

  const [items, setItems] = useState<DrinkItem[]>([]);
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [loading, setLoading] = useState(true);

  const { hydrationGoalMl } = useDashboard();
  const safeGoal = hydrationGoalMl ?? 0;

  /* ───────────────── Load ───────────────── */

  useEffect(() => {
    if (!user?.id || !lang) return;

    const userId = user.id;
    const today = getLocalDayKey(new Date());

    async function load() {
      setLoading(true);

      const { data: logsData } = await supabase
        .from("nutrition_logs")
        .select("product_key, ml, water, preparation_key, unit_key, created_at")
        .eq("user_id", userId)
        .eq("log_date", today) as {
        data: DrinkLog[] | null;
      };

      const logs = logsData ?? [];

      if (logs.length === 0) {
        setItems([]);
        setLogs([]);
        setLoading(false);
        return;
      }

      const productKeys = [...new Set(logs.map((l) => l.product_key))];

      const { data: products } = await supabase
        .from("nutrition_products")
        .select("product_key, is_drink")
        .in("product_key", productKeys) as {
        data: Product[] | null;
      };

      const drinkKeys = new Set(
        (products ?? [])
          .filter((p) => p.is_drink)
          .map((p) => p.product_key)
      );

      const drinkLogs = logs.filter((l) =>
        drinkKeys.has(l.product_key)
      );

      const [
        { data: productTranslations },
        { data: prepTranslations },
        { data: unitTranslations },
      ] = await Promise.all([
        supabase
          .from("nutrition_product_translations")
          .select("product_key, name")
          .in("product_key", productKeys)
          .eq("lang", lang) as {
          data: ProductTranslation[] | null;
        },

        supabase
          .from("nutrition_preparation_translations")
          .select("preparation_key, name")
          .eq("lang", lang) as {
          data: PrepTranslation[] | null;
        },

        supabase
          .from("nutrition_unit_translations")
          .select("unit_key, label")
          .eq("lang", lang) as {
          data: UnitTranslation[] | null;
        },
      ]);

      const nameMap = new Map<string, string>(
        (productTranslations ?? []).map((t) => [
          t.product_key,
          t.name,
        ])
      );

      const prepMap = new Map<string, string>(
        (prepTranslations ?? []).map((p) => [
          p.preparation_key,
          p.label,
        ])
      );

      const unitMap = new Map<string, string>(
        (unitTranslations ?? []).map((u) => [
          u.unit_key,
          u.label,
        ])
      );

      const grouped = new Map<string, number>();

      drinkLogs.forEach((log) => {
        const key = `${log.product_key}_${log.preparation_key}_${log.unit_key}`;
        grouped.set(key, (grouped.get(key) ?? 0) + (log.ml ?? 0));
      });

      const result: DrinkItem[] = Array.from(grouped.entries()).map(
        ([key, total]) => {
          const [product_key, preparation_key, unit_key] = key.split("_");

          return {
            product_key,
            preparation_key,
            unit_key,
            name: nameMap.get(product_key) ?? product_key,
            total_ml: total,
            preparation: prepMap.get(preparation_key) ?? "",
            unit: unitMap.get(unit_key) ?? "",
          };
        }
      );

      result.sort((a, b) => b.total_ml - a.total_ml);

      setItems(result);
      setLogs(logs);
      setLoading(false);
    }

    load();
  }, [user?.id, lang]);

  /* ───────────────── Totals ───────────────── */

  const totalDrink = items.reduce((acc, i) => acc + i.total_ml, 0);
  const totalFood = logs.reduce(
    (sum, l) => sum + (l.water ?? 0),
    0
  );
  const total = totalDrink + totalFood;

  const nowTime = useNow();

  const currentMl = totalDrink + totalFood;

  const hydrationStatus = useMemo(() => {
    if (!safeGoal) {
      return {
        color: "bg-gray-400 text-white",
        message: "",
        expectedProgress: 0,
      };
    }

    return getHydrationStatus(currentMl, safeGoal, nowTime, t, langCode);
  }, [currentMl, safeGoal, nowTime, lang]);

  const hydrationScore = useMemo(() => {
    if (!safeGoal) return 0;

    const expectedProgress = getExpectedHydrationProgress(nowTime);
    const expectedMl = safeGoal * expectedProgress;

    if (expectedMl <= 0) return 0;

    return Math.min(100, Math.round((currentMl / expectedMl) * 100));
  }, [currentMl, safeGoal, nowTime]);

  const pillScore =
    hydrationStatus.color === "bg-green-600 text-white"
      ? hydrationScore
      : Math.min(hydrationScore, 99);

  /* ───────────────── Chart ───────────────── */

  const chartData = useMemo(() => {
    if (!logs.length) return [];

    const sortedLogs = [...logs].sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );

    const points = Array.from({ length: 97 }, (_, i) =>
      i === 96 ? 23.999 : i / 4
    );

    return points.map((hour) => {
      const pointTime = new Date();
      pointTime.setHours(Math.floor(hour));
      pointTime.setMinutes((hour % 1) * 60);
      pointTime.setSeconds(0);

      const cumulative = sortedLogs.reduce((sum, log) => {
        const t = new Date(log.created_at);
        const logHour = toHalfHour(t);

        if (logHour > hour) return sum;

        return sum + (log.ml ?? 0) + (log.water ?? 0);
      }, 0);

      return {
        hour,
        actual: cumulative,
        expected:
          safeGoal *
          getExpectedHydrationProgress(pointTime),
      };
    });
  }, [logs, totalFood]);

  /* ───────────────── Totals ───────────────── */

  const now = new Date();
  const currentTime =
    Math.round((now.getHours() + now.getMinutes() / 60) * 4) / 4;

  const combinedDots = useMemo(() => {
    if (!logs.length) return [];

    const grouped = new Map<number, { drink: number; food: number }>();

    logs.forEach((log) => {
      const d = new Date(log.created_at);
      const hour = toHalfHour(d);

      const current = grouped.get(hour) ?? { drink: 0, food: 0 };

      if ((log.ml ?? 0) > 0) {
        current.drink += log.ml;
      }

      if ((log.water ?? 0) > 0) {
        current.food += log.water;
      }

      grouped.set(hour, current);
    });

    return Array.from(grouped.entries()).map(([hour, values]) => {
      const cumulative = logs.reduce((sum, l) => {
        const t = new Date(l.created_at);
        const h = toHalfHour(t);

        if (h > hour) return sum;

        return sum + (l.ml ?? 0) + (l.water ?? 0);
      }, 0);

      return {
        hour,
        value: cumulative,
        hasDrink: values.drink > 0,
        hasFood: values.food > 0,
      };
    });
  }, [logs]);

  /* ───────────────── UI ───────────────── */

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 space-y-6">

        <Card
          header={
            <CardHeader
              icon="/water_drop.svg"
              title="Hydratatie vandaag"
              scoreLabel="FitLifeScore"
              score={pillScore}
              scoreColor={hydrationStatus.color}
            />
          }
        >
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="hour"
                  type="number"
                  domain={[0, 24]}
                  ticks={[0,4,8,12,16,20,24]}
                />

                <YAxis hide domain={[0, safeGoal]} />

                <Line
                  type="linear"
                  dataKey="expected"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  dot={false}
                />

                <Line
                  type="linear"
                  dataKey="actual"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={false}
                />

                <Scatter
                  data={combinedDots}
                  dataKey="value"
                  shape={({ cx, cy, payload }: any) => {
                    const r = 5;

                    // alleen drinken
                    if (payload.hasDrink && !payload.hasFood) {
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill="#0284c7"
                          stroke="white"
                          strokeWidth={2}
                        />
                      );
                    }

                    // alleen food
                    if (!payload.hasDrink && payload.hasFood) {
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill="#f97316"
                          stroke="white"
                          strokeWidth={2}
                        />
                      );
                    }

                    // 🔥 BEIDE → half-half
                    return (
                      <g>
  <defs>
    <clipPath id={`left-${cx}-${cy}`}>
      <rect x={cx - r} y={cy - r} width={r} height={r * 2} />
    </clipPath>

    <clipPath id={`right-${cx}-${cy}`}>
      <rect x={cx} y={cy - r} width={r} height={r * 2} />
    </clipPath>
  </defs>

  {/* linker helft = drink */}
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="#0284c7"
    clipPath={`url(#left-${cx}-${cy})`}
  />

  {/* rechter helft = food */}
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="#f97316"
    clipPath={`url(#right-${cx}-${cy})`}
  />

  {/* border */}
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke="white"
    strokeWidth={2}
  />
</g>
                    );
                  }}
                />

                <ReferenceLine
                  x={currentTime}
                  stroke="black"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* DRINKS */}
        <Card
          header={
            <CardHeader
              icon="/water_drop.svg"
              title="Vandaag gedronken"
            />
          }
        >
          {loading ? (
            <div className="text-sm text-gray-500">Laden…</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-gray-500">
              Nog niets gedronken vandaag
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item, i) => (
                <div
                  key={`${item.product_key}-${item.preparation_key}-${item.unit_key}-${i}`}
                  className="flex justify-between border rounded px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium text-[#191970]">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {[item.preparation, item.unit]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  </div>

                  <div className="text-sm font-medium text-[#191970]">
                    {item.total_ml} ml
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* TOTAL */}
        <Card
          header={
            <CardHeader
              icon="/target.svg"
              title="Totale hydratatie vandaag"
            />
          }
        >
          <div className="flex flex-col gap-3">

            <div className="flex justify-between border rounded px-3 py-2">
              <span>Totaal</span>
              <span>{total} ml</span>
            </div>

            <div className="flex justify-between border rounded px-3 py-2">
              <span>🥤 Drinken</span>
              <span>{totalDrink} ml</span>
            </div>

            <div className="flex justify-between border rounded px-3 py-2">
              <span>🥗 Voeding</span>
              <span>{totalFood} ml</span>
            </div>

          </div>
        </Card>

      </div>
    </div>
  );
}