// app/handbook/chapter-09/page.tsx

export default function Chapter09() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-xl font-semibold text-[#191970]">
            H3.5 - Aggregation & Safeguards
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft hoe FitLifeTool individuele
            domeinscores samenvoegt tot één consistente dagstatus,
            en hoe randgevallen gecontroleerd worden afgehandeld.
          </p>
  
          <p className="text-gray-600">
            De focus ligt op betrouwbaarheid, voorspelbaarheid en
            het voorkomen van misleidende scores.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p>
            FitLifeTool beschouwt de FitLifeScore als een
            <strong> samengestelde indicator </strong>
            die nooit beter kan zijn dan zijn zwakste onderdeel.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Elke domeinscore blijft afzonderlijk leidend</li>
            <li>Aggregatie mag geen onrealistisch totaal opleveren</li>
            <li>Statuskleuren zijn belangrijker dan het getal zelf</li>
            <li>Randgevallen moeten expliciet afgevangen worden</li>
          </ul>
  
          <p className="text-gray-600">
            Hierdoor ontstaat een systeem dat eerlijk blijft,
            zelfs wanneer data onvolledig of vertraagd is.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p>
            De FitLifeScore wordt berekend via een
            <strong> gewogen aggregatie </strong>
            van hydratie, activiteit en voeding.
          </p>
  
          <div className="bg-gray-50 border rounded p-4 space-y-2 text-sm">
            <p className="font-medium text-gray-800">
              Implementatieprincipes:
            </p>
  
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>
                Elke domeinscore wordt eerst individueel afgerond
              </li>
              <li>
                De totaalscore wordt naar beneden afgerond
              </li>
              <li>
                Statuskleur wordt afgeleid van domeinstatussen
              </li>
              <li>
                Niet-groene domeinen blokkeren perfecte scores
              </li>
            </ul>
          </div>
  
          <p className="text-gray-600">
            Hierdoor kan een gebruiker nooit een perfecte dagstatus
            behalen zolang één domein achterblijft.
          </p>
        </section>
  
        {/* ───────────────── Belangrijke beslissingen ───────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Geen afronding omhoog</strong><br />
              Scores worden altijd conservatief berekend.
            </li>
  
            <li>
              <strong>Status boven numeriek resultaat</strong><br />
              De kleur vertelt het echte verhaal, niet het percentage.
            </li>
  
            <li>
              <strong>Blokkade bij onvolledigheid</strong><br />
              Perfecte scores vereisen volledige dekking.
            </li>
  
            <li>
              <strong>Expliciete edge-case afhandeling</strong><br />
              Geen impliciete aannames bij ontbrekende data.
            </li>
          </ul>
  
          <p className="text-gray-600">
            Deze keuzes voorkomen score-inflatie en versterken
            het vertrouwen van gebruikers in de feedback.
          </p>
        </section>
  
      </div>
    );
  }
  