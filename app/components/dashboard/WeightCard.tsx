"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

type WeightProfileResult = {
  weight_kg: number;
  bmi: number;
};

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Ondergewicht";
  if (bmi < 25) return "Gezond";
  if (bmi < 30) return "Overgewicht";
  return "Obesitas";
}

export default function WeightCard() {
  const { user } = useUser();

  const [weight, setWeight] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);

  // Profiel ophalen
  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("weight_kg, bmi")
      .eq("id", user.id)
      .single()
      .then(
        ({
          data,
          error,
        }: {
          data: WeightProfileResult | null;
          error: { message: string } | null;
        }) => {
          if (error) {
            console.error(error.message);
            return;
          }

          if (data) {
            setWeight(data.weight_kg);
            setBmi(data.bmi);
          }
        }
      );
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
      icon={
        <Image
          src="/weight.svg"
          alt=""
          width={16}
          height={16}
        />
      }
    >
      <div className="h-full flex flex-col justify-between">
        {/* Bovenkant */}
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-[#191970]">
            {weight} kg
          </div>
          <div className="text-xs text-gray-500">
            BMI: {bmi} ({getBMICategory(bmi)})
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-xs text-gray-600">
          BMI is een algemene indicatie en houdt geen rekening
          met spiermassa of vetpercentage.
        </div>
      </div>
    </Card>
  );
}
