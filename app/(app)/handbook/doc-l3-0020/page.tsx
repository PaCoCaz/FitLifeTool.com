// app/(app)/handbook/doc-l3-0020/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30020() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.6 De opbouw van het handboek</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft de structuur, functie en regels van het
          interne FitLifeTool-handboek.
        </p>

        <p>
          Het handboek is niet uitsluitend documentatie achteraf, maar vormt
          een actief onderdeel van de architectuur. Het legt vast waarom
          ontwerpkeuzes bestaan en hoe toekomstige uitbreidingen binnen het
          systeem moeten passen.
        </p>

        <p>
          Hierdoor blijft kennis over architectuur, productkeuzes en technische
          uitgangspunten behouden tijdens verdere ontwikkeling.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Het handboek documenteert drie fundamentele vragen:
        </p>

        <ul>
          <li>
            <strong>Wat</strong> doet het systeem?
          </li>

          <li>
            <strong>Waarom</strong> is het op deze manier ontworpen?
          </li>

          <li>
            <strong>Hoe</strong> is het technisch gerealiseerd?
          </li>
        </ul>

        <p>
          Een document beschrijft nooit uitsluitend implementatie.
          Architectuurkeuzes en achterliggende redenen zijn even belangrijk
          als de technische oplossing zelf.
        </p>
      </section>

      <section>
        <h2>Documentstructuur</h2>

        <p>
          Documenten volgen zoveel mogelijk dezelfde vaste opbouw.
          Niet ieder onderwerp vereist exact dezelfde secties, maar de
          volgorde en gedachte blijven consistent.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Sectie</th>
                <th>Doel</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Introductie</td>
                <td>
                  Beschrijft welk probleem of onderdeel wordt behandeld.
                </td>
              </tr>

              <tr>
                <td>Conceptueel model</td>
                <td>
                  Legt de ontwerpgedachte en systeemregels vast.
                </td>
              </tr>

              <tr>
                <td>Implementatie</td>
                <td>
                  Beschrijft hoe het concept technisch is gerealiseerd.
                </td>
              </tr>

              <tr>
                <td>Ontwerpprincipes</td>
                <td>
                  Legt vast welke beslissingen richtinggevend blijven.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Hoofdstukstructuur</h2>

        <p>
          Het handboek is opgebouwd uit hoofdstukken die ieder een duidelijke
          verantwoordelijkheid hebben.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Hoofdstuk</th>
                <th>Onderwerp</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>H1</td>
                <td>
                  Kernarchitectuur en fundamentele ontwerpprincipes.
                </td>
              </tr>

              <tr>
                <td>H2</td>
                <td>
                  Datamodel, persistentie, gebruikers en brongegevens.
                </td>
              </tr>

              <tr>
                <td>H3</td>
                <td>
                  Doelen, scores, status en feedbacksystemen.
                </td>
              </tr>

              <tr>
                <td>H4</td>
                <td>
                  UI-architectuur, componenten en gebruikersinterface.
                </td>
              </tr>

              <tr>
                <td>H5</td>
                <td>
                  Groei, uitbreidbaarheid en toekomstbestendigheid.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Beheer en uitbreiding</h2>

        <p>
          Nieuwe documentatie volgt dezelfde architectuurprincipes als de
          applicatie zelf: uitbreiden zonder bestaande structuren te breken.
        </p>

        <ul>
          <li>
            Nieuwe documenten worden toegevoegd via{" "}
            <code>handbookRegistry.ts</code>.
          </li>

          <li>
            Navigatie wordt afgeleid uit de centrale documentstructuur.
          </li>

          <li>
            Handmatige koppelingen buiten het registratiesysteem worden
            vermeden.
          </li>

          <li>
            Documentstatussen geven de betrouwbaarheid van informatie aan.
          </li>
        </ul>

        <p>
          Hierdoor blijft het handboek schaalbaar terwijl nieuwe onderdelen
          worden toegevoegd.
        </p>
      </section>

      <section>
        <h2>Status en verantwoordelijkheid</h2>

        <p>
          Documenten binnen het handboek hebben een expliciete status.
        </p>

        <ul>
          <li>
            <strong>draft:</strong> concept of nog onvolledig.
          </li>

          <li>
            <strong>review:</strong> inhoudelijk aanwezig maar nog te
            controleren.
          </li>

          <li>
            <strong>current:</strong> actuele en leidende documentatie.
          </li>
        </ul>

        <p>
          Een document met status <strong>current</strong> beschrijft de
          geldende architectuur en vormt de referentie voor toekomstige
          wijzigingen.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Documentatie groeit mee met de applicatie.</li>

          <li>Architectuurkeuzes worden altijd verklaard.</li>

          <li>Het handboek beschrijft principes, niet alleen code.</li>

          <li>Nieuwe functionaliteit vereist bijgewerkte documentatie.</li>

          <li>De centrale registry blijft de bron van waarheid.</li>
        </ul>

        <p>
          Het interne handboek is een integraal onderdeel van de
          FitLifeTool-architectuur. Nieuwe functionaliteit wordt pas als
          compleet beschouwd wanneer de bijbehorende ontwerpkeuzes,
          datastromen en implementatieprincipes zijn vastgelegd.
        </p>
      </section>
    </DocumentLayout>
  );
}