//  components/ui/NutritionPreview.tsx

"use client";

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
  if (!data) return null;

  const macros = [
    `Eiwitten: ${Math.round(data.protein)} g`,
    `Koolhydraten: ${Math.round(data.carbs)} g`,
    `Vetten: ${Math.round(data.fat)} g`,
  ];

  const micros = [
    `Vezels: ${data.fiber.toFixed(1)} g`,
    `Suiker: ${data.sugar.toFixed(1)} g`,
    `Zout: ${data.salt.toFixed(1)} g`,
  ];

  return (
    <div className="px-0 mb-3 text-[#191970] space-y-2">
      
      {/* Energie */}
      <div className="mb-1 font-semibold text-sm">
        Energie: ≈ {Math.round(data.kcal)} kcal
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