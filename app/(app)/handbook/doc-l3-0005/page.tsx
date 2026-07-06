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
          De FitLifeScore is de centrale leefstijlindicator van FitLifeTool.
          De score is ontworpen om gebruikers gedurende de dag inzicht te geven
          in hun actuele voortgang en hen te helpen gezonde keuzes te maken
          voordat de dag voorbij is.
        </p>

        <p>
          In tegenstelling tot traditionele puntensystemen beoordeelt de
          FitLifeScore niet uitsluitend het eindresultaat van een dag. De score
          is een realtime momentopname die voortdurend wordt bijgewerkt op basis
          van nieuwe registraties en veranderende omstandigheden.
        </p>

        <p>
          Dit hoofdstuk beschrijft de ontwerpfilosofie, de opbouw en de
          architectuur van de FitLifeScore.
        </p>
      </section>

      <section>
        <h2>Doel van de FitLifeScore</h2>

        <p>
          De FitLifeScore is ontwikkeld als hulpmiddel voor gedragsverandering,
          niet als doel op zichzelf.
        </p>

        <p>
          De score heeft vier primaire functies:
        </p>

        <ul>
          <li>de actuele leefstijl in één oogopslag samenvatten;</li>

          <li>gebruikers laten zien of zij op schema liggen;</li>

          <li>onbalans tussen voeding, hydratatie en activiteit zichtbaar maken;</li>

          <li>gebruikers helpen gedurende de dag tijdig bij te sturen.</li>
        </ul>

        <p>
          Een lage score betekent daarom niet dat een dag "mislukt" is. De
          score laat uitsluitend zien hoe de actuele situatie zich verhoudt tot
          de verwachte voortgang op dat moment van de dag.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          De FitLifeScore bestaat uit drie onafhankelijke pijlers die ieder een
          specifiek onderdeel van de dagelijkse leefstijl vertegenwoordigen.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Pijler</th>
                <th>Doel</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Nutrition</td>
                <td>Balans tussen energie-inname en beschikbare energie.</td>
              </tr>

              <tr>
                <td>Hydration</td>
                <td>Voortgang ten opzichte van het hydratatieschema.</td>
              </tr>

              <tr>
                <td>Activity</td>
                <td>Voortgang ten opzichte van het bewegingsdoel.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Iedere pijler heeft een eigen scoremodel en een eigen verantwoordelijkheid binnen de FitLifeScore.
          Hoewel de pijlers afzonderlijk worden berekend, bestaan er bewust onderlinge afhankelijkheden.
          Zo verhoogt lichamelijke activiteit automatisch het beschikbare voedingsbudget, waardoor de NutritionScore direct opnieuw wordt berekend.
          Hierdoor weerspiegelt de FitLifeScore de totale energiebalans van de dag in plaats van drie volledig losstaande deelscores.
        </p>
      </section>

      <section>
        <h2>Gewogen berekening</h2>

        <p>
          De drie pijlers dragen ieder met een vast gewicht bij aan de uiteindelijke FitLifeScore.
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
          Nutrition heeft een iets grotere invloed omdat energiebalans een centrale rol speelt binnen de dagelijkse leefstijl.
          De andere twee pijlers blijven echter essentieel voor een evenwichtige beoordeling.
        </p>
      </section>

      <section>
        <h2>Realtime leefstijlindicator</h2>

        <p>
          De FitLifeScore is geen eindbeoordeling maar een dynamische
          momentopname. Iedere nieuwe registratie kan de score direct
          beïnvloeden.
        </p>

        <ul>
          <li>een maaltijd verandert de NutritionScore;</li>

          <li>een drinkmoment beïnvloedt de HydrationScore;</li>

          <li>een activiteit verhoogt de ActivityScore;</li>

          <li>een activiteit verhoogt tegelijkertijd het beschikbare voedingsbudget van die dag, waardoor de NutritionScore direct opnieuw wordt berekend.</li>
        </ul>

        <p>
          Hierdoor kan een gebruiker die tijdelijk achterloopt of juist voorloopt later op de dag alsnog volledig op schema komen.
        </p>
      </section>

      <section>
        <h2>Balans boven perfectie</h2>

        <p>
          Een FitLifeScore van <strong>100</strong> vertegenwoordigt een
          volledig gebalanceerde dag.
        </p>

        <p>
          Daarom wordt een perfecte score uitsluitend toegekend wanneer alle
          drie de pijlers hun dagdoel hebben bereikt.
        </p>

        <p>
          Zodra één van de pijlers achterblijft, wordt de maximale score
          begrensd op <strong>99</strong>. Hiermee wordt voorkomen dat
          uitstekende prestaties binnen één onderdeel tekorten binnen een ander
          onderdeel volledig maskeren.
        </p>
      </section>

      <section>
        <h2>Gegevensstroom</h2>

        <p>
          De FitLifeScore wordt volledig opgebouwd uit dezelfde brongegevens als
          de overige dashboardonderdelen.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-4">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Gebruikerslogs
      ↓
dashboard_day_summary (RPC)
      ↓
DashboardStore
      ↓
Nutrition / Hydration / Activity
      ↓
FitLifeScore
      ↓
Dashboard`}
          </pre>
        </div>

        <p>
          De gebruikersinterface presenteert uitsluitend de berekende resultaten
          en bevat geen zelfstandige businesslogica.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>De FitLifeScore is een realtime momentopname.</li>

          <li>De score ondersteunt gedragsverandering gedurende de dag.</li>

          <li>Balans is belangrijker dan een hoge deelscore.</li>

          <li>Nieuwe gebeurtenissen kunnen de score gedurende de dag herstellen.</li>

          <li>De score wordt nooit opgeslagen.</li>

          <li>Iedere berekening is reproduceerbaar vanuit brongegevens.</li>

          <li>De gebruikersinterface bevat geen verborgen scorelogica.</li>
        </ul>

        <div className="info-box">
          De FitLifeScore is geen beoordeling van het verleden, maar een
          hulpmiddel om gebruikers gedurende de dag inzicht te geven in hun
          actuele leefstijl en hen te ondersteunen bij het tijdig bijsturen van
          hun gedrag.
        </div>
      </section>
    </DocumentLayout>
  );
}