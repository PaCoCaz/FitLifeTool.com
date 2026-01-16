// app/handbook/doc-l3-0002/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30002() {
  return (
    <DocumentLayout>

      <header>
        <h1>2.1 Profielen & Autorisatie</h1>
      </header>

      <section>
        <p>
          Gebruikersidentiteit, rollen en toegangscontrole binnen FitLifeTool.
        </p>

        <p>
          FitLifeTool maakt een strikt onderscheid tussen
          <strong> authenticatie</strong> en <strong>autorisatie</strong>.
          Authenticatie bepaalt <em>wie</em> iemand is, autorisatie bepaalt
          <em> wat</em> iemand mag.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe gebruikersprofielen zijn opgebouwd,
          waarom er een aparte <code>profiles</code>-tabel bestaat en hoe
          rollen systematisch worden toegepast in de applicatie.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Elke gebruiker in FitLifeTool bestaat uit twee conceptueel
          gescheiden entiteiten:
        </p>

        <table className="key-column">
          <thead>
            <tr>
              <th>Entiteit</th>
              <th>Omschrijving</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Auth user</td>
              <td>Beheerd door Supabase Auth</td>
            </tr>
            <tr>
              <td>Profile</td>
              <td>Domeinspecifieke gebruikersdata</td>
            </tr>
          </tbody>
        </table>

        <p>
          Het profiel fungeert als centrale bron voor:
        </p>

        <ul>
          <li>persoonlijke kenmerken (gewicht, lengte, leeftijd)</li>
          <li>doelstellingen (afvallen, onderhouden, aankomen)</li>
          <li>rol en toegangsrechten</li>
          <li>feature-gating (abonnementen)</li>
        </ul>

        <p>
          De applicatie werkt <em>nooit</em> rechtstreeks met alleen de
          auth-user; vrijwel alle logica verloopt via het profiel.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technisch is deze scheiding geïmplementeerd via:
        </p>

        <ul>
          <li>Supabase Auth voor login, sessies en tokens</li>
          <li>
            Een <code>profiles</code>-tabel gekoppeld via
            <code> id = auth.user.id</code>
          </li>
          <li>Server-side guards in Next.js layouts</li>
        </ul>

        <p>
          Autorisatie vindt primair plaats op layout-niveau, niet op
          component-niveau. Hierdoor:
        </p>

        <ul>
          <li>worden ongeautoriseerde pagina’s nooit gerenderd</li>
          <li>blijft client-side code eenvoudiger</li>
          <li>ontstaat er één centrale toegangslogica</li>
        </ul>
      </section>

      <section>
        <h2>Rollenmodel</h2>

        <p>
          FitLifeTool hanteert een beperkt maar expliciet rollenmodel:
        </p>

        <table className="key-column">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Omschrijving</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>owner</td>
              <td>Volledige toegang</td>
            </tr>
            <tr>
              <td>admin</td>
              <td>Beheer en moderatie</td>
            </tr>
            <tr>
              <td>developer</td>
              <td>Technische inzage</td>
            </tr>
            <tr>
              <td>user</td>
              <td>Reguliere eindgebruiker</td>
            </tr>
          </tbody>
        </table>

        <p>
          Rollen zijn bedoeld voor <em>autorisatie</em>, niet voor
          monetisatie of feature-ontsluiting.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>Rollen worden server-side afgedwongen</li>
          <li>UI veronderstelt nooit impliciet toegangsrechten</li>
          <li>Profieldata is altijd leidend boven auth-metadata</li>
          <li>Autorisatie gebeurt zo vroeg mogelijk in de render-keten</li>
        </ul>

        <p>
          Dit voorkomt security-lekken, conditionele spaghetti en
          onvoorspelbaar gedrag bij uitbreiding van het systeem.
        </p>
      </section>

    </DocumentLayout>
  );
}
