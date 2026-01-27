// app/(public)/(categories)/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";

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
      <div className="home-grid-2col category-card home-preview-card">
        <h2>
          <img src="/water_drop.svg" alt="" aria-hidden="true" className="title-icon" />
          Drink je genoeg water op een dag?
        </h2>
        <p>
          Zie direct of je achterloopt op je persoonlijke hydratatiedoel en houd je vochtbalans eenvoudig op peil.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/hydration.png" alt="Hydratatie overzicht" />
        </div>
      </div>

      <div className="home-grid-2col category-card home-preview-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Beweeg je genoeg voor jouw doel?
        </h2>
        <p>
          Volg je dagelijkse activiteiten en ontdek of je energieverbruik aansluit bij je gezondheidsdoelen.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/activity.png" alt="Beweging en activiteit" />
        </div>
      </div>

      <div className="home-grid-2col category-card home-preview-card">
        <h2>
          <img src="/nutrition.svg" alt="" aria-hidden="true" className="title-icon" />
          Grip op calorieën zonder obsessie
        </h2>
        <p>
          Krijg inzicht in je voedingspatroon en begrijp hoe je keuzes bijdragen aan je totale gezondheid.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/nutrition.png" alt="Voeding en calorie-inzicht" />
        </div>
      </div>

      {/* ================= RIJ 2 ================= */}
      <div className="home-grid-2col category-card home-preview-card">
        <h2>
          <img src="/weight.svg" alt="" aria-hidden="true" className="title-icon" />
          Zie of je écht vooruitgaat
        </h2>
        <p>
          Volg gewicht, BMI en trends over tijd zodat je niet wordt misleid door losse momentopnames.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/weight.png" alt="Gewicht en voortgang grafiek" />
        </div>
      </div>

      <div className="home-grid-2col category-card home-preview-card">
        <h2>
          <img src="/logo_transparant.png" alt="" aria-hidden="true" className="title-icon" />
          Hoe gezond was jouw dag écht?
        </h2>
        <p>
          Combineer voeding, beweging en hydratatie in één duidelijke dagbalans en zie direct hoe je dag scoort.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/score.png" alt="Dagelijkse gezondheidsbalans" />
        </div>
      </div>

      <div className="home-grid-2col category-card home-preview-card">
        <h2>
          <img src="/target.svg" alt="" aria-hidden="true" className="title-icon" />
          Werk gericht aan je doelen
        </h2>
        <p>
          Stel persoonlijke doelen en volg je vooruitgang met duidelijke trends in plaats van losse cijfers.
        </p>
        <div className="home-preview-image">
          <img src="/images/home/goals.png" alt="Gezondheidsdoelen en voortgang" />
        </div>
      </div>

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
