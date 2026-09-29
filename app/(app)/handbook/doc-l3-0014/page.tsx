// app/(app)/handbook/doc-l3-0014/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30014() {
  return (
    <DocumentLayout>
      <header>
        <h1>4.5 Visuele hiërarchie & Status</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          De visuele laag van FitLifeTool is ontworpen om gebruikers snel
          inzicht te geven in hun actuele situatie zonder complexe analyses
          of interpretatie van cijfers.
        </p>

        <p>
          Kleur, typografie en positionering hebben binnen de applicatie een
          functionele betekenis. Visuele elementen worden gebruikt om
          prioriteit, voortgang en status te communiceren.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool informatie rangschikt en
          hoe statusfeedback consequent wordt weergegeven.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          De interface maakt onderscheid tussen twee vormen van visuele
          communicatie.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Onderdeel</th>
                <th>Doel</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Hiërarchie</td>
                <td>Bepaalt welke informatie als eerste aandacht krijgt.</td>
              </tr>

              <tr>
                <td>Status</td>
                <td>Geeft betekenis aan de huidige voortgang.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Hierdoor kan een gebruiker eerst zien wat belangrijk is en daarna
          begrijpen wat de huidige situatie betekent.
        </p>
      </section>

      <section>
        <h2>Visuele hiërarchie</h2>

        <p>
          FitLifeTool gebruikt een beperkt aantal vaste patronen om informatie
          voorspelbaar te presenteren.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Niveau</th>
                <th>Gebruik</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Primair</td>
                <td>
                  Hoofdwaarden, titels en navigatie gebruiken de primaire
                  FitLifeTool-kleur.
                </td>
              </tr>

              <tr>
                <td>Secundair</td>
                <td>
                  Ondersteunende informatie gebruikt kleinere tekst en
                  neutrale tinten.
                </td>
              </tr>

              <tr>
                <td>Status</td>
                <td>
                  Statuskleuren worden uitsluitend gebruikt voor feedback.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Decoratieve variatie wordt bewust beperkt zodat kleur en nadruk hun
          betekenis behouden.
        </p>
      </section>

      <section>
        <h2>Globaal FitLifeTool Color System</h2>

        <p>
          Dit kleurensysteem is het canonieke ontwerpcontract voor Public Web,
          de ingelogde applicatie en gedeelde FitLifeTool-UI. Het beschrijft
          de beoogde semantische rollen; bestaande componenten gebruiken nog
          niet overal deze exacte waarden.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Kleur</th>
                <th>Waarde</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Navy</td>
                <td><code>#191970</code></td>
                <td>Merkbasis, primaire structuur en waar passend een actie met hoge nadruk.</td>
              </tr>
              <tr>
                <td>Header Light Blue</td>
                <td><code>#B8CAE0</code></td>
                <td>Lichte headerachtergrond.</td>
              </tr>
              <tr>
                <td>Page Background</td>
                <td><code>#DBE4F0</code></td>
                <td>Pagina-achtergrond.</td>
              </tr>
              <tr>
                <td>Accent Blue / Interactive &amp; Insight Blue</td>
                <td><code>#1976D2</code></td>
                <td>Interactieve nadruk, zoals passende hover-, focus- en navigatiestates, en informatieve inzichten.</td>
              </tr>
              <tr>
                <td>Primary Green / Positive &amp; Action Accent</td>
                <td><code>#22C55E</code></td>
                <td>Positieve of actiegerichte nadruk, met voldoende contrast.</td>
              </tr>
              <tr>
                <td>FitLifeTool Red</td>
                <td><code>#C80000</code></td>
                <td>Canoniek rood; de context bepaalt de betekenis.</td>
              </tr>
              <tr>
                <td>Background Light</td>
                <td><code>#F5FAFF</code></td>
                <td>Lichte achtergrond voor oppervlakken.</td>
              </tr>
              <tr>
                <td>Border / Divider</td>
                <td><code>#E2E8F0</code></td>
                <td>Neutrale randen en scheidingslijnen.</td>
              </tr>
              <tr>
                <td>Text Secondary</td>
                <td><code>#64748B</code></td>
                <td>Ondersteunende tekst.</td>
              </tr>
              <tr>
                <td>White</td>
                <td><code>#FFFFFF</code></td>
                <td>Witte oppervlakken of tekst waar het contrast dat toelaat.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Accent Blue is wereldwijd de beoogde Interactive / Insight Blue,
          maar blauw is niet automatisch een gezondheids- of statuskleur.
          Primary Green maakt evenmin iedere groene UI tot succes- of
          statusfeedback. Ook betekent niet ieder rood element automatisch
          een fout. De bestaande statusregels, waaronder Handbook 3.2,
          blijven de betekenis van statuskleuren bepalen.
        </p>
      </section>

      <section>
        <h2>Reikwijdte van ontwerp- en componentcontracten</h2>

        <ul>
          <li>Het globale Design System deelt kleur- en ontwerpprincipes tussen Public Web en de ingelogde App.</li>
          <li>Een component- of layoutregel wordt pas gedeeld nadat hij in beide omgevingen passend is gevalideerd.</li>
          <li>Public Web-componentcontracten beschrijven de concrete publieke implementatie.</li>
          <li>Componenten en navigatie van de ingelogde App vragen een eigen functionele en visuele validatie.</li>
        </ul>

        <p>
          De geaccepteerde Public Header gebruikt een structuur van 108px en
          een buitenafstand van 14px voor geopende panelen. Die geometrie is
          niet van nature uitsluitend publiek, maar wordt nog niet aan de
          ingelogde App opgelegd. Heeft de App een gelijkwaardige tweelaagse
          header zonder functionele reden voor afwijking, dan heeft hergebruik
          van een gedeeld geometriecontract de voorkeur.
        </p>
      </section>

      <section>
        <h2>Gedeelde navigatie- en tekst/beeldcontracten</h2>

        <p>
          De primaire FitLifeTool-header blijft tijdens verticaal scrollen
          zichtbaar. Header en menu bieden navigatie en accounttoegang;
          conversie hoort bij de betreffende pagina. Dit ontwerpprincipe geldt
          ook voor een toekomstige ingelogde App, maar haar concrete controls,
          lagen en geometrie worden afzonderlijk gevalideerd. Het huidige
          Public Web-contract staat in Handbook 5.11.
        </p>

        <p>
          Waar lopende tekst daadwerkelijk om een vrijstaande afbeelding loopt,
          geldt <code>availableTextWidth(lineBox) = contentWidth -
          actualImageExclusionForThatLineBox - safetyGap</code>. De zichtbare
          afbeelding is waar mogelijk zelf de float met
          <code> shape-outside</code>. Haar asset-specifieke contour gebruikt
          genormaliseerde coördinaten ten opzichte van de image border-box,
          zodat schaal en exclusion samen bewegen. Bij een ander responsive
          asset worden asset, aspectratio en contour samen beoordeeld.
        </p>

        <p>
          <code>content-edge-inset</code> begrenst gewone content en controls
          ten opzichte van de sectierand; <code>image-exclusion-gap-inline</code>
          is de afzonderlijke veiligheidsafstand tussen lopende tekst en beeld.
          Gelijke pixelwaarden maken deze contracten niet uitwisselbaar.
          Tekst breekt natuurlijk en taal-onafhankelijk af, zonder
          locale-specifieke breedtes of handmatige <code>&lt;br&gt;</code>-regels
          als layoutmechanisme. <code>shape-outside</code> beïnvloedt
          tekstregelvakken, ook wanneer een regel de float slechts gedeeltelijk
          in de hoogte raakt; een CTA of absoluut overlay-element wordt er niet
          automatisch door beschermd. Gescheiden Grid/Flex-tekst/beeldlayouts
          vallen buiten dit exclusion-contract.
        </p>
      </section>

      <section>
        <h2>Canoniek contract en huidige implementatie</h2>

        <p>
          De canonieke kleuren hierboven zijn een doelcontract, geen bewering
          dat alle bestaande schermen al zijn gemigreerd. De read-only audit
          vóór dit document vond 45 exacte toepassingen van
          <code> #0BA4E0</code> in 21 bestanden, vooral voor bestaande
          hover-, focus-, navigatie-, actie- en selectiestates. Geen daarvan
          werd als FitLifeScore-, voedings-, hydratatie- of activiteitsstatuskleur
          aangetroffen.
        </p>

        <p>
          De Hero-CTA en de primaire verzendknoppen van de Public Web Login-
          en Register-modal gebruiken inmiddels Navy <code>#191970</code> als
          normale achtergrond en Accent Blue <code>#1976D2</code> bij hover.
          De gedeelde primaire acties op de directe <code>/login</code>-,
          <code> /register</code>- en onboardingroutes zijn nog niet volledig
          gemigreerd. Hun passende hoverstates worden later afzonderlijk
          vanuit de nieuwste geïntegreerde Account &amp; Security-basis
          beoordeeld; dit is geen claim dat alle FitLifeTool-buttons al het
          canonieke kleurencontract volgen. Voor <code>#22C55E</code> vond de
          eerdere audit geen exacte implementatietoepassing.
        </p>

        <p>
          Er is geen automatische of globale zoek-en-vervangactie toegestaan.
          Iedere latere migratie vereist afzonderlijke visuele, contrast-,
          focus- en regressievalidatie in de betrokken omgeving.
        </p>
      </section>

      <section>
        <h2>Statuskleuren</h2>

        <p>
          Statuskleuren zijn gekoppeld aan de onderliggende berekeningen en
          worden niet handmatig door UI-componenten gekozen.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Status</th>
                <th>Betekenis</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Groen</td>
                <td>
                  De gebruiker ligt op schema of heeft het doel bereikt.
                </td>
              </tr>

              <tr>
                <td>Oranje</td>
                <td>
                  Er bestaat een beperkte afwijking van de verwachte
                  voortgang.
                </td>
              </tr>

              <tr>
                <td>Rood</td>
                <td>
                  Er bestaat een duidelijke afwijking die aandacht vraagt.
                </td>
              </tr>

              <tr>
                <td>Grijs</td>
                <td>
                  Status is tijdelijk onbekend of gegevens worden geladen.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Een waarschuwing betekent niet dat een gebruiker heeft gefaald.
          Het geeft alleen aan dat bijsturen nodig kan zijn.
        </p>
      </section>

      <section>
        <h2>Status boven decoratie</h2>

        <p>
          Binnen FitLifeTool heeft iedere kleur een betekenis.
          Kleuren worden daarom niet gebruikt om schermen aantrekkelijker te
          maken, maar om informatie sneller begrijpelijk te maken.
        </p>

        <p>
          Dezelfde status heeft overal dezelfde visuele representatie:
          dashboardkaarten, voortgangsbalken en de FitLifeScore volgen
          dezelfde regels.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Visuele keuzes ondersteunen gebruikersgedrag.</li>

          <li>Statuskleuren volgen uit berekeningen.</li>

          <li>Groen betekent op schema, niet alleen voltooid.</li>

          <li>Waarschuwingen ondersteunen bijsturen.</li>

          <li>De primaire kleur wordt gebruikt voor structuur, niet status.</li>

          <li>Consistentie gaat boven visuele variatie.</li>
        </ul>

        <p>
          Door visuele feedback rechtstreeks te koppelen aan de onderliggende
          statuslogica blijft FitLifeTool voorspelbaar en helpt de interface
          gebruikers gedurende de dag betere keuzes te maken.
        </p>
      </section>
    </DocumentLayout>
  );
}
