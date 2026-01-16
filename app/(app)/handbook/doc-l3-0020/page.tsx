// app/(app)/handbook/doc-l3-0020/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30020() {
  return (
    <DocumentLayout>

      <header>
        <h1>5.6 De opbouw van het handboek</h1>
      </header>

      <section>
        <p>
          Dit document beschrijft <strong>hoe het interne handboek van FitLifeTool structureel is opgebouwd</strong>, en vormt de canonieke leidraad voor iedereen die het handboek onderhoudt of uitbreidt.
        </p>

        <p>
          Het handboek is geen losse documentatie, maar een <em>geïntegreerd onderdeel van de applicatie</em>.
          Navigatie, breadcrumbs, paginering en inhoud zijn bewust technisch gestructureerd om schaalbaarheid en consistentie te waarborgen.
        </p>
      </section>

      <section>
        <h2>Normatieve status van dit document</h2>

        <p>
          Dit document (<code>doc-l3-0020</code>) is het <strong>normatieve referentiedocument</strong> voor het interne handboek van FitLifeTool.
        </p>

        <p>
          Alle regels omtrent structuur, layout, navigatie, styling en documentopbouw zoals hier beschreven zijn <strong>bindend</strong> voor alle andere handboekdocumenten.
        </p>

        <p>
          Bij afwijkingen tussen dit document en andere handboekdocumenten geldt <strong>dit document altijd als leidend</strong>.
        </p>

        <p className="muted">
          Wijzigingen aan handboekgedrag worden gedaan door dit document en de onderliggende infrastructuur
          (registry, layout, globals.css) aan te passen, nooit door individuele documenten te “corrigeren”.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Het handboek is opgezet als een <strong>hiërarchisch documentensysteem</strong> met vaste niveaus,
          hoofdstukken en documenten.
        </p>

        <h3>Niveaus (levels)</h3>

        <table className="key-column">
          <thead>
            <tr>
              <th>Level</th>
              <th>Doelgroep</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>L1</td>
              <td>Eindgebruikersdocumentatie</td>
              <td>Toekomstig</td>
            </tr>
            <tr>
              <td>L2</td>
              <td>Coach- en begeleidersdocumentatie</td>
              <td>Toekomstig</td>
            </tr>
            <tr>
              <td>L3</td>
              <td>Interne ontwikkelaarsdocumentatie</td>
              <td>Huidig</td>
            </tr>
          </tbody>
        </table>

        <h3>Hoofdstukken</h3>

        <p>
          Elk hoofdstuk (H1 t/m H5) vertegenwoordigt een <strong>afgebakend systeemdomein</strong>, zoals architectuur, datamodel, UI of uitbreidbaarheid.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          De volledige structuur van het handboek wordt <strong>centraal gedefinieerd</strong> in:
        </p>

        <div className="info-box">
          <code>/app/handbook/handbookRegistry.ts</code>
        </div>

        <p>Deze registry is de single source of truth voor:</p>

        <ul>
          <li>Navigatie in de sidebar</li>
          <li>Breadcrumb-opbouw</li>
          <li>Hoofdstuk-landingspagina's</li>
          <li>DocumentPager (vorige / volgende)</li>
          <li>Indexpagina (Table of Contents)</li>
        </ul>
      </section>

      <section>
        <h2>Documenttemplate & stijlregels</h2>

        <ol>
          <li>Introductie - wat &amp; waarom</li>
          <li>Conceptueel model - hoe het gedacht is</li>
          <li>Implementatie - hoe het gebouwd is</li>
          <li>Belangrijke beslissingen - waarom deze keuzes</li>
        </ol>

        <p className="muted">
          Afwijkingen van deze structuur zijn niet toegestaan.
        </p>

        <p>
          <strong>Structuurregel: documenttitel</strong><br />
          Elk document bevat exact één <code>&lt;h1&gt;</code>.
          Deze <code>&lt;h1&gt;</code> staat altijd direct binnen een semantische <code>&lt;header&gt;</code> en nooit binnen een <code>&lt;section&gt;</code>.
        </p>

        <p className="muted">
          Deze regel is bindend voor alle documentpagina's.
          Hoofdstukpagina's volgen een eigen layout en vallen buiten deze regel.
        </p>

        <p>
          <strong>Architectonische regel</strong><br />
          De presentatie van lijsten is onderdeel van het globale styling-contract.
          Lijststijl (<em>disc</em>, <em>decimal</em>) wordt uitsluitend bepaald in <code>globals.css</code>.
          Documenten gebruiken alleen semantische <code>&lt;ul&gt;</code> en <code>&lt;ol&gt;</code>, zonder classes of inline styling.
        </p>

        <p>
          <strong>Toegestane semantische classes</strong><br />
          Documenten gebruiken in principe geen classes.
          Uitzonderingen hierop zijn uitsluitend de expliciet gedefinieerde semantische modifiers <code>.muted</code> en <code>.info-box</code>, zoals vastgelegd in <code>globals.css</code>.
        </p>

        <p className="muted">
          De <code>.info-box</code> is bedoeld voor ondersteunende of technische toelichting en wordt
          bewust weergegeven met een kleinere typografische schaal dan de hoofdtekst.
          Dit onderscheid is onderdeel van het globale styling-contract en mag niet per document worden aangepast.
        </p>

        <p>
          <strong>Tabellen</strong><br />
          Tabellen kennen een beperkt aantal canonieke varianten.
          De class <code>.key-column</code> is de <strong>standaard en voorkeursvariant</strong> en wordt gebruikt voor compacte, gecodeerde of gestructureerde waarden (bijv. levels, statussen, percentages).
          De class <code>.label-column</code> wordt uitsluitend gebruikt wanneer de eerste kolom expliciet een beschrijvend label bevat (bijv. entiteiten, rollen, namen).
        </p>

        <p className="muted">
          Bij <code>.key-column</code>-tabellen mag de headerkolom breder zijn dan de bodykolom.
          Dit is een bewuste architectonische keuze om leesbaarheid van kolomtitels te waarborgen zonder de compactheid van datawaarden te verliezen.
        </p>

        <p className="muted">
          Deze classes geven uitsluitend semantische intentie aan.
          Alle visuele eigenschappen (uitlijning, breedte, typografie) zijn centraal vastgelegd in <code>globals.css</code>.
        </p>

        <p className="muted">
          Het introduceren van nieuwe classes in documenten is niet toegestaan.
          Indien een nieuwe presentatievorm nodig is, wordt deze eerst canoniek toegevoegd aan het globale styling-contract.
        </p>

        <p>
          <strong>Reikwijdte</strong><br />
          Dit document beschrijft het handboek zoals het <em>architectonisch bedoeld</em> is.
          Het fungeert niet als voorbeeldimplementatie per document, maar als definitie van het systeem waarbinnen documenten bestaan.
        </p>
      </section>

      <section>
        <h2>Hoofdstukpagina's</h2>

        <p>
          Naast individuele documenten kent het handboek <strong>hoofdstukpagina's</strong>.
          Een hoofdstukpagina fungeert uitsluitend als <em>structureel en navigerend anker</em> binnen het handboek en is geen inhoudelijk document.
        </p>

        <h3>Doel en reikwijdte</h3>

        <p>
          Een hoofdstukpagina heeft als doel:
        </p>

        <ul>
          <li>het positioneren van een hoofdstuk binnen de totale handboekstructuur</li>
          <li>het bieden van context en samenhang tussen onderliggende documenten</li>
          <li>het fungeren als landingspunt vanuit navigatie en breadcrumbs</li>
        </ul>

        <p className="muted">
          Hoofdstukpagina's zijn niet normatief voor inhoudelijke of architectonische beslissingen.
          Die verantwoordelijkheid ligt altijd bij individuele documenten (L3).
        </p>

        <h3>Verschil met documentpagina's</h3>

        <table className="label-column">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Hoofdstukpagina</th>
              <th>Documentpagina</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Doel</td>
              <td>Navigatie & context</td>
              <td>Inhoud & besluitvorming</td>
            </tr>
            <tr>
              <td>Normatief</td>
              <td>Nee</td>
              <td>Ja</td>
            </tr>
            <tr>
              <td>Layout</td>
              <td>ChapterLayout</td>
              <td>DocumentLayout</td>
            </tr>
            <tr>
              <td>DocumentPager</td>
              <td>Niet toegestaan</td>
              <td>Verplicht (indien van toepassing)</td>
            </tr>
            <tr>
              <td>Tabellen</td>
              <td>Niet toegestaan</td>
              <td>Toegestaan</td>
            </tr>
            <tr>
              <td>Info-box</td>
              <td>Niet toegestaan</td>
              <td>Toegestaan</td>
            </tr>
          </tbody>
        </table>

        <h3>Layout en technische afbakening</h3>

        <p>
          Hoofdstukpagina's maken gebruik van een aparte layout:
          <code>ChapterLayout</code>.
        </p>

        <ul>
          <li>Deze layout is verantwoordelijk voor spacing en positionering</li>
          <li>Hoofdstukpagina's bevatten geen document-specifieke logica</li>
          <li>Navigatie (breadcrumbs, sidebar) wordt volledig extern geregeld</li>
        </ul>

        <p className="muted">
          Het is niet toegestaan om hoofdstukpagina's te behandelen als “lichte documenten” of om documentgedrag gedeeltelijk te kopiëren.
        </p>

        <h3>Architectonische regel</h3>

        <p>
          Hoofdstukpagina's zijn <strong>structureel</strong>, documenten zijn <strong>inhoudelijk</strong>. Deze verantwoordelijkheden mogen nooit vermengd worden.
        </p>
      </section>

      <section>
        <p className="muted">
          Dit document is leidend. Bij twijfel over structuur, navigatie of stijl: <strong>dit document aanpassen</strong>, niet omzeilen.
        </p>
      </section>

    </DocumentLayout>
  );
}
