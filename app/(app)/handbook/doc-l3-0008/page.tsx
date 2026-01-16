// app/handbook/doc-l3-0008/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30008() {
  return (
    <DocumentLayout>

      <header>
        <h1>3.4 Dagplanning vs Herstel</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool omgaat met <strong>gedeeltelijke voltooiing</strong> en gedrag dat pas later op de dag plaatsvindt.
        </p>

        <p>
          Het doel is een systeem te ontwerpen dat <em>coachend, eerlijk en motiverend</em> blijft, ook wanneer gebruikers hun doelen niet perfect of niet volgens planning behalen.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          FitLifeTool hanteert het principe dat <strong>voortgang gradueel is</strong> en nooit binair (goed/fout).
        </p>

        <ul>
          <li>Elke actie draagt bij aan de dagscore</li>
          <li>Gedeeltelijke voltooiing heeft altijd waarde</li>
          <li>Late acties worden niet genegeerd</li>
          <li>De dag sluit pas af bij dagwissel, niet op tijdstip</li>
        </ul>

        <p>
          Hierdoor blijft het systeem psychologisch veilig: gebruikers worden gestimuleerd om alsnog iets te doen, in plaats van af te haken na een gemiste planning.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Technisch wordt partial completion verwerkt via <strong>expected vs actual progress</strong> per domein (hydratie, activiteit, voeding).
        </p>

        <div className="info-box">
          <p><strong>Kernmechanismen:</strong></p>

          <ul>
            <li>Expected progress wordt berekend op basis van tijd</li>
            <li>Actual progress is de huidige gerealiseerde score</li>
            <li>Scores blijven stijgen zolang acties worden gelogd</li>
            <li>Late-day acties kunnen statuskleuren herstellen</li>
          </ul>
        </div>

        <p>
          Hierdoor kan een gebruiker die 's avonds alsnog hydrateert of beweegt, zichtbaar herstellen in score en status.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Geen harde deadlines per dagdeel</strong><br />
            De dag wordt pas afgesloten bij kalenderwissel.
          </li>

          <li>
            <strong>Geen negatieve straffen voor late acties</strong><br />
            Herstel is altijd mogelijk zolang de dag actief is.
          </li>

          <li>
            <strong>Score ≠ planning</strong><br />
            Planning stuurt feedback, niet de geldigheid van acties.
          </li>

          <li>
            <strong>Motivatie boven perfectie</strong><br />
            Het systeem beloont consistent gedrag, niet timing-perfectie.
          </li>
        </ul>

        <p>
          Deze keuzes voorkomen afhaken en ondersteunen duurzaam gedrag, wat essentieel is voor lange termijn gebruik.
        </p>
      </section>

    </DocumentLayout>
  );
}
