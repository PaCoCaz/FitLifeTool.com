// app/(public)/(categories)/beweging/hoeveel-moet-je-bewegen-per-dag/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function BeweegrichtlijnenPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Hoeveel moet je per dag bewegen voor een goede gezondheid?</h1>

        <p>
          Voldoende beweging is essentieel voor je hart, spieren, stofwisseling en
          mentale gezondheid. Maar hoeveel moet je eigenlijk bewegen per dag om
          gezond te blijven?
        </p>

        <p>
          Gezondheidsrichtlijnen adviseren volwassenen om wekelijks een combinatie
          van matig intensieve en spierversterkende activiteiten te doen. Regelmatig
          bewegen verkleint het risico op hart- en vaatziekten, diabetes type 2 en
          overgewicht.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity.png"
          alt="Mensen die verschillende vormen van beweging uitvoeren"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>De algemene beweegrichtlijnen voor volwassenen</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Soort beweging</th>
                <th>Aanbevolen hoeveelheid</th>
                <th>Voorbeelden</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Matig intensieve inspanning</td>
                <td>Minstens 150 minuten per week</td>
                <td>Stevig wandelen, fietsen, zwemmen</td>
              </tr>
              <tr>
                <td>Zware inspanning</td>
                <td>75 minuten per week (of combinatie met matig)</td>
                <td>Hardlopen, intensief sporten</td>
              </tr>
              <tr>
                <td>Spier- en botversterkend</td>
                <td>Minstens 2 dagen per week</td>
                <td>Krachttraining, traplopen, springen</td>
              </tr>
              <tr>
                <td>Lang zitten beperken</td>
                <td>Dagelijks onderbreken</td>
                <td>Opstaan, wandelen, rekken</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Wat is matig en wat is intensief bewegen?</h2>

        <p>
          De intensiteit van beweging wordt vaak uitgedrukt in <strong>MET-waarden</strong>.
          Matige inspanning ligt meestal tussen de 3 en 6 MET, terwijl intensieve
          inspanning boven de 6 MET ligt.
        </p>

        <ul>
          <li><strong>Matig intensief:</strong> je ademhaling versnelt, maar praten lukt nog</li>
          <li><strong>Intensief:</strong> je ademt zwaar en praten wordt moeilijk</li>
        </ul>

        <h2>Moet je elke dag bewegen?</h2>

        <p>
          Het is beter om beweging te spreiden over meerdere dagen dan alles in één
          of twee dagen te doen. Dagelijkse activiteit helpt je stofwisseling actief
          te houden en vermindert de negatieve effecten van langdurig zitten.
        </p>

        <h2>Helpt meer bewegen altijd meer?</h2>

        <p>
          Tot op zekere hoogte wel. Meer bewegen levert extra gezondheidsvoordelen op,
          maar herstelmomenten blijven belangrijk. Een goede balans tussen inspanning
          en rust voorkomt overbelasting en blessures.
        </p>

        <h2>Wat als je nu weinig beweegt?</h2>

        <p>
          Begin klein. Zelfs korte wandelingen van 10 minuten hebben al een positief
          effect. Bouw de duur en intensiteit geleidelijk op.
        </p>

        <h2>Veelgestelde vragen over dagelijkse beweging</h2>

        <Accordion
          items={[
            {
              question: "Is wandelen voldoende als beweging?",
              answer: "Ja, stevig wandelen valt onder matig intensieve inspanning en draagt bij aan de beweegrichtlijnen.",
            },
            {
              question: "Moet je zweten om gezond te bewegen?",
              answer: "Niet altijd. Ook matige inspanning zonder veel zweten heeft gezondheidsvoordelen.",
            },
            {
              question: "Is krachttraining echt nodig?",
              answer: "Ja, spierversterkende oefeningen zijn belangrijk voor spiermassa, botdichtheid en stofwisseling.",
            },
            {
              question: "Kan ik beweging opsparen in het weekend?",
              answer: "Dat kan, maar het is gezonder om beweging over meerdere dagen te verspreiden.",
            },
          ]}
        />

        <h2>Samenvatting</h2>

        <p>
          Voor een goede gezondheid wordt aangeraden om minstens 150 minuten per week
          matig intensief te bewegen, spierversterkende oefeningen te doen en lang
          zitten te beperken. Regelmaat is belangrijker dan perfectie.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je zien of jij genoeg beweegt?</h2>

        <p>
          FitLifeTool helpt je inzicht te krijgen in je dagelijkse activiteit en laat
          zien of je de beweegrichtlijnen haalt.
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
