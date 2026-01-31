// app/(public)/(categories)/beweging/hoeveel-calorieen-verbrand-je-met-bewegen/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function CalorieverbruikPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      {/* H1 + Intro Card */}
      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Hoeveel calorieën verbrand je met bewegen?</h1>

        <p>
          Hoeveel calorieën je verbrandt met bewegen hangt af van je
          <strong> lichaamsgewicht</strong>, de <strong>intensiteit</strong> van de
          activiteit en de <strong>duur</strong>. Iemand van 90 kilo verbrandt bij
          dezelfde activiteit meer energie dan iemand van 60 kilo.
        </p>

        <p>
          Wandelen, fietsen, krachttraining en sporten verschillen sterk in
          energieverbruik. Door inzicht te krijgen in je calorieverbruik kun je
          beter begrijpen hoe beweging bijdraagt aan je conditie, vetverbranding
          en energiebalans.
        </p>
      </div>

      {/* Afbeelding Card */}
      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity-calories.png"
          alt="Iemand die sport en calorieën verbrandt"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Waar hangt calorieverbruik van af?</h2>
        <ul>
          <li><strong>Lichaamsgewicht</strong> - zwaardere mensen verbruiken meer energie</li>
          <li><strong>Intensiteit</strong> - hardlopen verbrandt meer dan wandelen</li>
          <li><strong>Duur</strong> - hoe langer je beweegt, hoe hoger het totaalverbruik</li>
          <li><strong>Spiermassa</strong> - meer spieren verhogen je energieverbruik</li>
          <li><strong>Conditie</strong> - goed getrainde lichamen werken efficiënter</li>
        </ul>

        <h2>Gemiddeld calorieverbruik per activiteit (per uur)</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
                <tr>
                    <th>Activiteit</th>
                    <th>50 kg</th>
                    <th>60 kg</th>
                    <th>70 kg</th>
                    <th>80 kg</th>
                    <th>90 kg</th>
                    <th>100 kg</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Wandelen (5 km/u)</td>
                    <td>160 kcal</td>
                    <td>190 kcal</td>
                    <td>220 kcal</td>
                    <td>250 kcal</td>
                    <td>280 kcal</td>
                    <td>310 kcal</td>
                </tr>
                <tr>
                    <td>Fietsen (rustig tempo)</td>
                    <td>240 kcal</td>
                    <td>290 kcal</td>
                    <td>340 kcal</td>
                    <td>390 kcal</td>
                    <td>440 kcal</td>
                    <td>490 kcal</td>
                </tr>
                <tr>
                    <td>Hardlopen (8 km/u)</td>
                    <td>500 kcal</td>
                    <td>600 kcal</td>
                    <td>700 kcal</td>
                    <td>800 kcal</td>
                    <td>900 kcal</td>
                    <td>1000 kcal</td>
                </tr>
                <tr>
                    <td>Krachttraining</td>
                    <td>200 kcal</td>
                    <td>240 kcal</td>
                    <td>280 kcal</td>
                    <td>320 kcal</td>
                    <td>360 kcal</td>
                    <td>400 kcal</td>
                </tr>
                <tr>
                    <td>Zwemmen</td>
                    <td>320 kcal</td>
                    <td>380 kcal</td>
                    <td>440 kcal</td>
                    <td>500 kcal</td>
                    <td>560 kcal</td>
                    <td>620 kcal</td>
                </tr>
            </tbody>
          </table>
        </div>

        <p>
            <strong>Let op:</strong> de waarden in de tabel zijn gemiddelden en gebaseerd op zogeheten <strong>MET-waarden</strong> (Metabolic Equivalent of Task). 
            Een MET geeft aan hoeveel energie een activiteit kost ten opzichte van rust. 1 MET staat gelijk aan het energieverbruik in rust. 
            Een activiteit van 5 MET betekent dat je lichaam ongeveer vijf keer zoveel energie verbruikt als wanneer je stilzit.
        </p>

        <p>
            Het daadwerkelijke calorieverbruik verschilt per persoon en hangt onder andere af van leeftijd, geslacht, lichaamssamenstelling, conditie en hoe intensief je de activiteit uitvoert. 
            De tabel is daarom bedoeld als praktische richtlijn, niet als exacte meting.
        </p>

        <h2>Calorieverbruik bij dagelijkse activiteiten</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Activiteit</th>
                <th>Gemiddeld verbruik per uur</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Huishouden</td>
                <td>150 – 250 kcal</td>
              </tr>
              <tr>
                <td>Tuinieren</td>
                <td>250 – 400 kcal</td>
              </tr>
              <tr>
                <td>Traplopen</td>
                <td>500 – 700 kcal</td>
              </tr>
              <tr>
                <td>Staand werken</td>
                <td>100 – 150 kcal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Waarom calorieverbruik belangrijk is</h2>
        <p>
          Je lichaam gebruikt calorieën als energiebron. Door te bewegen verhoog je
          je dagelijkse energieverbruik. Dat helpt bij:
        </p>

        <ul>
          <li>Gewichtsbeheersing</li>
          <li>Verbetering van je conditie</li>
          <li>Gezonde stofwisseling</li>
          <li>Verlaging van gezondheidsrisico’s</li>
        </ul>

        <h2>Veelgestelde vragen over calorieverbruik</h2>

        <Accordion
          items={[
            {
              question: "Verbrand je meer calorieën met cardio of krachttraining?",
              answer: "Cardio verbrandt tijdens de training vaak meer calorieën, maar krachttraining verhoogt je rustverbranding door meer spiermassa.",
            },
            {
              question: "Is zweten een teken dat je meer calorieën verbrandt?",
              answer: "Niet altijd. Zweten zegt vooral iets over temperatuurregulatie, niet direct over calorieverbruik.",
            },
            {
              question: "Helpt wandelen bij afvallen?",
              answer: "Ja, regelmatig wandelen verhoogt je dagelijkse energieverbruik en draagt bij aan gewichtsbeheersing.",
            },
            {
              question: "Hoe nauwkeurig zijn calorie-schattingen?",
              answer: "Het zijn gemiddelden. Werkelijk verbruik verschilt per persoon door gewicht, conditie en inspanning.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          Hoeveel calorieën je verbrandt met bewegen hangt af van je gewicht,
          intensiteit en duur van de activiteit. Zowel sport als dagelijkse
          beweging dragen bij aan je energieverbruik en algehele gezondheid.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je weten hoeveel calorieën jij dagelijks verbrandt?</h2>

        <p>
          FitLifeTool berekent je persoonlijke energieverbruik op basis van je
          gewicht, activiteit en doelen. Zo krijg je inzicht in je voortgang.
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
