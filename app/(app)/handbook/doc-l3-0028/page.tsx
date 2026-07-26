import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30028() {
  return (
    <DocumentLayout>
      <header>
        <h1>3.6 Activity-registratie</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          De Activity-pagina gebruikt de actuele gedeelde UI-patronen van
          FitLifeTool. De interface is gemoderniseerd voor consistente cards,
          spacing, selectie en responsive weergave op mobiel en desktop.
        </p>
      </section>

      <section>
        <h2>Huidige gebruikersflow</h2>

        <p>De Activity-interface ondersteunt:</p>

        <ul>
          <li>selectie van een activiteit</li>
          <li>selectie van een standaardduur</li>
          <li>invoer van aangepaste minuten</li>
          <li>een calorie-preview vóór opslaan</li>
          <li>toevoegen van de activiteit aan Vandaag</li>
          <li>een bijgewerkt en gegroepeerd Vandaag-overzicht</li>
        </ul>
      </section>

      <section>
        <h2>MET en calorieberekening</h2>

        <p>
          De huidige activiteitencatalogus en bijbehorende MET-waarden staan
          lokaal in de applicatiecode. MET-waarden worden niet als masterdata
          in Supabase opgeslagen.
        </p>

        <p>
          De calorie-preview en de opgeslagen calorieën gebruiken de bestaande
          lokale berekeningslogica op basis van MET, gewicht en duur. Deze
          formule en de bestaande MET-waarden vallen buiten gewone
          UI-wijzigingen en worden niet zonder expliciete opdracht aangepast.
        </p>
      </section>

      <section>
        <h2>Opgeslagen activiteitgegevens</h2>

        <p>
          De huidige implementatie schrijft bij toevoegen de volgende gegevens
          naar <code>activity_logs</code>:
        </p>

        <ul>
          <li><code>user_id</code></li>
          <li><code>activity_type</code></li>
          <li><code>duration_minutes</code></li>
          <li><code>calories</code></li>
          <li><code>log_date</code></li>
        </ul>

        <p>
          Het Vandaag-overzicht leest activiteiten voor de actuele lokale dag
          en groepeert gelijke activiteitstypen voor presentatie.
        </p>
      </section>

      <section>
        <h2>Bekende open architectuurvraag</h2>

        <p>
          De Activity-interface gebruikt momenteel gewicht uit auth/user
          metadata en past een fallback toe wanneer daar geen bruikbaar gewicht
          beschikbaar is. Profiel- en instellingenflows beheren gewicht in
          <code> profiles.weight_kg</code>.
        </p>

        <p>
          Welke bron canoniek moet zijn is nog niet formeel vastgesteld. Dit
          document blijft daarom op status <strong>review</strong>. De
          gewichtsbron, fallback en synchronisatie worden pas na een expliciet
          architectuurbesluit als vaste regel gedocumenteerd.
        </p>
      </section>

      <section>
        <h2>Toekomstige uitbreiding</h2>

        <p>
          Activity Search, activity-favorieten, categorieën en een uitgebreide
          activiteitencatalogus zijn toekomstige uitbreidingen en zijn nog niet
          geïmplementeerd.
        </p>
      </section>
    </DocumentLayout>
  );
}
