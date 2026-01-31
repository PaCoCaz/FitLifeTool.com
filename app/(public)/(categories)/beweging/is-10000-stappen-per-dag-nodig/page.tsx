// app/(public)/(categories)/beweging/is-10000-stappen-per-dag-nodig/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function StappenPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Is 10.000 stappen per dag echt nodig?</h1>

        <p>
          De norm van <strong>10.000 stappen per dag</strong> is wereldwijd bekend, maar komt oorspronkelijk niet uit wetenschappelijk onderzoek. 
          Toch blijkt uit studies dat meer dagelijks bewegen duidelijke gezondheidsvoordelen heeft, ook als je minder dan 10.000 stappen zet.
        </p>

        <p>
          Het belangrijkste is dat je <strong>meer beweegt dan je nu doet</strong>, elke extra stap telt immers mee voor je conditie, stofwisseling en algemene gezondheid.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity-steps.png"
          alt="Persoon die stappen telt met een smartwatch"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Waar komt de 10.000 stappen-regel vandaan?</h2>
        <p>
          De 10.000-stappenregel ontstond in de jaren 60 in Japan als marketingcampagne voor een stappenteller. 
          De naam van het apparaat betekende letterlijk “10.000-stappenmeter”, het getal was makkelijk te onthouden, maar niet gebaseerd op medisch onderzoek.
        </p>

        <h2>Hoeveel stappen zijn wél gezond?</h2>
        <p>
          Onderzoek laat zien dat gezondheidsvoordelen al beginnen bij ongeveer <strong>6.000 tot 8.000 stappen per dag</strong> voor veel volwassenen.
          Meer stappen leveren extra voordelen op, maar het effect vlakt geleidelijk af.
        </p>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Aantal stappen per dag</th>
                <th>Mogelijk gezondheidseffect</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3.000 - 5.000</td>
                <td>Licht actief, basisbeweging</td>
              </tr>
              <tr>
                <td>6.000 - 8.000</td>
                <td>Duidelijke gezondheidsvoordelen</td>
              </tr>
              <tr>
                <td>8.000 - 10.000</td>
                <td>Goede conditie en lager gezondheidsrisico</td>
              </tr>
              <tr>
                <td>10.000+</td>
                <td>Extra voordelen, maar minder sterke toename</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Waarom stappen tellen helpt</h2>
        <p>
          Stappen zijn een eenvoudige manier om je dagelijkse activiteit inzichtelijk te maken.
          Ze motiveren om meer te bewegen en minder lang achter elkaar stil te zitten.
        </p>

        <ul>
          <li>Meer stappen = hoger dagelijks calorieverbruik</li>
          <li>Verbetering van hart- en vaatgezondheid</li>
          <li>Lagere kans op chronische aandoeningen</li>
          <li>Betere stemming en energieniveau</li>
        </ul>

        <h2>Wat is belangrijker dan 10.000 stappen?</h2>
        <p>
          Het totale beweegpatroon over de dag is belangrijker dan één specifiek getal.
          Regelmatig opstaan, wandelen en afwisselen tussen zitten en bewegen heeft grote voordelen voor je gezondheid.
        </p>

        <h2>Zijn stappen genoeg als enige beweging?</h2>
        <p>
          Wandelen is gezond, maar voor een optimale gezondheid zijn ook <strong>krachttraining</strong> en <strong>intensievere inspanning</strong> belangrijk. 
          Deze helpen je spieren en botten sterk te houden en verbeteren je stofwisseling.
        </p>

        <h2>Veelgestelde vragen over stappen per dag</h2>

        <Accordion
          items={[
            {
              question: "Moet ik elke dag 10.000 stappen halen?",
              answer: "Nee. Minder stappen leveren ook gezondheidsvoordelen op. Het belangrijkste is dat je consistent meer beweegt.",
            },
            {
              question: "Is wandelen genoeg als beweging?",
              answer: "Wandelen is een uitstekende basis, maar krachttraining en intensievere inspanning zorgen voor extra gezondheidsvoordelen.",
            },
            {
              question: "Tellen huishoudelijke taken als stappen?",
              answer: "Ja, elke vorm van lopen draagt bij aan je dagtotaal.",
            },
            {
              question: "Is meer dan 10.000 stappen beter?",
              answer: "Tot een bepaald punt wel, maar de extra voordelen worden kleiner naarmate het aantal stappen stijgt.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          10.000 stappen per dag is geen magische grens, maar wel een handige richtlijn.
          Gezondheidsvoordelen beginnen al bij lagere aantallen. Door dagelijks meer
          te bewegen, zelfs in kleine hoeveelheden, verbeter je je conditie, energie
          en algehele gezondheid.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je inzicht in je dagelijkse stappen en activiteit?</h2>

        <p>
          Met FitLifeTool houd je eenvoudig bij hoeveel je beweegt en hoe dit
          bijdraagt aan je calorieverbruik en gezondheid.
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
