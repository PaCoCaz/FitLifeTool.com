// app/(public)/(categories)/leefstijl/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import CategoryIntroCard from "@/components/category/CategoryIntroCard";
import CategoryTopicCard from "@/components/category/CategoryTopicCard";

export default function LeefstijlPage() {
  return (
    <CategoryGrid>
      {/* Intro card */}
      <div className="category-span-full">
        <CategoryIntroCard
          categoryLabel="Leefstijl"
          title="Leefstijl"
          description="Leefstijl omvat gedrag, routines en keuzes die gezondheid beïnvloeden."
        />
      </div>
    </CategoryGrid>
  );
}
