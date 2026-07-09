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
          FitLifeTool maakt een strikt onderscheid tussen opgeslagen
          brongegevens en realtime berekende waarden.
        </p>

        <p>
          Gebruikersinstellingen, persoonlijke doelen en registraties worden
          opgeslagen. Dagelijkse voortgang, statussen en scores worden hieruit
          dynamisch berekend.
        </p>

        <p>
          Hierdoor blijft de applicatie flexibel: wijzigingen in berekeningen
          kunnen worden toegepast zonder historische gebruikersdata aan te
          passen.
        </p>
      </section>


      <section>
        <h2>Conceptueel model</h2>

        <p>
          Binnen FitLifeTool bestaan drie soorten gegevens:
        </p>


        <div className="table-scroll">
          <table className="label-column">

            <thead>
              <tr>
                <th>Type</th>
                <th>Omschrijving</th>
              </tr>
            </thead>


            <tbody>

              <tr>
                <td>Brondata</td>

                <td>
                  Permanente gegevens zoals gebruikersinstellingen,
                  producten en logs.
                </td>
              </tr>


              <tr>
                <td>Profielwaarden</td>

                <td>
                  Opgeslagen persoonlijke instellingen zoals doelen,
                  voorkeuren en berekende doelwaarden.
                </td>
              </tr>


              <tr>
                <td>Afgeleide dagdata</td>

                <td>
                  Tijdelijke waarden zoals voortgang, status en scores.
                </td>
              </tr>

            </tbody>

          </table>
        </div>


        <p>
          Alleen waarden die nodig zijn als stabiele gebruikersconfiguratie
          worden opgeslagen. Dagresultaten worden opnieuw berekend.
        </p>
      </section>


      <section>
        <h2>Brongegevens</h2>

        <p>
          De berekeningen binnen FitLifeTool gebruiken meerdere soorten
          brongegevens.
        </p>


        <ul>

          <li>
            gebruikersprofiel en persoonlijke instellingen;
          </li>

          <li>
            productgegevens en voedingswaarden;
          </li>

          <li>
            voedingsregistraties via <code>nutrition_logs</code>;
          </li>

          <li>
            activiteiten via <code>activity_logs</code>;
          </li>

          <li>
            gewichtsregistraties via <code>weight_logs</code>.
          </li>

        </ul>


        <p>
          Hydratatie gebruikt geen aparte daglog. De hydratiewaarde wordt
          opgebouwd vanuit geregistreerde consumpties, producten en
          hydratatiefactoren.
        </p>


        <p>
          Deze gegevens vormen samen de reproduceerbare basis van alle
          berekeningen.
        </p>

      </section>


      <section>
        <h2>Dynamische afgeleide data</h2>


        <p>
          Nieuwe gebeurtenissen kunnen de actuele dagstatus veranderen zonder
          bestaande brongegevens te wijzigen.
        </p>


        <p>
          Een belangrijk voorbeeld hiervan is de relatie tussen activiteit en
          voeding.
        </p>


        <ul>

          <li>
            Een activiteit wordt opgeslagen als bronregistratie.
          </li>

          <li>
            De verbrande energie verhoogt het beschikbare voedingsbudget van
            dezelfde dag.
          </li>

          <li>
            De oorspronkelijke voedingsregistraties blijven ongewijzigd.
          </li>

          <li>
            NutritionScore, status en voortgang worden opnieuw berekend.
          </li>

        </ul>


        <p>
          Hierdoor blijft de volledige dag opnieuw te reconstrueren vanuit de
          oorspronkelijke gegevens.
        </p>

      </section>


      <section>
        <h2>Realtime herberekening</h2>


        <p>
          Iedere wijziging volgt dezelfde centrale gegevensstroom.
        </p>


        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">

          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Nieuwe registratie
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
          DashboardStore beheert de actuele daggegevens. De afzonderlijke
          dashboardkaarten gebruiken deze centrale bron en halen geen eigen
          dagdata rechtstreeks uit de database.
        </p>


        <p>
          ScoreContext bewaart uitsluitend tijdelijke scores en
          statusinformatie voor de huidige gebruikersinterface.
        </p>

      </section>


      <section>
        <h2>Profieldata versus dagdata</h2>


        <p>
          Niet alle opgeslagen waarden zijn historische logs. Sommige waarden
          worden bewust opgeslagen als actuele gebruikersconfiguratie.
        </p>


        <ul>

          <li>
            caloriebehoefte;
          </li>

          <li>
            waterdoel;
          </li>

          <li>
            activiteitsdoel;
          </li>

          <li>
            persoonlijke instellingen.
          </li>

        </ul>


        <p>
          Deze waarden vormen de basis waarmee dagelijkse voortgang wordt
          berekend. Ze zijn geen opgeslagen dagscores.
        </p>

      </section>


      <section>
        <h2>Waarom herberekening?</h2>


        <p>
          Afgeleide dagwaarden worden niet opgeslagen omdat ze altijd opnieuw
          uit dezelfde brongegevens kunnen worden opgebouwd.
        </p>


        <ul>

          <li>
            Nieuwe logs worden direct meegenomen.
          </li>

          <li>
            Gewijzigde doelen werken onmiddellijk door.
          </li>

          <li>
            Berekeningen blijven reproduceerbaar.
          </li>

          <li>
            Scores hoeven niet gemigreerd te worden.
          </li>

        </ul>

      </section>


      <section>
        <h2>Belangrijke ontwerpprincipes</h2>


        <ul>

          <li>
            Brondata vormt altijd de waarheid.
          </li>

          <li>
            Profielwaarden zijn opgeslagen configuratie.
          </li>

          <li>
            Dagstatus en scores zijn afgeleid.
          </li>

          <li>
            DashboardStore beheert dagelijkse voortgang.
          </li>

          <li>
            ScoreContext bevat alleen tijdelijke UI-status.
          </li>

          <li>
            Historische data blijft reproduceerbaar.
          </li>

        </ul>


        <div className="info-box">
          FitLifeTool bewaart de gegevens die nodig zijn om een situatie opnieuw
          te berekenen, maar bewaart niet het resultaat van die berekening.
          Hierdoor blijven scores en inzichten altijd actueel.
        </div>

      </section>


    </DocumentLayout>
  );
}