// app/(public)/(categories)/hydratatie/tellen-koffie-thee-en-andere-dranken-mee-voor-hydratatie/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";
import Link from "next/link";

export default function DrankenHydratatiePage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text category-article-intro-card">
        <div className="category-label">HYDRATATIE</div>

        <h1>Tellen koffie, thee en andere dranken mee voor je hydratatie?</h1>

        <p>
          Veel mensen denken dat alleen water telt voor je hydratatie, maar dat is niet helemaal waar.
          Ook andere dranken leveren vocht aan je lichaam. Toch hydrateren niet alle dranken even goed,
          en sommige hebben zelfs een tegengesteld effect.
        </p>

        <p>
          Weet je nog niet hoeveel vocht je per dag nodig hebt? Lees eerst{" "}
          <Link href="/hydratatie/hoeveel-water-moet-je-per-dag-drinken">
            hoeveel water je per dag moet drinken
          </Link>
          .
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/hydration-drinks.png"
          alt="Verschillende dranken zoals water, thee en koffie"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Welke dranken hydrateren goed?</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Drank</th>
                <th>Draagt bij aan hydratatie?</th>
                <th>Opmerking</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Water</td>
                <td>Ja — beste keuze</td>
                <td>Hydrateert zonder extra calorieën of toevoegingen</td>
              </tr>
              <tr>
                <td>Thee</td>
                <td>Ja</td>
                <td>Ook met cafeïne levert thee netto vocht</td>
              </tr>
              <tr>
                <td>Koffie</td>
                <td>Ja (met mate)</td>
                <td>Lichte vochtafdrijvende werking, maar telt mee</td>
              </tr>
              <tr>
                <td>Melk</td>
                <td>Ja</td>
                <td>Bevat vocht én voedingsstoffen</td>
              </tr>
              <tr>
                <td>Soep</td>
                <td>Ja</td>
                <td>Kan flink bijdragen aan totale vochtinname</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Welke dranken hydrateren minder goed?</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Drank</th>
                <th>Effect op hydratatie</th>
                <th>Waarom</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alcohol</td>
                <td>Vermindert hydratatie</td>
                <td>Stimuleert vochtverlies via urine</td>
              </tr>
              <tr>
                <td>Suikerrijke frisdrank</td>
                <td>Beperkt hydraterend</td>
                <td>Veel suiker, minder effectief voor vochtbalans</td>
              </tr>
              <tr>
                <td>Energiedranken</td>
                <td>Beperkt hydraterend</td>
                <td>Bevat cafeïne en suiker</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Telt koffie echt mee als vocht?</h2>
        <p>
          Ja. Hoewel cafeïne een licht vochtafdrijvend effect heeft, levert koffie netto nog steeds vocht.
          Bij normale consumptie (1–4 koppen per dag) draagt koffie gewoon bij aan je dagelijkse vochtinname.
        </p>

        <h2>Hoe zit het met thee?</h2>
        <p>
          Thee bestaat grotendeels uit water en hydrateert goed. Zelfs zwarte en groene thee met cafeïne
          dragen bij aan je vochtbalans. Kruidenthee is volledig cafeïnevrij en dus een uitstekende keuze.
        </p>

        <h2>Waarom is water toch de beste basis?</h2>
        <ul>
          <li>Bevat geen calorieën of suiker</li>
          <li>Belast je spijsvertering niet</li>
          <li>Ondersteunt alle lichaamsfuncties direct</li>
          <li>Helpt je dorstgevoel betrouwbaar reguleren</li>
        </ul>

        <p>
          Door water als basis te nemen en andere dranken als aanvulling te zien, blijf je het best gehydrateerd.
          Lees ook{" "}
          <Link href="/hydratatie/wanneer-moet-je-water-drinken">
            wanneer je het beste kunt drinken
          </Link>{" "}
          om je inname goed te spreiden.
        </p>

        <h2>Veelgestelde vragen over dranken en hydratatie</h2>

        <Accordion
          items={[
            {
              question: "Telt koffie net zo goed mee als water?",
              answer: "Niet helemaal. Koffie hydrateert wel, maar water blijft de beste basis omdat het geen cafeïne bevat.",
            },
            {
              question: "Is thee beter dan koffie voor hydratatie?",
              answer: "Beide dragen bij. Kruidenthee is cafeïnevrij en daarom een uitstekende hydraterende keuze.",
            },
            {
              question: "Telt frisdrank als vocht?",
              answer: "Het levert vocht, maar door het hoge suikergehalte is het geen goede primaire bron van hydratatie.",
            },
            {
              question: "Waarom droogt alcohol uit?",
              answer: "Alcohol remt het hormoon dat je vocht vasthoudt, waardoor je meer vocht verliest via urine.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          Niet alleen water telt mee voor je hydratatie. Ook thee, koffie, melk en soep dragen bij aan je
          vochtinname. Alcohol en suikerrijke dranken hydrateren minder goed. Water blijft de beste basis
          voor een gezonde vochtbalans.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Houd jij bij wat je écht drinkt op een dag?</h2>

        <p>
          Met FitLifeTool kun je eenvoudig al je dranken bijhouden en zien hoeveel daarvan
          echt bijdragen aan je dagelijkse hydratatie.
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
