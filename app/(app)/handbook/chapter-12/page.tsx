// app/handbook/chapter-12/page.tsx

export default function Chapter12() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            4.3 - Layout & Responsiveness
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft hoe de layout van FitLifeTool
            is opgebouwd met grid-systemen en hoe de UI zich
            responsief aanpast aan verschillende schermgroottes.
          </p>
  
          <p className="text-gray-700">
            Het doel van deze aanpak is om een stabiele,
            voorspelbare structuur te bieden, waarbij cards,
            navigatie en content logisch herschikken zonder
            visuele breuken of onverwacht gedrag.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            De layout is gebaseerd op een
            <strong> tweedimensionaal gridmodel </strong>,
            waarin rijen en kolommen expliciet worden gedefinieerd.
            Cards zijn grid-items die zich aanpassen aan beschikbare ruimte.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Desktop: meerdere kolommen naast elkaar</li>
            <li>Tablet: herverdeling naar minder kolommen</li>
            <li>Mobiel: lineaire stacking van cards</li>
          </ul>
  
          <p className="text-gray-700">
            Responsiveness wordt gezien als een
            <strong> layout-eigenschap </strong>,
            niet als een aparte mobiele variant van de applicatie.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            Technisch is het grid gerealiseerd met CSS Grid
            via utility classes. Het dashboard gebruikt een
            vaste kolomstructuur die per breakpoint verandert.
          </p>
  
          <p className="text-gray-700">
            Een typisch patroon is:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li><code>grid-cols-12</code> als basis</li>
            <li>Cards bepalen hun span via <code>col-span-x</code></li>
            <li>Breakpoints sturen herverdeling (<code>md:</code>, <code>lg:</code>)</li>
          </ul>
  
          <p className="text-gray-700">
            De containerbreedte is bewust begrensd om
            leesbaarheid te behouden, terwijl de interne grid
            volledige vrijheid heeft om content te positioneren.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Grid boven flex:</strong> grids geven expliciete
              controle over zowel rijen als kolommen.
            </li>
            <li>
              <strong>12-koloms systeem:</strong> sluit aan bij
              gangbare ontwerpprincipes en is intuïtief uitbreidbaar.
            </li>
            <li>
              <strong>Responsiveness via breakpoints:</strong>
              voorkomt complexe runtime-logica.
            </li>
            <li>
              <strong>Geen aparte mobiele layouts:</strong>
              reduceert onderhoud en inconsistenties.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Deze aanpak zorgt ervoor dat nieuwe cards of pagina’s
            automatisch passen binnen het bestaande layout-systeem
            zonder extra ontwerpbeslissingen.
          </p>
        </section>
  
      </div>
    );
  }
  