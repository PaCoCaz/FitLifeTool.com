// app/(public)/(categories)/beweging/wat-zijn-met-waarden/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function METPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Wat zijn MET-waarden en hoe bereken je het calorieverbruik?</h1>

        <p>
          <strong>MET</strong> staat voor <strong>Metabolic Equivalent of Task</strong>, het is een maat die aangeeft hoeveel energie een activiteit kost ten opzichte van volledige rust.
        </p>

        <p>
          Je energieverbruik in rust is 1 MET, een activiteit van 4 MET betekent dus dat je lichaam vier keer zoveel energie verbruikt als wanneer je stil zit.
          MET-waarden worden gebruikt om het calorieverbruik van beweging te schatten.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity-met.png"
          alt="Grafiek met MET-waarden voor verschillende activiteiten"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Wat betekent 1 MET precies?</h2>

        <p>
          De waarde 1 MET komt ongeveer overeen met <strong>1 kcal per kilogram lichaamsgewicht per uur</strong>, voor iemand van 70 kg betekent dat dus ongeveer 70 kcal per uur in rust.
        </p>

        <h2>Hoe bereken je calorieverbruik met MET?</h2>

        <p>
          Je calorieverbruik tijdens activiteit kun je schatten met deze formule:
        </p>

        <p className="formula">
          Calorieën per uur = MET x lichaamsgewicht (kg)
        </p>

        <p>
          Voorbeeld: iemand van 80 kg die een activiteit doet van 5 MET verbruikt
          ongeveer 5 x 80 = <strong>400 kcal per uur</strong>.
        </p>

        <h2>Voorbeelden van MET-waarden per activiteit</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Activiteit</th>
                <th>MET-waarde</th>
                <th>Intensiteit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rustig zitten</td>
                <td>1,0</td>
                <td>Zeer licht</td>
              </tr>
              <tr>
                <td>Wandelen (5 km/u)</td>
                <td>3,5</td>
                <td>Licht tot matig</td>
              </tr>
              <tr>
                <td>Fietsen (rustig tempo)</td>
                <td>4,0</td>
                <td>Matig</td>
              </tr>
              <tr>
                <td>Hardlopen (8 km/u)</td>
                <td>8,0</td>
                <td>Zwaar</td>
              </tr>
              <tr>
                <td>Krachttraining</td>
                <td>5-6</td>
                <td>Matig tot zwaar</td>
              </tr>
              <tr>
                <td>Touwtje springen</td>
                <td>10-12</td>
                <td>Zeer zwaar</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Waarom zijn MET-waarden handig?</h2>

        <ul>
          <li>Je kunt activiteiten objectief vergelijken</li>
          <li>Ze helpen bij het schatten van calorieverbruik</li>
          <li>Ze worden gebruikt in gezondheidsrichtlijnen en onderzoek</li>
          <li>Fitnessapps gebruiken MET om verbranding te berekenen</li>
        </ul>

        <h2>Zijn MET-waarden voor iedereen exact?</h2>

        <p>
          Nee. MET-waarden zijn gemiddelden. Werkelijk calorieverbruik hangt ook af van
          je conditie, spiermassa, techniek en efficiëntie van bewegen.
        </p>

        <h2>Veelgestelde vragen over MET-waarden</h2>

        <Accordion
          items={[
            {
              question: "Is 8 MET altijd zwaar?",
              answer: "Voor de meeste mensen wel. Het komt overeen met intensieve activiteiten zoals hardlopen.",
            },
            {
              question: "Kun je MET gebruiken om af te vallen?",
              answer: "Ja. MET helpt inzicht te geven in je calorieverbruik, wat belangrijk is voor gewichtsverlies.",
            },
            {
              question: "Zijn MET-waarden nauwkeurig?",
              answer: "Ze zijn een goede schatting, maar geen exacte meting voor elk individu.",
            },
            {
              question: "Gebruiken fitnesshorloges MET?",
              answer: "Indirect wel. Ze combineren hartslag, beweging en MET-modellen om verbranding te schatten.",
            },
          ]}
        />

        <h2>Samenvatting</h2>

        <p>
          MET-waarden geven aan hoeveel energie een activiteit kost ten opzichte van
          rust. Door MET te combineren met je lichaamsgewicht kun je eenvoudig je
          calorieverbruik tijdens beweging berekenen.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je precies weten hoeveel calorieën jij verbrandt?</h2>

        <p>
          FitLifeTool gebruikt je gewicht en activiteit om je calorieverbruik
          automatisch te berekenen en bij te houden.
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
