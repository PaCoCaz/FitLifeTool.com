// app/handbook/chapter-08/page.tsx

export default function Chapter08() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-xl font-semibold text-[#191970]">
            H3.4 Partial completion & Recovery
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft hoe FitLifeTool omgaat met
            <strong> gedeeltelijke voltooiing </strong>
            en gedrag dat pas later op de dag plaatsvindt.
          </p>
  
          <p className="text-gray-600">
            Het doel is een systeem te ontwerpen dat
            <em> coachend, eerlijk en motiverend </em>
            blijft, ook wanneer gebruikers hun doelen
            niet perfect of niet volgens planning behalen.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p>
            FitLifeTool hanteert het principe dat
            <strong> voortgang gradueel is </strong>
            en nooit binair (goed/fout).
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Elke actie draagt bij aan de dagscore</li>
            <li>Gedeeltelijke voltooiing heeft altijd waarde</li>
            <li>Late acties worden niet genegeerd</li>
            <li>De dag sluit pas af bij dagwissel, niet op tijdstip</li>
          </ul>
  
          <p className="text-gray-600">
            Hierdoor blijft het systeem psychologisch veilig:
            gebruikers worden gestimuleerd om alsnog iets te doen,
            in plaats van af te haken na een gemiste planning.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p>
            Technisch wordt partial completion verwerkt via
            <strong> expected vs actual progress </strong>
            per domein (hydratie, activiteit, voeding).
          </p>
  
          <div className="bg-gray-50 border rounded p-4 space-y-2 text-sm">
            <p className="font-medium text-gray-800">
              Kernmechanismen:
            </p>
  
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>
                Expected progress wordt berekend op basis van tijd
                binnen de dag
              </li>
              <li>
                Actual progress is de huidige gerealiseerde score
              </li>
              <li>
                Scores blijven stijgen zolang acties worden gelogd
              </li>
              <li>
                Late-day acties kunnen statuskleuren herstellen
              </li>
            </ul>
          </div>
  
          <p className="text-gray-600">
            Hierdoor kan een gebruiker die ’s avonds alsnog hydrateert
            of beweegt, zichtbaar herstellen in score en status.
          </p>
        </section>
  
        {/* ───────────────── Belangrijke beslissingen ───────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Geen harde deadlines per dagdeel</strong><br />
              De dag wordt pas afgesloten bij kalenderwissel.
            </li>
  
            <li>
              <strong>Geen negatieve straffen voor late acties</strong><br />
              Herstel is altijd mogelijk zolang de dag actief is.
            </li>
  
            <li>
              <strong>Score ≠ planning</strong><br />
              Planning stuurt feedback, niet de geldigheid van acties.
            </li>
  
            <li>
              <strong>Motivatie boven perfectie</strong><br />
              Het systeem beloont consistent gedrag, niet timing-perfectie.
            </li>
          </ul>
  
          <p className="text-gray-600">
            Deze keuzes voorkomen afhaken en ondersteunen duurzaam gedrag,
            wat essentieel is voor lange termijn gebruik.
          </p>
        </section>
  
      </div>
    );
  }
  