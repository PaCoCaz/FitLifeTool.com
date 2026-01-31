// app/(public)/(categories)/beweging/activiteit-tracking-met-fitlifetool/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function ActivityTrackingPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Activiteit bijhouden met FitLifeTool</h1>

        <p>
          Door je dagelijkse beweging bij te houden krijg je inzicht in hoeveel
          calorieën je verbruikt en hoe actief je werkelijk bent. FitLifeTool helpt
          je om je activiteit overzichtelijk te registreren en te koppelen aan je
          persoonlijke doelen.
        </p>

        <p>
          Of je nu wandelt, sport of gewoon meer wilt bewegen gedurende de dag:
          inzicht in je activiteit maakt het makkelijker om vooruitgang te boeken.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity-tracking.png"
          alt="Overzicht van activiteit tracking in FitLifeTool"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Waarom activiteit bijhouden belangrijk is</h2>
        <p>
          Veel mensen overschatten hoeveel ze bewegen op een dag. Door je activiteit
          te registreren zie je objectief hoeveel je verbruikt en waar nog winst te
          behalen valt.
        </p>

        <ul>
          <li>Inzicht in je dagelijkse calorieverbruik</li>
          <li>Betere balans tussen voeding en beweging</li>
          <li>Meer motivatie door zichtbare voortgang</li>
          <li>Bewuster omgaan met een zittende leefstijl</li>
        </ul>

        <h2>Wat kun je bijhouden in FitLifeTool?</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Activiteit</th>
                <th>Wat wordt gemeten?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dagelijkse stappen</td>
                <td>Beweging gedurende de dag via lopen</td>
              </tr>
              <tr>
                <td>Sportactiviteiten</td>
                <td>Calorieverbruik op basis van type en duur</td>
              </tr>
              <tr>
                <td>Totale activiteit</td>
                <td>Dagelijks energieverbruik uit beweging</td>
              </tr>
              <tr>
                <td>Activiteitsdoelen</td>
                <td>Persoonlijke doelen afgestemd op jouw profiel</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Hoe FitLifeTool je calorieverbruik berekent</h2>
        <p>
          FitLifeTool combineert jouw lichaamsgegevens met het type activiteit en
          de duur van je inspanning. Zo krijg je een realistische schatting van je
          energieverbruik in plaats van een algemene standaardwaarde.
        </p>

        <p>
          Hierdoor zie je niet alleen hoeveel je beweegt, maar ook wat dit betekent
          voor je totale energiebalans.
        </p>

        <h2>Inzicht in je voortgang</h2>
        <p>
          Door activiteit dagelijks bij te houden zie je patronen in je leefstijl.
          Misschien beweeg je minder in het weekend, of juist meer op werkdagen.
          Deze inzichten helpen je om gerichte aanpassingen te maken.
        </p>

        <h2>Veelgestelde vragen over activiteit bijhouden</h2>

        <Accordion
          items={[
            {
              question: "Moet ik elke beweging handmatig invoeren?",
              answer: "Je kunt activiteiten handmatig toevoegen, maar ook standaard activiteiten selecteren voor snelle invoer.",
            },
            {
              question: "Hoe nauwkeurig is de calorieverbranding?",
              answer: "FitLifeTool gebruikt persoonlijke gegevens en activiteitsduur voor een realistische schatting, maar het blijft een benadering.",
            },
            {
              question: "Helpt activiteit bijhouden bij afvallen?",
              answer: "Ja, inzicht in je verbruik helpt om voeding en beweging beter op elkaar af te stemmen.",
            },
            {
              question: "Kan ik mijn doelen aanpassen?",
              answer: "Ja, je activiteitsdoelen worden afgestemd op jouw profiel en kunnen worden aangepast wanneer je vooruitgang boekt.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          Activiteit bijhouden geeft je grip op je energieverbruik en helpt je om
          bewuster te bewegen. Met FitLifeTool zie je precies hoeveel je verbruikt
          en hoe dit bijdraagt aan je gezondheid en doelen.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil jij inzicht in jouw dagelijkse activiteit?</h2>

        <p>
          Start vandaag met het bijhouden van je beweging en ontdek hoeveel jouw
          activiteit bijdraagt aan je energieverbruik.
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
