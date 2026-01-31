// app/(public)/(categories)/beweging/wat-is-tdee/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function TDEEPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Wat is TDEE en hoeveel calorieën verbruik je per dag?</h1>

        <p>
          <strong>TDEE</strong> staat voor <em>Total Daily Energy Expenditure</em>:
          het totale aantal calorieën dat je lichaam op een dag verbruikt. Dit is
          de som van je rustverbranding, dagelijkse beweging en sportactiviteiten.
        </p>

        <p>
          Door je TDEE te kennen, weet je hoeveel calorieën je nodig hebt om op
          gewicht te blijven, af te vallen of spiermassa op te bouwen. Het is
          daarmee de basis van elke voedings- en bewegingsstrategie.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity-tdee.png"
          alt="Diagram van dagelijkse energieverbruik"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Waaruit bestaat je TDEE?</h2>

        <p>Je totale dagelijkse energieverbruik bestaat uit vier onderdelen:</p>

        <ul>
          <li>
            <strong>BMR (Basal Metabolic Rate)</strong> - de calorieën die je lichaam
            in rust verbruikt om te functioneren
          </li>
          <li>
            <strong>NEAT</strong> - energieverbruik door dagelijkse beweging zoals lopen,
            staan en huishoudelijke taken
          </li>
          <li>
            <strong>Sport en training</strong> - calorieverbruik tijdens geplande
            inspanning
          </li>
          <li>
            <strong>Thermisch effect van voeding</strong> - energie die nodig is om
            voedsel te verteren
          </li>
        </ul>

        <h2>Hoe bereken je je TDEE?</h2>

        <p>
          Eerst wordt je <strong>BMR</strong> berekend op basis van leeftijd, lengte,
          gewicht en geslacht. Daarna wordt dit vermenigvuldigd met een
          activiteitsfactor.
        </p>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Activiteitsniveau</th>
                <th>Factor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Weinig beweging (zittend werk)</td>
                <td>1.2</td>
              </tr>
              <tr>
                <td>Licht actief (1-3x per week sporten)</td>
                <td>1.375</td>
              </tr>
              <tr>
                <td>Gemiddeld actief (3-5x per week sporten)</td>
                <td>1.55</td>
              </tr>
              <tr>
                <td>Zeer actief (6-7x per week sporten)</td>
                <td>1.725</td>
              </tr>
              <tr>
                <td>Extreem actief (zware fysieke arbeid)</td>
                <td>1.9</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>Formule:</strong> TDEE = BMR x activiteitsfactor
        </p>

        <h2>Waarom is TDEE belangrijk?</h2>

        <ul>
          <li>Om af te vallen moet je onder je TDEE eten</li>
          <li>Om aan te komen moet je boven je TDEE eten</li>
          <li>Voor gewichtsbehoud eet je rond je TDEE</li>
        </ul>

        <h2>Wat beïnvloedt je TDEE?</h2>

        <ul>
          <li>Lichaamsgewicht en spiermassa</li>
          <li>Hoeveel je beweegt op een dag</li>
          <li>Sportintensiteit</li>
          <li>Leeftijd</li>
          <li>Geslacht</li>
        </ul>

        <h2>Veelgestelde vragen over TDEE</h2>

        <Accordion
          items={[
            {
              question: "Is TDEE hetzelfde als BMR?",
              answer: "Nee. BMR is alleen je rustverbranding. TDEE is je totale dagelijkse energieverbruik inclusief beweging en sport.",
            },
            {
              question: "Verandert mijn TDEE als ik afval?",
              answer: "Ja. Een lager lichaamsgewicht betekent meestal een lager energieverbruik.",
            },
            {
              question: "Is TDEE een exacte waarde?",
              answer: "Nee, het is een schatting. Je werkelijke verbruik kan per dag verschillen.",
            },
            {
              question: "Helpt meer bewegen mijn TDEE verhogen?",
              answer: "Ja. Meer activiteit verhoogt je dagelijkse calorieverbruik.",
            },
          ]}
        />

        <h2>Samenvatting</h2>

        <p>
          TDEE is het totale aantal calorieën dat je lichaam dagelijks verbruikt.
          Het bestaat uit rustverbranding en alle vormen van beweging. Door je
          TDEE te kennen, kun je gerichter werken aan afvallen, spieropbouw of
          gewichtsbehoud.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je jouw persoonlijke TDEE automatisch laten berekenen?</h2>

        <p>
          FitLifeTool combineert je gewicht, activiteit en leefstijl om jouw
          dagelijkse energieverbruik inzichtelijk te maken.
        </p>

        <div className="hero-cta">
          <RegisterButton className="hero-primary-btn">
            Start met je activiteit bijhouden
          </RegisterButton>
        </div>
      </div>
    </CategoryGrid>
  );
}
