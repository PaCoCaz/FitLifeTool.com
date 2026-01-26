// app/(public)/(categories)/beweging/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import CategoryIntroCard from "@/components/category/CategoryIntroCard";
import CategoryTopicCard from "@/components/category/CategoryTopicCard";

export default function BewegingPage() {
  return (
    <CategoryGrid>
      {/* Intro card */}
      <div className="category-span-full">
        <CategoryIntroCard
          categoryLabel="Beweging"
          title="Beweging"
          description="Beweging ondersteunt kracht, conditie en het aanpassingsvermogen van het lichaam."
        />
      </div>
    </CategoryGrid>
  );
}
