// app/handbook/doc-l3-0010/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30010() {
  return (
    <DocumentLayout>

      <section>
        <h1>4.1 UI-architectuur - Overzicht</h1>

        <p>
          Dit hoofdstuk beschrijft de globale architectuur van de UI-laag
          van FitLifeTool. Het doel is inzicht geven in hoe layout,
          navigatie en content samenkomen tot één consistent systeem.
        </p>

        <p>
          De UI is niet opgebouwd als een verzameling losse pagina's,
          maar als een hiërarchisch en herbruikbaar layout-systeem
          dat schaalbaar is naarmate de applicatie groeit.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          De UI-architectuur van FitLifeTool is gebaseerd op een <strong>shell + content</strong>-model.
          Hierbij vormt een vaste buitenlaag (shell) het kader waarbinnen alle pagina's worden weergegeven.
        </p>

        <ul>
          <li>De shell bepaalt globale structuur en navigatie</li>
          <li>Contentpagina's bevatten uitsluitend domeinlogica</li>
          <li>Context (waar ben ik?) is altijd zichtbaar</li>
        </ul>

        <p>
          Dit voorkomt dat individuele pagina's zelf verantwoordelijk
          worden voor layoutbeslissingen en zorgt voor visuele en
          structurele consistentie.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technisch is de UI-architectuur gerealiseerd via een centrale <code>AppShell</code>-component, die op layout-niveau wordt toegepast.
        </p>

        <ul>
          <li>Header en topnavigatie zijn fixed gepositioneerd</li>
          <li>Breadcrumb-gebied is een vaste zone onder de navigatie</li>
          <li>Scrollende content wordt hier expliciet onder geplaatst</li>
        </ul>

        <p>
          Binnen de shell renderen pagina's uitsluitend hun eigen
          inhoud. Ze hebben geen kennis van globale offsets,
          vaste hoogtes of navigatie-elementen.
        </p>

        <p>
          Hierdoor kan de UI-structuur worden aangepast zonder
          individuele pagina's te wijzigen.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Single AppShell</strong><br />
            Voorkomt layout-duplicatie en versnippering.
          </li>

          <li>
            <strong>Fixed navigatiezones</strong><br />
            Houden context altijd zichtbaar, ook bij lange pagina's.
          </li>

          <li>
            <strong>Content als “domme” laag</strong><br />
            Pagina's focussen uitsluitend op logica en data.
          </li>

          <li>
            <strong>Vooruitdenken</strong><br />
            Deze structuur ondersteunt toekomstige uitbreidingen
            zoals extra navigatieniveaus, modals en contextuele UI.
          </li>
        </ul>
      </section>

    </DocumentLayout>
  );
}
