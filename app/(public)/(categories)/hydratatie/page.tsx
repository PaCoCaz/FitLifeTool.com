// app/(public)/(categories)/hydratatie/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";

export default function HydrationCategoryPage() {
  return (
    <CategoryGrid>
      {/* HERO CARD */}
      <div className="category-span-full category-card category-intro-card">
        <div className="category-label">HYDRATATIE</div>

        <h1>Alles wat je moet weten over goed gehydrateerd blijven.</h1>

        <p>
          Hydratatie is essentieel voor je energie, concentratie en algehele gezondheid.
          Hier leer je hoeveel je moet drinken, wanneer je het beste kunt drinken
          en hoe je jouw vochtbalans optimaal houdt.
        </p>

        <div className="hero-cta">
          <RegisterButton className="hero-primary-btn">
            Start met je hydratatie bijhouden
          </RegisterButton>
        </div>

      </div>

      {/* ================= RIJ 1 ================= */}

      <div className="home-preview-card category-card">
        <h2>
          <img src="/water_drop.svg" alt="" aria-hidden="true" className="title-icon" />
          Drink je elke dag genoeg water?
        </h2>

        <p>
          Ontdek hoeveel water jouw lichaam dagelijks nodig heeft en welke factoren
          zoals gewicht, beweging en temperatuur hier invloed op hebben.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/hydration.png" alt="Water drinken" />
        </div>

        <a href="/hydratatie/waterbehoefte" className="category-card-button category-card-link">
          Lees hoeveel water jij nodig hebt <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/water_drop.svg" alt="" aria-hidden="true" className="title-icon" />
          Wanneer moet je water drinken?
        </h2>

        <p>
          Leer hoe je jouw waterinname slim over de dag verdeelt zodat je lichaam
          optimaal gehydrateerd blijft.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/hydration-timing.png" alt="Water drinken moment" />
        </div>

        <a href="/hydratatie/drinkmomenten" className="category-card-button category-card-link">
          Bekijk de beste drinkmomenten <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/water_drop.svg" alt="" aria-hidden="true" className="title-icon" />
          Wat als je te weinig drinkt?
        </h2>

        <p>
          Herken signalen van milde uitdroging en ontdek wat langdurig vochttekort
          met je energie en gezondheid doet.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/hydration-dehydration.png" alt="Uitdroging" />
        </div>

        <a href="/hydratatie/uitdroging" className="category-card-button category-card-link">
          Lees alles over uitdroging <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="home-preview-card category-card">
        <h2>
          <img src="/water_drop.svg" alt="" aria-hidden="true" className="title-icon" />
          Hoeveel moet je drinken bij sport?
        </h2>

        <p>
          Beweging verhoogt je vochtbehoefte. Ontdek hoeveel extra water je nodig hebt
          tijdens en na inspanning.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/hydration-sport.png" alt="Sport en water" />
        </div>

        <a href="/hydratatie/sport" className="category-card-button category-card-link">
          Lees over hydratatie bij sport <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/water_drop.svg" alt="" aria-hidden="true" className="title-icon" />
          Tellen koffie en thee ook mee?
        </h2>

        <p>
          Niet alleen water hydrateert. Leer welke dranken bijdragen aan je vochtbalans
          en welke juist niet.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/hydration-drinks.png" alt="Dranken" />
        </div>

        <a href="/hydratatie/dranken" className="category-card-button category-card-link">
          Ontdek welke dranken meetellen <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/water_drop.svg" alt="" aria-hidden="true" className="title-icon" />
          FitLifeTool helpt bij je hydratatie?
        </h2>

        <p>
          Zie hoe je met FitLifeTool eenvoudig je dagelijkse waterinname bijhoudt
          en inzicht krijgt in je vochtbalans.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/hydration-tracking.png" alt="Hydratatie tracking" />
        </div>

        <a href="/hydratatie/hydratatie-tracking" className="category-card-button category-card-link">
          Bekijk hoe hydratatie tracking werkt <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>
    </CategoryGrid>
  );
}
