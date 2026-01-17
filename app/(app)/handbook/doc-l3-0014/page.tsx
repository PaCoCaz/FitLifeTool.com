// app/handbook/doc-l3-0014/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30014() {
  return (
    <DocumentLayout>

      <header>
        <h1>4.5 Visuele hiërarchie & Status</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe visuele hiërarchie en
          status-indicatie binnen FitLifeTool worden ingezet
          om informatie snel scanbaar, begrijpelijk en
          cognitief licht te houden.
        </p>

        <p>
          De UI communiceert continu status en prioriteit,
          zonder expliciete uitleg of extra interactie
          van de gebruiker te vereisen.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Visuele hiërarchie bepaalt <strong>wat eerst wordt gezien</strong>, terwijl status-signaling bepaalt <strong>wat het betekent</strong>.
        </p>

        <p>
          FitLifeTool gebruikt hiervoor een beperkt,
          consequent toegepast systeem van:
        </p>

        <ul>
          <li>kleurintensiteit</li>
          <li>typografisch gewicht</li>
          <li>ruimte en positionering</li>
          <li>subtiele contrastverschillen</li>
        </ul>

        <p>
          Status wordt primair impliciet gecommuniceerd:
          de gebruiker <em>ziet</em> vooruitgang of achterstand,
          voordat deze wordt gelezen.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          De UI maakt onderscheid tussen primaire,
          secundaire en ondersteunende elementen via
          vaste conventies:
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Rol</th>
                <th>Kenmerken</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Primair</td>
                <td>Donkerblauw, hoger typografisch gewicht, prominente plaatsing</td>
              </tr>
              <tr>
                <td>Secundair</td>
                <td>Neutrale tinten, kleiner lettertype</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>Kleuraccenten met lage verzadiging</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Status-signaling volgt vaste regels:
        </p>

        <div className="table-scroll">  
          <table className="label-column">
            <thead>
              <tr>
                <th>Status</th>
                <th>Kleurgebruik</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Positief</td>
                <td>Koele of groene tinten</td>
              </tr>
              <tr>
                <td>Neutraal</td>
                <td>Grijs of gedempt blauw</td>
              </tr>
              <tr>
                <td>Waarschuwing</td>
                <td>Warm accent, beperkt in oppervlak</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Decoratieve elementen worden vermeden;
          elke visuele variatie heeft een functionele betekenis.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Beperkt kleurpalet</strong><br />
            Voorkomt visuele ruis en betekenisverwarring.
          </li>

          <li>
            <strong>Status ≠ decoratie</strong><br />
            Elke kleurverandering draagt informatie.
          </li>

          <li>
            <strong>Subtiele nadruk boven expliciete labels</strong><br />
            Minder tekst, sneller begrip.
          </li>

          <li>
            <strong>Consistentie boven creativiteit</strong><br />
            Voorspelbaarheid vergroot gebruiksgemak.
          </li>
        </ul>

        <p className="muted">
          Deze aanpak maakt het mogelijk om complexe
          statusinformatie te tonen zonder de interface
          zwaar of technisch te laten aanvoelen.
        </p>
      </section>

    </DocumentLayout>
  );
}
