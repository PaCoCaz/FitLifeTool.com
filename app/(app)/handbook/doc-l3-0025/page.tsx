import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30025() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.7 Development & Release Workflow</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft de canonieke ontwikkel- en releaseworkflow
          van FitLifeTool. Ontwikkeling vindt plaats op <code>develop</code>.
          De branch <code>main</code> vertegenwoordigt productie.
        </p>

        <p>
          Iedere stap wordt afzonderlijk gecontroleerd. Bij een onverwachte
          branch-, build-, test- of deploymentafwijking wordt gestopt en eerst
          gerapporteerd.
        </p>
      </section>

      <section>
        <h2>Voorbereiding</h2>

        <p>Controleer vóór iedere wijziging:</p>

        <ul>
          <li>de actieve branch</li>
          <li>de werkboom met <code>git status</code></li>
          <li>de gelijkheid met de relevante remote branch</li>
          <li>of er onverwachte lokale commits of wijzigingen bestaan</li>
        </ul>

        <p>
          Nieuwe ontwikkeling begint uitsluitend vanaf een schone en actuele
          <code> develop</code>-branch.
        </p>
      </section>

      <section>
        <h2>Lokale ontwikkeling</h2>

        <p>
          Iedere Git-push vereist vooraf expliciete toestemming. Dit geldt ook
          voor pushes naar <code>origin/develop</code> en
          <code> origin/main</code>.
        </p>

        <ol>
          <li>Werk uitsluitend aan de goedgekeurde scope op <code>develop</code>.</li>
          <li>Valideer de wijziging lokaal vóór een commit.</li>
          <li>Controleer de volledige diff en de lijst gewijzigde bestanden.</li>
          <li>Stage uitsluitend de bedoelde bestanden.</li>
          <li>Controleer de staged diff en staged scope expliciet.</li>
          <li>Commit uitsluitend de gevalideerde wijzigingen.</li>
          <li>
            Push na expliciete toestemming ontwikkeling uitsluitend naar
            <code> origin/develop</code>.
          </li>
        </ol>

        <p>
          Productieacties volgen pas na afzonderlijke, expliciete toestemming.
        </p>
      </section>

      <section>
        <h2>Documentation Impact Check</h2>

        <p>
          Bepaal vóór afronding van iedere relevante wijziging of zij gevolgen
          heeft voor canonieke FitLifeTool-documentatie of nieuwe projectkennis
          introduceert die canoniek moet worden vastgelegd.
        </p>

        <p>Rapporteer dit in deze vorm:</p>

        <pre className="whitespace-pre-wrap text-sm leading-7">
{`Documentation impact:
- None`}
        </pre>

        <p>Of, wanneer documentatie moet wijzigen:</p>

        <pre className="whitespace-pre-wrap text-sm leading-7">
{`Documentation impact:
- Handbook 2.5: update required
- PRODUCT_DATA_GOVERNANCE.md: update required
- FITLIFETOOL_CONTEXT.md: no change
- AGENTS.md: no change`}
        </pre>

        <ul>
          <li>Niet iedere codewijziging vereist documentatie.</li>
          <li>Pas de diepste canonieke bron aan die eigenaar is van de kennis.</li>
          <li>
            Wijzig <code>FITLIFETOOL_CONTEXT.md</code> alleen wanneer
            kerncontext, terminologie of de documentrouter verandert.
          </li>
          <li>Een auditfinding wordt niet automatisch een businessregel.</li>
          <li>
            Nieuwe architectuur of businesslogica wordt pas canoniek na
            expliciete goedkeuring.
          </li>
        </ul>
      </section>

      <section>
        <h2>Fast-forward-only release</h2>

        <p>
          Voor toekomstige releases wordt <code>develop</code> uitsluitend via
          fast-forward naar <code>main</code> gebracht.
        </p>

        <ol>
          <li>
            Actualiseer lokale <code>main</code> uitsluitend via fast-forward
            vanaf <code>origin/main</code>.
          </li>
          <li>
            Breng <code>develop</code> uitsluitend via fast-forward naar
            <code> main</code>.
          </li>
          <li>Maak geen mergecommit.</li>
          <li>Gebruik geen rebase of force push als alternatief.</li>
          <li>Stop en rapporteer wanneer fast-forward niet mogelijk is.</li>
          <li>Push uitsluitend <code>main</code> naar <code>origin/main</code>.</li>
        </ol>

        <p>
          Bestaande historische mergecommits hoeven niet te worden
          herschreven. Fast-forward-only geldt als werkwijze voor toekomstige
          releases.
        </p>
      </section>

      <section>
        <h2>Productieverificatie</h2>

        <p>
          Een push naar <code>origin/main</code> start de
          Vercel-productiedeployment. Wacht totdat de deployment de status
          <strong> Ready</strong> heeft en verifieer daarna:
        </p>

        <ul>
          <li>de exacte live Git-SHA</li>
          <li>het deployment-ID</li>
          <li>de productie-alias <code>fitlifetool.vercel.app</code></li>
          <li>de Function Region <code>lhr1</code></li>
          <li>eventuele build- en runtimefouten</li>
        </ul>

        <p>
          Voer vervolgens een beperkte functionele smoketest uit die past bij
          de gedeployde wijziging. Herstel tijdelijke testdata via bestaande,
          veilige functionaliteit wanneer dat mogelijk is.
        </p>

        <p>
          Controleer na afloop opnieuw de branch, commit, branchgelijkheid en
          werkboom. Bevestig expliciet dat geen onverwachte wijzigingen zijn
          uitgevoerd.
        </p>
      </section>

      <section>
        <h2>Rollback</h2>

        <ol>
          <li>Bepaal de laatst gevalideerde productiecommit.</li>
          <li>Vraag expliciete toestemming voor de rollback.</li>
          <li>Voer geen ongecontroleerde history rewrite of force push uit.</li>
          <li>Wacht opnieuw op deploymentstatus <strong>Ready</strong>.</li>
          <li>Verifieer de live Git-SHA en voer een productie-smoketest uit.</li>
        </ol>

        <p>
          Wanneer een veilige rollback niet zonder alternatieve Git-operatie
          kan worden uitgevoerd, wordt gestopt en eerst een nieuw voorstel
          gedaan.
        </p>
      </section>
    </DocumentLayout>
  );
}
