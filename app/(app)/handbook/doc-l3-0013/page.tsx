// app/(app)/handbook/doc-l3-0013/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30013() {
  return (
    <DocumentLayout>
      <header>
        <h1>4.4 Navigatie & Contextbewustzijn</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Navigatie binnen FitLifeTool is ontworpen om gebruikers altijd
          duidelijk te maken waar zij zich bevinden, welke acties beschikbaar
          zijn en welke informatie relevant is binnen de huidige context.
        </p>

        <p>
          Navigatie is geen verzameling losse links, maar onderdeel van de
          applicatiestructuur. De beschikbare navigatie volgt uit de huidige
          route, gebruikersstatus en applicatiesectie.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool navigatie centraal beheert
          en hoe context behouden blijft op verschillende schermformaten.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          FitLifeTool gebruikt een gelaagde navigatiestructuur waarbij iedere
          laag een eigen verantwoordelijkheid heeft.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Niveau</th>
                <th>Verantwoordelijkheid</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>AppShell</td>
                <td>Globale applicatiestructuur en hoofdcontext.</td>
              </tr>

              <tr>
                <td>Hoofdnavigatie</td>
                <td>Navigeren tussen primaire applicatiegebieden.</td>
              </tr>

              <tr>
                <td>Contextnavigatie</td>
                <td>Navigeren binnen een specifiek domein.</td>
              </tr>

              <tr>
                <td>Breadcrumb</td>
                <td>Weergeven van de huidige positie binnen de hiërarchie.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Iedere laag voegt context toe zonder verantwoordelijkheden van een
          andere laag over te nemen.
        </p>
      </section>

      <section>
        <h2>Mobile-first navigatie</h2>

        <p>
          Omdat FitLifeTool primair mobiel wordt gebruikt, wordt navigatie
          ontworpen vanuit beperkte schermruimte.
        </p>

        <ul>
          <li>
            Mobiele schermen tonen alleen de direct relevante navigatie.
          </li>

          <li>
            Uitgebreidere navigatiestructuren worden pas zichtbaar wanneer
            extra ruimte beschikbaar is.
          </li>

          <li>
            De navigatiestructuur blijft inhoudelijk gelijk op ieder apparaat.
          </li>
        </ul>

        <p>
          Desktopweergaven voegen overzicht toe, maar introduceren geen
          afzonderlijke navigatielogica.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Navigatie wordt centraal opgebouwd via layouts en gedeelde
          componenten. Pagina's bepalen niet zelf hoe zij binnen de applicatie
          bereikbaar zijn.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Route
      ↓
Layout
      ↓
Navigatiecontext
      ↓
Breadcrumb / Menu
      ↓
Gebruiker`}
          </pre>
        </div>

        <p>
          Hierdoor blijft navigatie voorspelbaar en kan een volledige sectie
          worden uitgebreid zonder individuele pagina's aan te passen.
        </p>
      </section>

      <section>
        <h2>Autorisatie en zichtbaarheid</h2>

        <p>
          Navigatie volgt altijd de toegangsregels van de applicatie.
          Beschikbare onderdelen worden bepaald door gebruikersstatus,
          rol en applicatiecontext.
        </p>

        <p>
          Navigatie verleent zelf geen rechten. Autorisatie wordt server-side
          gecontroleerd; navigatie toont uitsluitend wat binnen die context
          relevant is.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Navigatie wordt centraal door layouts beheerd.</li>

          <li>Pagina's bevatten geen eigen navigatiestructuur.</li>

          <li>Mobile-first bepaalt de informatiedichtheid.</li>

          <li>Breadcrumbs ondersteunen oriëntatie, niet primaire navigatie.</li>

          <li>Autorisatie en navigatie blijven gescheiden verantwoordelijkheden.</li>

          <li>Nieuwe secties volgen dezelfde navigatiearchitectuur.</li>
        </ul>

        <p>
          Door navigatie als onderdeel van de applicatiearchitectuur te
          behandelen blijft FitLifeTool overzichtelijk en schaalbaar, terwijl
          gebruikers altijd hun positie en beschikbare acties begrijpen.
        </p>
      </section>
    </DocumentLayout>
  );
}