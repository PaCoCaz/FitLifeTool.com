// app/handbook/chapter-03/page.tsx
export default function Chapter03() {
  return (
    <article className="space-y-12 max-w-4xl">

      {/* Titel */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#191970]">
          H2.2 Day Structure & Logs
        </h1>
        <p className="text-gray-600">
          Hoe FitLifeTool dagen definieert, vastlegt en herberekent.
        </p>
      </header>

      {/* Introductie */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Introductie
        </h2>

        <p className="text-gray-700">
          In FitLifeTool is een “dag” geen visueel concept, maar een
          <strong> technisch ankerpunt</strong> voor alle berekeningen.
          Vrijwel elke score, voortgangsbalk en evaluatie is dag-gebonden.
        </p>

        <p className="text-gray-700">
          Dit hoofdstuk beschrijft hoe dagen worden gedefinieerd, waarom
          logs altijd append-only zijn en hoe historische herberekening
          mogelijk blijft zonder dat data wordt overschreven.
        </p>
      </section>

      {/* Conceptueel model */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Conceptueel model
        </h2>

        <p className="text-gray-700">
          Het kernprincipe is eenvoudig:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            Een dag wordt geïdentificeerd door een <strong>datum (YYYY-MM-DD)</strong>
          </li>
          <li>
            Alle gebruikersinteracties worden als <strong>logs</strong> opgeslagen
          </li>
          <li>
            Scores worden <em>afgeleid</em>, niet opgeslagen
          </li>
        </ul>

        <p className="text-gray-700">
          Er bestaat geen expliciete “day”-tabel. Een dag is een
          <strong> aggregatie van logs</strong> binnen een tijdsinterval.
        </p>

        <p className="text-gray-700">
          Hierdoor blijft het systeem flexibel, herleidbaar en robuust
          bij wijzigingen in rekenlogica.
        </p>
      </section>

      {/* Logs als fundament */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Logs als fundament
        </h2>

        <p className="text-gray-700">
          Alle gebruikersacties worden vastgelegd als afzonderlijke
          records in log-tabellen, zoals:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li><code>hydration_logs</code></li>
          <li><code>activity_logs</code></li>
          <li><code>nutrition_logs</code></li>
          <li><code>weight_logs</code></li>
        </ul>

        <p className="text-gray-700">
          Elk log-record bevat minimaal:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>user_id</li>
          <li>datum (log_date)</li>
          <li>tijdstip (created_at)</li>
          <li>inhoud (bijv. ml, kcal, stappen)</li>
        </ul>
      </section>

      {/* Append-only principe */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Append-only principe
        </h2>

        <p className="text-gray-700">
          Logs worden <strong>nooit overschreven</strong>. Correcties
          gebeuren altijd door:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>het toevoegen van een nieuw log</li>
          <li>of het markeren van een log als ongeldig</li>
        </ul>

        <p className="text-gray-700">
          Dit maakt het mogelijk om:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>historische berekeningen opnieuw uit te voeren</li>
          <li>bugs in logica te fixen zonder dat data verloren gaat</li>
          <li>analyses en trends betrouwbaar te reconstrueren</li>
        </ul>
      </section>

      {/* Implementatie */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Implementatie
        </h2>

        <p className="text-gray-700">
          Technisch worden dagen berekend door:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>logs te filteren op <code>log_date</code></li>
          <li>logwaarden te sommeren of middelen</li>
          <li>dagdoelen dynamisch toe te passen</li>
        </ul>

        <p className="text-gray-700">
          De applicatie maakt hierbij bewust geen gebruik van caching
          op dagniveau. De bron blijft altijd de logdata.
        </p>
      </section>

      {/* Belangrijke beslissingen */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Belangrijke beslissingen
        </h2>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            Geen aparte day-tabel
          </li>
          <li>
            Logs zijn append-only
          </li>
          <li>
            Scores zijn afgeleide data
          </li>
          <li>
            Historische herberekening is altijd mogelijk
          </li>
        </ul>

        <p className="text-gray-700">
          Dit vormt de basis voor betrouwbare dagdoelen,
          progressieberekeningen en toekomstige analytics.
        </p>
      </section>

    </article>
  );
}
