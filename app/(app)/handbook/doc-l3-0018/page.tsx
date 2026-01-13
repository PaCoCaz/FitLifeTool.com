// app/handbook/doc-l3-0018/page.tsx

import DocumentPager from "../documentPager";

export default function DocL30018() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            5.4 - Beheer van technische schuld
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft hoe FitLifeTool omgaat met technische schuld
            (technical debt) en waarom deze expliciet wordt beheerd in plaats van
            vermeden.
          </p>
  
          <p className="text-gray-700">
            Technische schuld is onvermijdelijk in een iteratief product,
            maar onbeheerd leidt zij tot vertraging, fragiliteit en verlies
            van ontwikkelsnelheid.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            Binnen FitLifeTool wordt technische schuld gezien als een bewuste
            ruil tussen snelheid en perfectie.
          </p>
  
          <p className="text-gray-700">
            Er wordt onderscheid gemaakt tussen:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>geaccepteerde schuld (tijdelijk, bewust)</li>
            <li>verborgen schuld (onbedoeld, gevaarlijk)</li>
            <li>verouderde schuld (niet langer gerechtvaardigd)</li>
          </ul>
  
          <p className="text-gray-700">
            Alleen geaccepteerde schuld is toegestaan; de overige vormen
            moeten actief worden opgespoord en afgebouwd.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            Technische schuld wordt in FitLifeTool beheerd via:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>duidelijke modulegrenzen</li>
            <li>expliciete TODO’s met context</li>
            <li>refactor-momenten gekoppeld aan feature-ontwikkeling</li>
          </ul>
  
          <p className="text-gray-700">
            Schuld wordt nooit “later wel eens” opgelost,
            maar gekoppeld aan concrete triggers, zoals:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>toenemende complexiteit in een module</li>
            <li>herhaald werk of workarounds</li>
            <li>onduidelijke of fragiele logica</li>
          </ul>
  
          <p className="text-gray-700">
            Hierdoor blijft schuld zichtbaar en beheersbaar.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Technische schuld is toegestaan:</strong>
              mits bewust gekozen en gedocumenteerd.
            </li>
            <li>
              <strong>Geen verborgen schuld:</strong>
              onduidelijke code wordt beschouwd als een bug.
            </li>
            <li>
              <strong>Refactoring is onderdeel van bouwen:</strong>
              niet een aparte fase.
            </li>
            <li>
              <strong>Architectuur boven optimalisatie:</strong>
              leesbaarheid en stabiliteit hebben prioriteit.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Door technische schuld actief te managen,
            blijft FitLifeTool schaalbaar zonder
            ontwikkelsnelheid te verliezen.
          </p>
        </section>
  
      {/* ───────────────── Navigatie ───────────────── */}
      <DocumentPager />
      </div>
    );
  }
  