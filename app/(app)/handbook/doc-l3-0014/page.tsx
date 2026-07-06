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