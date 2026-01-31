// app/(public)/(categories)/beweging/cadio-vs-krachttraining/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function CardioVsKrachttrainingPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Wat is het verschil tussen cardio en krachttraining?</h1>

        <p>
          Cardio en krachttraining zijn twee belangrijke vormen van beweging,
          maar ze hebben een verschillend effect op je lichaam. Waar cardio vooral
          gericht is op je hart en longen, helpt krachttraining bij het opbouwen
          van spiermassa en het verhogen van je rustverbranding.
        </p>

        <p>
          Voor een optimale gezondheid en lichaamssamenstelling is een combinatie
          van beide trainingsvormen het meest effectief.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity-types.png"
          alt="Vergelijking tussen cardio en krachttraining"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Wat is cardio?</h2>
        <p>
          Cardio, ook wel conditietraining genoemd, omvat activiteiten waarbij je
          hartslag langdurig verhoogd is. Dit verbetert je uithoudingsvermogen en
          versterkt je hart- en vaatstelsel.
        </p>

        <ul>
          <li>Wandelen of stevig wandelen</li>
          <li>Hardlopen</li>
          <li>Fietsen</li>
          <li>Zwemmen</li>
          <li>Groepslessen zoals aerobics</li>
        </ul>

        <h2>Wat is krachttraining?</h2>
        <p>
          Krachttraining richt zich op het belasten van spieren zodat ze sterker
          worden en in veel gevallen ook groeien. Dit helpt bij het behoud van
          spiermassa, wat belangrijk is voor je stofwisseling en lichaamshouding.
        </p>

        <ul>
          <li>Training met gewichten of machines</li>
          <li>Oefeningen met lichaamsgewicht (zoals push-ups en squats)</li>
          <li>Weerstandsbanden</li>
          <li>Functionele krachttraining</li>
        </ul>

        <h2>Belangrijkste verschillen tussen cardio en krachttraining</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Kenmerk</th>
                <th>Cardio</th>
                <th>Krachttraining</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hoofddoel</td>
                <td>Uithoudingsvermogen verbeteren</td>
                <td>Spierkracht en spiermassa opbouwen</td>
              </tr>
              <tr>
                <td>Effect op hart</td>
                <td>Sterke verbetering van conditie</td>
                <td>Lichte tot matige verbetering</td>
              </tr>
              <tr>
                <td>Calorieverbruik tijdens training</td>
                <td>Vaak hoger tijdens de activiteit</td>
                <td>Gemiddeld tijdens training, hoger erna</td>
              </tr>
              <tr>
                <td>Effect op rustverbranding</td>
                <td>Beperkt</td>
                <td>Verhoogt rustverbranding door extra spiermassa</td>
              </tr>
              <tr>
                <td>Bot- en spiergezondheid</td>
                <td>Beperkt effect</td>
                <td>Versterkt botten en spieren</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Wat is beter voor afvallen?</h2>
        <p>
          Beide trainingsvormen helpen bij vetverlies, maar op een andere manier.
          Cardio verbrandt direct calorieën, terwijl krachttraining helpt je
          spiermassa te behouden of te vergroten. Meer spiermassa betekent een
          hogere rustverbranding, waardoor je ook buiten je trainingen meer
          energie verbruikt.
        </p>

        <h2>Waarom een combinatie het beste werkt</h2>
        <p>
          Door cardio en krachttraining te combineren profiteer je van de voordelen
          van beide: een gezond hart, sterkere spieren en een efficiëntere
          stofwisseling. Dit zorgt voor een betere algehele fitheid en een lager
          risico op blessures.
        </p>

        <h2>Veelgestelde vragen over cardio en krachttraining</h2>

        <Accordion
          items={[
            {
              question: "Moet ik eerst cardio of krachttraining doen?",
              answer: "Dat hangt af van je doel. Voor spieropbouw begin je meestal met krachttraining. Voor conditieverbetering kun je starten met cardio.",
            },
            {
              question: "Kan ik elke dag krachttraining doen?",
              answer: "Spieren hebben hersteltijd nodig. Train daarom verschillende spiergroepen op verschillende dagen of neem rustdagen.",
            },
            {
              question: "Is wandelen ook cardio?",
              answer: "Ja, stevig wandelen valt onder matig intensieve cardio en draagt bij aan je conditie.",
            },
            {
              question: "Verbrand je meer vet met cardio?",
              answer: "Cardio verbrandt tijdens de training veel calorieën, maar krachttraining helpt je op lange termijn meer energie te verbruiken door extra spiermassa.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          Cardio verbetert vooral je conditie en hartgezondheid, terwijl
          krachttraining je spieren versterkt en je stofwisseling verhoogt.
          Een combinatie van beide zorgt voor de beste resultaten op het gebied
          van gezondheid, vetverbranding en fitheid.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je zien welke trainingsvorm het beste bij jou past?</h2>

        <p>
          Met FitLifeTool krijg je inzicht in je activiteit, calorieverbruik en
          trainingspatronen, zodat je een gebalanceerde routine kunt opbouwen.
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
