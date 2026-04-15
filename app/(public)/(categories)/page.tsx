// app/(public)/(categories)/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";

export default function HomePage() {
  return (
    <CategoryGrid>
      {/* HERO */}
      <div className="category-span-full category-card category-intro-card">
        <div className="category-label">FITLIFETOOL</div>

        <h1>Eindelijk grip op je gezondheid, zonder losse apps of giswerk.</h1>

        <p>
          FitLifeTool bundelt je voeding, beweging, hydratatie en gewicht in één overzicht.
          Zo zie je dagelijks waar je staat en wat je vandaag kunt verbeteren voor duurzame vooruitgang.
        </p>

        <div className="hero-cta">
          <RegisterButton className="hero-primary-btn">
            Gratis account aanmaken
          </RegisterButton>

          <a href="/uitleg" className="hero-secondary-btn">
            Bekijk hoe het werkt
          </a>
        </div>
      </div>

      {/* ================= RIJ 1 ================= */}
      <Card
        className="home-grid-2col category-card home-preview-card"
        header={
          <CardHeader
            icon="/water_drop.svg"
            title="Drink je genoeg water op een dag?"
            as="h2"
          />
        }
      >
        <p>
          Zie direct of je achterloopt op je persoonlijke hydratatiedoel en houd je vochtbalans eenvoudig op peil.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/hydration.png" alt="Hydratatie overzicht" />
        </div>
      </Card>

      <Card
        className="home-grid-2col category-card home-preview-card"
        header={
          <CardHeader
            icon="/activity.svg"
            title="Beweeg je genoeg voor jouw doel?"
            as="h2"
          />
        }
      >
        <p>
          Volg je dagelijkse activiteiten en ontdek of je energieverbruik aansluit bij je gezondheidsdoelen.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/activity.png" alt="Beweging en activiteit" />
        </div>
      </Card>  

      <Card
        className="home-grid-2col category-card home-preview-card"
        header={
          <CardHeader
            icon="/nutrition.svg"
            title="Grip op calorieën zonder obsessie"
            as="h2"
          />
        }
      >
        <p>
          Krijg inzicht in je voedingspatroon en begrijp hoe je keuzes bijdragen aan je totale gezondheid.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/nutrition.png" alt="Voeding en calorie-inzicht" />
        </div>
      </Card>

      {/* ================= RIJ 2 ================= */}

      <Card
        className="home-grid-2col category-card home-preview-card"
        header={
          <CardHeader
            icon="/weight.svg"
            title="Zie of je écht vooruitgaat"
            as="h2"
          />
        }
      >
        <p>
          Volg gewicht, BMI en trends over tijd zodat je niet wordt misleid door losse momentopnames.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/weight.png" alt="Gewicht en voortgang grafiek" />
        </div>
      </Card>

      <Card
        className="home-grid-2col category-card home-preview-card"
        header={
          <CardHeader
            icon="/heart.svg"
            title="Hoe gezond was jouw dag écht?"
            as="h2"
          />
        }
      >
        <p>
          Combineer voeding, beweging en hydratatie in één duidelijke dagbalans en zie direct hoe je dag scoort.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/score.png" alt="Dagelijkse gezondheidsbalans" />
        </div>
      </Card>

      <Card
        className="home-grid-2col category-card home-preview-card"
        header={
          <CardHeader
            icon="/target.svg"
            title="Werk gericht aan je doelen"
            as="h2"
          />
        }
      >
        <p>
          Stel persoonlijke doelen en volg je vooruitgang met duidelijke trends in plaats van losse cijfers.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/goals.png" alt="Gezondheidsdoelen en voortgang" />
        </div>
      </Card>

      {/* CTA ONDERAAN */}
      <div className="category-span-full category-card" style={{ textAlign: "center" }}>
        <h2>Klaar om te weten waar je écht staat met je gezondheid?</h2>
        <p style={{ maxWidth: "600px", margin: "0 auto 1.5rem auto" }}>
          Start gratis en ontdek binnen een paar minuten hoe jouw dagelijkse gewoontes zich vertalen naar echte vooruitgang.
        </p>

        <RegisterButton className="hero-primary-btn">
          Maak gratis een account
        </RegisterButton>
      </div>
    </CategoryGrid>
  );
}
