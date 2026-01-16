// app/handbook/doc-l3-0016/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30016() {
  return (
    <DocumentLayout>

      <header>
        <h1>5.2 Feature flags & Uitrol</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe nieuwe functionaliteit
          binnen FitLifeTool gecontroleerd wordt uitgerold
          met behulp van feature flags.
        </p>

        <p>
          Het doel is risico beperken, regressies voorkomen
          en nieuwe features veilig testen in productie,
          zonder impact op bestaande gebruikers.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Feature flags worden gezien als <strong>tijdelijke controlemechanismen</strong>, niet als permanente configuratie.
        </p>

        <p>
          Een feature doorloopt meerdere fasen:
        </p>

        <ul>
          <li>ontwikkeling (uitgeschakeld)</li>
          <li>interne test (beperkte toegang)</li>
          <li>gradual rollout (subset van gebruikers)</li>
          <li>volledige activatie</li>
          <li>verwijderen van de flag</li>
        </ul>

        <p>
          Flags zijn expliciet <em>tijdelijk</em> en maken geen onderdeel uit van het definitieve systeemontwerp.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Binnen FitLifeTool worden feature flags toegepast op duidelijke grenzen:
        </p>

        <table className="key-column">
          <thead>
            <tr>
              <th>Domein</th>
              <th>Toepassing</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UI</td>
              <td>Cards, acties en visualisaties</td>
            </tr>
            <tr>
              <td>Logica</td>
              <td>Nieuwe score- en berekeningsvarianten</td>
            </tr>
            <tr>
              <td>Workflow</td>
              <td>Processtappen zoals nieuwe onboarding</td>
            </tr>
          </tbody>
        </table>

        <p>
          Flags worden centraal beheerd en via
          context of providers beschikbaar gesteld,
          zodat conditionele logica niet verspreid raakt.
        </p>

        <p>
          Gradual rollout kan plaatsvinden op basis van:
        </p>

        <ul>
          <li>gebruikersrol (admin, developer, testgroep)</li>
          <li>account-leeftijd</li>
          <li>feature-specifieke criteria</li>
        </ul>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Flags zijn tijdelijk:</strong> langdurige flags leiden tot verborgen complexiteit.
          </li>
          <li>
            <strong>Geen flags diep in businesslogica:</strong> voorkomt onvoorspelbaar gedrag.
          </li>
          <li>
            <strong>Expliciete rollout-fases:</strong> elke feature volgt dezelfde levenscyclus.
          </li>
          <li>
            <strong>Opruimen is verplicht:</strong> een feature zonder flag is het einddoel.
          </li>
        </ul>

        <p>
          Door feature flags bewust en beperkt in te zetten,
          blijft FitLifeTool stabiel terwijl het
          gecontroleerd kan evolueren.
        </p>
      </section>

    </DocumentLayout>
  );
}

