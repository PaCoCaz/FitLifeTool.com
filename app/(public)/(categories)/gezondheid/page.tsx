// app/(public)/(categories)/gezondheid/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import CategoryIntroCard from "@/components/category/CategoryIntroCard";
import CategoryTopicCard from "@/components/category/CategoryTopicCard";

export default function GezondheidPage() {
  return (
    <CategoryGrid>
      {/* Intro card */}
      <div className="category-span-full">
        <CategoryIntroCard
          categoryLabel="Gezondheid"
          title="Gezondheid"
          description="Gezondheid gaat over meer dan losse metingen of momentopnames. Het draait om inzicht in de samenhang tussen lichaam, gedrag, voeding, beweging en herstel. Binnen FitLifeTool wordt gezondheid benaderd als een dynamisch geheel: meetbaar, begrijpelijk en gericht op duurzame vooruitgang."
        />
      </div>

      {/* BMI card */}
      <div className="category-span-full">
        <CategoryTopicCard
          title="BMI (Body Mass Index)"
          description="BMI is een veelgebruikte maat om lichaamsgewicht te relateren aan lengte. Het geeft een globale indicatie van gewicht in verhouding tot lengte, maar zegt niet alles over gezondheid. Binnen FitLifeTool wordt BMI altijd bekeken in samenhang met andere factoren."
          imageSrc="/images/gezondheid/bmi.png"
          imageAlt="BMI berekening op basis van lengte en gewicht"
          href="/gezondheid/bmi"
        />
      </div>
    </CategoryGrid>
  );
}
