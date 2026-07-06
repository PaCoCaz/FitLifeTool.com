// app/(app)/handbook/doc-l3-0009/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30009() {
  return (
    <DocumentLayout>
      <header>
        <h1>3.5 Controle & Betrouwbaarheid</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          De waarde van een gezondheidsscore wordt niet bepaald door de hoogte
          van het getal, maar door het vertrouwen dat gebruikers in die score
          kunnen hebben. Daarom is de FitLifeScore ontworpen als een volledig
          reproduceerbare en controleerbare afgeleide van geregistreerde
          gebruikersgegevens.
        </p>

        <p>
          Iedere score, statuskleur en voortgangsindicator moet altijd
          verklaarbaar zijn vanuit de onderliggende loggegevens. Er bestaan geen
          verborgen correcties, handmatige aanpassingen of niet-herleidbare
          berekeningen.
        </p>

        <p>
          Dit hoofdstuk beschrijft de ontwerpkeuzes die ervoor zorgen dat de
          feedback van FitLifeTool betrouwbaar, voorspelbaar en consistent
          blijft.
        </p>
      </section>

      <section>
        <h2>Bron van waarheid</h2>

        <p>
          Alle berekeningen binnen FitLifeTool zijn uiteindelijk terug te voeren
          op dezelfde brongegevens.
        </p>

        <ul>
          <li>Gebruikersregistraties vormen de enige bron van waarheid.</li>

          <li>Dagdoelen worden afgeleid uit het gebruikersprofiel.</li>

          <li>Voortgang wordt telkens opnieuw berekend.</li>

          <li>De FitLifeScore is volledig afgeleid van de drie leefstijlpijlers.</li>
        </ul>

        <p>
          Hierdoor kan iedere getoonde waarde opnieuw worden opgebouwd zonder
          afhankelijk te zijn van opgeslagen tussenresultaten.
        </p>
      </section>

      <section>
        <h2>Consistente feedback</h2>

        <p>
          FitLifeTool zorgt ervoor dat gebruikers overal binnen de applicatie
          dezelfde interpretatie van hun voortgang zien.
        </p>

        <ul>
          <li>Dezelfde status heeft overal dezelfde betekenis.</li>

          <li>Dezelfde kleur heeft overal dezelfde interpretatie.</li>

          <li>Nieuwe registraties worden direct verwerkt.</li>

          <li>Alle kaarten gebruiken dezelfde actuele gegevens.</li>
        </ul>

        <p>
          Hierdoor ontstaat één consistent beeld van de voortgang, ongeacht
          waar de informatie binnen de applicatie wordt weergegeven.
        </p>
      </section>

      <section>
        <h2>Realtime controle</h2>

        <p>
          Iedere relevante wijziging leidt automatisch tot een nieuwe
          berekening van de betrokken leefstijlpijlers en uiteindelijk van de
          FitLifeScore.
        </p>

        <p>
          Daardoor ziet de gebruiker onmiddellijk welk effect een nieuwe
          registratie heeft op de actuele voortgang en de totale dagscore.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-4">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Nieuwe registratie
        ↓
DashboardStore
        ↓
Herberekening leefstijlpijler
        ↓
Nieuwe status
        ↓
Nieuwe FitLifeScore
        ↓
Dashboard`}
          </pre>
        </div>
      </section>

      <section>
        <h2>Voorkomen van misleidende feedback</h2>

        <p>
          Binnen FitLifeTool zijn verschillende ontwerpkeuzes gemaakt om te
          voorkomen dat gebruikers een onrealistisch beeld van hun voortgang
          krijgen.
        </p>

        <ul>
          <li>Een perfecte dagscore vereist dat alle pijlers groen zijn.</li>

          <li>De live-status wordt bepaald door de minst gunstige pijler.</li>

          <li>De FitLifeScore wordt nooit handmatig aangepast.</li>

          <li>Historische gegevens worden nooit gewijzigd om een betere score te tonen.</li>

          <li>Nieuwe activiteit beïnvloedt direct het beschikbare voedingsbudget en daarmee ook de NutritionScore.</li>
        </ul>

        <p>
          Hierdoor blijft de feedback altijd in overeenstemming met het
          daadwerkelijke gedrag van de gebruiker.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Alle feedback is reproduceerbaar.</li>

          <li>Brongegevens zijn altijd leidend.</li>

          <li>Realtime herberekening heeft voorrang boven opgeslagen resultaten.</li>

          <li>Status en score vertellen samen het volledige verhaal.</li>

          <li>Gebruikers moeten iedere score kunnen begrijpen en herleiden.</li>

          <li>Het systeem ondersteunt vertrouwen door volledige transparantie van de berekeningen.</li>
        </ul>

        <p>
          Door alle feedback op dezelfde reproduceerbare manier op te bouwen,
          ontstaat een systeem dat gebruikers niet alleen informeert, maar ook
          vertrouwen geeft dat iedere score een eerlijke weergave is van hun
          actuele leefstijl.
        </p>
      </section>
    </DocumentLayout>
  );
}