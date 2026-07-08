// app/(app)/handbook/doc-l3-0022/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30022() {
  return (
    <DocumentLayout>

      <header>
        <h1>2.5 Product Intelligence Engine</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool producten verwerkt,
          valideert en omzet naar bruikbare voedingsinformatie,
          scores en gebruikersfeedback.
        </p>

        <p>
          De Product Intelligence Engine vormt de centrale laag tussen
          externe voedingsbronnen en de gegevens die uiteindelijk binnen
          de applicatie worden gebruikt.
        </p>

        <p>
          Het doel is om ruwe voedingsdata om te zetten naar consistente,
          controleerbare en doelafhankelijke informatie.
        </p>
      </section>


      <section>
        <h2>Conceptueel model</h2>

        <p>
          Productinformatie doorloopt binnen FitLifeTool een vaste
          verwerkingsketen.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Externe voedingsbron
        ↓
Brondata normalisatie
        ↓
Productbereiding
        ↓
Controle & validatie
        ↓
Nutrition scoring
        ↓
Labels
        ↓
Supabase export`}
          </pre>
        </div>

        <p>
          Hierdoor wordt voorkomen dat ruwe brondata rechtstreeks invloed
          heeft op gebruikersfeedback.
        </p>
      </section>


      <section>
        <h2>Productstructuur</h2>

        <p>
          Producten bestaan uit meerdere lagen met elk een eigen
          verantwoordelijkheid.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Laag</th>
                <th>Rol</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>PRODUCTS</td>
                <td>
                  Basisdefinitie van een product.
                </td>
              </tr>

              <tr>
                <td>PRODUCT_TRANSLATIONS</td>
                <td>
                  Meertalige naamgeving per product.
                </td>
              </tr>

              <tr>
                <td>PRODUCT_PREPARATIONS</td>
                <td>
                  Bereidingen, voedingswaarden, validaties en scorelogica.
                </td>
              </tr>

              <tr>
                <td>PORTIONS</td>
                <td>
                  Praktische gebruikersporties.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Export-tabellen zoals DB_PRODUCTS en DB_PRODUCT_PREPARATIONS
          bevatten uitsluitend opgeschoonde data voor Supabase.
        </p>
      </section>


      <section>
        <h2>Brondata</h2>

        <p>
          Voedingswaarden worden gebaseerd op betrouwbare externe bronnen.
          De primaire bron is NEVO.
        </p>

        <p>
          Uit NEVO worden de relevante voedingskolommen overgenomen,
          waaronder:
        </p>

        <ul>
          <li>energie</li>
          <li>eiwit</li>
          <li>koolhydraten</li>
          <li>vet</li>
          <li>vezels</li>
          <li>suikers</li>
          <li>zout en natrium</li>
          <li>waterpercentage</li>
        </ul>

        <p>
          Iedere productvariant bewaart zijn herkomst via broninformatie,
          zodat later altijd duidelijk blijft waar waarden vandaan komen.
        </p>
      </section>


      <section>
        <h2>Validatie</h2>

        <p>
          Voordat productdata gebruikt wordt, voert FitLifeTool controles uit
          op consistentie.
        </p>

        <ul>
          <li>controle van berekende energie tegenover bronenergie</li>
          <li>controle van macroverdeling</li>
          <li>controle van ontbrekende waarden</li>
          <li>controle van bereiding en porties</li>
        </ul>

        <p>
          Producten met afwijkende controles worden eerst beoordeeld voordat
          ze onderdeel worden van de actieve database.
        </p>
      </section>


      <section>
        <h2>Doelafhankelijke scoring</h2>

        <p>
          FitLifeTool gebruikt geen algemene voedingsscore.
          Een product wordt beoordeeld binnen de context van het doel
          van de gebruiker.
        </p>

        <p>
          Daarom bestaan aparte scores voor:
        </p>

        <ul>
          <li>gewicht verliezen</li>
          <li>gewicht behouden</li>
          <li>gewicht aankomen</li>
        </ul>

        <p>
          Hetzelfde product kan hierdoor verschillende beoordelingen krijgen,
          afhankelijk van de situatie van de gebruiker.
        </p>
      </section>


      <section>
        <h2>Score-opbouw</h2>

        <p>
          De uiteindelijke score ontstaat uit meerdere onderliggende factoren.
        </p>

        <ul>
          <li>energiedichtheid</li>
          <li>eiwitwaarde</li>
          <li>vezelbijdrage</li>
          <li>suikerbelasting</li>
          <li>alcoholimpact</li>
          <li>hydratiebijdrage</li>
          <li>productgroep-correcties</li>
        </ul>

        <p>
          Deze factoren worden gecombineerd tot de uiteindelijke
          NutritionScore en vertaald naar een label.
        </p>
      </section>


      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>
            Brondata wordt nooit direct gebruikt zonder normalisatie.
          </li>

          <li>
            PRODUCT_PREPARATIONS is de centrale berekeningslaag.
          </li>

          <li>
            Scores en labels zijn afgeleide waarden.
          </li>

          <li>
            Exporttabellen bevatten geen eigen logica.
          </li>

          <li>
            Nieuwe producten volgen altijd dezelfde verwerkingsketen.
          </li>

          <li>
            Automatische uitbreiding mag bestaande scorelogica niet wijzigen.
          </li>
        </ul>

        <p>
          Door deze structuur kan FitLifeTool de productdatabase uitbreiden
          terwijl voedingsfeedback consistent, uitlegbaar en betrouwbaar
          blijft.
        </p>
      </section>

    </DocumentLayout>
  );
}