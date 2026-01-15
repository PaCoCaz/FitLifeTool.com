// app/handbook/doc-l3-0006/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30006() {
  return (
    <DocumentLayout>

      <section>
        <h1>3.2 Status &amp; Kleuren</h1>

        <p>
          Naast numerieke scores gebruikt FitLifeTool kleurcodes om voortgang en status intuïtief zichtbaar te maken.<br/>
          Kleuren zijn geen decoratie, maar onderdeel van de logica.
          Ze fungeren als snelle feedbacklaag bovenop cijfers.
        </p>
      </section>

      <section>
        <h2>Status per card</h2>

        <p>
          Elke card (Hydration, Activity, Nutrition) publiceert een
          eigen status op basis van de voortgang ten opzichte van
          het dagdoel.
        </p>

        <p>
          De status is altijd één van de volgende waarden:
        </p>

        <table className="key-column">
          <thead>
            <tr>
              <th>Status</th>
              <th>Betekenis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>behind</td>
              <td>Gebruiker loopt achter op schema</td>
            </tr>
            <tr>
              <td>onTrack</td>
              <td>Gebruiker ligt op schema</td>
            </tr>
            <tr>
              <td>completed</td>
              <td>Dagdoel is behaald</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Kleurmapping</h2>

        <p>
          Elke status correspondeert met een vaste kleur:
        </p>

        <table className="key-column">
          <thead>
            <tr>
              <th>Status</th>
              <th>Kleur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>behind</td>
              <td>Rood / oranje tint</td>
            </tr>
            <tr>
              <td>onTrack</td>
              <td>Blauw (neutraal positief)</td>
            </tr>
            <tr>
              <td>completed</td>
              <td>Groen</td>
            </tr>
          </tbody>
        </table>

        <p>
          Deze mapping is overal identiek: cards, progress bars,
          iconen en de FitLifeScore zelf.
        </p>
      </section>

      <section>
        <h2>Aggregatie naar FitLifeScore</h2>

        <p>
          De FitLifeScore bepaalt zijn kleur niet op basis van
          het numerieke eindresultaat, maar op basis van de
          gecombineerde card-statussen.
        </p>

        <p>
          De aggregatieregel is expliciet conservatief:
        </p>

        <ul>
          <li>
            Als <strong>alle</strong> cards <em>completed</em> zijn →
            scorekleur = groen
          </li>
          <li>
            Als één of meerdere cards <em>behind</em> zijn →
            scorekleur = rood / waarschuwing
          </li>
          <li>
            In alle andere gevallen →
            scorekleur = blauw
          </li>
        </ul>
      </section>

      <section>
        <h2>Geen numerieke shortcuts</h2>

        <p>
          Een hoge FitLifeScore (bijvoorbeeld 90+) kan nog steeds een waarschuwingskleur tonen als één card achterloopt.<br/>
          Dit voorkomt dat gebruikers een “goed getal” zien terwijl er feitelijk onbalans bestaat.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Cards exposen hun status via props of context.
          De ScoreCard luistert hierop en bepaalt de eindkleur.
        </p>

        <ul>
          <li>Geen herberekening in de ScoreCard</li>
          <li>Geen duplicatie van card-logica</li>
          <li>Status is leidend, niet score</li>
        </ul>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>Kleuren zijn semantisch, niet cosmetisch</li>
          <li>Aggregatie is conservatief</li>
          <li>Status gaat boven getal</li>
          <li>Consistente mapping door de hele applicatie</li>
        </ul>

        <p>
          Hierdoor blijft de visuele feedback betrouwbaar en
          voorspelbaar, ook bij uitbreiding van het systeem.
        </p>
      </section>

    </DocumentLayout>
  );
}
