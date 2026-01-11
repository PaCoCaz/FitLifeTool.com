// app/handbook/chapter-10/page.tsx

export default function Chapter10() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            4.1 - UI Architecture overview
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft de globale architectuur van de UI-laag
            van FitLifeTool. Het doel is inzicht geven in hoe layout,
            navigatie en content samenkomen tot één consistent systeem.
          </p>
  
          <p className="text-gray-700">
            De UI is niet opgebouwd als een verzameling losse pagina’s,
            maar als een hiërarchisch en herbruikbaar layout-systeem
            dat schaalbaar is naarmate de applicatie groeit.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            De UI-architectuur van FitLifeTool is gebaseerd op een
            <strong> shell + content </strong> model.
            Hierbij vormt een vaste buitenlaag (shell) het kader
            waarbinnen alle pagina’s worden weergegeven.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>De shell bepaalt globale structuur en navigatie</li>
            <li>Contentpagina’s bevatten uitsluitend domeinlogica</li>
            <li>Context (waar ben ik?) is altijd zichtbaar</li>
          </ul>
  
          <p className="text-gray-700">
            Dit voorkomt dat individuele pagina’s zelf verantwoordelijk
            worden voor layoutbeslissingen en zorgt voor visuele en
            structurele consistentie.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            Technisch is de UI-architectuur gerealiseerd via een centrale
            <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">
              AppShell
            </code>
            component, die op layout-niveau wordt toegepast.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Header en topnavigatie zijn fixed gepositioneerd</li>
            <li>Breadcrumb-gebied is een vaste zone onder de navigatie</li>
            <li>Scrollende content wordt hier expliciet onder geplaatst</li>
          </ul>
  
          <p className="text-gray-700">
            Binnen de shell renderen pagina’s uitsluitend hun eigen
            inhoud. Ze hebben geen kennis van globale offsets,
            vaste hoogtes of navigatie-elementen.
          </p>
  
          <p className="text-gray-700">
            Hierdoor kan de UI-structuur worden aangepast zonder
            individuele pagina’s te wijzigen.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Single AppShell:</strong> voorkomt layout-duplicatie
              en versnippering.
            </li>
            <li>
              <strong>Fixed navigatiezones:</strong> houden context altijd
              zichtbaar, ook bij lange pagina’s.
            </li>
            <li>
              <strong>Content als “domme” laag:</strong> pagina’s focussen
              uitsluitend op logica en data.
            </li>
            <li>
              <strong>Vooruitdenken:</strong> deze structuur ondersteunt
              toekomstige uitbreidingen zoals extra navigatieniveaus,
              modals en contextuele UI.
            </li>
          </ul>
        </section>
  
      </div>
    );
  }
  