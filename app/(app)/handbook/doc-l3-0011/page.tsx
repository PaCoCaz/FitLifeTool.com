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
          FitLifeTool. Iedere kaart vertegenwoordigt één afgebakend
          leefstijldomein en presenteert de actuele voortgang, status en
          relevante acties binnen dat domein.
        </p>

        <p>
          Het kaartsysteem is ontworpen als een verzameling herbruikbare
          bouwstenen met een vaste structuur. Hierdoor blijven alle kaarten
          herkenbaar, terwijl iedere kaart zijn eigen domeinspecifieke
          functionaliteit kan bevatten.
        </p>

        <p>
          Dit hoofdstuk beschrijft de architectuur van het kaartsysteem en de
          ontwerpkeuzes die zorgen voor een consistente gebruikerservaring.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Iedere dashboardkaart vertegenwoordigt precies één
          verantwoordelijkheidsgebied binnen FitLifeTool.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Kaart</th>
                <th>Verantwoordelijkheid</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Hydration</td>
                <td>Hydratatie en vochtbalans.</td>
              </tr>

              <tr>
                <td>Nutrition</td>
                <td>Voeding, caloriebudget en voedingsstatus.</td>
              </tr>

              <tr>
                <td>Activity</td>
                <td>Lichamelijke activiteit en energieverbruik.</td>
              </tr>

              <tr>
                <td>Weight</td>
                <td>Gewicht en lichaamsontwikkeling.</td>
              </tr>

              <tr>
                <td>FitLifeScore</td>
                <td>Gecombineerde dagstatus van alle leefstijldomeinen.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Iedere kaart is zelfstandig verantwoordelijk voor zijn eigen data,
          berekeningen en presentatie.
        </p>
      </section>

      <section>
        <h2>Opbouw van een kaart</h2>

        <p>
          Alle dashboardkaarten volgen dezelfde anatomie.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Card
 ├── CardHeader
 │      ├── Icoon
 │      ├── Titel
 │      └── FitLifeScore
 │
 └── Card Content
        ├── Hoofdwaarde
        ├── Doelwaarde
        ├── Progressbar
        ├── Statusbericht
        └── Acties`}
          </pre>
        </div>

        <p>
          Door deze vaste structuur herkennen gebruikers iedere kaart direct,
          ongeacht het onderliggende leefstijldomein.
        </p>
      </section>

      <section>
        <h2>Compositie</h2>

        <p>
          Het kaartsysteem is gebaseerd op compositie in plaats van
          overerving of afzonderlijke kaarttypen.
        </p>

        <ul>
          <li>De component <code>Card</code> verzorgt de basislayout.</li>

          <li>
            <code>CardHeader</code> verzorgt titel, pictogram en
            FitLifeScore.
          </li>

          <li>De inhoud wordt als children samengesteld.</li>

          <li>
            Domeinspecifieke componenten voegen uitsluitend hun eigen logica
            toe.
          </li>
        </ul>

        <p>
          Hierdoor blijft de layout volledig uniform terwijl de inhoud per
          kaart kan verschillen.
        </p>
      </section>

      <section>
        <h2>Verantwoordelijkheden</h2>

        <p>
          Iedere kaart is verantwoordelijk voor zijn eigen domein en kent een
          vaste gegevensstroom.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`DashboardStore
      ↓
Domeinscore
      ↓
Status
      ↓
Card
      ↓
Gebruiker`}
          </pre>
        </div>

        <p>
          Kaarten voeren geen berekeningen uit voor andere domeinen. Alleen de
          FitLifeScore combineert informatie uit meerdere kaarten.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>
            Iedere kaart vertegenwoordigt precies één leefstijldomein.
          </li>

          <li>
            Alle kaarten gebruiken dezelfde visuele basisstructuur.
          </li>

          <li>
            Businesslogica blijft gescheiden van presentatie.
          </li>

          <li>
            Nieuwe kaarten worden opgebouwd uit bestaande componenten.
          </li>

          <li>
            Consistentie gaat vóór individuele optimalisaties.
          </li>
        </ul>

        <p>
          Door deze architectuur blijft het dashboard overzichtelijk en
          uitbreidbaar. Nieuwe domeinen kunnen worden toegevoegd zonder dat de
          bestaande gebruikerservaring verandert.
        </p>
      </section>
    </DocumentLayout>
  );
}