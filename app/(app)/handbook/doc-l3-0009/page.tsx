// app/handbook/doc-l3-0009/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30009() {
  return (
    <DocumentLayout>

      <section>
        <h1>3.5 Controle & Betrouwbaarheid</h1>

        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool individuele
          domeinscores samenvoegt tot één consistente dagstatus,
          en hoe randgevallen gecontroleerd worden afgehandeld.
        </p>

        <p>
          De focus ligt op betrouwbaarheid, voorspelbaarheid en
          het voorkomen van misleidende scores.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          FitLifeTool beschouwt de FitLifeScore als een <strong>samengestelde indicator</strong> die nooit beter kan zijn dan zijn zwakste onderdeel.
        </p>

        <ul>
          <li>Elke domeinscore blijft afzonderlijk leidend</li>
          <li>Aggregatie mag geen onrealistisch totaal opleveren</li>
          <li>Statuskleuren zijn belangrijker dan het getal zelf</li>
          <li>Randgevallen moeten expliciet afgevangen worden</li>
        </ul>

        <p className="muted">
          Hierdoor ontstaat een systeem dat eerlijk blijft,
          zelfs wanneer data onvolledig of vertraagd is.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          De FitLifeScore wordt berekend via een <strong>gewogen aggregatie</strong> van hydratie, activiteit en voeding.
        </p>

        <div className="info-box">
          <p>
            <strong>Implementatieprincipes</strong>
          </p>

          <ul>
            <li>Elke domeinscore wordt eerst individueel afgerond</li>
            <li>De totaalscore wordt naar beneden afgerond</li>
            <li>Statuskleur wordt afgeleid van domeinstatussen</li>
            <li>Niet-groene domeinen blokkeren perfecte scores</li>
          </ul>
        </div>

        <p className="muted">
          Hierdoor kan een gebruiker nooit een perfecte dagstatus
          behalen zolang één domein achterblijft.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Geen afronding omhoog</strong><br />
            Scores worden altijd conservatief berekend.
          </li>

          <li>
            <strong>Status boven numeriek resultaat</strong><br />
            De kleur vertelt het echte verhaal, niet het percentage.
          </li>

          <li>
            <strong>Blokkade bij onvolledigheid</strong><br />
            Perfecte scores vereisen volledige dekking.
          </li>

          <li>
            <strong>Expliciete edge-case afhandeling</strong><br />
            Geen impliciete aannames bij ontbrekende data.
          </li>
        </ul>

        <p className="muted">
          Deze keuzes voorkomen score-inflatie en versterken het vertrouwen van gebruikers in de feedback.
        </p>
      </section>

    </DocumentLayout>
  );
}
