// app/handbook/chapter-01/page.tsx
export default function Chapter01() {
  return (
    <article className="space-y-12 max-w-4xl">

      {/* Titel */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#191970]">
          H1.1 Overview & Principles
        </h1>
        <p className="text-gray-600">
          Architectonische uitgangspunten en ontwerpprincipes van FitLifeTool.
        </p>
      </header>

      {/* Introductie */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Introductie
        </h2>

        <p className="text-gray-700">
          FitLifeTool is ontworpen als een dag-gedreven gezondheidsplatform
          waarin alle logica, voortgang en feedback worden afgeleid van
          expliciete gebruikersacties binnen een kalenderdag.
        </p>

        <p className="text-gray-700">
          Dit handboek documenteert niet alleen <em>hoe</em> de applicatie is
          gebouwd, maar vooral <em>waarom</em> bepaalde keuzes zijn gemaakt.
          Dit hoofdstuk legt de conceptuele basis waarop alle volgende
          hoofdstukken voortbouwen.
        </p>
      </section>

      {/* Conceptueel model */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Conceptueel model
        </h2>

        <p className="text-gray-700">
          De kern van FitLifeTool bestaat uit een beperkt aantal fundamentele
          concepten:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            <strong>De dag</strong> is de primaire aggregatie-eenheid
          </li>
          <li>
            <strong>Logs</strong> zijn onveranderlijke registraties van acties
          </li>
          <li>
            <strong>Scores</strong> zijn afgeleide waarden, nooit brondata
          </li>
          <li>
            <strong>UI</strong> reflecteert altijd de huidige datastatus
          </li>
        </ul>

        <p className="text-gray-700">
          Dit betekent concreet dat er geen “magische” state bestaat:
          alles wat de gebruiker ziet is herleidbaar tot opgeslagen data
          en deterministische berekeningen.
        </p>
      </section>

      {/* Implementatie */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Implementatie
        </h2>

        <p className="text-gray-700">
          Architectonisch is FitLifeTool opgebouwd volgens de volgende lagen:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            <strong>Server-side autorisatie</strong> (Supabase + Next.js layouts)
          </li>
          <li>
            <strong>Datalaag</strong> met expliciete tabellen per domein
          </li>
          <li>
            <strong>Client-side providers</strong> voor tijd en dagcontext
          </li>
          <li>
            <strong>Event-gedreven updates</strong> tussen cards
          </li>
        </ul>

        <p className="text-gray-700">
          Hierdoor ontstaat een duidelijke scheiding tussen:
          <em>wat er is opgeslagen</em>, <em>wat er wordt berekend</em> en <em>wat er wordt gepresenteerd</em>.
        </p>
      </section>

      {/* Belangrijke beslissingen */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Belangrijke beslissingen
        </h2>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            Dagwissels zijn expliciete gebeurtenissen, geen automatische resets
          </li>
          <li>
            Scores mogen nooit rechtstreeks worden aangepast
          </li>
          <li>
            UI-logica mag geen verborgen state introduceren
          </li>
          <li>
            Alles moet te herberekenen zijn op basis van logs
          </li>
        </ul>

        <p className="text-gray-700">
          Deze keuzes maken het systeem voorspelbaar, testbaar en uitbreidbaar,
          zelfs wanneer complexiteit toeneemt.
        </p>
      </section>

    </article>
  );
}
