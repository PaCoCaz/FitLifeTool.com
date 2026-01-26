// app/(public)/(categories)/hydratatie/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import CategoryIntroCard from "@/components/category/CategoryIntroCard";
import CategoryTopicCard from "@/components/category/CategoryTopicCard";

export default function HydratatiePage() {
  return (
    <CategoryGrid>
      {/* Intro card */}
      <div className="category-span-full">
        <CategoryIntroCard
          categoryLabel="Hydratatie"
          title="Hydratatie"
          description="Voldoende hydratatie is essentieel voor fysieke prestaties en herstel."
        />
      </div>
    </CategoryGrid>
  );
}
