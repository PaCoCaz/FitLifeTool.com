// app/handbook/doc-l3-0012/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30012() {
  return (
    <DocumentLayout>

      <header>
        <h1>4.3 Layout & Responsiviteit</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe de layout van FitLifeTool
          is opgebouwd met grid-systemen en hoe de UI zich
          responsief aanpast aan verschillende schermgroottes.
        </p>

        <p>
          Het doel van deze aanpak is om een stabiele,
          voorspelbare structuur te bieden, waarbij cards,
          navigatie en content logisch herschikken zonder
          visuele breuken of onverwacht gedrag.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          De layout is gebaseerd op een
          <strong> tweedimensionaal gridmodel</strong>,
          waarin rijen en kolommen expliciet worden gedefinieerd.
          Cards zijn grid-items die zich aanpassen aan beschikbare ruimte.
        </p>

        <ul>
          <li>Desktop: meerdere kolommen naast elkaar</li>
          <li>Tablet: herverdeling naar minder kolommen</li>
          <li>Mobiel: lineaire stacking van cards</li>
        </ul>

        <p>
          Responsiveness wordt gezien als een <strong>layout-eigenschap</strong>, niet als een aparte mobiele variant van de applicatie.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technisch is het grid gerealiseerd met CSS Grid
          via utility classes. Het dashboard gebruikt een
          vaste kolomstructuur die per breakpoint verandert.
        </p>

        <p>
          Een typisch patroon is:
        </p>

        <ul>
          <li><code>grid-cols-12</code> als basis</li>
          <li>Cards bepalen hun span via <code>col-span-x</code></li>
          <li>Breakpoints sturen herverdeling (<code>md:</code>, <code>lg:</code>)</li>
        </ul>

        <p>
          De containerbreedte is bewust begrensd om
          leesbaarheid te behouden, terwijl de interne grid
          volledige vrijheid heeft om content te positioneren.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Grid boven flex</strong><br />
            Grids geven expliciete controle over zowel rijen als kolommen.
          </li>

          <li>
            <strong>12-koloms systeem</strong><br />
            Sluit aan bij gangbare ontwerpprincipes en is intuïtief uitbreidbaar.
          </li>

          <li>
            <strong>Responsiveness via breakpoints</strong><br />
            Voorkomt complexe runtime-logica.
          </li>

          <li>
            <strong>Geen aparte mobiele layouts</strong><br />
            Reduceert onderhoud en inconsistenties.
          </li>
        </ul>

        <p className="muted">
          Deze aanpak zorgt ervoor dat nieuwe cards of pagina's
          automatisch passen binnen het bestaande layout-systeem
          zonder extra ontwerpbeslissingen.
        </p>
      </section>

    </DocumentLayout>
  );
}
