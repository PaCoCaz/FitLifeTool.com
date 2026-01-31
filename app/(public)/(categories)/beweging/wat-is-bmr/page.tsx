// app/(public)/(categories)/beweging/wat-is-bmr/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function BMRPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Wat is je rustverbranding (BMR)?</h1>

        <p>
          Je <strong>rustverbranding</strong>, ook wel <strong>BMR (Basal Metabolic Rate)</strong>,
          is het aantal calorieën dat je lichaam in volledige rust verbruikt om
          in leven te blijven. Denk aan ademhaling, hartslag, lichaamstemperatuur
          en celherstel.
        </p>

        <p>
          Zelfs als je de hele dag zou liggen zonder te bewegen, verbrandt je lichaam
          nog steeds energie. Die basisverbranding vormt het grootste deel van je
          dagelijkse calorieverbruik.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity-bmr.png"
          alt="Diagram van rustverbranding in het lichaam"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Waar gebruikt je lichaam energie voor in rust?</h2>

        <ul>
          <li>Ademhaling en zuurstoftransport</li>
          <li>Hartslag en bloedcirculatie</li>
          <li>Regulatie van lichaamstemperatuur</li>
          <li>Hersenactiviteit en zenuwstelsel</li>
          <li>Herstel en onderhoud van cellen en organen</li>
        </ul>

        <p>
          Deze processen draaien continu, dag en nacht. Daarom is je rustverbranding
          verantwoordelijk voor ongeveer <strong>60-75% van je totale dagelijkse energieverbruik</strong>.
        </p>

        <h2>Hoe wordt je BMR berekend?</h2>

        <p>
          De meest gebruikte formule is de <strong>Mifflin-St Jeor formule</strong>.
          Deze houdt rekening met geslacht, leeftijd, lengte en gewicht.
        </p>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Formule</th>
                <th>Berekening</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mannen</td>
                <td>10 x gewicht (kg) + 6,25 x lengte (cm) - 5 x leeftijd + 5</td>
              </tr>
              <tr>
                <td>Vrouwen</td>
                <td>10 x gewicht (kg) + 6,25 x lengte (cm) - 5 x leeftijd - 161</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Wat beïnvloedt je rustverbranding?</h2>

        <ul>
          <li><strong>Spiermassa</strong> - meer spieren verhogen je BMR</li>
          <li><strong>Leeftijd</strong> - BMR daalt meestal met de jaren</li>
          <li><strong>Geslacht</strong> - mannen hebben gemiddeld een hogere BMR</li>
          <li><strong>Lengte en gewicht</strong></li>
          <li><strong>Hormonen</strong> (zoals schildklierhormonen)</li>
        </ul>

        <h2>Is een hogere BMR beter?</h2>

        <p>
          Een hogere rustverbranding betekent dat je lichaam in rust meer energie
          verbruikt. Dit kan helpen bij gewichtsbehoud of afvallen, maar het is
          slechts één onderdeel van je totale energieverbruik.
        </p>

        <h2>Veelgestelde vragen over BMR</h2>

        <Accordion
          items={[
            {
              question: "Is BMR hetzelfde als TDEE?",
              answer: "Nee. BMR is alleen je rustverbranding. TDEE is je totale dagelijkse energieverbruik inclusief beweging en sport.",
            },
            {
              question: "Kun je je BMR verhogen?",
              answer: "Ja, vooral door spiermassa op te bouwen via krachttraining.",
            },
            {
              question: "Verandert je BMR als je afvalt?",
              answer: "Ja, meestal daalt je BMR wanneer je lichaamsgewicht afneemt.",
            },
            {
              question: "Is BMR bij iedereen gelijk?",
              answer: "Nee, het verschilt per persoon afhankelijk van lichaamssamenstelling, leeftijd en geslacht.",
            },
          ]}
        />

        <h2>Samenvatting</h2>

        <p>
          Je BMR is het aantal calorieën dat je lichaam in rust verbruikt om te
          functioneren. Het vormt het grootste deel van je dagelijkse energieverbruik
          en wordt beïnvloed door spiermassa, leeftijd, lengte en gewicht.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je weten wat jouw rustverbranding is?</h2>

        <p>
          FitLifeTool berekent automatisch jouw BMR op basis van je lichaamsgegevens
          en gebruikt dit om je dagelijkse caloriebehoefte nauwkeuriger te bepalen.
        </p>

        <div className="hero-cta">
          <RegisterButton className="hero-primary-btn">
            Bereken je energieverbruik
          </RegisterButton>
        </div>
      </div>
    </CategoryGrid>
  );
}
