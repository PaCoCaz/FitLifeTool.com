// app/handbook/chapter-05/page.tsx
export default function Chapter05() {
    return (
      <article className="space-y-12 max-w-4xl">
  
        {/* Titel */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#191970]">
            H3.1 FitLifeScore fundamentals
          </h1>
          <p className="text-gray-600">
            De betekenis, opbouw en ontwerpprincipes van de FitLifeScore.
          </p>
        </header>
  
        {/* Introductie */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Introductie
          </h2>
  
          <p className="text-gray-700">
            De FitLifeScore is een samenvattende dagscore die in één oogopslag
            laat zien hoe goed een gebruiker zijn leefstijlgedrag uitvoert.
          </p>
  
          <p className="text-gray-700">
            De score is bewust ontworpen als <strong>resultaatindicator</strong>,
            niet als doel op zichzelf. Het is een afgeleide van gedrag,
            geen losstaand puntensysteem.
          </p>
        </section>
  
        {/* Conceptueel model */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            De FitLifeScore bestaat uit drie onafhankelijke pijlers:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Hydration</li>
            <li>Activity</li>
            <li>Nutrition</li>
          </ul>
  
          <p className="text-gray-700">
            Elke pijler levert een score tussen 0 en 100. Deze worden
            samengevoegd tot één gewogen eindscore.
          </p>
  
          <p className="text-gray-700">
            Cruciaal: geen enkele pijler kan de score “meenemen” naar 100
            als een andere pijler faalt.
          </p>
        </section>
  
        {/* Gewogen aggregatie */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Gewogen aggregatie
          </h2>
  
          <p className="text-gray-700">
            De FitLifeScore gebruikt vaste gewichten per pijler:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Hydration - 30%</li>
            <li>Activity - 30%</li>
            <li>Nutrition - 40%</li>
          </ul>
  
          <p className="text-gray-700">
            De ruwe score wordt berekend als gewogen gemiddelde en
            vervolgens naar beneden afgerond.
          </p>
        </section>
  
        {/* Blokkadeprincipe */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Blokkadeprincipe (99 vs 100)
          </h2>
  
          <p className="text-gray-700">
            Een FitLifeScore van <strong>100</strong> is alleen mogelijk
            wanneer <em>alle</em> pijlers hun dagdoel hebben behaald.
          </p>
  
          <p className="text-gray-700">
            Indien één of meerdere pijlers onder hun doel blijven:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>wordt de score maximaal 99</li>
            <li>ongeacht het gewogen gemiddelde</li>
          </ul>
  
          <p className="text-gray-700">
            Dit voorkomt “vals groen” en dwingt balans af tussen
            leefstijlonderdelen.
          </p>
        </section>
  
        {/* Tijd en voortgang */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Tijd & voortgang
          </h2>
  
          <p className="text-gray-700">
            De FitLifeScore is een <strong>momentopname</strong>.
            De score verandert gedurende de dag op basis van:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>nieuwe logs</li>
            <li>verwachte voortgang volgens dagschema</li>
            <li>herberekende dagdoelen</li>
          </ul>
  
          <p className="text-gray-700">
            Hierdoor is een score van bijvoorbeeld 70 om 10:00 uur
            niet negatief, maar contextafhankelijk.
          </p>
        </section>
  
        {/* Implementatie */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            Technisch wordt de FitLifeScore berekend in de UI-laag,
            op basis van events die door cards worden uitgezonden.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Elke card publiceert score + statuskleur</li>
            <li>De scorecard aggregeert deze informatie</li>
            <li>Geen server-side state voor de score</li>
          </ul>
  
          <p className="text-gray-700">
            Dit maakt de score:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>deterministisch</li>
            <li>herleidbaar</li>
            <li>vrij van synchronisatieproblemen</li>
          </ul>
        </section>
  
        {/* Belangrijke beslissingen */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Score wordt niet opgeslagen</li>
            <li>100 is expliciet schaars</li>
            <li>Realtime berekening in de UI</li>
            <li>Balans gaat boven extremen</li>
          </ul>
  
          <p className="text-gray-700">
            Deze keuzes zorgen ervoor dat de FitLifeScore betrouwbaar,
            uitlegbaar en uitbreidbaar blijft.
          </p>
        </section>
  
      </article>
    );
  }
  