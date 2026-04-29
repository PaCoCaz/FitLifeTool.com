//  components/ui/NutritionPreview.tsx

"use client";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

type NutritionPreviewData = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  salt: number;
};

type Props = {
  data: NutritionPreviewData | null;
};

export default function NutritionPreview({ data }: Props) {
  const langCode = useLang();
  const t = uiText[langCode];

  if (!data) return null;

  const macros = [
    `${t.nutrition.protein}: ${Math.round(data.protein)} g`,
    `${t.nutrition.carbs}: ${Math.round(data.carbs)} g`,
    `${t.nutrition.fat}: ${Math.round(data.fat)} g`,
  ];

  const micros = [
    `${t.nutrition.fiber}: ${data.fiber.toFixed(1)} g`,
    `${t.nutrition.sugar}: ${data.sugar.toFixed(1)} g`,
    `${t.nutrition.salt}: ${data.salt.toFixed(1)} g`,
  ];

  return (
    <div className="px-0 mb-3 text-[#191970] space-y-2">
      
      {/* Energie */}
      <div className="mb-1 font-semibold text-sm">
        {t.nutrition.energy}: ≈ {Math.round(data.kcal)} kcal
      </div>

      {/* Macro + Micro */}
      <div className="text-xs">

        <div className="mb-0 font-medium">
          {macros.join(", ")}
        </div>

        <div className="text-[#5A6B85]">
          {micros.join(", ")}
        </div>

      </div>
    </div>
  );
}