// app/(app)/handbook/doc-l3-0008/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30008() {
  return (
    <DocumentLayout>
      <header>
        <h1>3.4 Dagplanning & Bijsturen</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          FitLifeTool beschouwt een kalenderdag als één samenhangende periode
          waarin gebruikers voortdurend keuzes maken. Die keuzes hoeven niet
          gelijkmatig over de dag verdeeld te zijn. De applicatie ondersteunt
          daarom niet alleen het volgen van een dagschema, maar ook het bewust
          afwijken en later weer bijsturen.
        </p>

        <p>
          Het doel is niet om gebruikers te beoordelen op ieder afzonderlijk
          moment, maar om hen gedurende de hele dag inzicht te geven in de
          gevolgen van hun keuzes en de ruimte die nog beschikbaar is om hun
          dagdoelen te behalen.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Iedere kalenderdag blijft actief tot de dagwisseling. Binnen die
          periode kunnen gebruikers hun voortgang voortdurend beïnvloeden.
        </p>

        <ul>
          <li>Iedere registratie heeft direct invloed op de actuele voortgang.</li>

          <li>Voortgang is continu en nooit binair.</li>

          <li>De status kan gedurende de dag meerdere keren veranderen.</li>

          <li>De FitLifeScore wordt na iedere relevante wijziging opnieuw berekend.</li>
        </ul>

        <p>
          Hierdoor blijft de applicatie gedurende de hele dag een actueel beeld
          geven van de leefstijl van de gebruiker.
        </p>
      </section>

      <section>
        <h2>Bewust plannen</h2>

        <p>
          FitLifeTool gaat ervan uit dat gebruikers hun dag bewust kunnen
          plannen. Het dagschema is daarom een referentiepunt en geen vaste
          verplichting.
        </p>

        <p>
          Een gebruiker kan er bijvoorbeeld voor kiezen om overdag minder te
          eten wanneer later op de avond een uitgebreid diner of feest gepland
          staat. Andersom kan iemand tijdelijk boven het voedingsbudget uitkomen
          met de bedoeling dit later op de dag te compenseren door extra
          lichamelijke activiteit.
        </p>

        <p>
          Het dashboard maakt deze keuzes zichtbaar zonder ze als goed of fout
          te beoordelen.
        </p>
      </section>

      <section>
        <h2>Direct bijsturen</h2>

        <p>
          Iedere nieuwe registratie leidt direct tot een herberekening van de
          betrokken leefstijlpijlers.
        </p>

        <ul>
          <li>Extra water verbetert onmiddellijk de HydrationScore.</li>

          <li>Nieuwe activiteiten verhogen direct de ActivityScore.</li>

          <li>
            Activiteiten verhogen bovendien het beschikbare voedingsbudget,
            waardoor ook de NutritionScore direct opnieuw wordt berekend.
          </li>

          <li>
            De FitLifeScore wordt vervolgens automatisch opnieuw samengesteld.
          </li>
        </ul>

        <p>
          Hierdoor kan een gebruiker zijn voortgang gedurende de dag actief
          beïnvloeden en onmiddellijk zien wat het effect daarvan is.
        </p>
      </section>

      <section>
        <h2>Geen straf voor timing</h2>

        <p>
          FitLifeTool beloont niet het exacte tijdstip waarop een actie wordt
          uitgevoerd, maar het uiteindelijke gedrag over de volledige dag.
        </p>

        <p>
          Tijdelijke achterstand is daarom geen mislukking, maar een momentopname.
          Zolang de dag actief is, blijft er ruimte om de voortgang te verbeteren
          en de status opnieuw te laten veranderen.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Een kalenderdag blijft actief tot de dagwisseling.</li>

          <li>Gebruikers kunnen hun dag bewust plannen.</li>

          <li>Voortgang kan gedurende de hele dag worden bijgestuurd.</li>

          <li>Activiteit verhoogt direct het beschikbare voedingsbudget.</li>

          <li>Iedere relevante wijziging leidt tot een nieuwe FitLifeScore.</li>

          <li>Het systeem ondersteunt gedrag, niet perfectie.</li>

          <li>Feedback is informatief en niet bestraffend.</li>
        </ul>

        <p>
          Door planning, realtime herberekening en directe feedback te
          combineren ondersteunt FitLifeTool gebruikers bij het maken van
          bewuste keuzes gedurende de hele dag, zonder hen vast te zetten in een
          rigide dagschema.
        </p>
      </section>
    </DocumentLayout>
  );
}