// app/(app)/handbook/doc-l3-0004/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30004() {
  return (
    <DocumentLayout>
      <header>
        <h1>2.3 Brondata, Afgeleide data & Herberekening</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Vrijwel alle informatie die FitLifeTool aan de gebruiker toont is
          afgeleide data. Alleen gebruikersacties en profielgegevens worden
          permanent opgeslagen; voortgang, statussen, scores en daglimieten
          worden steeds opnieuw berekend.
        </p>

        <p>
          Hierdoor blijft de applicatie altijd synchroon met de actuele
          situatie en kunnen verbeteringen in de rekenlogica direct worden
          toegepast zonder historische gegevens aan te passen.
        </p>

        <p>
          Dit hoofdstuk beschrijft welke gegevens als bron dienen, welke
          informatie wordt afgeleid en waarom FitLifeTool vrijwel nooit
          berekende waarden opslaat.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Binnen FitLifeTool bestaat een duidelijk onderscheid tussen
          brongegevens en afgeleide informatie.
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
                <td>Dagdoel</td>
                <td>Referentiewaarde voor de betreffende dag.</td>
              </tr>

              <tr>
                <td>Voortgang</td>
                <td>Actuele situatie op basis van loggegevens.</td>
              </tr>

              <tr>
                <td>Status</td>
                <td>Realtime interpretatie van de voortgang ten opzichte van het dagschema.</td>
              </tr>

              <tr>
                <td>Score</td>
                <td>Numerieke afgeleide van de actuele situatie.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Alleen brongegevens worden opgeslagen. Alle overige informatie wordt
          op ieder moment opnieuw berekend.
        </p>
      </section>

      <section>
        <h2>Brongegevens</h2>

        <p>
          De berekeningen zijn gebaseerd op twee soorten brongegevens:
        </p>

        <ul>
          <li>gebruikersprofiel en persoonlijke instellingen</li>
          <li>gebruikerslogs, zoals voeding, hydratatie, activiteiten en gewicht</li>
        </ul>

        <p>
          Deze gegevens vormen samen de enige bron van waarheid binnen de
          applicatie.
        </p>
      </section>

      <section>
        <h2>Dynamische afgeleide data</h2>

        <p>
          Niet alle afgeleide waarden blijven gedurende de dag gelijk. Nieuwe
          gebeurtenissen kunnen de context veranderen zonder dat bestaande
          loggegevens worden aangepast.
        </p>

        <p>
          Het duidelijkste voorbeeld hiervan is de relatie tussen activiteit en
          voeding.
        </p>

        <ul>
          <li>Elke activiteit wordt als afzonderlijke log opgeslagen.</li>

          <li>
            De verbruikte energie verhoogt automatisch het beschikbare
            voedingsbudget van die dag.
          </li>

          <li>
            Hierdoor verschuift de actuele voedingslimiet zonder dat eerdere
            voedingsregistraties worden aangepast.
          </li>

          <li>
            De NutritionScore, voortgangsbalk en status worden vervolgens
            onmiddellijk opnieuw berekend.
          </li>
        </ul>

        <p>
          Hierdoor ondersteunt FitLifeTool gebruikers bij het herstellen van
          hun energiebalans gedurende de dag. Een gebruiker die tijdelijk voor
          loopt op zijn calorie-inname kan door extra activiteit later alsnog
          volledig op schema komen.
        </p>
      </section>

      <section>
        <h2>Realtime herberekening</h2>

        <p>
          Iedere nieuwe registratie leidt automatisch tot een nieuwe
          berekening van alle relevante afgeleide gegevens.
        </p>

        <p>
          De applicatie gebruikt hiervoor steeds dezelfde gegevensstroom:
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Nieuwe log
      ↓
DashboardStore
      ↓
dashboard_day_summary (RPC)
      ↓
Afgeleide data
      ↓
FitLifeScore
      ↓
Dashboard`}
          </pre>
        </div>

        <p>
          De gebruikersinterface toont uitsluitend het resultaat van deze
          berekeningen en bevat zelf geen bedrijfslogica.
        </p>
      </section>

      <section>
        <h2>Waarom herberekening?</h2>

        <p>
          Afgeleide data wordt bewust niet opgeslagen. Hierdoor blijft iedere
          berekening altijd gebaseerd op dezelfde brongegevens.
        </p>

        <ul>
          <li>Nieuwe logs worden direct verwerkt.</li>

          <li>Gewijzigde profielinstellingen werken onmiddellijk door.</li>

          <li>Verbeteringen in rekenregels gelden ook voor historische dagen.</li>

          <li>De database bevat uitsluitend brongegevens.</li>

          <li>Voortgang, status en scores blijven altijd reproduceerbaar.</li>
        </ul>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Brongegevens vormen altijd de enige waarheid.</li>

          <li>Voortgang is altijd een berekende waarde.</li>

          <li>Status wordt realtime bepaald.</li>

          <li>Scores worden nooit opgeslagen.</li>

          <li>Historische loggegevens worden nooit aangepast.</li>

          <li>Dashboardgegevens worden telkens opnieuw opgebouwd.</li>

          <li>De gebruikersinterface presenteert uitsluitend afgeleide resultaten.</li>
        </ul>

        <div className="info-box">
          Binnen FitLifeTool worden uitsluitend brongegevens opgeslagen.
          Dagdoelen, voortgang, statussen, voedingslimieten en scores zijn
          afgeleide waarden die op ieder moment opnieuw uit dezelfde gegevens
          kunnen worden berekend.
        </div>
      </section>
    </DocumentLayout>
  );
}