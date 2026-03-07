"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useRouter } from "next/navigation";

/* ───────────────── Types ───────────────── */

type WeightProfileResult = {
  weight_kg: number;
  bmi: number;
  target_weight_kg: number | null;
  height_cm: number;
};

/* ───────────────── Helpers ───────────────── */

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Ondergewicht";
  if (bmi < 25) return "Gezond";
  if (bmi < 30) return "Overgewicht";
  return "Obesitas";
}

/* ───────────────── BMI segmentdefinitie ───────────────── */

const BMI_SEGMENTS = [
  { min: 15, max: 18.5, width: 22 },
  { min: 18.5, max: 25, width: 28 },
  { min: 25, max: 30, width: 25 },
  { min: 30, max: 40, width: 25 },
];

function getBMIPercentage(bmi: number): number {
  let offset = 0;

  for (const segment of BMI_SEGMENTS) {
    if (bmi >= segment.min && bmi <= segment.max) {
      const progress =
        (bmi - segment.min) / (segment.max - segment.min);
      return offset + progress * segment.width;
    }
    offset += segment.width;
  }

  if (bmi < BMI_SEGMENTS[0].min) return 0;
  return 100;
}

/* ───────────────── BMI Balk ───────────────── */

function BMIBar({ bmi }: { bmi: number }) {
  const percentage = getBMIPercentage(bmi);

  return (
    <div className="mt-4">
      <div className="relative w-full">
        <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className="absolute left-0 top-0 h-2 w-[22%] bg-[#0095D3]" />
          <div className="absolute left-[22%] top-0 h-2 w-[28%] bg-green-600" />
          <div className="absolute left-[50%] top-0 h-2 w-[25%] bg-orange-500" />
          <div className="absolute left-[75%] top-0 h-2 w-[25%] bg-[#C80000]" />

          <div className="absolute left-[22%] top-0 h-2 w-[2px] bg-white" />
          <div className="absolute left-[50%] top-0 h-2 w-[2px] bg-white" />
          <div className="absolute left-[75%] top-0 h-2 w-[2px] bg-white" />
        </div>

        <div
          className="absolute -top-3 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-[#191970]" />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-[22%_28%_25%_25%] text-center">
        <div>
          <div className="text-[10px] font-medium text-gray-600">
            Ondergewicht
          </div>
          <div className="text-[9px] text-gray-400">&lt; 18.5</div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-600">
            Gezond
          </div>
          <div className="text-[9px] text-gray-400">
            18.5 – 24.9
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-600">
            Overgewicht
          </div>
          <div className="text-[9px] text-gray-400">
            25 – 29.9
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-600">
            Obesitas
          </div>
          <div className="text-[9px] text-gray-400">≥ 30</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── WeightCard ───────────────── */

export default function WeightCard() {
  const { user } = useUser();
  const router = useRouter();

  const [weight, setWeight] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);

  /* ───────────────── Load profile ───────────────── */

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    supabase
      .from("profiles")
      .select("weight_kg, bmi, target_weight_kg, height_cm")
      .eq("id", userId)
      .single()
      .then(({ data }: { data: WeightProfileResult | null }) => {
        if (!data) return;

        setWeight(data.weight_kg);
        setBmi(data.bmi);
        setTargetWeight(data.target_weight_kg);
      });
  }, [user]);

  if (weight === null || bmi === null) {
    return (
      <Card title="Gewicht">
        <div className="text-sm text-gray-500">
          Gegevens laden…
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Gewicht"
      icon={<Image src="/weight.svg" alt="" width={16} height={16} />}
    >
      <div className="space-y-1">

        <div className="text-2xl font-semibold text-[#191970]">
          {weight} kg
        </div>

        {targetWeight && (
          <div className="text-xs text-gray-500">
            Streefgewicht: {targetWeight} kg
          </div>
        )}

        <div className="text-xs text-gray-500">
          BMI: {bmi.toFixed(1)} ({getBMICategory(bmi)})
        </div>

        <BMIBar bmi={bmi} />

      </div>
    </Card>
  );
}