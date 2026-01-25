// app/(public)/(categories)/gezondheid/bmi/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import CategoryIntroCard from "@/components/category/CategoryIntroCard";
import CategoryTopicCard from "@/components/category/CategoryTopicCard";

export default function BmiPage() {
  return (
    <CategoryGrid>

      {/* Intro card */}
      <div className="category-span-full">
        <CategoryIntroCard
          categoryLabel="Gezondheid"
          title="BMI (Body Mass Index)"
          description="BMI (Body Mass Index) is een veelgebruikte methode om lichaamsgewicht te relateren aan lengte. Het wordt vaak ingezet als eerste indicatie van gewichtsstatus, maar krijgt pas betekenis wanneer het wordt bekeken in samenhang met lichaamsbouw, leefstijl en ontwikkeling over tijd."
        />
      </div>

      {/* Wat is BMI */}
      <div className="category-span-full">
        <CategoryTopicCard
          title="Wat is BMI?"
          description="De Body Mass Index berekent een verhouding tussen gewicht en lengte. Het resultaat wordt ingedeeld in categorieën zoals ondergewicht, gezond gewicht en overgewicht."
          imageSrc="/images/gezondheid/bmi-wat-is-het.png"
          imageAlt="Illustratie van BMI categorieën"
          href="/gezondheid/bmi/wat-is-bmi"
        />
      </div>

      {/* BMI berekenen */}
      <div className="category-span-full">
        <CategoryTopicCard
          title="BMI berekenen"
          description="BMI wordt berekend door het gewicht in kilogrammen te delen door het kwadraat van de lengte in meters. FitLifeTool gebruikt deze berekening als onderdeel van bredere gezondheidsinzichten."
          imageSrc="/images/gezondheid/bmi-berekenen.png"
          imageAlt="Voorbeeld van BMI berekening"
          href="/gezondheid/bmi/berekenen"
        />
      </div>

      {/* Beperkingen */}
      <div className="category-span-full">
        <CategoryTopicCard
          title="Beperkingen van BMI"
          description="BMI houdt geen rekening met spiermassa, vetverdeling of conditie. Daarom wordt BMI binnen FitLifeTool nooit los geïnterpreteerd, maar altijd in context."
          imageSrc="/images/gezondheid/bmi-beperkingen.png"
          imageAlt="Uitleg over beperkingen van BMI"
          href="/gezondheid/bmi/beperkingen"
        />
      </div>

    </CategoryGrid>
  );
}
