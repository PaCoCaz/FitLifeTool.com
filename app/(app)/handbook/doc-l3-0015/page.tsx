// app/(app)/handbook/doc-l3-0015/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30015() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.1 Kernprincipes uitbreidbaarheid</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool ontworpen is om nieuwe
          functionaliteit toe te voegen zonder bestaande onderdelen te
          herschrijven of bestaande gebruikersdata te wijzigen.
        </p>

        <p>
          Uitbreidbaarheid is geen aparte technische laag, maar een gevolg
          van consistente keuzes in datamodel, businesslogica en
          gebruikersinterface.
        </p>

        <p>
          Nieuwe functionaliteit moet aansluiten op bestaande patronen.
          Het systeem groeit door uitbreiding, niet door vervanging.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          FitLifeTool behandelt uitbreidingen als nieuwe domeinen binnen
          dezelfde architectuur.
        </p>

        <p>
          Een nieuw domein volgt dezelfde basisstructuur:
        </p>

        <ul>
          <li>brondata wordt opgeslagen als logs</li>

          <li>berekeningen leveren afgeleide waarden</li>

          <li>status ontstaat uit vergelijking met verwachtingen</li>

          <li>de UI presenteert de actuele toestand</li>
        </ul>

        <p>
          Hierdoor kunnen nieuwe onderdelen worden toegevoegd zonder de
          bestaande werking van Hydration, Activity, Nutrition of andere
          modules te beïnvloeden.
        </p>
      </section>

      <section>
        <h2>Architectuurpatronen</h2>

        <p>
          Nieuwe functionaliteit gebruikt zoveel mogelijk bestaande
          bouwstenen.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Onderdeel</th>
                <th>Uitbreidingsprincipe</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Database</td>
                <td>
                  Nieuwe data wordt toegevoegd zonder bestaande structuren te
                  breken.
                </td>
              </tr>

              <tr>
                <td>Logs</td>
                <td>
                  Gebeurtenissen blijven de primaire bron van waarheid.
                </td>
              </tr>

              <tr>
                <td>Scores</td>
                <td>
                  Scores worden berekend en niet permanent opgeslagen.
                </td>
              </tr>

              <tr>
                <td>Cards</td>
                <td>
                  Nieuwe functies gebruiken dezelfde card-compositie.
                </td>
              </tr>

              <tr>
                <td>Vertalingen</td>
                <td>
                  Nieuwe teksten worden toegevoegd via het vertaalsysteem.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Gecontroleerde groei</h2>

        <p>
          Uitbreidbaarheid betekent niet dat iedere mogelijkheid vooraf wordt
          ingebouwd.
        </p>

        <p>
          FitLifeTool kiest bewust voor een stabiele kern met duidelijke
          uitbreidingspunten:
        </p>

        <ul>
          <li>nieuwe domeinen volgen bestaande lifecycle</li>

          <li>bestaande berekeningen blijven reproduceerbaar</li>

          <li>oude gebruikersdata blijft geldig</li>

          <li>nieuwe features introduceren geen uitzonderingsstromen</li>
        </ul>

        <p>
          Hierdoor blijft groei beheersbaar zonder toenemende complexiteit.
        </p>
      </section>

      <section>
        <h2>Voorbeelden toekomstige uitbreiding</h2>

        <p>
          Door deze architectuur kunnen toekomstige onderdelen dezelfde
          structuur volgen.
        </p>

        <ul>
          <li>nieuwe gezondheidsdomeinen</li>

          <li>nieuwe scoremodellen</li>

          <li>persoonlijke inzichten en analyses</li>

          <li>coaching en aanbevelingen</li>
        </ul>

        <p>
          Deze uitbreidingen voegen nieuwe lagen toe zonder de bestaande
          basisprincipes te wijzigen.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Uitbreiden gaat boven herschrijven.</li>

          <li>Bestaande data blijft altijd geldig.</li>

          <li>Nieuwe features volgen bestaande patronen.</li>

          <li>Configuratie heeft voorkeur boven uitzonderingslogica.</li>

          <li>De kern blijft klein en voorspelbaar.</li>

          <li>Complexiteit wordt niet doorgeschoven naar de gebruiker.</li>
        </ul>

        <p>
          Door uitbreidbaarheid als architectuurprincipe te behandelen kan
          FitLifeTool doorgroeien zonder dat betrouwbaarheid,
          voorspelbaarheid of onderhoudbaarheid verloren gaat.
        </p>
      </section>
    </DocumentLayout>
  );
}