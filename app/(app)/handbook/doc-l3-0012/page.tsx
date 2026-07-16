// app/(app)/handbook/doc-l3-0012/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30012() {
  return (
    <DocumentLayout>
      <header>
        <h1>4.3 Layout & Responsiviteit</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          FitLifeTool is ontworpen volgens een <strong>mobile-first</strong> ontwerpstrategie.
          De meeste gebruikers registreren voeding, hydratatie, activiteiten en gewicht gedurende de dag via een smartphone.
          De gebruikersinterface is daarom primair geoptimaliseerd voor kleine schermen.
        </p>

        <p>
          Tablet- en desktopweergaven vormen uitbreidingen van dezelfde
          interface. Zij bieden meer ruimte voor presentatie, maar veranderen
          niets aan de functionaliteit of de onderliggende businesslogica.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe layouts worden opgebouwd, hoe
          responsiviteit wordt toegepast en welke ontwerpprincipes zorgen voor
          een consistente gebruikerservaring op alle apparaten.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Iedere applicatiesectie gebruikt een gespecialiseerde
          layoutcomponent die is afgestemd op het doel van die sectie.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Layoutcomponent</th>
                <th>Verantwoordelijkheid</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>DashboardGrid</td>
                <td>Positioneert de dashboardkaarten.</td>
              </tr>

              <tr>
                <td>SettingsGrid</td>
                <td>Structureert de instellingenpagina.</td>
              </tr>

              <tr>
                <td>CategoryGrid</td>
                <td>Toont productcategorieën en lijsten.</td>
              </tr>

              <tr>
                <td>HandbookLayout</td>
                <td>Structureert documentatie en navigatie.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Iedere layout bepaalt uitsluitend de positionering van componenten.
          De onderliggende functionaliteit blijft volledig onafhankelijk van de
          gekozen presentatie.
        </p>
      </section>

      <section>
        <h2>Responsief gedrag</h2>

        <p>
          FitLifeTool gebruikt één gebruikersinterface voor alle apparaten.
          Componenten worden automatisch herschikt op basis van de beschikbare
          schermruimte.
        </p>

        <ul>
          <li>Mobiel vormt het uitgangspunt van het ontwerp.</li>

          <li>Tablet benut extra ruimte zonder functionaliteit te wijzigen.</li>

          <li>Desktop toont meerdere componenten gelijktijdig wanneer dat de leesbaarheid verbetert.</li>

          <li>Interacties blijven op ieder apparaat identiek.</li>
        </ul>

        <p>
          Hierdoor leert een gebruiker slechts één interface kennen,
          ongeacht het apparaat waarop FitLifeTool wordt gebruikt.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Layoutcomponenten zijn uitsluitend verantwoordelijk voor de
          positionering van componenten. Businesslogica, dataverwerking en
          statusberekeningen bevinden zich altijd binnen de betreffende
          domeincomponenten.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`AppShell
      ↓
Section Layout
      ↓
Responsive Grid
      ↓
Cards & Components
      ↓
Gebruiker`}
          </pre>
        </div>

        <p>
          Hierdoor kan dezelfde component op verschillende schermformaten een
          andere positie krijgen, terwijl gedrag, berekeningen en interacties
          volledig identiek blijven.
        </p>
      </section>

      <section>
        <h2>CSS-structuur</h2>

        <p>
          De globale styling is verdeeld over een klein aantal duidelijke
          stylesheets. Iedere stylesheet heeft een eigen verantwoordelijkheid.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Bestand</th>
                <th>Verantwoordelijkheid</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>globals.css</td>
                <td>
                  Globale basisregels en browsernormalisatie.
                </td>
              </tr>

              <tr>
                <td>components.css</td>
                <td>
                  Herbruikbare UI-componentklassen zoals centrale
                  buttonstijlen.
                </td>
              </tr>

              <tr>
                <td>public-content.css</td>
                <td>
                  Homepage, publieke categoriepagina&apos;s, SEO-content en FAQ.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <code>category.css</code> bestaat niet meer. Publieke pagina&apos;s
          renderen binnen <code>.public-content</code>, zodat publieke
          contentstijlen gescheiden blijven van dashboard- en applicatiestijlen.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Mobile-first vormt het uitgangspunt van iedere nieuwe interface.</li>

          <li>Responsiviteit verandert uitsluitend de presentatie.</li>

          <li>Layouts bepalen de structuur; componenten bepalen het gedrag.</li>

          <li>Businesslogica is volledig onafhankelijk van schermgrootte.</li>

          <li>Nieuwe layouts volgen dezelfde responsieve architectuur.</li>

          <li>Publieke content gebruikt public-content.css binnen de publieke scope.</li>

          <li>Gebruikers ervaren op ieder apparaat dezelfde functionaliteit.</li>
        </ul>

        <p>
          Door presentatie, layout en businesslogica strikt van elkaar te
          scheiden blijft FitLifeTool overzichtelijk, onderhoudbaar en
          schaalbaar. Nieuwe schermen en toekomstige apparaten kunnen hierdoor
          worden ondersteund zonder de functionele architectuur aan te passen.
        </p>
      </section>
    </DocumentLayout>
  );
}
