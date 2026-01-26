// app/(public)/(categories)/voeding/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import CategoryIntroCard from "@/components/category/CategoryIntroCard";
import CategoryTopicCard from "@/components/category/CategoryTopicCard";

export default function VoedingPage() {
  return (
    <CategoryGrid>
      {/* Intro card */}
      <div className="category-span-full">
        <CategoryIntroCard
          categoryLabel="Voeding"
          title="Voeding"
          description="Voeding vormt de basis voor energie, herstel en lichamelijk functioneren."
        />
      </div>
    </CategoryGrid>
  );
}
