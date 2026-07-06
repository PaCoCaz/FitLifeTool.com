// app/(app)/handbook/doc-l3-0017/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30017() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.3 Roadmap & Ontwikkelvisie</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft de ontwikkelvisie achter FitLifeTool en de
          principes die bepalen hoe toekomstige functionaliteit wordt gekozen,
          ontworpen en toegevoegd.
        </p>

        <p>
          De roadmap is geen vaste lijst met features, maar een richtinggevend
          model gebaseerd op gebruikerswaarde, technische stabiliteit en
          uitbreiding van bestaande kernconcepten.
        </p>

        <p>
          Nieuwe functionaliteit moet het bestaande systeem versterken en mag
          de eenvoud en voorspelbaarheid van FitLifeTool niet verminderen.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          FitLifeTool groeit vanuit een stabiele kern:
        </p>

        <ul>
          <li>gebruikers registreren gedrag</li>

          <li>het systeem vertaalt gedrag naar inzicht</li>

          <li>feedback helpt gebruikers bijsturen</li>

          <li>ontwikkeling ondersteunt langdurige gedragsverbetering</li>
        </ul>

        <p>
          Toekomstige uitbreidingen volgen dezelfde cyclus en worden toegevoegd
          als extra lagen bovenop het bestaande fundament.
        </p>

        <p>
          Groei betekent daarom meer inzicht en ondersteuning, niet meer
          complexiteit voor de gebruiker.
        </p>
      </section>

      <section>
        <h2>Roadmap-principes</h2>

        <p>
          Nieuwe ontwikkelingen worden beoordeeld aan de hand van vaste
          uitgangspunten.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Principe</th>
                <th>Betekenis</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Daggedreven</td>
                <td>
                  Functionaliteit moet passen binnen het dagelijkse
                  feedbackmodel.
                </td>
              </tr>

              <tr>
                <td>Meetbaar</td>
                <td>
                  Nieuwe onderdelen moeten gebaseerd zijn op herleidbare data.
                </td>
              </tr>

              <tr>
                <td>Uitlegbaar</td>
                <td>
                  Gebruikers moeten begrijpen waarom feedback wordt gegeven.
                </td>
              </tr>

              <tr>
                <td>Uitbreidbaar</td>
                <td>
                  Nieuwe features volgen bestaande architectuurpatronen.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Toekomstige groeirichtingen</h2>

        <p>
          De architectuur ondersteunt uitbreiding naar aanvullende
          gezondheids- en leefstijldomeinen.
        </p>

        <ul>
          <li>slaap en herstel</li>

          <li>lichaamsmetingen en trends</li>

          <li>persoonlijke inzichten</li>

          <li>gedragsanalyse</li>

          <li>coaching en begeleiding</li>
        </ul>

        <p>
          Deze uitbreidingen voegen nieuwe informatie toe, maar blijven
          gebaseerd op dezelfde principes: brondata, berekening, status en
          feedback.
        </p>
      </section>

      <section>
        <h2>Intelligentie & automatisering</h2>

        <p>
          Naarmate FitLifeTool slimmer wordt, blijft transparantie een
          belangrijk uitgangspunt.
        </p>

        <p>
          Automatisering ondersteunt de gebruiker, maar vervangt de bestaande
          score- en statusmodellen niet.
        </p>

        <ul>
          <li>adviezen moeten verklaarbaar blijven</li>

          <li>gebruikers houden controle over doelen</li>

          <li>inzichten zijn gebaseerd op eigen gegevens</li>

          <li>automatische systemen mogen geen verborgen regels introduceren</li>
        </ul>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>De roadmap volgt de architectuur.</li>

          <li>Nieuwe functionaliteit versterkt bestaande patronen.</li>

          <li>Meer mogelijkheden mogen niet leiden tot meer complexiteit.</li>

          <li>Gebruikersinzicht gaat boven dataverzameling.</li>

          <li>Automatisering blijft transparant en uitlegbaar.</li>

          <li>Gedragsverbetering blijft het centrale doel.</li>
        </ul>

        <p>
          Door groei te sturen vanuit vaste principes kan FitLifeTool
          ontwikkelen tot een breder gezondheidsplatform zonder de eenvoud,
          betrouwbaarheid en controle van de huidige basis te verliezen.
        </p>
      </section>
    </DocumentLayout>
  );
}