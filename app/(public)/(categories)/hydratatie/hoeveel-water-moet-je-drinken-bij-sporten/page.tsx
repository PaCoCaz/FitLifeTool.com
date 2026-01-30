// app/(public)/(categories)/hydratatie/hoeveel-water-moet-je-drinken-bij-sporten/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";
import Link from "next/link";

export default function HydratatieBijSportPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text category-article-intro-card">
        <div className="category-label">HYDRATATIE</div>

        <h1>Hoeveel water moet je drinken bij sporten?</h1>

        <p>
          Tijdens het sporten verliest je lichaam extra vocht via zweet. Dit vochtverlies
          moet worden aangevuld om je prestaties, herstel en lichaamstemperatuur op peil te houden.
          Hoeveel je precies moet drinken hangt af van de intensiteit, duur en omstandigheden
          waarin je beweegt.
        </p>

        <p>
          Weet je nog niet wat je basisbehoefte is? Lees eerst{" "}
          <Link href="/hydratatie/hoeveel-water-moet-je-per-dag-drinken">
            hoeveel water je per dag nodig hebt
          </Link>
          , en tel daar je sportverbruik bij op.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/hydration-sport.png"
          alt="Iemand drinkt water tijdens het sporten"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Waarom is drinken bij sport zo belangrijk?</h2>
        <p>
          Tijdens inspanning stijgt je lichaamstemperatuur en begin je te zweten.
          Zweet bestaat grotendeels uit water en elektrolyten. Als je dit verlies
          niet aanvult, daalt je bloedvolume en moet je hart harder werken.
          Dit kan leiden tot vermoeidheid, duizeligheid en slechtere prestaties.
        </p>

        <h2>Gemiddeld vochtverlies tijdens sporten</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Type inspanning</th>
                <th>Gemiddeld vochtverlies</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lichte inspanning (wandelen, yoga)</td>
                <td>± 0,3 – 0,5 liter per uur</td>
              </tr>
              <tr>
                <td>Matige inspanning (fitness, fietsen)</td>
                <td>± 0,5 – 1 liter per uur</td>
              </tr>
              <tr>
                <td>Intensieve inspanning (hardlopen, teamsport)</td>
                <td>± 1 – 2 liter per uur</td>
              </tr>
              <tr>
                <td>Sport in warme omstandigheden</td>
                <td>Kan oplopen tot 2+ liter per uur</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Hoeveel moet je drinken voor, tijdens en na het sporten?</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Moment</th>
                <th>Advies</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Voor het sporten</td>
                <td>Drink 300–500 ml in het uur vooraf</td>
              </tr>
              <tr>
                <td>Tijdens het sporten</td>
                <td>Drink elke 15–20 minuten een paar slokken</td>
              </tr>
              <tr>
                <td>Na het sporten</td>
                <td>Vul 1,2–1,5× het verloren gewicht in vocht aan</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Regelmatig kleine hoeveelheden drinken werkt beter dan in één keer veel.
          Lees ook{" "}
          <Link href="/hydratatie/wanneer-moet-je-water-drinken">
            wanneer je het beste water kunt drinken
          </Link>{" "}
          om je hydratatie over de dag te spreiden.
        </p>

        <h2>Wanneer zijn sportdranken nodig?</h2>
        <p>
          Bij inspanning langer dan 60–90 minuten kan een drank met elektrolyten
          helpen om zoutverlies via zweet aan te vullen. Voor kortere trainingen
          is water meestal voldoende.
        </p>

        <h2>Signalen dat je te weinig drinkt tijdens sport</h2>
        <ul>
          <li>Snelle vermoeidheid</li>
          <li>Duizeligheid of licht gevoel in het hoofd</li>
          <li>Spierkrampen</li>
          <li>Droge mond en sterke dorst</li>
          <li>Donkergele urine na inspanning</li>
        </ul>

        <p>
          Merk je deze signalen vaak? Dan is de kans groot dat je structureel
          te weinig drinkt. Lees ook wat er gebeurt{" "}
          <Link href="/hydratatie/wat-gebeurt-er-als-je-te-weinig-drinkt">
            als je te weinig drinkt
          </Link>.
        </p>

        <h2>Veelgestelde vragen over hydratatie bij sport</h2>

        <Accordion
          items={[
            {
              question: "Moet je wachten met drinken tot je dorst hebt tijdens sport?",
              answer: "Nee, dorst is een laat signaal. Drink regelmatig kleine hoeveelheden.",
            },
            {
              question: "Is alleen water voldoende bij lange trainingen?",
              answer: "Bij inspanning langer dan 60–90 minuten kunnen elektrolyten nuttig zijn.",
            },
            {
              question: "Kun je te veel drinken tijdens sport?",
              answer: "Ja, extreem veel water zonder elektrolyten kan gevaarlijk zijn, maar dit komt zelden voor bij normale sporters.",
            },
            {
              question: "Hoe weet je hoeveel vocht je verloren hebt?",
              answer: "Weeg jezelf voor en na het sporten. Elk verloren kilo staat gelijk aan ongeveer 1 liter vocht.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          Tijdens het sporten verlies je extra vocht via zweet. Afhankelijk van
          intensiteit en omstandigheden kan dit oplopen tot 1–2 liter per uur.
          Door vóór, tijdens en na het sporten regelmatig te drinken, blijf je
          beter presteren en herstel je sneller.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je weten of jij genoeg drinkt tijdens het sporten?</h2>

        <p>
          FitLifeTool helpt je om je dagelijkse en sportgerelateerde vochtinname
          bij te houden en laat zien of je jouw hydratatiedoel haalt.
        </p>

        <div className="hero-cta">
          <RegisterButton className="hero-primary-btn">
            Start met je hydratatie bijhouden
          </RegisterButton>
        </div>
      </div>
    </CategoryGrid>
  );
}
