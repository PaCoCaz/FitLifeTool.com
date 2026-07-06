// app/(app)/handbook/doc-l3-0002/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30002() {
  return (
    <DocumentLayout>
      <header>
        <h1>2.1 Gebruikersidentiteit & Autorisatie</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Iedere gebruiker binnen FitLifeTool beschikt over een unieke identiteit
          die wordt gebruikt voor authenticatie, autorisatie en het koppelen van
          persoonlijke gegevens aan de applicatie.
        </p>

        <p>
          FitLifeTool maakt een strikt onderscheid tussen
          <strong> authenticatie</strong> en <strong>autorisatie</strong>.
          Authenticatie bepaalt <em>wie</em> een gebruiker is, autorisatie
          bepaalt <em>welke onderdelen</em> van de applicatie toegankelijk zijn.
        </p>

        <p>
          Dit hoofdstuk beschrijft hoe gebruikersprofielen zijn opgebouwd,
          waarom een aparte <code>profiles</code>-tabel wordt gebruikt en hoe
          toegangsrechten binnen de applicatie worden toegepast.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Iedere gebruiker bestaat uit twee logisch gescheiden onderdelen.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Entiteit</th>
                <th>Omschrijving</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Auth user</td>
                <td>Gebruiker beheerd door Supabase Authentication.</td>
              </tr>
              <tr>
                <td>Profile</td>
                <td>Applicatiespecifieke gebruikersgegevens.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Het profiel vormt de centrale bron voor alle domeinspecifieke
          gebruikersinformatie.
        </p>

        <ul>
          <li>persoonlijke kenmerken (gewicht, lengte, leeftijd)</li>
          <li>persoonlijke doelstellingen</li>
          <li>rol en toegangsrechten</li>
          <li>taal- en gebruikersinstellingen</li>
        </ul>

        <p>
          Vrijwel alle businesslogica werkt via het profiel en niet rechtstreeks
          via de auth-gebruiker.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          De scheiding tussen authenticatie en gebruikersgegevens is technisch
          geïmplementeerd via:
        </p>

        <ul>
          <li>Supabase Authentication voor login, sessies en tokens.</li>

          <li>
            Een <code>profiles</code>-tabel gekoppeld via{" "}
            <code>id = auth.users.id</code>.
          </li>

          <li>
            Server-side autorisatie binnen de Next.js layouts voordat pagina's
            worden gerenderd.
          </li>
        </ul>

        <p>
          Hierdoor wordt ongeautoriseerde inhoud nooit opgebouwd voordat de
          toegangscontrole heeft plaatsgevonden.
        </p>
      </section>

      <section>
        <h2>Rollenmodel</h2>

        <p>
          FitLifeTool gebruikt rollen om onderdelen van de applicatie af te
          schermen en beheerfunctionaliteit beschikbaar te maken.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Rol</th>
                <th>Omschrijving</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>owner</td>
                <td>Volledige toegang tot alle functionaliteit.</td>
              </tr>
              <tr>
                <td>admin</td>
                <td>Beheerfunctionaliteit binnen de applicatie.</td>
              </tr>
              <tr>
                <td>developer</td>
                <td>Toegang tot ontwikkelaarsfunctionaliteit zoals het Developer Handbook.</td>
              </tr>
              <tr>
                <td>user</td>
                <td>Standaard eindgebruiker.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Rollen zijn uitsluitend bedoeld voor autorisatie en staan los van
          gebruikersgegevens of toekomstige abonnementsvormen.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Authenticatie en applicatiedata zijn strikt gescheiden.</li>
          <li>Profieldata vormt de centrale identiteit binnen de applicatie.</li>
          <li>Autorisatie wordt server-side afgedwongen.</li>
          <li>UI-componenten vertrouwen nooit uitsluitend op client-side controles.</li>
          <li>Referentiedata en gebruikersdata blijven volledig gescheiden.</li>
        </ul>

        <p>
          Door deze architectuur blijven identiteit, toegangscontrole en
          gebruikersgegevens overzichtelijk, veilig en eenvoudig uitbreidbaar.
        </p>
      </section>
    </DocumentLayout>
  );
}