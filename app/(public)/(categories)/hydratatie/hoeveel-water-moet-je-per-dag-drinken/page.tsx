// app/(public)/(categories)/hydratatie/hoeveel-water-moet-je-per-dag-drinken/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";

export default function WaterbehoeftePage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      {/* H1 + Intro Card */}
      <div className="category-card category-intro-card category-equal-card seo-intro-text">
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
        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Situatie</th>
                <th>Dagelijkse vochtbehoefte</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gemiddelde vrouw</td>
                <td>Ongeveer 1,5 – 2,5 liter per dag</td>
              </tr>
              <tr>
                <td>Gemiddelde man</td>
                <td>Ongeveer 2 – 3 liter per dag</td>
              </tr>
              <tr>
                <td>Intensief sporten of warm weer</td>
                <td>Vaak 0,5 – 1 liter extra per uur activiteit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Let op: deze hoeveelheden gaan over <strong>totale vochtinname</strong>, dus inclusief water uit voeding zoals groenten, fruit, yoghurt en soep.
        </p>

        <h2>Moet je alleen water drinken?</h2>
        <p>
          Water is de beste basis, maar thee, koffie en melk tellen ook mee.
          Alcohol en suikerhoudende dranken hydrateren minder effectief en zijn
          geen goede primaire bron van vocht.
        </p>

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
      </div>
            {/* ================= RIJ 3 — CTA ================= */}

            <div
        className="category-span-full category-card">
        <h2>Weet jij of je genoeg drinkt op een dag?</h2>

        <p>
          Laat FitLifeTool jouw persoonlijke vochtbehoefte berekenen op basis van
          je gewicht, activiteit en leefstijl. Zo weet je precies hoeveel jij nodig hebt.
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
