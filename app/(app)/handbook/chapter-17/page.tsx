// app/handbook/chapter-17/page.tsx

export default function Chapter17() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            5.3 - Roadmap assumptions
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft de aannames die ten grondslag liggen
            aan de roadmap van FitLifeTool.
          </p>
  
          <p className="text-gray-700">
            De roadmap is geen vaste belofte, maar een richtinggevend model
            dat gebaseerd is op expliciete aannames over gebruik,
            technische haalbaarheid en productgroei.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            Elke roadmap-keuze rust op één of meerdere aannames.
            Deze aannames zijn expliciet gemaakt om:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>verwachtingen te managen</li>
            <li>beslissingen later te kunnen herzien</li>
            <li>scope creep te voorkomen</li>
          </ul>
  
          <p className="text-gray-700">
            Binnen FitLifeTool worden aannames onderverdeeld in:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>gebruikersaannames</li>
            <li>technische aannames</li>
            <li>organisatorische aannames</li>
          </ul>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            Roadmap assumptions worden niet hard gecodeerd,
            maar impliciet verwerkt in ontwerpkeuzes en prioriteiten.
          </p>
  
          <p className="text-gray-700">
            Voorbeelden binnen FitLifeTool:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              aanname dat gebruikers dagelijks loggen,
              wat leidt tot dag-gebaseerde datastructuren
            </li>
            <li>
              aanname dat complexiteit geleidelijk toeneemt,
              wat een modulaire architectuur vereist
            </li>
            <li>
              aanname dat features incrementeel worden uitgerold,
              wat feature flags noodzakelijk maakt
            </li>
          </ul>
  
          <p className="text-gray-700">
            Wanneer aannames wijzigen, moet de roadmap
            expliciet worden herijkt.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Aannames zijn documenteerbaar:</strong>
              impliciete aannames worden expliciet gemaakt in het handboek.
            </li>
            <li>
              <strong>Geen roadmap zonder aannames:</strong>
              elke toekomstige feature veronderstelt randvoorwaarden.
            </li>
            <li>
              <strong>Herziening is toegestaan:</strong>
              aannames mogen veranderen zonder dat het systeem faalt.
            </li>
            <li>
              <strong>Architectuur blijft leidend:</strong>
              roadmap volgt het systeem, niet andersom.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Door roadmap assumptions zichtbaar te maken,
            blijft FitLifeTool strategisch wendbaar
            zonder richting te verliezen.
          </p>
        </section>
  
      </div>
    );
  }
  