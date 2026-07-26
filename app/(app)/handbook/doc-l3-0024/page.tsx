// app/(app)/handbook/doc-l3-0024/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30024() {
  return (
    <DocumentLayout>

      <header>
        <h1>2.7 Data Import & Database Synchronisatie</h1>
        <HandbookMeta />
      </header>


      <section>
        <p>
          Dit hoofdstuk beschrijft hoe productdata vanuit de beheeromgeving
          wordt omgezet naar de operationele database van FitLifeTool.
        </p>

        <p>
          De database is niet de plek waar productinformatie wordt ontworpen.
          Supabase bevat uitsluitend gevalideerde gegevens die nodig zijn voor
          gebruik binnen de applicatie.
        </p>

        <p>
          De volledige productdefinitie, berekeningen en controles worden
          beheerd binnen de productwerkboeken. Welk concreet bestand de
          formele canonieke productiebron is, moet nog expliciet worden
          vastgesteld.
        </p>

        <div className="info-box">
          Dit document heeft status <strong>review</strong> zolang de canonieke
          werkboekbron en volledige synchronisatieprocedure niet formeel zijn
          vastgelegd.
        </div>
      </section>


      <section>
        <h2>Conceptueel model</h2>

        <p>
          Productdata beweegt altijd in één richting.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Productbeheer
      ↓
Berekeningen & controles
      ↓
Exporttabellen
      ↓
Supabase
      ↓
Applicatie`}
          </pre>
        </div>

        <p>
          Supabase wordt hierdoor behandeld als runtime database,
          niet als bron van productwaarheid.
        </p>
      </section>


      <section>
        <h2>Productbeheer en werkboekrollen</h2>

        <p>
          De lokaal aanwezige bestanden hebben verschillende rollen. Deze
          rollen mogen niet worden verwisseld:
        </p>

        <ul>
          <li>
            Een toekomstige formele canonieke bron bevat de goedgekeurde
            productwaarheid.
          </li>
          <li>
            Een importwerkboek bevat overdraagbare importlagen en is niet
            automatisch de productiebron.
          </li>
          <li>
            Een testwerkboek ondersteunt proefbewerkingen en validatie.
          </li>
          <li>
            Een back-up bewaart een eerder moment en wordt niet als actuele
            bron gebruikt zonder expliciete herstelbeslissing.
          </li>
        </ul>

        <p>De huidige beheer- en ondersteuningslagen omvatten:</p>

        <ul>
          <li>staging- en importlagen</li>
          <li>productgroepen en vertalingen</li>
          <li>PRODUCTS</li>
          <li>PRODUCT_TRANSLATIONS</li>
          <li>preparations en vertalingen</li>
          <li>PRODUCT_PREPARATIONS</li>
          <li>PRODUCT_SCORES</li>
          <li>units en vertalingen</li>
          <li>PORTIONS</li>
          <li>bronnen</li>
          <li>configuratie</li>
          <li>validatie- en dropdownlagen</li>
          <li>bonus/malus waar aanwezig</li>
        </ul>

        <p>
          Deze lagen bevatten zowel invoerdata als afgeleide gegevens
          zoals controles, scores en labels.
        </p>
      </section>


      <section>
        <h2>Exporttabellen</h2>

        <p>
          Alleen specifieke exporttabellen worden gebruikt voor synchronisatie
          met Supabase.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Tabel</th>
                <th>Doel</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>DB_PRODUCTS</td>
                <td>Productdefinities voor de database.</td>
              </tr>

              <tr>
                <td>DB_PRODUCT_PREPARATIONS</td>
                <td>Voedingswaarden en bereidingsvarianten.</td>
              </tr>

              <tr>
                <td>PRODUCT_SCORES</td>
                <td>Doelafhankelijke NutritionScores.</td>
              </tr>

              <tr>
                <td>PORTIONS</td>
                <td>Beschikbare gebruikersporties.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Exporttabellen bevatten geen eigen logica.
          Ze vertegenwoordigen alleen het resultaat van de berekeningen.
        </p>
      </section>


      <section>
        <h2>Synchronisatieregels</h2>

        <p>
          Om bestaande gebruikersdata betrouwbaar te houden gelden vaste
          synchronisatieregels.
        </p>

        <ul>
          <li>
            Product keys worden nooit hernoemd nadat ze actief zijn.
          </li>

          <li>
            Preparation keys blijven stabiel.
          </li>

          <li>
            Nieuwe varianten worden toegevoegd in plaats van bestaande
            betekenis te wijzigen.
          </li>

          <li>
            Scores worden opnieuw gegenereerd vanuit brondata.
          </li>

          <li>
            Supabase-data wordt niet handmatig aangepast buiten migraties.
          </li>
        </ul>
      </section>


      <section>
        <h2>Updates en correcties</h2>

        <p>
          Correcties aan productinformatie gebeuren altijd aan de bronzijde.
        </p>

        <p>
          De workflow is:
        </p>

        <ol>
          <li>corrigeer brongegevens</li>
          <li>laat berekeningen opnieuw uitvoeren</li>
          <li>controleer validaties</li>
          <li>maak nieuwe export</li>
          <li>synchroniseer Supabase</li>
        </ol>

        <p>
          Hierdoor blijven wijzigingen reproduceerbaar en controleerbaar.
        </p>

        <p>
          Werk bij iedere toekomstige wijziging de versie, wijzigingsdatum en
          changelog bij. Valideer een import vóór synchronisatie en bepaal
          vooraf hoe de vorige gevalideerde toestand veilig kan worden
          hersteld.
        </p>

        <p>
          Deze principes leggen nog geen exacte synchronisatieopdracht vast.
          Een concrete import- of herstelprocedure wordt pas canoniek wanneer
          zij aantoonbaar bestaat, getest is en expliciet is goedgekeurd.
        </p>
      </section>


      <section>
        <h2>AI en databasebeheer</h2>

        <p>
          AI-tools mogen helpen bij dataverwerking, maar volgen dezelfde
          synchronisatieregels als handmatige wijzigingen.
        </p>

        <p>
          AI mag:
        </p>

        <ul>
          <li>nieuwe producten voorbereiden</li>
          <li>ontbrekende gegevens aanvullen</li>
          <li>vertalingen voorstellen</li>
          <li>datakwaliteit controleren</li>
        </ul>

        <p>
          AI mag niet rechtstreeks productstructuren wijzigen of bestaande
          sleutels aanpassen zonder expliciete opdracht.
        </p>
      </section>


      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>
            De formeel aangewezen productbron blijft de bron van waarheid.
          </li>

          <li>Supabase bevat alleen gevalideerde runtime-data.</li>

          <li>Importstromen moeten gevalideerd en herstelbaar zijn.</li>

          <li>Historische gebruikersdata blijft geldig.</li>

          <li>Automatisering volgt dezelfde regels als handmatige invoer.</li>
        </ul>

        <p>
          Door deze scheiding kan FitLifeTool veilig groeien naar grote
          productdatabases zonder controle over kwaliteit en consistentie
          te verliezen.
        </p>
      </section>

    </DocumentLayout>
  );
}
