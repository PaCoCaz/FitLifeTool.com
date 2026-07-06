// app/(app)/handbook/doc-l3-0018/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30018() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.4 Beheer van technische schuld</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool omgaat met technische schuld
          en hoe wordt voorkomen dat tijdelijke oplossingen permanente
          beperkingen worden.
        </p>

        <p>
          Technische schuld ontstaat niet alleen door codekwaliteit, maar ook
          wanneer nieuwe functionaliteit afwijkt van bestaande
          architectuurprincipes.
        </p>

        <p>
          Het doel is niet om iedere vorm van technische schuld te voorkomen,
          maar om deze zichtbaar, bewust en beheersbaar te houden.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Binnen FitLifeTool wordt technische schuld gezien als een afwijking
          tussen de huidige implementatie en de gewenste architectuur.
        </p>

        <p>
          Niet iedere afwijking is direct een probleem. Belangrijk is dat de
          reden, impact en toekomstige oplossing duidelijk zijn.
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
                <td>Bewust</td>
                <td>
                  Tijdelijke keuze met bekende oorzaak en oplossing.
                </td>
              </tr>

              <tr>
                <td>Verborgen</td>
                <td>
                  Onbekende complexiteit die toekomstige wijzigingen
                  bemoeilijkt.
                </td>
              </tr>

              <tr>
                <td>Structureel</td>
                <td>
                  Een oplossing die tegen de architectuurprincipes ingaat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Alleen bewuste technische schuld is acceptabel. Verborgen of
          structurele schuld moet worden opgelost voordat hier nieuwe
          functionaliteit bovenop wordt gebouwd.
        </p>
      </section>

      <section>
        <h2>Architectuurbewaking</h2>

        <p>
          De belangrijkste vorm van schuldpreventie is het blijven volgen van
          bestaande patronen.
        </p>

        <p>
          Binnen FitLifeTool betekent dit:
        </p>

        <ul>
          <li>brondata blijft gescheiden van berekende data</li>

          <li>businesslogica blijft buiten presentatiecomponenten</li>

          <li>scoremodellen worden niet gedupliceerd</li>

          <li>gebruikersdata wordt nooit aangepast om UI-problemen op te lossen</li>

          <li>nieuwe domeinen volgen bestaande datastromen</li>
        </ul>

        <p>
          Afwijken van deze principes wordt behandeld als technische schuld,
          ook wanneer de functionaliteit op dat moment correct werkt.
        </p>
      </section>

      <section>
        <h2>Onderhoud en refactoring</h2>

        <p>
          Refactoring is geen aparte fase na ontwikkeling, maar onderdeel van
          het normale ontwikkelproces.
        </p>

        <p>
          Herziening wordt uitgevoerd wanneer:
        </p>

        <ul>
          <li>dezelfde logica meerdere keren ontstaat</li>

          <li>een component meerdere verantwoordelijkheden krijgt</li>

          <li>uitbreiding moeilijker wordt dan verwacht</li>

          <li>nieuwe features bestaande patronen onder druk zetten</li>
        </ul>

        <p>
          Het doel van refactoring is niet verandering, maar het herstellen van
          eenvoud en voorspelbaarheid.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Werkende code is niet automatisch gezonde code.</li>

          <li>Architectuurafwijkingen worden expliciet gemaakt.</li>

          <li>Herbruikbare patronen hebben voorkeur boven snelle oplossingen.</li>

          <li>Refactoring hoort bij ontwikkeling.</li>

          <li>Gebruikersdata heeft prioriteit boven implementatiegemak.</li>

          <li>Eenvoud is een actief onderhoudsdoel.</li>
        </ul>

        <p>
          Door technische schuld zichtbaar te houden kan FitLifeTool blijven
          groeien zonder dat complexiteit, uitzonderingen of verborgen
          afhankelijkheden de verdere ontwikkeling vertragen.
        </p>
      </section>
    </DocumentLayout>
  );
}