// app/handbook/doc-l3-0013/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30013() {
  return (
    <DocumentLayout>

      <section>
        <h1>4.4 Navigatie & Contextbewustzijn</h1>

        <p>
          Dit hoofdstuk beschrijft hoe navigatie binnen FitLifeTool
          is ontworpen om contextbewust te zijn, zonder de gebruiker
          te overweldigen of te desoriënteren.
        </p>

        <p>
          Navigatie is geen losstaand UI-element, maar een
          essentieel onderdeel van gebruikersoriëntatie,
          taakfocus en informatiehiërarchie.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          FitLifeTool hanteert het principe van
          <strong> gelaagde navigatie</strong>,
          waarbij elke laag een duidelijk doel heeft.
        </p>

        <table className="label-column">
          <thead>
            <tr>
              <th>Laag</th>
              <th>Doel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Globaal</td>
              <td>Waar ben ik in de applicatie</td>
            </tr>
            <tr>
              <td>Contextueel</td>
              <td>Wat kan ik hier doen</td>
            </tr>
            <tr>
              <td>Breadcrumbs</td>
              <td>Hoe ben ik hier gekomen</td>
            </tr>
          </tbody>
        </table>

        <p>
          Contextbewustzijn betekent dat navigatie-elementen
          zich aanpassen aan:
        </p>

        <ul>
          <li>de huidige pagina</li>
          <li>de rol van de gebruiker</li>
          <li>het actieve domein (dashboard, handbook, detailpagina)</li>
        </ul>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          De navigatiestructuur is opgesplitst in herbruikbare
          componenten, elk met een duidelijk afgebakende
          verantwoordelijkheid.
        </p>

        <table className="label-column">
          <thead>
            <tr>
              <th>Component</th>
              <th>Verantwoordelijkheid</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Header</td>
              <td>Applicatie-identiteit en primaire acties</td>
            </tr>
            <tr>
              <td>TopNavigation</td>
              <td>Hoofdsecties binnen de applicatie</td>
            </tr>
            <tr>
              <td>Sidebar</td>
              <td>Verdieping binnen een domein</td>
            </tr>
            <tr>
              <td>Breadcrumb</td>
              <td>Positionering binnen de hiërarchie</td>
            </tr>
          </tbody>
        </table>

        <p>
          Context wordt afgeleid uit routing (URL-segmenten)
          en expliciet doorgegeven via layout-componenten,
          bijvoorbeeld bij het opbouwen van breadcrumbs.
        </p>

        <p>
          Actieve navigatie-items worden uitsluitend visueel
          onderscheiden (kleur of gewicht), zonder extra UI-ruis
          zoals iconen of animaties.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Geen overmatige navigatie</strong><br />
            Alleen tonen wat relevant is voor de huidige context.
          </li>

          <li>
            <strong>Breadcrumb als oriëntatie, niet als menu</strong><br />
            Ondersteunt begrip zonder extra cognitieve last.
          </li>

          <li>
            <strong>Visuele subtiliteit</strong><br />
            Actieve status via kleur in plaats van decoratieve elementen.
          </li>

          <li>
            <strong>Layouts bepalen navigatie</strong><br />
            Context wordt centraal geregeld in layouts, niet per losse pagina.
          </li>
        </ul>

        <p className="muted">
          Deze keuzes zorgen voor een consistente, schaalbare navigatie
          die meegroeit met de applicatie zonder structurele herzieningen.
        </p>
      </section>

    </DocumentLayout>
  );
}
