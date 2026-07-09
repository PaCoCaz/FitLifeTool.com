// app/(app)/handbook/doc-l3-0011/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30011() {
  return (
    <DocumentLayout>

      <header>
        <h1>4.2 Kaartsysteem & Compositie</h1>
        <HandbookMeta />
      </header>


      <section>
        <p>
          Dashboardkaarten vormen de primaire gebruikersinterface van
          FitLifeTool. Iedere kaart vertegenwoordigt een duidelijk afgebakend
          onderdeel van de applicatie en presenteert actuele informatie,
          voortgang of persoonlijke gegevens.
        </p>

        <p>
          Het kaartsysteem is opgebouwd uit herbruikbare componenten. De
          visuele structuur is overal gelijk, terwijl iedere kaart alleen de
          logica bevat die hoort bij zijn eigen verantwoordelijkheid.
        </p>

        <p>
          Dit hoofdstuk beschrijft de rolverdeling tussen kaarten,
          DashboardStore, profieldata en ScoreContext.
        </p>
      </section>


      <section>
        <h2>Conceptueel model</h2>

        <p>
          Niet iedere dashboardkaart gebruikt dezelfde databron. FitLifeTool
          maakt onderscheid tussen daggerichte kaarten en profielgerichte
          kaarten.
        </p>


        <div className="table-scroll">

          <table className="label-column">

            <thead>

              <tr>
                <th>Kaart</th>
                <th>Databron</th>
                <th>Verantwoordelijkheid</th>
              </tr>

            </thead>


            <tbody>


              <tr>

                <td>Hydration</td>

                <td>
                  DashboardStore
                </td>

                <td>
                  Actuele hydratatievoortgang binnen de actieve dag.
                </td>

              </tr>


              <tr>

                <td>Nutrition</td>

                <td>
                  DashboardStore
                </td>

                <td>
                  Energie-inname, voedingsbudget en dagstatus.
                </td>

              </tr>


              <tr>

                <td>Activity</td>

                <td>
                  DashboardStore
                </td>

                <td>
                  Activiteiten en voortgang richting bewegingsdoel.
                </td>

              </tr>


              <tr>

                <td>Weight</td>

                <td>
                  Profielgegevens
                </td>

                <td>
                  Gewicht, lichaamsontwikkeling en persoonlijke waarden.
                </td>

              </tr>


              <tr>

                <td>FitLifeScore</td>

                <td>
                  ScoreContext
                </td>

                <td>
                  Gecombineerde interpretatie van de actuele leefstijlstatus.
                </td>

              </tr>


            </tbody>

          </table>

        </div>


        <p>
          DashboardStore beheert uitsluitend dagelijkse voortgangsgegevens.
          Profielinformatie zoals gewicht of persoonlijke instellingen valt
          buiten deze verantwoordelijkheid.
        </p>

      </section>



      <section>

        <h2>Opbouw van een kaart</h2>


        <p>
          Alle kaarten gebruiken dezelfde visuele basisstructuur.
        </p>


        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">

          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Card
 ├── CardHeader
 │      ├── Icoon
 │      ├── Titel
 │      └── Status / Score
 │
 └── Card Content
        ├── Hoofdwaarde
        ├── Doelwaarde
        ├── Progressbar
        └── Domeininformatie`}
          </pre>

        </div>


        <p>
          Card en CardHeader bevatten alleen presentatie en geen
          domeinspecifieke berekeningen.
        </p>

      </section>



      <section>

        <h2>Compositie</h2>


        <p>
          Het kaartsysteem gebruikt compositie. Algemene UI wordt gedeeld,
          terwijl domeinen hun eigen gedrag toevoegen.
        </p>


        <ul>

          <li>
            <code>Card</code> verzorgt de basislayout.
          </li>

          <li>
            <code>CardHeader</code> verzorgt de uniforme kop.
          </li>

          <li>
            Dashboardkaarten bepalen hun eigen inhoud.
          </li>

          <li>
            Gemeenschappelijke logica wordt gedeeld via stores en contexts.
          </li>

        </ul>


        <p>
          Hierdoor blijft de interface consistent zonder afhankelijkheden
          tussen losse kaarten.
        </p>

      </section>



      <section>

        <h2>Gegevensstroom</h2>


        <p>
          Daggerichte dashboardkaarten volgen dezelfde centrale gegevensstroom.
        </p>


        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">

          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Supabase
      ↓
dashboard_day_summary (RPC)
      ↓
DashboardStore
      ↓
Nutrition / Hydration / Activity
      ↓
ScoreContext
      ↓
FitLifeScoreCard`}
          </pre>

        </div>


        <p>
          ScoreContext bevat geen brongegevens. Het deelt alleen tijdelijke
          scores en statusinformatie tussen de domeinkaarten en de
          FitLifeScoreCard.
        </p>


        <p>
          Profielgerichte kaarten gebruiken de daarvoor bedoelde
          profielgegevens en hoeven niet via DashboardStore te lopen.
        </p>

      </section>



      <section>

        <h2>Belangrijke ontwerpprincipes</h2>


        <ul>

          <li>
            Iedere kaart heeft één duidelijke verantwoordelijkheid.
          </li>

          <li>
            Daggerichte data loopt via DashboardStore.
          </li>

          <li>
            Profieldata blijft gescheiden van dagvoortgang.
          </li>

          <li>
            ScoreContext bevat alleen tijdelijke UI-status.
          </li>

          <li>
            Kaarten berekenen geen resultaten voor andere domeinen.
          </li>

          <li>
            Nieuwe kaarten gebruiken bestaande UI-componenten.
          </li>

        </ul>


        <p>
          Door deze scheiding blijft het dashboard uitbreidbaar zonder dat
          DashboardStore verandert in een algemene opslagplaats voor alle
          applicatiedata.
        </p>

      </section>


    </DocumentLayout>
  );
}