// app/(app)/handbook/doc-l3-0007/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30007() {
  return (
    <DocumentLayout>
      <header>
        <h1>3.3 Verwachte vs Actuele Voortgang</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Een van de belangrijkste ontwerpprincipes van FitLifeTool is dat
          voortgang altijd in relatie tot de tijd wordt beoordeeld. Dezelfde
          hoeveelheid water, voeding of activiteit kan op verschillende
          momenten van de dag tot een andere status leiden.
        </p>

        <p>
          Daarom vergelijkt FitLifeTool voortdurend de
          <strong> verwachte voortgang</strong> met de
          <strong> actuele voortgang</strong>. De uitkomst van die vergelijking
          bepaalt de live-status van iedere leefstijlpijler.
        </p>

        <p>
          Dit systeem is bedoeld om gebruikers continu inzicht te geven in hun
          dagverloop, zodat zij gedurende de dag bewust kunnen bijsturen.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Iedere leefstijlpijler bestaat uit twee onafhankelijke grootheden.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Onderdeel</th>
                <th>Omschrijving</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Verwachte voortgang</td>
                <td>Waar de gebruiker volgens het dagschema zou moeten staan.</td>
              </tr>

              <tr>
                <td>Actuele voortgang</td>
                <td>De werkelijk geregistreerde voortgang.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          De actuele status ontstaat uitsluitend uit de vergelijking tussen
          beide waarden.
        </p>
      </section>

      <section>
        <h2>Verwachte voortgang</h2>

        <p>
          De verwachte voortgang is een dynamische referentielijn die gedurende
          de dag geleidelijk oploopt richting het dagdoel.
        </p>

        <p>
          Iedere leefstijlpijler gebruikt hiervoor een eigen dagschema. Zo
          volgen hydratatie, voeding en activiteit elk een eigen patroon dat
          aansluit bij normaal dagelijks gedrag.
        </p>

        <p>
          De verwachte voortgang is geen verplichting of advies, maar een
          objectief referentiepunt waarmee de actuele situatie kan worden
          vergeleken.
        </p>
      </section>

      <section>
        <h2>Actuele voortgang</h2>

        <p>
          De actuele voortgang bestaat uitsluitend uit geregistreerde
          gebruikersacties, zoals gegeten voeding, gedronken water of uitgevoerde
          activiteiten.
        </p>

        <p>
          Deze gegevens worden rechtstreeks uit de logtabellen opgebouwd en
          vormen altijd de enige bron van waarheid.
        </p>
      </section>

      <section>
        <h2>Bewust afwijken van het dagschema</h2>

        <p>
          FitLifeTool gaat er nadrukkelijk niet vanuit dat een gebruiker het
          dagschema op ieder moment exact volgt.
        </p>

        <p>
          Een gebruiker kan er bewust voor kiezen om tijdelijk achter te lopen
          of juist vooruit te werken. Het systeem veroordeelt deze keuzes niet,
          maar maakt ze zichtbaar zodat de gebruiker de gevolgen begrijpt.
        </p>

        <p>
          Zo kan iemand gedurende de dag bewust minder calorieën gebruiken in
          afwachting van een diner of feest later op de avond. Omgekeerd kan een
          gebruiker tijdelijk boven het voedingsbudget uitkomen en dit later op
          de dag compenseren door extra lichamelijke activiteit uit te voeren.
        </p>

        <p>
          Het dashboard ondersteunt deze manier van plannen doordat alle
          voortgang direct opnieuw wordt berekend zodra nieuwe activiteiten of
          voedingsregistraties worden toegevoegd.
        </p>
      </section>

      <section>
        <h2>Realtime herberekening</h2>

        <p>
          Iedere nieuwe registratie kan de actuele situatie direct veranderen.
        </p>

        <ul>
          <li>Nieuwe drinkmomenten verhogen de HydrationScore.</li>

          <li>Nieuwe activiteiten verhogen de ActivityScore.</li>

          <li>
            Uitgevoerde activiteiten verhogen bovendien het beschikbare
            voedingsbudget, waardoor ook de NutritionScore onmiddellijk opnieuw
            wordt berekend.
          </li>

          <li>
            De FitLifeScore wordt vervolgens automatisch opnieuw samengesteld.
          </li>
        </ul>

        <p>
          Hierdoor geeft het dashboard voortdurend de actuele stand van zaken
          weer, zonder dat historische gegevens worden aangepast.
        </p>
      </section>

      <section>
        <h2>Geen voorspellingen</h2>

        <p>
          FitLifeTool voorspelt nooit toekomstig gedrag. Het systeem gaat er
          niet vanuit dat een gebruiker later op de dag nog zal eten, drinken
          of bewegen.
        </p>

        <p>
          Alle feedback is uitsluitend gebaseerd op de gegevens die op dat
          moment daadwerkelijk zijn geregistreerd.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Voortgang wordt altijd beoordeeld in relatie tot de tijd.</li>

          <li>Verwachte voortgang is een referentie, geen verplichting.</li>

          <li>Gebruikers mogen bewust afwijken van het dagschema.</li>

          <li>Nieuwe registraties leiden direct tot een herberekening.</li>

          <li>Activiteit verhoogt het beschikbare voedingsbudget.</li>

          <li>Alle feedback is gebaseerd op actuele geregistreerde gegevens.</li>

          <li>Historische gegevens worden nooit aangepast.</li>
        </ul>

        <p>
          Door verwachte en actuele voortgang voortdurend met elkaar te
          vergelijken ontstaat een systeem dat gebruikers niet beoordeelt op één
          moment, maar hen gedurende de hele dag ondersteunt bij het maken van
          bewuste keuzes.
        </p>
      </section>
    </DocumentLayout>
  );
}