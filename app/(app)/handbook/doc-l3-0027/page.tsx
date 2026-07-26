import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30027() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.9 Testing & Validatie</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Iedere wijziging wordt gevalideerd in verhouding tot haar risico en
          bereik. Deze matrix beschrijft de minimale controles vóór commit en,
          waar van toepassing, na een productiedeployment.
        </p>
      </section>

      <section>
        <h2>Codewijzigingen</h2>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Controle</th>
                <th>Uitvoering</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gerichte tests</td>
                <td>
                  Voer tests uit voor de aangepaste regels, helpers of routes.
                </td>
              </tr>
              <tr>
                <td>Volledige tests</td>
                <td>
                  <code>
                    node --experimental-strip-types --test
                    app/lib/**/*.test.mts
                  </code>
                </td>
              </tr>
              <tr>
                <td>TypeScript</td>
                <td><code>npx tsc --noEmit</code></td>
              </tr>
              <tr>
                <td>ESLint</td>
                <td><code>npm run lint</code></td>
              </tr>
              <tr>
                <td>Productiebuild</td>
                <td><code>npm run build</code></td>
              </tr>
              <tr>
                <td>Diff-integriteit</td>
                <td><code>git diff --check</code></td>
              </tr>
              <tr>
                <td>Werkboom</td>
                <td><code>git status</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Controleer daarnaast altijd de volledige lijst gewijzigde bestanden,
          de inhoudelijke diff en, vóór een commit, de staged bestanden en
          staged diff.
        </p>

        <p>
          Het project heeft momenteel geen <code>test</code>- of
          <code>typecheck</code>-script in <code>package.json</code>. Het
          hierboven vermelde Node-commando voert de bestaande testbestanden
          rechtstreeks uit. Nieuwe npm-scripts worden pas gedocumenteerd nadat
          zij daadwerkelijk zijn toegevoegd.
        </p>
      </section>

      <section>
        <h2>UI-wijzigingen</h2>

        <ul>
          <li>controleer desktopweergave</li>
          <li>controleer mobiele weergave en responsive herschikking</li>
          <li>controleer loading- en skeletonstates</li>
          <li>controleer empty states</li>
          <li>controleer error- en retrystates</li>
          <li>controleer onnodige layout shifts</li>
          <li>controleer console-errors</li>
          <li>controleer React-hydratiefouten</li>
        </ul>

        <p>
          Voer de controle uit met representatieve inhoud en zonder bestaande
          gebruikersgegevens onnodig te wijzigen.
        </p>
      </section>

      <section>
        <h2>Productievalidatie</h2>

        <ul>
          <li>deploymentstatus is <strong>Ready</strong></li>
          <li>de exacte live Git-SHA komt overeen met de bedoelde commit</li>
          <li>de productie-alias is correct</li>
          <li>de Function Region is correct</li>
          <li>er zijn geen onverwachte build- of runtimefouten</li>
          <li>de relevante functionaliteit slaagt in een beperkte smoketest</li>
          <li>tijdelijke testdata wordt waar mogelijk veilig hersteld</li>
        </ul>

        <p>
          Een deployment is pas afgerond nadat zowel technische metadata als
          de relevante gebruikersflow zijn gecontroleerd.
        </p>
      </section>
    </DocumentLayout>
  );
}
