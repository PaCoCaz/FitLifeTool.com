// app/(app)/handbook/doc-l3-0023/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30023() {
  return (
    <DocumentLayout>

      <header>
        <h1>2.6 Product Expansion Workflow</h1>
        <HandbookMeta />
      </header>


      <section>
        <p>
          Dit hoofdstuk beschrijft hoe nieuwe producten gecontroleerd
          worden toegevoegd aan FitLifeTool.
        </p>

        <p>
          Het doel van de Product Expansion Workflow is om de database
          schaalbaar uit te breiden zonder verlies van datakwaliteit,
          scorebetrouwbaarheid of consistentie.
        </p>

        <p>
          Nieuwe producten worden nooit rechtstreeks toegevoegd aan de
          applicatiedatabase, maar doorlopen altijd dezelfde vaste
          verwerkingsketen.
        </p>

        <div className="info-box">
          Welk concreet werkboek de formele canonieke productiebron is, moet
          nog expliciet worden vastgesteld. Dit document blijft daarom op
          status <strong>review</strong>. Een import-, test- of back-upbestand
          is nooit automatisch een productiebron.
        </div>
      </section>


      <section>
        <h2>Conceptueel model</h2>

        <p>
          Productuitbreiding verloopt via een gecontroleerde pipeline.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Nieuw product
        ↓
Bronselectie
        ↓
PRODUCTS
        ↓
PRODUCT_TRANSLATIONS
        ↓
PRODUCT_PREPARATIONS
        ↓
Controle & scoring
        ↓
PORTIONS
        ↓
Exporttabellen
        ↓
Supabase`}
          </pre>
        </div>

        <p>
          Iedere stap verrijkt het product zonder eerdere lagen
          automatisch te wijzigen.
        </p>
      </section>


      <section>
        <h2>Bronselectie</h2>

        <p>
          Voor ieder product wordt eerst een betrouwbare voedingsbron
          gekozen.
        </p>

        <p>
          De voorkeursvolgorde is:
        </p>

        <ol>
          <li>NEVO database</li>
          <li>Vergelijkbare officiële voedingsdatabases</li>
          <li>Fabrikantgegevens</li>
          <li>Berekende waarden indien geen bron beschikbaar is</li>
        </ol>

        <p>
          De gebruikte bron wordt altijd vastgelegd via source-informatie.
        </p>
      </section>


      <section>
        <h2>PRODUCTS</h2>

        <p>
          Elk nieuw product begint met één unieke productdefinitie.
        </p>

        <ul>
          <li>product_key is permanent</li>
          <li>productgroepen bepalen scorecontext</li>
          <li>bestaande keys worden nooit hernoemd</li>
        </ul>

        <p>
          De productlaag bevat geen voedingswaarden of berekeningen.
        </p>
      </section>


      <section>
        <h2>PRODUCT_TRANSLATIONS</h2>

        <p>
          Alle producten worden direct meertalig toegevoegd.
        </p>

        <p>
          Ondersteunde talen:
        </p>

        <ul>
          <li>Nederlands</li>
          <li>Engels</li>
          <li>Frans</li>
          <li>Duits</li>
          <li>Pools</li>
        </ul>

        <p>
          Gebruikersgerichte productnamen worden nooit hardcoded
          in de applicatie.
        </p>
      </section>


      <section>
        <h2>PRODUCT_PREPARATIONS</h2>

        <p>
          De bereiding vormt de belangrijkste laag van een product.
        </p>

        <p>
          Hier worden toegevoegd:
        </p>

        <ul>
          <li>bereidingsvariant</li>
          <li>voedingswaarden</li>
          <li>broninformatie</li>
          <li>validaties</li>
          <li>scoreberekeningen</li>
          <li>labels</li>
        </ul>

        <p>
          Een product kan meerdere bereidingen hebben.
        </p>

        <p>
          Voorbeelden:
        </p>

        <ul>
          <li>rauw</li>
          <li>gekookt</li>
          <li>gebakken</li>
          <li>gedroogd</li>
        </ul>
      </section>

      <section>
        <h2>Huidige werkboeklagen</h2>

        <p>
          De lokaal aanwezige productwerkboeken bevatten meer lagen dan alleen
          de primaire product- en exporttabellen. De huidige categorieën zijn:
        </p>

        <ul>
          <li>staging- en importlagen</li>
          <li>producten en productvertalingen</li>
          <li>productgroepen en groepvertalingen</li>
          <li>preparations en preparationvertalingen</li>
          <li>units en unitvertalingen</li>
          <li>productscores</li>
          <li>portions</li>
          <li>bronregistratie</li>
          <li>configuratie</li>
          <li>validatie- en dropdownlagen</li>
          <li>bonus/malus-regels waar aanwezig</li>
        </ul>

        <p>
          Niet ieder werkboek bevat al deze lagen. De aanwezigheid van een
          werkblad bepaalt niet zelfstandig of dat bestand geschikt of
          goedgekeurd is als productiebron.
        </p>
      </section>


      <section>
        <h2>Porties</h2>

        <p>
          Porties vertalen technische voedingsdata naar praktisch
          gebruikersgedrag.
        </p>

        <p>
          Portiegroottes worden bepaald met behulp van betrouwbare
          referenties en realistische gebruikshoeveelheden.
        </p>

        <ul>
          <li>standaardgewicht</li>
          <li>gebruikelijke hoeveelheid</li>
          <li>gebruiksvriendelijke omschrijving</li>
        </ul>
      </section>


      <section>
        <h2>Export naar Supabase</h2>

        <p>
          Alleen gecontroleerde exporttabellen worden gebruikt voor
          database-import.
        </p>

        <ul>
          <li>DB_PRODUCTS</li>
          <li>DB_PRODUCT_PREPARATIONS</li>
          <li>PRODUCT_SCORES</li>
          <li>PORTIONS</li>
        </ul>

        <p>
          Werkbladen met berekeningen blijven de bron en worden niet
          rechtstreeks geïmporteerd.
        </p>
      </section>

      <section>
        <h2>Versie- en wijzigingsbeheer</h2>

        <p>
          Bij toekomstige productwijzigingen worden versie, wijzigingsdatum en
          changelog bijgewerkt in het daarvoor aangewezen werkboek. Een
          productimport wordt vooraf gevalideerd en moet herstelbaar zijn.
        </p>

        <p>
          Totdat de formele productiebron en synchronisatieprocedure zijn
          vastgesteld, wordt geen lokaal werkboek uitsluitend op basis van
          bestandsnaam, inhoud of actualiteitsdatum als canoniek behandeld.
        </p>
      </section>


      <section>
        <h2>AI en automatische uitbreiding</h2>

        <p>
          AI-tools zoals Codex mogen helpen bij uitbreiding van de
          productdatabase, maar mogen de bestaande logica niet wijzigen.
        </p>

        <p>
          Automatische uitbreiding mag uitsluitend:
        </p>

        <ul>
          <li>nieuwe producten toevoegen volgens bestaande structuur</li>
          <li>ontbrekende vertalingen voorstellen</li>
          <li>porties voorstellen op basis van betrouwbare bronnen</li>
          <li>brondata verwerken volgens bestaande regels</li>
        </ul>

        <p>
          AI mag geen scoreformules, labels of berekeningsregels aanpassen
          zonder expliciete opdracht.
        </p>
      </section>


      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Nieuwe producten volgen altijd dezelfde workflow.</li>

          <li>Brondata blijft gescheiden van berekende data.</li>

          <li>Berekeningen blijven centraal beheerd.</li>

          <li>Export is een eindresultaat, geen invoerbron.</li>

          <li>Datakwaliteit gaat boven snelheid van uitbreiding.</li>
        </ul>

        <p>
          Door deze werkwijze kan FitLifeTool groeien naar duizenden
          producten terwijl de kwaliteit en betrouwbaarheid behouden blijven.
        </p>
      </section>

    </DocumentLayout>
  );
}
