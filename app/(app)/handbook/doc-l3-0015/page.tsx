// app/handbook/doc-l3-0015/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30015() {
  return (
    <DocumentLayout>

      <header>
        <h1>5.1 Kernprincipes uitbreidbaarheid</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft de kernprincipes die bepalen
          hoe FitLifeTool uitbreidbaar blijft zonder dat
          bestaande logica fragiel of complex wordt.
        </p>

        <p>
          Uitbreidbaarheid binnen FitLifeTool is geen losstaand
          technisch doel, maar een direct gevolg van
          consistente architectuurkeuzes.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Uitbreidbaarheid wordt benaderd als <strong>gecontroleerde groei</strong>, niet als
          onbeperkte flexibiliteit.
        </p>

        <p>
          Het systeem is opgebouwd rond stabiele kernconcepten
          die zelden wijzigen, met uitbreidingen die
          hier logisch op aansluiten.
        </p>

        <ul>
          <li>vaste kernmodellen</li>
          <li>duidelijke verantwoordelijkheden</li>
          <li>losgekoppelde UI-lagen</li>
          <li>configuratie boven conditionele logica</li>
        </ul>

        <p>
          Nieuwe functionaliteit wordt toegevoegd door <em>uitbreiding</em>, niet door herschrijven.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          In de praktijk wordt uitbreidbaarheid gerealiseerd via:
        </p>

        <ul>
          <li>modulaire cards en UI-componenten</li>
          <li>gescheiden berekenings- en presentatielogica</li>
          <li>duidelijke data-interfaces per feature</li>
          <li>centrale providers voor tijd, gebruiker en context</li>
        </ul>

        <p>
          Nieuwe features volgen bestaande patronen: dezelfde lifecycle, dezelfde datastromen, dezelfde visuele hiërarchie.
          Hierdoor kunnen features onafhankelijk worden ontwikkeld en getest, zonder impact op de kern.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Stabiele kern boven snelle flexibiliteit:</strong> voorkomt technische schuld.
          </li>
          <li>
            <strong>Patroonherhaling:</strong> verlaagt cognitieve last voor toekomstige uitbreiding.
          </li>
          <li>
            <strong>Beperkte configuratie:</strong> uitbreidbaarheid mag nooit onbegrensd worden.
          </li>
          <li>
            <strong>Expliciete grenzen:</strong> niet alles hoeft uitbreidbaar te zijn.
          </li>
        </ul>

        <p>
          Deze principes zorgen ervoor dat FitLifeTool kan
          meegroeien in functionaliteit, zonder instabiel
          of onvoorspelbaar te worden.
        </p>
      </section>

    </DocumentLayout>
  );
}
