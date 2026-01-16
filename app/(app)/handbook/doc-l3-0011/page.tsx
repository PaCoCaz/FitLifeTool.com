// app/handbook/doc-l3-0011/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30011() {
  return (
    <DocumentLayout>

      <header>
        <h1>4.2 Kaartsysteem & Compositie</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft het card-systeem van FitLifeTool:
          hoe informatieblokken zijn opgebouwd, hergebruikt en
          consistent gepresenteerd binnen de UI.
        </p>

        <p>
          Cards vormen de primaire bouwsteen van het dashboard
          en andere overzichtspagina's. Ze zijn ontworpen om
          zelfstandige, begrijpelijke eenheden te zijn met
          een duidelijke verantwoordelijkheid.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Het card-systeem is gebaseerd op het principe van <strong>compositie boven variatie</strong>.
          In plaats van veel verschillende card-types is er
          één generiek card-frame waarin specifieke inhoud
          wordt geplaatst.
        </p>

        <ul>
          <li>Elke card vertegenwoordigt één domeinconcept</li>
          <li>Cards zijn visueel consistent maar inhoudelijk vrij</li>
          <li>Acties en statusinformatie zijn optioneel</li>
        </ul>

        <p>
          Hierdoor blijft het systeem uitbreidbaar zonder dat
          de UI fragmenteert in uitzonderingen.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technisch is het card-systeem geïmplementeerd als een
          herbruikbare React-component: <code>Card</code>.
        </p>

        <p>
          Deze component accepteert vaste structurele props
          (zoals titel en actiegebied) en rendert daarna
          willekeurige children als inhoud.
        </p>

        <ul>
          <li>Header-sectie met titel en optionele acties</li>
          <li>Inhoudssectie voor grafieken, formulieren of tekst</li>
          <li>Visuele scheiding via padding en achtergrond</li>
        </ul>

        <p>
          Domeinspecifieke cards (zoals Gewicht, Hydratatie,
          Activiteit) zijn dunne wrappers rondom deze basiskaart
          en bevatten uitsluitend logica en data.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Eén card-component</strong><br />
            Voorkomt visuele inconsistentie en code-duplicatie.
          </li>

          <li>
            <strong>Compositie via children</strong><br />
            Maakt cards flexibel zonder extra configuratie-opties.
          </li>

          <li>
            <strong>Dunne domein-cards</strong><br />
            Houden businesslogica los van layoutcode.
          </li>

          <li>
            <strong>Dashboard als grid van cards</strong><br />
            Ondersteunt herschikking en toekomstige personalisatie.
          </li>
        </ul>

        <p className="muted">
          Deze keuzes zorgen ervoor dat het UI-systeem schaalbaar
          blijft naarmate het aantal features en datapunten groeit.
        </p>
      </section>

    </DocumentLayout>
  );
}
