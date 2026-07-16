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
          Pagina&apos;s vormen slechts het startpunt van de renderboom. De
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
          Deze hiërarchie voorkomt dat pagina&apos;s zelf verantwoordelijk worden
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

          <li>
            <strong>UI Consistency First</strong><br />
            Bij nieuwe functionaliteit wordt altijd eerst gecontroleerd of een
            bestaande component, hook, helper of CSS-class kan worden
            hergebruikt voordat nieuwe implementaties worden toegevoegd.
          </li>

          <li>Layouts bepalen de structuur, niet de pagina&apos;s.</li>

          <li>Globale state wordt uitsluitend via providers gedeeld.</li>

          <li>Dezelfde interactie gebruikt overal dezelfde component.</li>
        </ul>

        <p>
          Hierdoor ontstaat een interface die voorspelbaar blijft voor zowel
          gebruikers als ontwikkelaars.
        </p>

        <p>
          Nieuwe componenten, hooks, helpers of CSS mogen alleen worden
          toegevoegd wanneer de bestaande architectuur de gewenste
          functionaliteit aantoonbaar niet ondersteunt.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Onderdeel</th>
                <th>Eerst gebruiken</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Buttons</td>
                <td>
                  <code>app-action-button</code>,
                  <code> app-action-button--active</code> en
                  <code> app-action-button--locked</code>.
                </td>
              </tr>

              <tr>
                <td>Productscores</td>
                <td>
                  <code>GradeBadge</code>.
                </td>
              </tr>

              <tr>
                <td>Entitlements</td>
                <td>
                  <code>DashboardStore</code> en
                  <code> get_user_plan_features()</code>.
                </td>
              </tr>

              <tr>
                <td>Publieke pagina&apos;s</td>
                <td>
                  <code>public-content.css</code>.
                </td>
              </tr>

              <tr>
                <td>Browser return na Stripe</td>
                <td>
                  <code>useBrowserReturnRefresh</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Centrale componenten</h2>

        <p>
          Herbruikbare UI-elementen bepalen hun eigen visuele gedrag. Nieuwe
          schermen gebruiken bestaande componenten voordat nieuwe varianten
          worden toegevoegd.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Component</th>
                <th>Gebruik</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Card</td>
                <td>
                  Basiscontainer voor dashboard- en instellingenkaarten.
                </td>
              </tr>

              <tr>
                <td>CardHeader</td>
                <td>
                  Uniforme kaartkop met titel, icoon, score of status.
                </td>
              </tr>

              <tr>
                <td>GradeBadge</td>
                <td>
                  Enige component voor productgrades, inclusief kleur en
                  afmeting.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Productgrades worden altijd met <code>GradeBadge</code> getoond.
          Componenten bouwen geen losse grade-cirkels en bepalen zelf geen
          gradekleuren.
        </p>
      </section>

      <section>
        <h2>Knoppen</h2>

        <p>
          Actieknoppen gebruiken centrale CSS-klassen. Hierdoor blijven hover,
          locked-state en actieve state overal gelijk.
        </p>

        <ul>
          <li>
            <code>app-action-button</code> vormt de basisstijl.
          </li>

          <li>
            <code>app-action-button--active</code> toont een actieve of primaire
            actie.
          </li>

          <li>
            <code>app-action-button--locked</code> toont een vergrendelde
            actie.
          </li>

          <li>
            Componenten voegen geen eigen hoverkleuren toe wanneer een centrale
            buttonclass bestaat.
          </li>
        </ul>

        <p>
          Hovergedrag wordt centraal beheerd in <code>components.css</code>.
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
            <strong>Layouts boven pagina&apos;s</strong><br />
            Pagina&apos;s bevatten uitsluitend domeinspecifieke inhoud en geen
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
