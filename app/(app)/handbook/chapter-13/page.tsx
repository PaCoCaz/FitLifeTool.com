// app/handbook/chapter-13/page.tsx

export default function Chapter13() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            4.4 - Navigation & Context awareness
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft hoe navigatie binnen FitLifeTool
            is ontworpen om contextbewust te zijn, zonder de gebruiker
            te overweldigen of te desoriënteren.
          </p>
  
          <p className="text-gray-700">
            Navigatie is hier geen losstaand UI-element, maar een
            essentieel onderdeel van gebruikersoriëntatie,
            taakfocus en informatiehiërarchie.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            FitLifeTool hanteert het principe van
            <strong> gelaagde navigatie </strong>,
            waarbij elke laag een duidelijk doel heeft:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Globale navigatie: waar ben ik in de applicatie</li>
            <li>Contextuele navigatie: wat kan ik hier doen</li>
            <li>Breadcrumbs: hoe ben ik hier gekomen</li>
          </ul>
  
          <p className="text-gray-700">
            Context awareness betekent dat navigatie-elementen
            zich aanpassen aan:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>de huidige pagina</li>
            <li>de rol van de gebruiker</li>
            <li>het actieve domein (dashboard, handbook, detailpagina)</li>
          </ul>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            De navigatiestructuur is opgesplitst in herbruikbare
            componenten, elk met een duidelijk afgebakende
            verantwoordelijkheid.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li><strong>Header:</strong> applicatie-identiteit & primaire acties</li>
            <li><strong>TopNavigation:</strong> hoofdsecties binnen de app</li>
            <li><strong>Sidebar navigation:</strong> verdieping binnen een domein</li>
            <li><strong>Breadcrumb:</strong> positionering binnen de hiërarchie</li>
          </ul>
  
          <p className="text-gray-700">
            Context wordt afgeleid uit routing (URL-segmenten)
            en expliciet doorgegeven via layout-componenten
            (bijvoorbeeld breadcrumbs per subsectie).
          </p>
  
          <p className="text-gray-700">
            Actieve navigatie-items worden uitsluitend visueel
            onderscheiden (kleur/gewicht), zonder extra UI-ruis
            zoals iconen of animaties.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Geen overmatige navigatie:</strong> alleen tonen wat relevant is voor de huidige context.
            </li>
            <li>
              <strong>Breadcrumb als oriëntatie, niet als menu:</strong> ondersteunt begrip zonder extra cognitieve last.
            </li>
            <li>
              <strong>Visuele subtiliteit:</strong> actieve status via kleur i.p.v. decoratieve elementen.
            </li>
            <li>
              <strong>Layouts bepalen navigatie:</strong> context wordt centraal geregeld in layouts, niet per losse pagina.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Deze keuzes zorgen voor een consistente, schaalbare navigatie die meegroeit met de applicatie zonder structurele herzieningen.
          </p>
        </section>
  
      </div>
    );
  }
  