import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30026() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.8 Codex Workflow & AI Runbook</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit runbook beschrijft hoe Codex en andere AI-assistenten veilig aan
          FitLifeTool werken. De goedgekeurde scope, bestaande architectuur en
          actuele projectdocumentatie blijven altijd leidend.
        </p>
      </section>

      <section>
        <h2>Fase A — Analyse</h2>

        <ul>
          <li>Begin read-only.</li>
          <li>Inspecteer alle relevante code en documentatie.</li>
          <li>Benoem de concrete scope, aannames en risico&apos;s.</li>
          <li>Wijzig nog niets.</li>
          <li>Doe een concreet, afgebakend voorstel.</li>
        </ul>

        <p>
          Conflicten tussen implementatie en het handbook worden eerst
          gerapporteerd. Een open architectuurvraag wordt niet zelfstandig
          opgelost.
        </p>
      </section>

      <section>
        <h2>Fase B — Implementatie</h2>

        <ul>
          <li>Pas uitsluitend de expliciet goedgekeurde scope aan.</li>
          <li>Neem geen onverwachte bestanden mee.</li>
          <li>
            Voer geen database-, infrastructuur- of productieaanpassing uit
            buiten een expliciete opdracht.
          </li>
          <li>
            Gebruik tijdelijke scripts waar mogelijk in een tijdelijke map.
          </li>
          <li>
            Verwijder tijdelijke meet-, inspectie- en debugcode na gebruik.
          </li>
          <li>Toon of log nooit secrets, tokens, cookies of wachtwoorden.</li>
        </ul>
      </section>

      <section>
        <h2>Fase C — Validatie</h2>

        <ul>
          <li>Voer relevante gerichte tests uit.</li>
          <li>Voer de volledige tests uit waar dat praktisch is.</li>
          <li>Controleer TypeScript, ESLint en de productiebuild.</li>
          <li>Controleer de diff en alle gewijzigde bestanden.</li>
          <li>Controleer staged bestanden afzonderlijk vóór een commit.</li>
          <li>Controleer de werkboom en rapporteer waarschuwingen.</li>
        </ul>

        <p>
          Een waarschuwing wordt niet stilzwijgend genegeerd. Rapporteer of de
          waarschuwing nieuw is of al vóór de wijziging bestond.
        </p>
      </section>

      <section>
        <h2>Fase D — Git en deployment</h2>

        <p>Vraag expliciete toestemming vóór:</p>

        <ul>
          <li>een branch checkout als onderdeel van een release</li>
          <li>een merge</li>
          <li>een push</li>
          <li>een productiedeployment</li>
          <li>een rollback</li>
          <li>een database- of Supabase-wijziging</li>
        </ul>

        <p>
          Gebruik geen force push en maak geen onverwachte commits. Na iedere
          risicodragende stap wordt gerapporteerd:
        </p>

        <ul>
          <li>wat is uitgevoerd</li>
          <li>wat is veranderd</li>
          <li>de huidige branch en commit</li>
          <li>de actuele werkboomstatus</li>
          <li>eventuele fouten of waarschuwingen</li>
        </ul>
      </section>

      <section>
        <h2>Productiedata en testdata</h2>

        <ul>
          <li>
            Pas geen productiegegevens aan voor tests zonder expliciete
            toestemming.
          </li>
          <li>
            Herstel testdata wanneer bestaande functionaliteit dit veilig
            ondersteunt.
          </li>
          <li>
            Gebruik geen directe databasehandeling om testdata te herstellen
            zonder expliciete toestemming.
          </li>
        </ul>
      </section>

      <section>
        <h2>Documentation Impact Check</h2>

        <p>
          Voer vóór afronding de Documentation Impact Check uit zoals
          vastgelegd in Handbook 5.7. Rapporteer expliciet
          <code> Documentation impact: None</code> of benoem per canonieke bron
          welke update vereist is. Leg nieuwe kennis vast bij de diepste
          eigenaar en promoveer auditbevindingen niet zelfstandig tot
          businessregels.
        </p>
      </section>
    </DocumentLayout>
  );
}
