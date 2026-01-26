// app/(public)/(categories)/herstel/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import CategoryIntroCard from "@/components/category/CategoryIntroCard";
import CategoryTopicCard from "@/components/category/CategoryTopicCard";

export default function HerstelPage() {
  return (
    <CategoryGrid>
      {/* Intro card */}
      <div className="category-span-full">
        <CategoryIntroCard
          categoryLabel="Herstel"
          title="Herstel"
          description="Herstel bepaalt hoe het lichaam reageert op belasting, stress en training."
        />
      </div>
    </CategoryGrid>
  );
}
