// app/handbook/doc-l3-0005/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30005() {
  return (
    <DocumentLayout>

      <header>
        <h1>3.1 Fundament FitLifeScore</h1>
      </header>

      <section>
        <p>
          De betekenis, opbouw en ontwerpprincipes van de FitLifeScore.
        </p>

        <p>
          De FitLifeScore is een samenvattende dagscore die in één oogopslag
          laat zien hoe goed een gebruiker zijn leefstijlgedrag uitvoert.
        </p>

        <p>
          De score is bewust ontworpen als <strong>resultaatindicator</strong>,
          niet als doel op zichzelf. Het is een afgeleide van gedrag,
          geen losstaand puntensysteem.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          De FitLifeScore bestaat uit drie onafhankelijke pijlers:
        </p>

        <ul>
          <li>Hydration</li>
          <li>Activity</li>
          <li>Nutrition</li>
        </ul>

        <p>
          Elke pijler levert een score tussen 0 en 100. Deze worden
          samengevoegd tot één gewogen eindscore.
        </p>

        <p>
          Cruciaal: geen enkele pijler kan de score “meenemen” naar 100
          als een andere pijler faalt.
        </p>
      </section>

      <section>
        <h2>Gewogen aggregatie</h2>

        <p>
          De FitLifeScore gebruikt vaste gewichten per pijler:
        </p>

        <table className="key-column">
          <thead>
            <tr>
              <th>Gewicht</th>
              <th>Pijler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>30%</td>
              <td>Hydration</td>
            </tr>
            <tr>
              <td>30%</td>
              <td>Activity</td>
            </tr>
            <tr>
              <td>40%</td>
              <td>Nutrition</td>
            </tr>
          </tbody>
        </table>

        <p>
          De ruwe score wordt berekend als gewogen gemiddelde en vervolgens naar beneden afgerond.
        </p>
      </section>

      <section>
        <h2>Blokkadeprincipe (99 vs 100)</h2>

        <p>
          Een FitLifeScore van <strong>100</strong> is alleen mogelijk
          wanneer <em>alle</em> pijlers hun dagdoel hebben behaald.
        </p>

        <p>
          Indien één of meerdere pijlers onder hun doel blijven:
        </p>

        <ul>
          <li>wordt de score maximaal 99</li>
          <li>ongeacht het gewogen gemiddelde</li>
        </ul>

        <p>
          Dit voorkomt “vals groen” en dwingt balans af tussen
          leefstijlonderdelen.
        </p>
      </section>

      <section>
        <h2>Tijd & voortgang</h2>

        <p>
          De FitLifeScore is een <strong>momentopname</strong>.
          De score verandert gedurende de dag op basis van:
        </p>

        <ul>
          <li>nieuwe logs</li>
          <li>verwachte voortgang volgens dagschema</li>
          <li>herberekende dagdoelen</li>
        </ul>

        <p>
          Hierdoor is een score van bijvoorbeeld 70 om 10:00 uur
          niet negatief, maar contextafhankelijk.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technisch wordt de FitLifeScore berekend in de UI-laag,
          op basis van events die door cards worden uitgezonden.
        </p>

        <ul>
          <li>Elke card publiceert score en statuskleur</li>
          <li>De scorecard aggregeert deze informatie</li>
          <li>Geen server-side state voor de score</li>
        </ul>

        <p>
          Dit maakt de score:
        </p>

        <ul>
          <li>deterministisch</li>
          <li>herleidbaar</li>
          <li>vrij van synchronisatieproblemen</li>
        </ul>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>Score wordt niet opgeslagen</li>
          <li>100 is expliciet schaars</li>
          <li>Realtime berekening in de UI</li>
          <li>Balans gaat boven extremen</li>
        </ul>

        <p>
          Deze keuzes zorgen ervoor dat de FitLifeScore betrouwbaar,
          uitlegbaar en uitbreidbaar blijft.
        </p>
      </section>

    </DocumentLayout>
  );
}
