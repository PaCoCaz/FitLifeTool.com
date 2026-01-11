// app/handbook/chapter-15/page.tsx

export default function Chapter15() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            5.1 - Extensibility principles
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft de kernprincipes die bepalen
            hoe FitLifeTool uitbreidbaar blijft zonder dat
            bestaande logica fragiel of complex wordt.
          </p>
  
          <p className="text-gray-700">
            Extensibility binnen FitLifeTool is geen losstaand
            technisch doel, maar een direct gevolg van
            consistente architectuurkeuzes.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            Uitbreidbaarheid wordt benaderd als
            <strong> gecontroleerde groei</strong>, niet als
            onbeperkte flexibiliteit.
          </p>
  
          <p className="text-gray-700">
            Het systeem is opgebouwd rond stabiele kernconcepten
            die zelden wijzigen, met uitbreidingen die
            hier logisch op aansluiten.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>vaste kernmodellen</li>
            <li>duidelijke verantwoordelijkheden</li>
            <li>losgekoppelde UI-lagen</li>
            <li>configuratie boven conditionele logica</li>
          </ul>
  
          <p className="text-gray-700">
            Nieuwe functionaliteit wordt toegevoegd door
            <em>uitbreiding</em>, niet door herschrijven.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            In de praktijk wordt extensibility gerealiseerd via:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>modulaire cards en UI-componenten</li>
            <li>gescheiden berekenings- en presentatielogica</li>
            <li>duidelijke data-interfaces per feature</li>
            <li>centrale providers voor tijd, gebruiker en context</li>
          </ul>
  
          <p className="text-gray-700">
            Nieuwe features volgen bestaande patronen:
            dezelfde lifecycle, dezelfde datastromen,
            dezelfde visuele hiërarchie.
          </p>
  
          <p className="text-gray-700">
            Hierdoor kunnen features onafhankelijk worden
            ontwikkeld en getest, zonder impact op de kern.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Stabiele kern boven snelle flexibiliteit:</strong>
              voorkomt technische schuld.
            </li>
            <li>
              <strong>Patroonherhaling:</strong>
              verlaagt cognitieve last voor toekomstige uitbreiding.
            </li>
            <li>
              <strong>Beperkte configuratie:</strong>
              extensibility mag nooit onbegrensd worden.
            </li>
            <li>
              <strong>Expliciete grenzen:</strong>
              niet alles hoeft uitbreidbaar te zijn.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Deze principes zorgen ervoor dat FitLifeTool kan
            meegroeien in functionaliteit, zonder instabiel
            of onvoorspelbaar te worden.
          </p>
        </section>
  
      </div>
    );
  }
  