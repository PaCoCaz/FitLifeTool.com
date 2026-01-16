// app/handbook/doc-l3-0001/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30001() {
  return (
    <DocumentLayout>

      <header>
        <h1>1.1 Overzicht & Principes</h1>
      </header>

      <section>
        <p>
          FitLifeTool is ontworpen als een dag-gedreven gezondheidsplatform
          waarin alle logica, voortgang en feedback worden afgeleid van
          expliciete gebruikersacties binnen een kalenderdag.
        </p>

        <p>
          Dit handboek documenteert niet alleen <em>hoe</em> de applicatie is
          gebouwd, maar vooral <em>waarom</em> bepaalde keuzes zijn gemaakt.
          Dit hoofdstuk legt de conceptuele basis waarop alle volgende
          hoofdstukken voortbouwen.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          De kern van FitLifeTool bestaat uit een beperkt aantal fundamentele
          concepten:
        </p>

        <ul>
          <li><strong>De dag</strong> is de primaire aggregatie-eenheid</li>
          <li><strong>Logs</strong> zijn onveranderlijke registraties van acties</li>
          <li><strong>Scores</strong> zijn afgeleide waarden, nooit brondata</li>
          <li><strong>UI</strong> reflecteert altijd de huidige datastatus</li>
        </ul>

        <p>
          Dit betekent concreet dat er geen “magische” state bestaat:
          alles wat de gebruiker ziet is herleidbaar tot opgeslagen data
          en deterministische berekeningen.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Architectonisch is FitLifeTool opgebouwd volgens de volgende lagen:
        </p>

        <ul>
          <li><strong>Server-side autorisatie</strong> (Supabase + Next.js layouts)</li>
          <li><strong>Datalaag</strong> met expliciete tabellen per domein</li>
          <li><strong>Client-side providers</strong> voor tijd en dagcontext</li>
          <li><strong>Event-gedreven updates</strong> tussen cards</li>
        </ul>

        <p>
          Hierdoor ontstaat een duidelijke scheiding tussen
          wat er is opgeslagen, wat er wordt berekend en wat er wordt gepresenteerd.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <p>
          Op basis van dit model zijn een aantal expliciete ontwerpkeuzes gemaakt:
        </p>

        <ul>
          <li>Dagwissels zijn expliciete gebeurtenissen, geen automatische resets</li>
          <li>Scores mogen nooit rechtstreeks worden aangepast</li>
          <li>UI-logica mag geen verborgen state introduceren</li>
          <li>Alles moet te herberekenen zijn op basis van logs</li>
        </ul>

        <p>
          Deze keuzes maken het systeem voorspelbaar, testbaar en uitbreidbaar,
          zelfs wanneer complexiteit toeneemt.
        </p>
      </section>

    </DocumentLayout>
  );
}
