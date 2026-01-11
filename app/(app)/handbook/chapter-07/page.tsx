// app/handbook/chapter-07/page.tsx
export default function Chapter07() {
    return (
      <article className="space-y-12 max-w-4xl">
  
        {/* Titel */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#191970]">
            H3.3 Expected vs Actual progress
          </h1>
          <p className="text-gray-600">
            Hoe FitLifeTool voortgang beoordeelt in de context van tijd,
            verwachtingen en dagverloop.
          </p>
        </header>
  
        {/* Introductie */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Introductie
          </h2>
  
          <p className="text-gray-700">
            In FitLifeTool wordt voortgang nooit los gezien van tijd.
            Een gebruiker die om 09:00 “achterloopt” kan om 21:00
            volledig op schema zijn.
          </p>
  
          <p className="text-gray-700">
            Daarom maakt het systeem expliciet onderscheid tussen:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li><strong>Expected progress</strong> - waar je zou moeten staan</li>
            <li><strong>Actual progress</strong> - waar je daadwerkelijk staat</li>
          </ul>
        </section>
  
        {/* Expected progress */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Expected progress
          </h2>
  
          <p className="text-gray-700">
            Expected progress is een theoretische voortgangslijn die
            afhangt van het tijdstip binnen de dag.
          </p>
  
          <p className="text-gray-700">
            De berekening volgt het principe:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Startpunt = begin van de dag</li>
            <li>Eindpunt = dagdoel om 23:59</li>
            <li>Voortgang neemt lineair toe met de tijd</li>
          </ul>
  
          <p className="text-gray-700">
            Expected progress is dus geen advies, maar een referentiepunt.
          </p>
        </section>
  
        {/* Actual progress */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Actual progress
          </h2>
  
          <p className="text-gray-700">
            Actual progress is de daadwerkelijk gelogde waarde:
            water gedronken, stappen gezet, voeding geregistreerd.
          </p>
  
          <p className="text-gray-700">
            Deze waarde is objectief en tijdsonafhankelijk —
            het systeem past hier geen correcties op toe.
          </p>
        </section>
  
        {/* Vergelijking */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Vergelijking & statusbepaling
          </h2>
  
          <p className="text-gray-700">
            De status van een card ontstaat uit de vergelijking
            tussen expected en actual progress.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              Actual &lt; Expected → <strong>behind</strong>
            </li>
            <li>
              Actual ≈ Expected → <strong>onTrack</strong>
            </li>
            <li>
              Actual ≥ dagdoel → <strong>completed</strong>
            </li>
          </ul>
  
          <p className="text-gray-700">
            “Behind” betekent hier niet fout, maar:
            <em>op dit moment lager dan verwacht</em>.
          </p>
        </section>
  
        {/* Bewust ontwerp */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Bewust ontwerp: tijdelijk achterlopen
          </h2>
  
          <p className="text-gray-700">
            Het systeem is expliciet ontworpen om tijdelijk
            achterlopen zichtbaar te maken.
          </p>
  
          <p className="text-gray-700">
            Dit voorkomt twee veelvoorkomende problemen:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Valse geruststelling vroeg op de dag</li>
            <li>Plotselinge stress aan het einde van de dag</li>
          </ul>
  
          <p className="text-gray-700">
            Door eerder feedback te geven, wordt gedrag gestuurd
            zonder te forceren.
          </p>
        </section>
  
        {/* Geen voorspellingen */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Geen voorspellingen of aannames
          </h2>
  
          <p className="text-gray-700">
            FitLifeTool doet geen voorspellingen over toekomstig gedrag.
          </p>
  
          <p className="text-gray-700">
            Er wordt niet aangenomen dat een gebruiker “later wel bijhaalt”.
            Alleen actuele data telt.
          </p>
        </section>
  
        {/* Implementatie */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Expected progress wordt berekend op basis van tijd</li>
            <li>Actual progress komt uit logs</li>
            <li>Statuslogica is uniform per card</li>
            <li>Geen cross-card correcties</li>
          </ul>
        </section>
  
        {/* Belangrijke beslissingen */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Expected ≠ target</li>
            <li>Behind ≠ falen</li>
            <li>Tijd is een first-class parameter</li>
            <li>Status is momentopname</li>
          </ul>
  
          <p className="text-gray-700">
            Deze keuzes maken het systeem eerlijk, voorspelbaar
            en uitbreidbaar.
          </p>
        </section>
  
      </article>
    );
  }
  