// app/(public)/(categories)/gewicht/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import CategoryIntroCard from "@/components/category/CategoryIntroCard";
import CategoryTopicCard from "@/components/category/CategoryTopicCard";

export default function GewichtPage() {
  return (
    <CategoryGrid>
      {/* Intro card */}
      <div className="category-span-full">
        <CategoryIntroCard
          categoryLabel="Gewicht"
          title="Gewicht"
          description="Gewicht en lichaamssamenstelling geven context aan gezondheid en energiebehoefte."
        />
      </div>
    </CategoryGrid>
  );
}
