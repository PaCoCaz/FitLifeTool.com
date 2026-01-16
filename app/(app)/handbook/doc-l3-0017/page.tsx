// app/handbook/doc-l3-0017/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30017() {
  return (
    <DocumentLayout>

      <header>
        <h1>5.3 Aannames voor roadmap</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft de aannames die ten grondslag liggen
          aan de roadmap van FitLifeTool.
        </p>

        <p>
          De roadmap is geen vaste belofte, maar een richtinggevend model
          dat gebaseerd is op expliciete aannames over gebruik,
          technische haalbaarheid en productgroei.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Elke roadmap-keuze rust op één of meerdere aannames.
          Deze aannames zijn expliciet gemaakt om:
        </p>

        <ul>
          <li>verwachtingen te managen</li>
          <li>beslissingen later te kunnen herzien</li>
          <li>scope creep te voorkomen</li>
        </ul>

        <p>
          Binnen FitLifeTool worden aannames onderverdeeld in:
        </p>

        <ul>
          <li>gebruikersaannames</li>
          <li>technische aannames</li>
          <li>organisatorische aannames</li>
        </ul>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Roadmap-aannames worden niet hard gecodeerd,
          maar impliciet verwerkt in ontwerpkeuzes en prioriteiten.
        </p>

        <p>
          Voorbeelden binnen FitLifeTool:
        </p>

        <ul>
          <li>
            aanname dat gebruikers dagelijks loggen,
            wat leidt tot dag-gebaseerde datastructuren
          </li>
          <li>
            aanname dat complexiteit geleidelijk toeneemt,
            wat een modulaire architectuur vereist
          </li>
          <li>
            aanname dat features incrementeel worden uitgerold,
            wat feature flags noodzakelijk maakt
          </li>
        </ul>

        <p>
          Wanneer aannames wijzigen, moet de roadmap
          expliciet worden herijkt.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Aannames zijn documenteerbaar:</strong> impliciete aannames worden expliciet gemaakt in het handboek.
          </li>
          <li>
            <strong>Geen roadmap zonder aannames:</strong> elke toekomstige feature veronderstelt randvoorwaarden.
          </li>
          <li>
            <strong>Herziening is toegestaan:</strong> aannames mogen veranderen zonder dat het systeem faalt.
          </li>
          <li>
            <strong>Architectuur blijft leidend:</strong> roadmap volgt het systeem, niet andersom.
          </li>
        </ul>

        <p>
          Door roadmap-aannames zichtbaar te maken,
          blijft FitLifeTool strategisch wendbaar
          zonder richting te verliezen.
        </p>
      </section>

    </DocumentLayout>
  );
}
