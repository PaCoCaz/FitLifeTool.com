"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

type ActivityLog = {
  id: string;
  type: string;
  calories: number;
};

const ACTIVITY_OPTIONS = [
  { type: "wandelen", label: "Wandelen (30 min)", calories: 150 },
  { type: "fietsen", label: "Fietsen (30 min)", calories: 200 },
  { type: "kracht", label: "Krachttraining", calories: 250 },
  { type: "hardlopen", label: "Hardlopen (30 min)", calories: 300 },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ActivityCard() {
  const { user } = useUser();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Laad activiteiten van vandaag
  useEffect(() => {
    if (!user) return;

    supabase
      .from("activity_logs")
      .select("id, type, calories")
      .eq("user_id", user.id)
      .eq("date", today())
      .then(
        ({
          data,
          error,
        }: {
          data: ActivityLog[] | null;
          error: { message: string } | null;
        }) => {
          if (error) {
            console.error(error.message);
            setLoading(false);
            return;
          }

          setLogs(data ?? []);
          setLoading(false);
        }
      );
  }, [user]);

  async function addActivity(
    type: string,
    calories: number
  ) {
    if (!user) return;

    const {
      data,
      error,
    }: {
      data: ActivityLog | null;
      error: { message: string } | null;
    } = await supabase
      .from("activity_logs")
      .insert({
        user_id: user.id,
        date: today(),
        type,
        calories,
      })
      .select("id, type, calories")
      .single();

    if (error) {
      console.error(error.message);
      return;
    }

    if (data) {
      setLogs((prev) => [...prev, data]);
      window.dispatchEvent(new Event("activity-updated"));
    }    
  }

  const totalBurned = logs.reduce(
    (sum, a) => sum + a.calories,
    0
  );

  if (loading) {
    return (
      <Card title="Activiteit">
        <div className="text-sm text-gray-500">
          Activiteiten laden…
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Activiteit"
      icon={
        <Image
          src="/activity.svg"
          alt=""
          width={16}
          height={16}
        />
      }
    >
      <div className="h-full flex flex-col justify-between">
        {/* Bovenkant */}
        <div>
          <div className="text-2xl font-semibold text-[#191970]">
            {totalBurned} kcal
          </div>
          <div className="text-xs text-gray-500">
            Vandaag verbrand
          </div>
        </div>

        {/* Activiteiten toevoegen */}
        <div className="mt-4 space-y-2">
          {ACTIVITY_OPTIONS.map((a) => (
            <button
              key={a.type}
              onClick={() =>
                addActivity(a.type, a.calories)
              }
              className="w-full rounded-[var(--radius)] border px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              + {a.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
