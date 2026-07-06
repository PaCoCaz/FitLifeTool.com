// app/(app)/handbook/doc-l3-0001/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30001() {
  return (
    <DocumentLayout>
      <header>
        <h1>1.1 Overzicht & Principes</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          FitLifeTool is een dag-gedreven gezondheidsplatform dat gebruikers helpt gedurende de dag gezonde keuzes te maken.
          Voeding, hydratatie, activiteiten en gewicht worden geregistreerd als afzonderlijke gebeurtenissen die samen de actuele voortgang en energiebalans bepalen.
        </p>

        <p>
          In plaats van uitsluitend een eindresultaat te tonen, vergelijkt FitLifeTool de actuele situatie continu met de verwachte voortgang op dat moment van de dag.
          Hierdoor ontvangen gebruikers realtime feedback en kunnen zij hun gedrag gedurende de dag bewust bijsturen.
        </p>

        <p>
          Alle feedback binnen de applicatie is gebaseerd op expliciete gebruikersacties en reproduceerbare berekeningen.
          Dit handboek documenteert niet alleen <em>hoe</em> FitLifeTool is gebouwd, maar vooral <em>waarom</em> deze ontwerpkeuzes zijn gemaakt.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          De architectuur van FitLifeTool is gebaseerd op een beperkt aantal fundamentele principes.
        </p>

        <ul>
          <li>
            <strong>De dag</strong> is de primaire aggregatie-eenheid.
          </li>

          <li>
            <strong>Logs</strong> zijn onveranderlijke registraties van gebruikersacties.
          </li>

          <li>
            <strong>Scores</strong> zijn afgeleide waarden en nooit brondata.
          </li>

          <li>
            <strong>Doelen</strong> bepalen de verwachte situatie; voortgang wordt altijd berekend.
          </li>

          <li>
            <strong>Referentiedata</strong> (producten, voedingswaarden, porties en vertalingen) staat volledig los van gebruikersgegevens.
          </li>

          <li>
            <strong>De UI</strong> presenteert uitsluitend de actuele status van de onderliggende data.
          </li>
        </ul>

        <p>
          Hierdoor bestaat er geen verborgen of "magische" state. Alles wat een gebruiker ziet is uiteindelijk herleidbaar tot opgeslagen data en deterministische berekeningen.
        </p>
      </section>

      <section>
        <h2>Architectuurlagen</h2>

        <p>
          FitLifeTool bestaat uit meerdere duidelijk gescheiden lagen, waarbij iedere laag een eigen verantwoordelijkheid heeft.
        </p>

        <ul>
          <li>
            <strong>Authenticatie & Autorisatie</strong> via Supabase Authentication en Next.js.
          </li>

          <li>
            <strong>Database</strong> met een strikte scheiding tussen referentiedata en gebruikersdata.
          </li>

          <li>
            <strong>Business Rules & Calculations</strong> voor doelen, scoremodellen en afgeleide waarden.
          </li>

          <li>
            <strong>Application State</strong> via providers en stores voor dagcontext, synchronisatie en gebruikersstatus.
          </li>

          <li>
            <strong>UI Components</strong> die uitsluitend verantwoordelijk zijn voor presentatie en interactie.
          </li>
        </ul>

        <p>
          Door deze verantwoordelijkheden duidelijk te scheiden blijven de verschillende onderdelen onafhankelijk, testbaar en eenvoudig uitbreidbaar.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <p>
          Binnen FitLifeTool gelden de volgende fundamentele ontwerpregels.
        </p>

        <ul>
          <li>
            Dagwissels zijn expliciete gebeurtenissen en geen verborgen resets.
          </li>

          <li>
            Scores worden altijd opnieuw berekend en nooit handmatig aangepast.
          </li>

          <li>
            Feedback ondersteunt gedragsverandering gedurende de dag en beoordeelt gebruikers niet uitsluitend op het eindresultaat.
          </li>

          <li>
            Een ongunstige status is altijd een momentopname en kan gedurende de dag veranderen door nieuwe voedingsregistraties, hydratatie of activiteiten.
          </li>

          <li>
            Gebruikersgegevens en referentiedata blijven strikt gescheiden.
          </li>

          <li>
            Alle gebruikersgerichte teksten verlopen via het vertaalsysteem.
          </li>

          <li>
            De UI introduceert geen verborgen businesslogica.
          </li>

          <li>
            Alle berekeningen moeten reproduceerbaar zijn vanuit de opgeslagen gegevens.
          </li>

          <li>
            Nieuwe functionaliteit bouwt voort op bestaande componenten voordat nieuwe structuren worden geïntroduceerd.
          </li>

          <li>
            De gebruikersinterface is mobile-first ontworpen; grotere schermen breiden de presentatie uit zonder de interactieprincipes te wijzigen.
          </li>
        </ul>

        <p>
          Door deze ontwerpprincipes consequent toe te passen blijft FitLifeTool schaalbaar, voorspelbaar en eenvoudig te onderhouden.
          Tegelijkertijd ondersteunen zij de centrale filosofie van de applicatie: gebruikers gedurende de dag helpen om gezonde keuzes te maken en hun voortgang tijdig bij te sturen, in plaats van hen pas achteraf te beoordelen.
        </p>
      </section>
    </DocumentLayout>
  );
}