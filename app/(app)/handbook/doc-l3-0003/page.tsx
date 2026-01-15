// app/handbook/doc-l3-0003/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30003() {
  return (
    <DocumentLayout>

      <section>
        <h1>2.2 Dagstructuur & Logs</h1>

        <p>
          Hoe FitLifeTool dagen definieert, vastlegt en herberekent.
        </p>

        <p>
          In FitLifeTool is een “dag” geen visueel concept, maar een
          <strong> technisch ankerpunt</strong> voor alle berekeningen.
          Vrijwel elke score, voortgangsbalk en evaluatie is dag-gebonden.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe dagen worden gedefinieerd, waarom
          logs altijd append-only zijn en hoe historische herberekening
          mogelijk blijft zonder dat data wordt overschreven.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Het kernprincipe is eenvoudig:
        </p>

        <ul>
          <li>
            Een dag wordt geïdentificeerd door een <strong>datum (YYYY-MM-DD)</strong>
          </li>
          <li>
            Alle gebruikersinteracties worden als <strong>logs</strong> opgeslagen
          </li>
          <li>
            Scores worden <em>afgeleid</em>, niet opgeslagen
          </li>
        </ul>

        <p>
          Er bestaat geen expliciete “day”-tabel. Een dag is een
          <strong> aggregatie van logs</strong> binnen een tijdsinterval.
        </p>

        <p>
          Hierdoor blijft het systeem flexibel, herleidbaar en robuust
          bij wijzigingen in rekenlogica.
        </p>
      </section>

      <section>
        <h2>Logs als fundament</h2>

        <p>
          Alle gebruikersacties worden vastgelegd als afzonderlijke
          records in log-tabellen, zoals:
        </p>

        <ul>
          <li><code>hydration_logs</code></li>
          <li><code>activity_logs</code></li>
          <li><code>nutrition_logs</code></li>
          <li><code>weight_logs</code></li>
        </ul>

        <p>
          Elk log-record bevat minimaal:
        </p>

        <table className="key-column">
          <thead>
            <tr>
              <th>Veld</th>
              <th>Omschrijving</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>user_id</td>
              <td>Verwijzing naar de gebruiker waartoe het log behoort</td>
            </tr>
            <tr>
              <td>log_date</td>
              <td>Datum waarop de log bij de dag wordt gerekend</td>
            </tr>
            <tr>
              <td>created_at</td>
              <td>Tijdstip waarop de log is vastgelegd</td>
            </tr>
            <tr>
              <td>inhoud</td>
              <td>De gemeten waarde, zoals ml, kcal of aantal stappen</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Append-only principe</h2>

        <p>
          Logs worden <strong>nooit overschreven</strong>. Correcties
          gebeuren altijd door:
        </p>

        <ul>
          <li>het toevoegen van een nieuw log</li>
          <li>of het markeren van een log als ongeldig</li>
        </ul>

        <p>
          Dit maakt het mogelijk om:
        </p>

        <ul>
          <li>historische berekeningen opnieuw uit te voeren</li>
          <li>bugs in logica te fixen zonder dat data verloren gaat</li>
          <li>analyses en trends betrouwbaar te reconstrueren</li>
        </ul>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technisch worden dagen berekend door:
        </p>

        <ul>
          <li>logs te filteren op <code>log_date</code></li>
          <li>logwaarden te sommeren of middelen</li>
          <li>dagdoelen dynamisch toe te passen</li>
        </ul>

        <p>
          De applicatie maakt hierbij bewust geen gebruik van caching
          op dagniveau. De bron blijft altijd de logdata.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>Geen aparte day-tabel</li>
          <li>Logs zijn append-only</li>
          <li>Scores zijn afgeleide data</li>
          <li>Historische herberekening is altijd mogelijk</li>
        </ul>

        <p>
          Dit vormt de basis voor betrouwbare dagdoelen,
          progressieberekeningen en toekomstige analytics.
        </p>
      </section>

    </DocumentLayout>
  );
}
