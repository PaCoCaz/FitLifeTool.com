//  app/components/dashboard/TodayConsumptionCard.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";

type ConsumptionRow = {
  id: string;
  calories: number;
  meal_type: string;
  food_product_translations: {
    name: string;
  } | null;
};

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"];

export default function TodayConsumptionCard() {
  const { user } = useUser();
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  const lang = useLang();
  const t = uiText[lang];

  const [logs, setLogs] = useState<ConsumptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    if (!user) return;

    const { data, error } = await supabase
      .from("consumption_logs")
      .select(`
        id,
        calories,
        meal_type,
        food_products (
          food_product_translations (
            name,
            lang
          )
        )
      `)
      .eq("user_id", user.id)
      .eq("log_date", dayKey)
      .order("log_time_local", { ascending: false });

    if (error) {
      console.error("LOAD LOGS ERROR:", error);
      setLogs([]);
      setLoading(false);
      return;
    }

    // Flatten translation
    const mapped =
      data?.map((row: any) => ({
        id: row.id,
        calories: row.calories,
        meal_type: row.meal_type,
        food_product_translations:
          row.food_products?.food_product_translations?.find(
            (tr: any) => tr.lang === lang
          ) ?? null,
      })) ?? [];

    setLogs(mapped);
    setLoading(false);
  }

  useEffect(() => {
    setLogs([]);
    setLoading(true);
  }, [dayKey]);

  useEffect(() => {
    loadLogs();
  }, [user, dayKey, lang]);

  async function deleteLog(id: string) {
    const { error } = await supabase
      .from("consumption_logs")
      .delete()
      .eq("id", id);

    if (!error) {
      await loadLogs();
    }
  }

  /* ───────────────── GROUPING ───────────────── */

  const grouped = useMemo(() => {
    const groups: Record<string, ConsumptionRow[]> = {};

    MEAL_ORDER.forEach((m) => {
      groups[m] = [];
    });

    logs.forEach((log) => {
      if (!groups[log.meal_type]) {
        groups[log.meal_type] = [];
      }
      groups[log.meal_type].push(log);
    });

    return groups;
  }, [logs]);

  const dayTotal = useMemo(() => {
    return logs.reduce((sum, log) => sum + log.calories, 0);
  }, [logs]);

  if (loading) {
    return (
      <Card title="Vandaag">
        <div className="text-sm text-gray-500">Laden...</div>
      </Card>
    );
  }

  return (
    <Card
      title="Vandaag"
      icon={<Image src="/nutrition.svg" alt="" width={16} height={16} />}
    >
      {logs.length === 0 && (
        <div className="text-sm text-gray-500">
          Nog geen items toegevoegd.
        </div>
      )}

      <div className="space-y-6">
        {MEAL_ORDER.map((meal) => {
          const items = grouped[meal];
          if (!items || items.length === 0) return null;

          const subtotal = items.reduce(
            (sum, log) => sum + log.calories,
            0
          );

          return (
            <div key={meal} className="space-y-3">
              {/* Groep titel */}
              <div className="flex justify-between items-center">
                <div className="font-semibold text-[#191970]">
                  {t.nutrition.mealLabels?.[meal] ?? meal}
                </div>
                <div className="text-sm font-semibold">
                  {formatNumber(subtotal, lang)} kcal
                </div>
              </div>

              {/* Items */}
              {items.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                >
                  <span className="text-gray-700">
                    {log.food_product_translations?.name ??
                      "Onbekend product"}
                  </span>

                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {formatNumber(log.calories, lang)} kcal
                    </span>

                    <button
                        onClick={() => deleteLog(log.id)}
                        className="flex items-center justify-center w-6 h-6 rounded-md bg-red-600 hover:bg-red-700 transition"
                        aria-label="Verwijder"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* Dag totaal */}
        {logs.length > 0 && (
          <div className="pt-4 border-t flex justify-between items-center font-semibold text-[#191970]">
            <span>Dagtotaal</span>
            <span>{formatNumber(dayTotal, lang)} kcal</span>
          </div>
        )}
      </div>
    </Card>
  );
}
