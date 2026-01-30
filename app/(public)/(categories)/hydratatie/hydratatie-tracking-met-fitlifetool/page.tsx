// app/(public)/(categories)/hydratatie/hydratatie-tracking-met-fitlifetool/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";
import Link from "next/link";

export default function HydratatieTrackingPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text category-article-intro-card">
        <div className="category-label">HYDRATATIE</div>

        <h1>FitLifeTool helpt bij je hydratatie</h1>

        <p>
          Voldoende drinken is essentieel voor je energie, concentratie en algehele gezondheid.
          Toch is het lastig om te weten of je écht genoeg drinkt. FitLifeTool helpt je om
          je dagelijkse waterinname eenvoudig bij te houden en inzicht te krijgen in je vochtbalans.
        </p>

        <p>
          Weet je nog niet hoeveel jij nodig hebt? Lees eerst{" "}
          <Link href="/hydratatie/hoeveel-water-moet-je-per-dag-drinken">
            hoeveel water je per dag moet drinken
          </Link>.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/hydration-tracking.png"
          alt="Hydratatie bijhouden in een app"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Waarom je hydratatie bijhouden helpt</h2>
        <p>
          Veel mensen drinken onregelmatig en merken pas dat ze te weinig hebben gedronken
          wanneer ze al dorst of vermoeidheid voelen. Door je vochtinname bij te houden,
          krijg je inzicht in je gewoontes en zie je direct of je op schema ligt.
        </p>

        <h2>Wat FitLifeTool voor je berekent</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Onderdeel</th>
                <th>Wat FitLifeTool doet</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Persoonlijk hydratatiedoel</td>
                <td>Gebaseerd op je gewicht en leefstijl</td>
              </tr>
              <tr>
                <td>Dagelijkse voortgang</td>
                <td>Laat zien hoeveel je al hebt gedronken</td>
              </tr>
              <tr>
                <td>Balans over de dag</td>
                <td>Inzicht of je gelijkmatig drinkt</td>
              </tr>
              <tr>
                <td>Langetermijntrend</td>
                <td>Toont patronen in je drinkgedrag</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Welke dranken kun je bijhouden?</h2>
        <p>
          In FitLifeTool kun je eenvoudig water, thee, koffie en andere dranken invoeren.
          Zo zie je hoeveel daarvan bijdragen aan je totale vochtinname. Twijfel je wat meetelt?
          Lees dan ook{" "}
          <Link href="/hydratatie/tellen-koffie-thee-en-andere-dranken-mee">
            welke dranken meetellen voor je hydratatie
          </Link>.
        </p>

        <h2>Waarom inzicht motiveert</h2>
        <ul>
          <li>Je ziet direct of je achterloopt op je doel</li>
          <li>Je leert je drinkmomenten beter spreiden</li>
          <li>Je voorkomt grote tekorten aan het einde van de dag</li>
          <li>Je bouwt een gezondere gewoonte op zonder te gokken</li>
        </ul>

        <h2>Veelgestelde vragen over hydratatie bijhouden</h2>

        <Accordion
          items={[
            {
              question: "Moet ik elke slok water invoeren?",
              answer: "Nee, je kunt eenvoudig grotere hoeveelheden invoeren, zoals een glas of fles water.",
            },
            {
              question: "Houdt FitLifeTool rekening met mijn gewicht?",
              answer: "Ja, je persoonlijke hydratatiedoel wordt afgestemd op je lichaamsgewicht en leefstijl.",
            },
            {
              question: "Kan ik ook koffie en thee invoeren?",
              answer: "Ja, verschillende dranken kunnen worden geregistreerd zodat je totale vochtinname klopt.",
            },
            {
              question: "Waarom is spreiding over de dag belangrijk?",
              answer: "Je lichaam kan vocht beter benutten als je regelmatig drinkt in plaats van alles in één keer.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          FitLifeTool helpt je om je hydratatie inzichtelijk en eenvoudig bij te houden.
          Door je persoonlijke doel, voortgang en drinkmomenten te volgen, weet je precies
          waar je staat en voorkom je dat je ongemerkt te weinig drinkt.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Klaar om grip te krijgen op je hydratatie?</h2>

        <p>
          Start vandaag nog met het bijhouden van je waterinname en ontdek hoe kleine gewoontes
          een groot verschil maken voor je energie en gezondheid.
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
