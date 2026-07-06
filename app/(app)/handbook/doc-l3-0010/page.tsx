// app/(app)/handbook/doc-l3-0010/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30010() {
  return (
    <DocumentLayout>
      <header>
        <h1>4.1 UI-architectuur</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          De gebruikersinterface van FitLifeTool is opgebouwd als een
          componentgebaseerd systeem waarin presentatie, navigatie en
          businesslogica bewust van elkaar zijn gescheiden. Hierdoor blijft
          de interface consistent, onderhoudbaar en eenvoudig uitbreidbaar,
          ook wanneer de applicatie groeit.
        </p>

        <p>
          Pagina's vormen slechts het startpunt van de renderboom. De
          daadwerkelijke functionaliteit bevindt zich in herbruikbare layouts,
          providers en UI-componenten die gezamenlijk één consistente
          gebruikerservaring vormen.
        </p>

        <p>
          Dit hoofdstuk beschrijft de architectuur van deze UI-laag en de
          ontwerpkeuzes die zorgen voor een uniforme structuur binnen de
          gehele applicatie.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          De UI-architectuur van FitLifeTool bestaat uit meerdere duidelijk
          gescheiden lagen, waarbij iedere laag één specifieke
          verantwoordelijkheid heeft.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Laag</th>
                <th>Verantwoordelijkheid</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>AppShell</td>
                <td>Globale structuur, header en navigatie.</td>
              </tr>

              <tr>
                <td>Layouts</td>
                <td>Pagina-opbouw en context per sectie.</td>
              </tr>

              <tr>
                <td>Providers</td>
                <td>Beschikbaar maken van gedeelde applicatiestatus.</td>
              </tr>

              <tr>
                <td>Dashboard Cards</td>
                <td>Presenteren van één afgebakend domein.</td>
              </tr>

              <tr>
                <td>UI Components</td>
                <td>Herbruikbare bouwstenen zonder domeinspecifieke logica.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Deze hiërarchie voorkomt dat pagina's zelf verantwoordelijk worden
          voor layout, globale state of navigatie.
        </p>
      </section>

      <section>
        <h2>Opbouw van de interface</h2>

        <p>
          Iedere pagina wordt opgebouwd vanuit dezelfde vaste structuur:
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`AppShell
      ↓
Section Layout
      ↓
Providers
      ↓
Pagina
      ↓
Cards
      ↓
UI Components`}
          </pre>
        </div>

        <p>
          Iedere laag kent uitsluitend zijn eigen verantwoordelijkheid en
          communiceert uitsluitend met de direct omliggende lagen.
        </p>
      </section>

      <section>
        <h2>Ontwerpprincipes</h2>

        <p>
          De UI volgt een aantal vaste architectuurprincipes.
        </p>

        <ul>
          <li>Presentatie en businesslogica blijven strikt gescheiden.</li>

          <li>Componenten zijn herbruikbaar en composable.</li>

          <li>Layouts bepalen de structuur, niet de pagina's.</li>

          <li>Globale state wordt uitsluitend via providers gedeeld.</li>

          <li>Dezelfde interactie gebruikt overal dezelfde component.</li>
        </ul>

        <p>
          Hierdoor ontstaat een interface die voorspelbaar blijft voor zowel
          gebruikers als ontwikkelaars.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpbeslissingen</h2>

        <ul>
          <li>
            <strong>Eén AppShell</strong><br />
            Alle applicatiesecties delen dezelfde basisstructuur en navigatie.
          </li>

          <li>
            <strong>Component-first</strong><br />
            Nieuwe functionaliteit wordt opgebouwd uit bestaande componenten
            voordat nieuwe varianten worden geïntroduceerd.
          </li>

          <li>
            <strong>Layouts boven pagina's</strong><br />
            Pagina's bevatten uitsluitend domeinspecifieke inhoud en geen
            globale layoutlogica.
          </li>

          <li>
            <strong>Consistente interactie</strong><br />
            Identieke UI-elementen gedragen zich overal hetzelfde.
          </li>
        </ul>

        <p>
          Door deze architectuur blijft de gebruikersinterface overzichtelijk,
          schaalbaar en eenvoudig te onderhouden, terwijl nieuwe functionaliteit
          zonder grote structurele wijzigingen kan worden toegevoegd.
        </p>
      </section>
    </DocumentLayout>
  );
}