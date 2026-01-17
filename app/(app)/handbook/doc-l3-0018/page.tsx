// app/handbook/doc-l3-0018/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30018() {
  return (
    <DocumentLayout>

      <header>
        <h1>5.4 Beheer van technische schuld</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool omgaat met technische schuld
          (technical debt) en waarom deze expliciet wordt beheerd in plaats van
          vermeden.
        </p>

        <p>
          Technische schuld is onvermijdelijk in een iteratief product,
          maar onbeheerd leidt zij tot vertraging, fragiliteit en verlies
          van ontwikkelsnelheid.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Binnen FitLifeTool wordt technische schuld gezien als een bewuste
          ruil tussen snelheid en perfectie.
        </p>

        <p>
          Er wordt onderscheid gemaakt tussen de volgende vormen van
          technische schuld:
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Type</th>
                <th>Betekenis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Geaccepteerd</td>
                <td>Tijdelijk en bewust gekozen schuld</td>
              </tr>
              <tr>
                <td>Verborgen</td>
                <td>Onbedoelde schuld met verhoogd risico</td>
              </tr>
              <tr>
                <td>Verouderd</td>
                <td>Schuld die niet langer gerechtvaardigd is</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Alleen geaccepteerde schuld is toegestaan; de overige vormen
          moeten actief worden opgespoord en afgebouwd.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technische schuld wordt in FitLifeTool beheerd via:
        </p>

        <ul>
          <li>duidelijke modulegrenzen</li>
          <li>expliciete TODO's met context</li>
          <li>refactor-momenten gekoppeld aan feature-ontwikkeling</li>
        </ul>

        <p>
          Schuld wordt nooit “later wel eens” opgelost,
          maar gekoppeld aan concrete triggers, zoals:
        </p>

        <ul>
          <li>toenemende complexiteit in een module</li>
          <li>herhaald werk of workarounds</li>
          <li>onduidelijke of fragiele logica</li>
        </ul>

        <p>
          Hierdoor blijft schuld zichtbaar en beheersbaar.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Technische schuld is toegestaan:</strong> mits bewust gekozen en gedocumenteerd.
          </li>
          <li>
            <strong>Geen verborgen schuld:</strong> onduidelijke code wordt beschouwd als een bug.
          </li>
          <li>
            <strong>Refactoring is onderdeel van bouwen:</strong> niet een aparte fase.
          </li>
          <li>
            <strong>Architectuur boven optimalisatie:</strong> leesbaarheid en stabiliteit hebben prioriteit.
          </li>
        </ul>

        <p>
          Door technische schuld actief te managen,
          blijft FitLifeTool schaalbaar zonder
          ontwikkelsnelheid te verliezen.
        </p>
      </section>

    </DocumentLayout>
  );
}
