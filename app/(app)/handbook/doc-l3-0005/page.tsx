// app/(app)/handbook/doc-l3-0005/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30005() {
  return (
    <DocumentLayout>

      <header>
        <h1>3.1 Fundament van de FitLifeScore</h1>
        <HandbookMeta />
      </header>


      <section>
        <p>
          De FitLifeScore is de centrale leefstijlindicator van
          FitLifeTool. De score geeft gebruikers gedurende de dag
          inzicht in hun actuele voortgang en helpt om tijdig bij te
          sturen.
        </p>

        <p>
          De FitLifeScore is geen eindrapport maar een live
          momentopname. De score vergelijkt de huidige situatie met de
          verwachte voortgang op dit specifieke moment van de dag.
        </p>

        <p>
          Hierdoor kan een gebruiker gedurende de hele dag zien of hij
          of zij op schema ligt, in plaats van pas achteraf een
          beoordeling te krijgen.
        </p>
      </section>


      <section>
        <h2>Doel van de FitLifeScore</h2>

        <p>
          De FitLifeScore is ontworpen als hulpmiddel voor
          gedragsverandering en niet als doel op zichzelf.
        </p>

        <p>
          De score ondersteunt:
        </p>

        <ul>
          <li>inzicht in de actuele leefstijlstatus;</li>
          <li>vroegtijdig herkennen van afwijkingen;</li>
          <li>balans tussen voeding, hydratatie en activiteit;</li>
          <li>bijsturen voordat de dag voorbij is.</li>
        </ul>

        <p>
          Een lagere score betekent niet dat een dag mislukt is, maar
          uitsluitend dat de actuele voortgang afwijkt van de verwachte
          situatie.
        </p>
      </section>


      <section>
        <h2>Conceptueel model</h2>

        <p>
          De FitLifeScore bestaat uit drie afzonderlijke domeinen met
          ieder hun eigen verantwoordelijkheid.
        </p>


        <div className="table-scroll">
          <table className="label-column">

            <thead>
              <tr>
                <th>Pijler</th>
                <th>Verantwoordelijkheid</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Nutrition</td>
                <td>
                  Bewaakt de energiebalans tussen voeding,
                  doelstelling en activiteit.
                </td>
              </tr>

              <tr>
                <td>Hydration</td>
                <td>
                  Bewaakt de vochtinname ten opzichte van het
                  verwachte dagschema.
                </td>
              </tr>

              <tr>
                <td>Activity</td>
                <td>
                  Bewaakt beweging ten opzichte van het actuele
                  activiteitsdoel.
                </td>
              </tr>

            </tbody>

          </table>
        </div>


        <p>
          Iedere pijler berekent zelfstandig zijn score en status.
          Hierdoor blijft domeinlogica gescheiden en kan de
          FitLifeScore deze resultaten combineren zonder verborgen
          aannames.
        </p>

        <p>
          Activiteit beïnvloedt bewust het voedingsdomein:
          verbrande energie verhoogt het beschikbare voedingsbudget
          van dezelfde dag.
        </p>
      </section>


      <section>
        <h2>Gewogen berekening</h2>

        <p>
          De uiteindelijke FitLifeScore wordt opgebouwd uit de drie
          domeinscores volgens vaste gewichten.
        </p>


        <div className="table-scroll">
          <table className="label-column">

            <thead>
              <tr>
                <th>Pijler</th>
                <th>Gewicht</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Nutrition</td>
                <td>40%</td>
              </tr>

              <tr>
                <td>Hydration</td>
                <td>30%</td>
              </tr>

              <tr>
                <td>Activity</td>
                <td>30%</td>
              </tr>

            </tbody>

          </table>
        </div>


        <p>
          Nutrition heeft een hogere weging vanwege de centrale rol
          van energiebalans binnen dagelijkse gezondheid.
        </p>
      </section>


      <section>
        <h2>Realtime leefstijlindicator</h2>

        <p>
          De FitLifeScore verandert gedurende de dag wanneer nieuwe
          gegevens beschikbaar komen.
        </p>

        <ul>
          <li>voeding wijzigt de NutritionScore;</li>
          <li>drinken en vochthoudende producten wijzigen Hydration;</li>
          <li>beweging wijzigt de ActivityScore;</li>
          <li>activiteit kan opnieuw invloed hebben op Nutrition.</li>
        </ul>

        <p>
          Hierdoor kan een gebruiker die tijdelijk achterloopt later
          alsnog volledig op schema komen.
        </p>
      </section>


      <section>
        <h2>Balans boven perfectie</h2>

        <p>
          Een FitLifeScore van <strong>100</strong> betekent dat alle
          domeinen voldoen aan de verwachte voortgang op het huidige
          moment van de dag.
        </p>

        <p>
          Het betekent niet automatisch dat alle volledige dagdoelen
          al afgerond zijn. De score beoordeelt voortgang ten opzichte
          van tijd.
        </p>

        <p>
          Bijvoorbeeld: halverwege de dag kan een gebruiker een score
          van 100 behalen wanneer voeding, hydratatie en activiteit
          perfect aansluiten bij de verwachte halve dag.
        </p>

        <p>
          Status wordt niet bepaald door de totale numerieke score.
          Iedere domeinkaart bepaalt zelfstandig zijn statuskleur op
          basis van eigen regels.
        </p>
      </section>


      <section>
        <h2>Gegevensstroom</h2>

        <p>
          Alle dashboardgegevens volgen één centrale datastroom.
          Hierdoor blijven kaarten en berekeningen consistent.
        </p>


        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-4">

          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Supabase
      ↓
dashboard_day_summary (RPC)
      ↓
DashboardStore
      ↓
Dashboard Cards
(Nutrition / Hydration / Activity)
      ↓
ScoreContext
(scores + status)
      ↓
FitLifeScoreCard`}
          </pre>

        </div>


        <p>
          DashboardStore is verantwoordelijk voor het ophalen en
          beheren van daggegevens. Dashboardkaarten halen geen eigen
          dagdata rechtstreeks uit de database.
        </p>

        <p>
          ScoreContext bevat uitsluitend tijdelijke UI-status:
          actuele scores en statuskleuren. Deze informatie wordt niet
          opgeslagen.
        </p>

        <p>
          Bij een dagwissel worden DashboardStore en ScoreContext
          opnieuw opgebouwd zodat de nieuwe dag altijd met correcte
          waarden start.
        </p>
      </section>


      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>De FitLifeScore is een realtime momentopname.</li>

          <li>Score 100 betekent volledig op schema liggen.</li>

          <li>Statuslogica blijft binnen de afzonderlijke domeinen.</li>

          <li>Dashboarddata heeft één centrale bron.</li>

          <li>Scores worden niet opgeslagen.</li>

          <li>Alle resultaten zijn reproduceerbaar vanuit brondata.</li>

          <li>UI-componenten bevatten geen verborgen businesslogica.</li>
        </ul>


        <p className="muted">
          De FitLifeScore beoordeelt niet alleen wat een gebruiker
          heeft gedaan, maar vooral of de gebruiker gedurende de dag
          op koers ligt richting zijn persoonlijke doelen.
        </p>

      </section>


    </DocumentLayout>
  );
}