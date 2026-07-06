// app/(app)/handbook/doc-l3-0006/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30006() {
  return (
    <DocumentLayout>
      <header>
        <h1>3.2 Status & Kleuren</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Naast numerieke scores gebruikt FitLifeTool een semantisch
          statussysteem om de actuele voortgang zichtbaar te maken.
          Kleuren zijn geen decoratief onderdeel van de interface, maar de
          visuele representatie van de actuele situatie ten opzichte van het
          dagschema.
        </p>

        <p>
          Daarbij maakt FitLifeTool bewust onderscheid tussen de
          <strong> verwachte voortgang</strong> en de
          <strong> actuele status</strong>. Dit onderscheid vormt de basis van
          alle feedback binnen het dashboard.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe statussen worden bepaald, hoe zij worden
          vertaald naar kleuren en hoe deze informatie wordt gebruikt binnen de
          FitLifeScore.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Iedere leefstijlpijler vergelijkt de actuele situatie met de
          verwachte voortgang volgens het dagschema.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Onderdeel</th>
                <th>Omschrijving</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Verwachte voortgang</td>
                <td>Waar de gebruiker volgens het dagschema zou moeten staan.</td>
              </tr>

              <tr>
                <td>Actuele voortgang</td>
                <td>De werkelijke voortgang op basis van geregistreerde gegevens.</td>
              </tr>

              <tr>
                <td>Status</td>
                <td>De interpretatie van het verschil tussen beide.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          De status vormt de betekenislaag; de numerieke score geeft de exacte
          voortgang weer.
        </p>
      </section>

      <section>
        <h2>Statuskleuren</h2>

        <p>
          Iedere kaart vertaalt zijn status naar een vaste kleur die binnen de
          gehele applicatie consequent wordt toegepast.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Kleur</th>
                <th>Betekenis</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Groen</td>
                <td>De gebruiker ligt op schema of heeft het dagdoel bereikt.</td>
              </tr>

              <tr>
                <td>Oranje</td>
                <td>Er is een beperkte achterstand die nog eenvoudig kan worden ingehaald.</td>
              </tr>

              <tr>
                <td>Rood</td>
                <td>Er is een duidelijke afwijking waarvoor actie nodig is.</td>
              </tr>

              <tr>
                <td>Grijs</td>
                <td>Er is nog onvoldoende informatie beschikbaar of er is geen doel ingesteld.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          De exacte interpretatie van een status verschilt per leefstijlpijler,
          maar de betekenis van de kleuren blijft overal gelijk.
        </p>
      </section>

      <section>
        <h2>Blauw vertegenwoordigt het dagschema</h2>

        <p>
          Blauw is binnen FitLifeTool geen statuskleur.
        </p>

        <p>
          De blauwe voortgangsbalk geeft uitsluitend weer waar de gebruiker
          volgens het dagschema zou moeten staan. De actuele voortgang wordt
          daar overheen weergegeven in de bijbehorende statuskleur.
        </p>

        <p>
          Hierdoor ziet de gebruiker in één oogopslag of hij vóór, op of achter
          het verwachte dagschema ligt.
        </p>
      </section>

      <section>
        <h2>Status per leefstijlpijler</h2>

        <p>
          Iedere pijler bepaalt zijn status zelfstandig op basis van een eigen
          scoremodel.
        </p>

        <ul>
          <li>
            <strong>Hydration</strong> vergelijkt de actuele vochtinname met de
            verwachte vochtinname volgens het dagschema.
          </li>

          <li>
            <strong>Activity</strong> vergelijkt de verbrande calorieën met de
            verwachte activiteit voor dat moment van de dag.
          </li>

          <li>
            <strong>Nutrition</strong> gebruikt een eigen interpretatie waarbij,
            afhankelijk van het gekozen doel (afvallen, onderhouden of
            aankomen), zowel een tekort als een overschrijding tot een andere
            status kan leiden.
          </li>
        </ul>

        <p>
          Hoewel de onderliggende berekeningen verschillen, presenteren alle
          pijlers hun resultaat via hetzelfde statussysteem.
        </p>
      </section>

      <section>
        <h2>Statusaggregatie</h2>

        <p>
          De live-status van de FitLifeScore wordt niet bepaald door de
          numerieke eindscore, maar door de gecombineerde status van de drie
          leefstijlpijlers.
        </p>

        <ul>
          <li>Bevat één van de pijlers een rode status, dan wordt de FitLifeScore rood.</li>

          <li>Is er geen rode status maar wel minimaal één oranje status, dan wordt de FitLifeScore oranje.</li>

          <li>Alleen wanneer alle pijlers groen zijn, krijgt de FitLifeScore een groene status.</li>

          <li>Zolang nog niet alle gegevens beschikbaar zijn, wordt een neutrale grijze status gebruikt.</li>
        </ul>

        <p>
          Hierdoor weerspiegelt de kleur altijd de minst gunstige actuele
          leefstijlpijler.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Iedere kaart berekent zelfstandig zijn eigen status en publiceert deze
          naar de centrale ScoreContext.
        </p>

        <p>
          De FitLifeScore gebruikt uitsluitend deze gepubliceerde statuskleuren
          om de live-status te bepalen. De onderliggende businesslogica wordt
          daarbij niet opnieuw uitgevoerd.
        </p>

        <ul>
          <li>Iedere kaart berekent zijn eigen status.</li>

          <li>Iedere kaart publiceert één statuskleur.</li>

          <li>De FitLifeScore aggregeert uitsluitend deze statuskleuren.</li>

          <li>Businesslogica wordt nergens gedupliceerd.</li>
        </ul>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Status en numerieke score zijn bewust van elkaar gescheiden.</li>

          <li>Blauw vertegenwoordigt uitsluitend de verwachte voortgang.</li>

          <li>Groen betekent dat de gebruiker op schema ligt of het dagdoel heeft bereikt.</li>

          <li>Oranje geeft een beperkte afwijking aan die nog kan worden gecorrigeerd.</li>

          <li>Rood vraagt om directe aandacht.</li>

          <li>De FitLifeScore gebruikt uitsluitend de statuskleuren van de afzonderlijke pijlers voor de live-status.</li>

          <li>Dezelfde kleur heeft overal binnen de applicatie dezelfde betekenis.</li>
        </ul>

        <p>
          Door status, voortgang en presentatie van elkaar te scheiden ontstaat
          een consistent feedbacksysteem waarmee gebruikers in één oogopslag
          begrijpen hoe zij ervoor staan én hoeveel ruimte er nog is om hun dag
          bij te sturen.
        </p>
      </section>
    </DocumentLayout>
  );
}