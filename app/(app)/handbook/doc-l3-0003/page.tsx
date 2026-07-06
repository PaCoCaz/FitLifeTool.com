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
          Vrijwel alle functionaliteit binnen FitLifeTool is georganiseerd rond
          één kalenderdag. Voeding, hydratatie, activiteiten, gewicht en de
          FitLifeScore worden altijd beoordeeld binnen de context van een
          specifieke dag.
        </p>

        <p>
          Een dag is geen afzonderlijke database-entiteit, maar een logische
          verzameling van alle gebruikersgegevens met dezelfde dagidentificatie.
          Hierdoor kunnen berekeningen altijd opnieuw worden uitgevoerd op basis
          van de oorspronkelijke brongegevens.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe dagen worden opgebouwd, hoe loggegevens
          worden gebruikt en waarom vrijwel alle voortgang binnen FitLifeTool
          reproduceerbaar kan worden herberekend.
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
            <strong>De dag</strong> wordt geïdentificeerd met een unieke{" "}
            <code>dayKey</code>.
          </li>

          <li>
            <strong>Gebruikersacties</strong> worden opgeslagen als
            afzonderlijke logregistraties.
          </li>

          <li>
            <strong>Voortgang en scores</strong> zijn altijd afgeleide waarden.
          </li>

          <li>
            <strong>Brongegevens</strong> blijven altijd behouden.
          </li>
        </ul>

        <p>
          Hierdoor bestaat er geen verborgen dagstatus. Iedere weergave kan
          opnieuw worden opgebouwd vanuit dezelfde loggegevens.
        </p>
      </section>

      <section>
        <h2>Logstructuur</h2>

        <p>
          Iedere functionele module gebruikt een eigen logtabel. Voorbeelden
          hiervan zijn:
        </p>

        <ul>
          <li>
            <code>nutrition_logs</code>
          </li>

          <li>
            <code>hydration_logs</code>
          </li>

          <li>
            <code>activity_logs</code>
          </li>

          <li>
            <code>weight_logs</code>
          </li>
        </ul>

        <p>
          Iedere log bevat minimaal de volgende gegevens:
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Veld</th>
                <th>Omschrijving</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>user_id</td>
                <td>Eigenaar van de registratie.</td>
              </tr>

              <tr>
                <td>log_date</td>
                <td>De kalenderdag waartoe de registratie behoort.</td>
              </tr>

              <tr>
                <td>created_at</td>
                <td>Moment waarop de registratie is opgeslagen.</td>
              </tr>

              <tr>
                <td>Domeinspecifieke gegevens</td>
                <td>
                  Bijvoorbeeld voedingswaarden, milliliters, stappen, minuten
                  activiteit of gewicht.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Iedere registratie staat volledig op zichzelf en vormt een
          reproduceerbare bron voor latere berekeningen.
        </p>
      </section>

      <section>
        <h2>Dagcontext</h2>

        <p>
          De actieve dag wordt centraal beheerd binnen de applicatie. Alle
          dashboardgegevens, kaarten en scoreberekeningen zijn gekoppeld aan
          dezelfde dagcontext.
        </p>

        <p>
          Een wijziging van de actieve dag leidt automatisch tot het opnieuw
          ophalen en berekenen van alle relevante gegevens.
        </p>

        <p>
          Hierdoor blijft de volledige gebruikersinterface consistent zonder dat
          afzonderlijke onderdelen hun eigen dagstatus hoeven bij te houden.
        </p>
      </section>

      <section>
        <h2>Herberekening</h2>

        <p>
          Dashboardwaarden en scores worden niet permanent opgeslagen. Ze worden
          telkens opnieuw opgebouwd vanuit de loggegevens en de actuele
          gebruikersdoelen.
        </p>

        <ul>
          <li>Loggegevens vormen altijd de bron van waarheid.</li>

          <li>Gebruikersdoelen bepalen de verwachte situatie.</li>

          <li>Scores worden dynamisch berekend.</li>

          <li>De gebruikersinterface toont uitsluitend berekende resultaten.</li>
        </ul>

        <p>
          Hierdoor kunnen wijzigingen in scoremodellen of berekeningen worden
          toegepast zonder historische gegevens aan te passen.
        </p>
      </section>

      <section>
        <h2>Gegevensstroom</h2>

        <p>
          Voor iedere actieve dag verloopt de gegevensstroom volgens hetzelfde
          patroon:
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`useDayNow
      ↓
dayKey
      ↓
DashboardStore
      ↓
dashboard_day_summary (RPC)
      ↓
Scores
      ↓
Dashboard UI`}
          </pre>
        </div>

        <p>
          Door deze vaste gegevensstroom worden alle kaarten en dashboards
          gesynchroniseerd vanuit dezelfde brongegevens.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Er bestaat geen aparte dagtabel.</li>

          <li>Loggegevens vormen altijd de bron van waarheid.</li>

          <li>Voortgang en scores zijn afgeleide data.</li>

          <li>Historische dagen blijven volledig reproduceerbaar.</li>

          <li>
            Een wijziging van de dagcontext resulteert altijd in een volledige
            herberekening.
          </li>

          <li>
            De gebruikersinterface berekent zelf geen businesslogica, maar
            presenteert uitsluitend de berekende resultaten.
          </li>
        </ul>

        <p>
          Deze architectuur maakt FitLifeTool voorspelbaar, controleerbaar en
          eenvoudig uitbreidbaar. Nieuwe modules kunnen dezelfde dagstructuur en
          logica volgen zonder de bestaande architectuur te wijzigen.
        </p>
      </section>
    </DocumentLayout>
  );
}