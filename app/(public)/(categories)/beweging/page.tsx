// app/(public)/(categories)/beweging/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";

export default function ActivityCategoryPage() {
  return (
    <CategoryGrid>
      {/* HERO CARD */}
      <div className="category-span-full category-card category-intro-card">
        <div className="category-label">BEWEGING</div>

        <h1>Alles wat je moet weten over bewegen en calorieverbruik.</h1>

        <p>
          Beweging is essentieel voor je gezondheid, energieniveau en
          stofwisseling. Hier leer je hoeveel je moet bewegen, hoeveel calorieën
          je verbrandt en hoe activiteit bijdraagt aan je algehele fitheid.
        </p>

        <div className="hero-cta">
          <RegisterButton className="hero-primary-btn">
            Start met je activiteit bijhouden
          </RegisterButton>
        </div>
      </div>

      {/* ================= RIJ 1 ================= */}

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Calorieën verbranden
        </h2>

        <p>
          Ontdek hoeveel energie je lichaam verbruikt tijdens wandelen,
          sporten en dagelijkse activiteiten.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity-calories.png" alt="Calorieverbruik bij beweging" />
        </div>

        <a href="/beweging/hoeveel-calorieen-verbrand-je-met-bewegen" className="category-card-button category-card-link">
          Bekijk je calorieverbruik <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Hoeveel moet je per dag bewegen?
        </h2>

        <p>
          Leer wat de aanbevolen hoeveelheid dagelijkse beweging is voor een
          gezonde leefstijl.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity.png" alt="Dagelijkse beweging" />
        </div>

        <a href="/beweging/hoeveel-moet-je-bewegen-per-dag" className="category-card-button category-card-link">
          Lees de beweegrichtlijnen <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Cardio vs krachttraining?
        </h2>

        <p>
          Ontdek hoe verschillende soorten training je lichaam beïnvloeden en
          wanneer je welke vorm het beste kunt inzetten.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity-types.png" alt="Cardio en krachttraining" />
        </div>

        <a href="/beweging/cardio-vs-krachttraining" className="category-card-button category-card-link">
          Vergelijk trainingsvormen <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Is 10.000 stappen per dag nodig?
        </h2>

        <p>
          Begrijp waar de 10.000-stappenregel vandaan komt en wat écht belangrijk
          is voor je gezondheid.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity-steps.png" alt="Stappen tellen" />
        </div>

        <a href="/beweging/is-10000-stappen-per-dag-nodig" className="category-card-button category-card-link">
          Lees over stappen en gezondheid <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Beweging en stofwisseling
        </h2>

        <p>
          Zie hoe activiteit je verbranding verhoogt en welke rol beweging
          speelt in je energiebalans.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity-metabolism.png" alt="Stofwisseling en beweging" />
        </div>

        <a href="/beweging/beweging-en-stofwisseling" className="category-card-button category-card-link">
          Ontdek het effect op je verbranding <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Activiteit bijhouden met FitLifeTool?
        </h2>

        <p>
          Zie hoe je met FitLifeTool eenvoudig je dagelijkse beweging bijhoudt
          en inzicht krijgt in je calorieverbruik.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity-tracking.png" alt="Activiteit tracking" />
        </div>

        <a href="/beweging/activiteit-tracking-met-fitlifetool" className="category-card-button category-card-link">
          Bekijk hoe activiteit tracking werkt <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      {/* ================= RIJ 3 ================= */}

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Wat is TDEE en hoe bereken je dit?
        </h2>

        <p>
          Leer wat TDEE betekent en hoe je rustverbranding en beweging samen je
          totale dagelijkse calorieverbruik bepalen.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity-tdee.png" alt="Totale energieverbruik berekening" />
        </div>

        <a href="/beweging/wat-is-tdee" className="category-card-button category-card-link">
          Ontdek wat TDEE is <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Wat zijn MET-waarden?
        </h2>

        <p>
          Begrijp hoe inspanningsniveau wordt omgerekend naar calorieverbruik en
          waarom dezelfde activiteit per persoon verschilt.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity-met.png" alt="MET-waarden uitleg" />
        </div>

        <a href="/beweging/wat-zijn-met-waarden" className="category-card-button category-card-link">
          Lees over MET-waarden <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>

      <div className="home-preview-card category-card">
        <h2>
          <img src="/activity.svg" alt="" aria-hidden="true" className="title-icon" />
          Wat is je rustverbranding (BMR)?
        </h2>

        <p>
          Ontdek hoeveel calorieën je lichaam in rust verbruikt en waarom dit de
          basis is van je totale energiebehoefte.
        </p>

        <div className="home-preview-image">
          <img src="/images/categories/activity-bmr.png" alt="Rustverbranding berekening" />
        </div>

        <a href="/beweging/wat-is-bmr" className="category-card-button category-card-link">
          Leer wat BMR betekent <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
        </a>
      </div>
    </CategoryGrid>
  );
}
