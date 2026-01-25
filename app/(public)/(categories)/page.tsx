// app/(public)/(categories)/page.tsx

import Link from "next/link";
import CategoryGrid from "@/components/layout/CategoryGrid";

export default function CategoriesHomePage() {
  return (
    <CategoryGrid>
      {/* =========================
         INTRO CARD (H1)
         ========================= */}
      <div className="category-span-full">
        <section className="category-card category-intro-card">
          <div className="category-label">FITLIFETOOL</div>
          <h1>Grip op je gezondheid</h1>
          <p>
            FitLifeTool geeft je dagelijks inzicht in je gezondheid. Geen losse
            metingen of momentopnames, maar begrijpelijke indicatoren die laten
            zien waar je staat, hoe je je ontwikkelt en wat je vandaag kunt doen
            om duurzame vooruitgang te boeken.
          </p>
        </section>
      </div>

      {/* =========================
         RIJ 2 — Hydratatie / Beweging
         ========================= */}

      <div className="col-span-12 md:col-span-6">
        <Link href="/gezondheid/hydratatie" className="block h-full">
          <article className="category-card h-full">
            <h2>Hydratatie</h2>
            <p>
              Zie hoeveel vocht je dagelijks binnenkrijgt en hoe dit zich
              verhoudt tot jouw persoonlijke waterdoel.
            </p>

            <div className="category-card-image">
              <img
                src="/images/previews/hydratatie.png"
                alt="Overzicht van hydratatie en waterinname"
              />
            </div>
          </article>
        </Link>
      </div>

      <div className="col-span-12 md:col-span-6">
        <Link href="/gezondheid/beweging" className="block h-full">
          <article className="category-card h-full">
            <h2>Beweging</h2>
            <p>
              Volg dagelijkse activiteit, energieverbruik en bewegingsdoelen in
              één overzicht.
            </p>

            <div className="category-card-image">
              <img
                src="/images/previews/beweging.png"
                alt="Activiteit en bewegingsoverzicht"
              />
            </div>
          </article>
        </Link>
      </div>

      {/* =========================
         RIJ 3 — Voeding / Gewicht
         ========================= */}

      <div className="col-span-12 md:col-span-6">
        <Link href="/gezondheid/voeding" className="block h-full">
          <article className="category-card h-full">
            <h2>Voeding</h2>
            <p>
              Begrijp calorie-inname, macro’s en eetpatronen zonder giswerk of
              losse apps.
            </p>

            <div className="category-card-image">
              <img
                src="/images/previews/voeding.png"
                alt="Voedingsinname en macroverdeling"
              />
            </div>
          </article>
        </Link>
      </div>

      <div className="col-span-12 md:col-span-6">
        <Link href="/gezondheid/gewicht" className="block h-full">
          <article className="category-card h-full">
            <h2>Gewicht</h2>
            <p>
              Volg gewicht, BMI en trends over tijd als onderdeel van je totale
              gezondheidsbeeld.
            </p>

            <div className="category-card-image">
              <img
                src="/images/previews/gewicht.png"
                alt="Gewichts- en BMI-trends"
              />
            </div>
          </article>
        </Link>
      </div>
    </CategoryGrid>
  );
}
