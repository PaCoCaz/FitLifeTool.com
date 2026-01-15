// app/handbook/doc-l3-0007/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30007() {
  return (
    <DocumentLayout>

      <section>
        <h1>3.3 Verwacht vs Actueel</h1>

        <p>
          In FitLifeTool wordt voortgang nooit los gezien van tijd.
          Een gebruiker die om 09:00 “achterloopt” kan om 21:00 volledig op schema zijn.
          Daarom maakt het systeem expliciet onderscheid tussen verwachte voortgang en daadwerkelijk gedrag.
        </p>
      </section>

      <section>
        <h2>Expected en actual progress</h2>

        <p>
          FitLifeTool onderscheidt twee vormen van voortgang:
        </p>

        <table className="label-column">
          <thead>
            <tr>
              <th>Type</th>
              <th>Omschrijving</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Expected progress</td>
              <td>Waar een gebruiker theoretisch zou moeten staan op basis van tijd</td>
            </tr>
            <tr>
              <td>Actual progress</td>
              <td>Wat daadwerkelijk is gelogd door de gebruiker</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Expected progress</h2>

        <p>
          Expected progress is een theoretische voortgangslijn die
          afhangt van het tijdstip binnen de dag.
        </p>

        <p>
          De berekening volgt het principe:
        </p>

        <ul>
          <li>Startpunt = begin van de dag</li>
          <li>Eindpunt = dagdoel om 23:59</li>
          <li>Voortgang neemt lineair toe met de tijd</li>
        </ul>

        <p>
          Expected progress is geen advies, maar een referentiepunt.
        </p>
      </section>

      <section>
        <h2>Actual progress</h2>

        <p>
          Actual progress is de daadwerkelijk gelogde waarde: water gedronken, stappen gezet, voeding geregistreerd.<br/>
          Deze waarde is objectief en tijdsonafhankelijk - het systeem past hier geen correcties op toe.
        </p>
      </section>

      <section>
        <h2>Status en vergelijking</h2>

        <p>
          De status van een card ontstaat uit de vergelijking tussen expected en actual progress.
        </p>

        <table className="key-column">
          <thead>
            <tr>
              <th>Status</th>
              <th>Vergelijking</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>behind</td>
              <td>Actual &lt; Expected</td>
            </tr>
            <tr>
              <td>onTrack</td>
              <td>Actual ≈ Expected</td>
            </tr>
            <tr>
              <td>completed</td>
              <td>Actual ≥ dagdoel</td>
            </tr>
          </tbody>
        </table>

        <p>
          “Behind” betekent hier niet fout, maar:
          <em>op dit moment lager dan verwacht</em>.
        </p>
      </section>

      <section>
        <h2>Bewust ontwerp: tijdelijk achterlopen</h2>

        <p>
          Het systeem is expliciet ontworpen om tijdelijk
          achterlopen zichtbaar te maken.
        </p>

        <p>
          Dit voorkomt twee veelvoorkomende problemen:
        </p>

        <ul>
          <li>Valse geruststelling vroeg op de dag</li>
          <li>Plotselinge stress aan het einde van de dag</li>
        </ul>

        <p>
          Door eerder feedback te geven, wordt gedrag gestuurd
          zonder te forceren.
        </p>
      </section>

      <section>
        <h2>Geen voorspellingen of aannames</h2>

        <p>
          FitLifeTool doet geen voorspellingen over toekomstig gedrag.
        </p>

        <p>
          Er wordt niet aangenomen dat een gebruiker “later wel bijhaalt”.
          Alleen actuele data telt.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <ul>
          <li>Expected progress wordt berekend op basis van tijd</li>
          <li>Actual progress komt uit logs</li>
          <li>Statuslogica is uniform per card</li>
          <li>Geen cross-card correcties</li>
        </ul>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>Expected ≠ target</li>
          <li>Behind ≠ falen</li>
          <li>Tijd is een first-class parameter</li>
          <li>Status is momentopname</li>
        </ul>

        <p>
          Deze keuzes maken het systeem eerlijk, voorspelbaar
          en uitbreidbaar.
        </p>
      </section>

    </DocumentLayout>
  );
}
