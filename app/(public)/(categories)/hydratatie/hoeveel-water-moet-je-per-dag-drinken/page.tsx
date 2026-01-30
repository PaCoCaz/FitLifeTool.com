// app/(public)/(categories)/hydratatie/hoeveel-water-moet-je-per-dag-drinken/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import FAQAccordion from "@/components/seo/FAQAccordion";

export default function WaterbehoeftePage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      {/* H1 + Intro Card */}
      <div className="category-card category-intro-card category-article-intro-card category-equal-card seo-intro-text">
        <div className="category-label">HYDRATATIE</div>

        <h1>Hoeveel water moet je per dag drinken?</h1>

        <p>
          Hoeveel water je per dag nodig hebt hangt af van je lichaamsgewicht,
          activiteit, omgevingstemperatuur en voeding. Voor de meeste volwassenen
          ligt de behoefte tussen de <strong>1,5 en 3 liter vocht per dag</strong>.
          Zwaardere mensen, sporters en mensen die veel zweten hebben meer nodig dan
          iemand die weinig beweegt.
        </p>

        <p>
          Een praktische richtlijn is ongeveer <strong>30 tot 40 milliliter water per kilogram lichaamsgewicht</strong>.
          Dat betekent dat iemand van 80 kilo al snel tussen de 2,4 en 3,2 liter vocht
          per dag nodig heeft, verspreid over de dag.
        </p>
      </div>

      {/* Afbeelding Card */}
      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/hydration.png"
          alt="Water wordt ingeschonken in een glas"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card">
        <h2>Waarom verschilt de waterbehoefte per persoon?</h2>
        <p>
          Je lichaam verliest voortdurend vocht via ademhaling, zweten en urine.
          Hoe groter je lichaam, hoe meer vocht je verliest. Ook beweging, warm weer
          en ziekte verhogen je vochtverlies, waardoor je meer moet drinken.
        </p>

        <h2>Algemene richtlijnen voor dagelijkse vochtinname</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Situatie</th>
                <th>Dagelijkse vochtbehoefte</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gemiddelde vrouw</td>
                <td>Ongeveer 1,5 - 2,5 liter per dag</td>
              </tr>
              <tr>
                <td>Gemiddelde man</td>
                <td>Ongeveer 2 - 3 liter per dag</td>
              </tr>
              <tr>
                <td>Intensief sporten of warm weer</td>
                <td>Vaak 0,5 - 1 liter extra per uur activiteit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Richtlijn waterinname per kilogram lichaamsgewicht</h2>

        <p>
          Een veelgebruikte praktische formule is om je dagelijkse waterbehoefte te baseren op je lichaamsgewicht. De meeste richtlijnen adviseren tussen de <strong>30 en 40 milliliter water per kilogram lichaamsgewicht per dag</strong>, afhankelijk van activiteit en omstandigheden.
        </p>

        <div className="table-scroll handbook">
          <table className="label-column">
            <thead>
              <tr>
                <th>Lichaamsgewicht</th>
                <th>Minimale richtlijn (30 ml/kg)</th>
                <th>Hogere behoefte (40 ml/kg)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>50 kg</td>
                <td>1,5 liter per dag</td>
                <td>2,0 liter per dag</td>
              </tr>
              <tr>
                <td>60 kg</td>
                <td>1,8 liter per dag</td>
                <td>2,4 liter per dag</td>
              </tr>
              <tr>
                <td>70 kg</td>
                <td>2,1 liter per dag</td>
                <td>2,8 liter per dag</td>
              </tr>
              <tr>
                <td>80 kg</td>
                <td>2,4 liter per dag</td>
                <td>3,2 liter per dag</td>
              </tr>
              <tr>
                <td>90 kg</td>
                <td>2,7 liter per dag</td>
                <td>3,6 liter per dag</td>
              </tr>
              <tr>
                <td>100 kg</td>
                <td>3,0 liter per dag</td>
                <td>4,0 liter per dag</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
        <strong>Let op:</strong> de berekening in de bovenstaande tabel gaat uit van je <strong>totale vochtinname per dag</strong>, dus inclusief water uit voeding zoals onder andere groenten, fruit, yoghurt en soep. Bij veel zweten, sporten of warm weer ligt je behoefte vaak aan de bovenkant van deze richtlijn.
        </p>

        <h2>Moet je alleen water drinken?</h2>

        <p>
          Water is de beste basis, maar thee, koffie en melk tellen ook mee.
          Alcohol en suikerhoudende dranken hydrateren minder effectief en zijn
          geen goede primaire bron van vocht.
        </p>

        <h2>Wanneer heb je meer water nodig dan gemiddeld?</h2>

        <ul>
          <li><strong>Bij warm weer</strong> verlies je meer vocht via zweet</li>
          <li><strong>Bij sporten</strong> kan je behoefte 0,5 - 1 liter per uur hoger liggen</li>
          <li><strong>Bij ziekte (koorts, diarree, braken)</strong> verlies je extra vocht</li>
          <li><strong>Tijdens zwangerschap of borstvoeding</strong> is de vochtbehoefte verhoogd</li>
          <li><strong>Bij een eiwitrijk of vezelrijk dieet</strong> heeft je lichaam meer vocht nodig</li>
        </ul>

        <h2>Kun je ook te veel water drinken?</h2>

        <p>
          Ja, extreem veel water drinken in korte tijd kan gevaarlijk zijn (waterintoxicatie),
          maar dit komt zelden voor bij normale dagelijkse inname. Het lichaam kan
          overtollig vocht meestal goed afvoeren via urine.
        </p>

        <h2>Hoe weet je of je genoeg drinkt?</h2>

        <ul>
          <li>Lichtgele urine is een goede indicatie van voldoende hydratatie</li>
          <li>Dorst, hoofdpijn en vermoeidheid kunnen tekenen zijn van tekort</li>
          <li>Donkergele urine wijst vaak op te weinig vocht</li>
        </ul>

        <h2>Veelgestelde vragen over water drinken</h2>

        <FAQAccordion
          items={[
            {
              question: "Is 2 liter water per dag genoeg?",
              answer: "Voor veel mensen wel, maar je behoefte hangt af van je lichaamsgewicht, activiteit en temperatuur. Zwaardere of actievere mensen hebben vaak meer nodig.",
            },
            {
              question: "Telt koffie en thee mee als vocht?",
              answer: "Ja, koffie en thee dragen bij aan je vochtinname, al is water de beste basis.",
            },
            {
              question: "Kun je te veel water drinken?",
              answer: "Ja, maar dit gebeurt zelden bij normale inname. Alleen extreem veel water in korte tijd kan gevaarlijk zijn.",
            },
            {
              question: "Hoe snel merk je dat je te weinig drinkt?",
              answer: "Dorst, vermoeidheid, hoofdpijn en donkere urine zijn vaak vroege signalen van een vochttekort.",
            },
          ]}
        />

        <h2>Samenvatting</h2>

        <p>
        De meeste volwassenen hebben tussen de 1,5 en 3 liter vocht per dag nodig.
        Een praktische richtlijn is 30–40 ml per kilogram lichaamsgewicht. Je behoefte
        stijgt bij sporten, warm weer en ziekte. Door je vochtinname af te stemmen op
        je lichaam en leefstijl blijf je beter gehydrateerd en voel je je energieker.
        </p>

      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Weet jij of je genoeg drinkt op een dag?</h2>

        <p>
          Laat FitLifeTool jouw persoonlijke vochtbehoefte berekenen op basis van je gewicht, activiteit en leefstijl. Zo weet je precies hoeveel jij nodig hebt.
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
