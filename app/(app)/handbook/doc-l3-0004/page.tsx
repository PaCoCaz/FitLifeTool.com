// app/handbook/doc-l3-0004/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30004() {
  return (
    <DocumentLayout>

      <section>
        <h1>2.3 Dagdoelen & Herberekening</h1>

        <p>
          Hoe FitLifeTool dagdoelen bepaalt, herberekent en vooruitkijkt.
        </p>

        <p>
          Dagdoelen vormen het hart van FitLifeTool. Ze bepalen niet alleen
          wat “goed bezig” betekent, maar sturen ook feedback, progressie
          en motivatie gedurende de dag.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe dagdoelen dynamisch worden berekend,
          waarom ze kunnen veranderen en hoe het systeem vooruitkijkt
          zonder historische data aan te passen.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Een dagdoel is geen statische waarde. Het is een
          <strong> afgeleide projectie</strong> gebaseerd op:
        </p>

        <ul>
          <li>gebruikersprofiel (doel, gewicht, niveau)</li>
          <li>dag van de week</li>
          <li>historische prestaties</li>
          <li>eventuele gemiste of overgeslagen dagen</li>
        </ul>

        <p>
          Dagdoelen bestaan daarom niet als database-records, maar
          worden telkens opnieuw berekend.
        </p>
      </section>

      <section>
        <h2>Waarom herberekening nodig is</h2>

        <p>
          Een vast dagdoel zou leiden tot onnauwkeurige of demotiverende
          feedback wanneer:
        </p>

        <ul>
          <li>een gebruiker een dag overslaat</li>
          <li>doelen tussentijds wijzigen</li>
          <li>het gedrag structureel verandert</li>
        </ul>

        <p>
          Door dagdoelen dynamisch te herberekenen:
        </p>

        <ul>
          <li>blijft feedback eerlijk</li>
          <li>wordt progressie realistisch weergegeven</li>
          <li>ontstaat ruimte voor adaptief gedrag</li>
        </ul>
      </section>

      <section>
        <h2>Morgen-preview</h2>

        <p>
          FitLifeTool toont bewust een <strong>morgen-preview</strong>:
          een voorspelling van de dagdoelen voor de volgende dag.
        </p>

        <p>
          Deze preview is gebaseerd op:
        </p>

        <ul>
          <li>huidige voortgang</li>
          <li>resterende dagen in de week</li>
          <li>gemiddelde prestaties</li>
        </ul>

        <p>
          Cruciaal: de preview schrijft niets weg. Het is uitsluitend
          informatief en heeft geen effect op logs of scores.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technisch worden dagdoelen berekend via:
        </p>

        <ul>
          <li>het ophalen van profielinstellingen</li>
          <li>het analyseren van logdata</li>
          <li>het toepassen van verdelingslogica per dag</li>
        </ul>

        <p>
          Er wordt expliciet onderscheid gemaakt tussen:
        </p>

        <ul>
          <li>doel (wat wil de gebruiker bereiken)</li>
          <li>schema (hoe wordt dit verdeeld)</li>
          <li>status (loopt de gebruiker voor of achter)</li>
        </ul>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>Dagdoelen worden niet opgeslagen</li>
          <li>Herberekening gebeurt realtime</li>
          <li>Morgen-preview is read-only</li>
          <li>Historische logs blijven onaangetast</li>
        </ul>

        <p>
          Deze aanpak voorkomt technische schuld en maakt toekomstige
          uitbreidingen zoals weekplanning en coaching mogelijk.
        </p>
      </section>

    </DocumentLayout>
  );
}
