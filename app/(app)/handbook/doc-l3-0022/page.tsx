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
        <h2>Productzoekfunctie</h2>

        <p>
          De productzoekfunctie gebruikt productnamen, vertalingen,
          productgroepen, bereidingen en doelafhankelijke scores om gebruikers
          snel naar het juiste product te leiden.
        </p>

        <p>
          Zoekresultaten worden client-side gerangschikt nadat de bestaande
          productquery de kandidaten heeft opgehaald.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Searchlaag</th>
                <th>Verantwoordelijkheid</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>nutrition_products_search</td>
                <td>
                  Bestaande bron voor normale, market-filtered discovery. Deze
                  view blijft het primaire contract en is niet vervangen door
                  de aliaslaag.
                </td>
              </tr>

              <tr>
                <td>nutrition_product_search_names</td>
                <td>
                  Aanvullende search-name-laag met <code>OFFICIAL</code>- en
                  <code> ALIAS</code>-records voor strikt exacte zoekingangen.
                  Het resultaat toont altijd de officiële displaynaam.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Regel</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Exacte naamovereenkomst.</td>
              </tr>

              <tr>
                <td>2</td>
                <td>Productnaam begint met de zoektekst.</td>
              </tr>

              <tr>
                <td>3</td>
                <td>Productnaam bevat de zoektekst.</td>
              </tr>

              <tr>
                <td>4</td>
                <td>Alfabetische sortering binnen dezelfde groep.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          De getoonde grade is gebaseerd op de eerste beschikbare bereiding
          van het product. De gebruikte <code>score_grade</code> hoort bij het
          actuele gebruikersdoel: afvallen, behouden of aankomen.
        </p>

        <p>
          Grades worden altijd weergegeven met <code>GradeBadge</code>.
          Losse grade-cirkels of eigen badgevarianten worden niet gebruikt.
          Voor gelockte producten wordt geen GradeBadge getoond; daar blijft
          uitsluitend het slot zichtbaar.
        </p>
      </section>


      <section>
        <h2>Nutrition market discovery</h2>

        <p>
          Productmarkten bepalen uitsluitend welke producten standaard in de
          zoek- en discoveryresultaten verschijnen. Zij vormen geen
          autorisatiegrens en beperken geen directe toegang tot een bestaand
          product.
        </p>

        <ul>
          <li>
            Een ondersteunde <code>food_region</code> gebruikt de scope
            <code> GLOBAL + food_region</code>.
          </li>
          <li>
            Een niet-ondersteunde, inactieve, ontbrekende of ongeldige regio
            gebruikt uitsluitend <code>GLOBAL</code>.
          </li>
          <li>
            <code>nutrition_markets</code> is de centrale bron voor actieve
            regionale ondersteuning; de applicatie bevat geen hardcoded
            marketlijst.
          </li>
          <li>
            Eligibility wordt vóór ranking en vóór de kandidaatlimiet
            toegepast. Marketlidmaatschap verandert de ranking niet.
          </li>
          <li>
            Food en drink gebruiken dezelfde server-side marketresolver.
          </li>
          <li>
            Favorieten, historie, bestaande logs, directe productroutes en
            expliciete product-key-lookups blijven ongefilterd.
          </li>
          <li>
            Categorieën worden uitsluitend opgebouwd uit normale,
            market-eligible producten. De exacte fallback breidt categorieën
            niet uit.
          </li>
          <li>
            Aliases erven de market eligibility van hun product en wijzigen
            die classificatie nooit.
          </li>
          <li>
            Buiten de normale market scope is alleen volledige equality
            toegestaan via <code>nutrition_product_search_names</code>:
            <code> search_name_normalized = normalized(query)</code>.
            Zowel een officiële naam als een expliciete alias kan de match
            openen, maar het resultaat toont altijd de officiële displaynaam.
          </li>
          <li>
            Het gedeelde normalisatiecontract voor opslag/view en
            applicatiequery is: Unicode NFKC, trim, Unicode en interne
            witruimte reduceren tot één spatie, lowercase en interpunctie
            behouden.
          </li>
          <li>
            De fallback zoekt alleen binnen de actuele UI- en zoektaal.
            <code> is_drink</code> houdt food- en drinkresultaten gescheiden.
          </li>
          <li>
            Substring-, prefix-, fuzzy-, typo- en semantische cross-market
            fallback zijn niet toegestaan.
          </li>
          <li>
            Resultaten worden op <code>product_key</code> gededupliceerd.
            Meerdere echte exacte producten worden met een vaste,
            deterministische volgorde getoond.
          </li>
        </ul>
      </section>


      <section>
        <h2>Zoekfilters</h2>

        <p>
          Geavanceerde zoekfilters zijn onderdeel van de productzoekfunctie
          en worden aangestuurd via entitlementfeatures.
        </p>

        <ul>
          <li>
            Gradefilter ondersteunt meerdere geselecteerde grades.
          </li>

          <li>
            Categoriefilter ondersteunt meerdere productgroepen.
          </li>

          <li>
            Filters worden toegepast voordat de resultaatlimiet wordt
            afgekapt.
          </li>

          <li>
            De feature <code>has_advanced_search_filters</code> bepaalt of de
            filters actief mogen zijn.
          </li>
        </ul>

        <p>
          Free-gebruikers zien een gelockte filterknop. Premium-, Pro- en
          Coach-gebruikers kunnen grade- en categoriefilters gebruiken.
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

          <li>
            Zoekresultaten gebruiken bestaande score- en gradegegevens.
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
