// app/(app)/handbook/doc-l3-0003/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30003() {
  return (
    <DocumentLayout>

      <header>
        <h1>2.2 Dagstructuur & Logs</h1>
        <HandbookMeta />
      </header>


      <section>
        <p>
          Vrijwel alle functionaliteit binnen FitLifeTool is georganiseerd
          rond één kalenderdag. Voeding, hydratatie, activiteiten, gewicht en
          de FitLifeScore worden altijd beoordeeld binnen de context van een
          specifieke dag.
        </p>

        <p>
          Een dag is geen afzonderlijke database-entiteit, maar een logische
          verzameling van gebruikersgegevens met dezelfde dagidentificatie.
          Hierdoor kunnen berekeningen opnieuw worden uitgevoerd vanuit de
          oorspronkelijke brongegevens.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe daggegevens worden opgebouwd en hoe
          FitLifeTool voorkomt dat berekende waarden als permanente status
          worden opgeslagen.
        </p>
      </section>


      <section>
        <h2>Conceptueel model</h2>

        <p>
          Iedere kalenderdag vormt de centrale aggregatie-eenheid van de
          applicatie.
        </p>

        <ul>

          <li>
            <strong>Dagcontext</strong> wordt bepaald door een unieke{" "}
            <code>dayKey</code>.
          </li>

          <li>
            <strong>Gebruikersacties</strong> worden opgeslagen als
            bronregistraties.
          </li>

          <li>
            <strong>Dashboardwaarden</strong> worden berekend vanuit deze
            brongegevens.
          </li>

          <li>
            <strong>Scores</strong> zijn tijdelijke afgeleide waarden.
          </li>

        </ul>

        <p>
          Hierdoor bestaat er geen verborgen dagstatus. Iedere dag kan opnieuw
          worden opgebouwd vanuit dezelfde gegevens.
        </p>
      </section>


      <section>
        <h2>Logstructuur</h2>

        <p>
          FitLifeTool gebruikt logtabellen voor gegevens die door gebruikers
          gedurende de tijd worden toegevoegd.
        </p>


        <div className="table-scroll">
          <table className="label-column">

            <thead>
              <tr>
                <th>Log</th>
                <th>Gebruik</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <code>nutrition_logs</code>
                </td>

                <td>
                  Voeding, energie-inname en afgeleide voedingswaarden.
                  Hydratatie uit voeding wordt berekend via productgegevens
                  en waterfactoren.
                </td>
              </tr>


              <tr>
                <td>
                  <code>activity_logs</code>
                </td>

                <td>
                  Bewegingsregistraties en verbrande energie.
                </td>
              </tr>


              <tr>
                <td>
                  <code>weight_logs</code>
                </td>

                <td>
                  Historische gewichtsregistraties.
                </td>
              </tr>

            </tbody>

          </table>
        </div>


        <p>
          Niet ieder domein vereist een eigen logtabel. Wanneer gegevens logisch
          uit bestaande registraties kunnen worden afgeleid, wordt hergebruik
          toegepast.
        </p>

        <p>
          Hydratatie is hiervan een voorbeeld: waterinname en vocht uit voeding
          worden gecombineerd tot één actuele hydratiewaarde.
        </p>
      </section>


      <section>
        <h2>Dagcontext</h2>

        <p>
          De actieve dag wordt centraal bepaald. Alle dashboardkaarten en
          berekeningen gebruiken dezelfde dagcontext.
        </p>

        <p>
          Wanneer de dag verandert, worden dashboarddata en tijdelijke scores
          opnieuw opgebouwd.
        </p>

        <p>
          Hierdoor blijven alle onderdelen consistent zonder dat losse
          componenten hun eigen dagstatus hoeven te bewaren.
        </p>
      </section>


      <section>
        <h2>Herberekening</h2>

        <p>
          Dashboardwaarden en scores worden niet permanent opgeslagen.
          Ze worden opnieuw opgebouwd vanuit logs, producten en actuele
          gebruikersinstellingen.
        </p>

        <ul>

          <li>Brongegevens vormen de waarheid.</li>

          <li>Doelen bepalen de verwachte voortgang.</li>

          <li>Scores worden dynamisch berekend.</li>

          <li>UI-componenten tonen berekende resultaten.</li>

        </ul>

        <p>
          Hierdoor kunnen scoremodellen later worden aangepast zonder oude
          gebruikersgegevens te wijzigen.
        </p>
      </section>


      <section>
        <h2>Gegevensstroom</h2>

        <p>
          De dashboardarchitectuur gebruikt één centrale datastroom.
        </p>


        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">

          <pre className="whitespace-pre-wrap text-sm leading-7">
{`useDayNow
      ↓
dayKey
      ↓
Supabase
      ↓
dashboard_day_summary (RPC)
      ↓
DashboardStore
      ↓
Dashboard Cards
      ↓
ScoreContext
      ↓
FitLifeScoreCard`}
          </pre>

        </div>


        <p>
          DashboardStore beheert de daggegevens. Dashboardkaarten halen geen
          eigen dashboarddata rechtstreeks uit de database.
        </p>

        <p>
          ScoreContext bewaart alleen tijdelijke scores en statusinformatie
          voor de actuele gebruikersinterface.
        </p>
      </section>


      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>

          <li>Er bestaat geen aparte dagtabel.</li>

          <li>Logs vormen de reproduceerbare bron.</li>

          <li>Niet ieder domein vereist een eigen logtabel.</li>

          <li>Voortgang en scores zijn afgeleide data.</li>

          <li>Dagwissels bouwen tijdelijke waarden opnieuw op.</li>

          <li>
            UI-componenten bevatten geen verborgen businesslogica.
          </li>

        </ul>


        <p className="muted">
          Deze structuur maakt FitLifeTool voorspelbaar en schaalbaar:
          nieuwe functies kunnen aansluiten op dezelfde dagstructuur zonder
          bestaande gegevensstromen te verstoren.
        </p>

      </section>


    </DocumentLayout>
  );
}