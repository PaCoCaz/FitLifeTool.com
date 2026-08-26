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
          <li>
            woonland via <code>country_code</code> en de onafhankelijk wijzigbare
            voedingsregio via <code>food_region</code>
          </li>
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
            Server-side autorisatie binnen de Next.js layouts voordat pagina&apos;s
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
        <h2>Gevoelige accountacties</h2>

        <p>
          Een ingelogde sessie is op zichzelf niet voldoende om het wachtwoord
          te wijzigen. De password-change serverroute valideert zelfstandig de
          actuele Supabase-gebruiker en voert direct vóór de wijziging via een
          afzonderlijke, niet-persistente Supabase-client een nieuwe password
          sign-in uit met de huidige, server-side vastgestelde identiteit. De
          opnieuw geauthenticeerde user-ID moet exact overeenkomen met de
          user-ID uit de bestaande sessie. De normale browsercookie wordt niet
          door deze fresh-authsessie vervangen.
        </p>

        <ul>
          <li>
            De client levert geen <code>user_id</code>, e-mail of andere
            ownership-identificatie aan als autorisatiegrens.
          </li>
          <li>
            Een ontbrekende, mislukte of inconsistente fresh authentication
            faalt gesloten voordat het wachtwoord wordt gewijzigd.
          </li>
          <li>
            De geïsoleerde fresh-authsessie bestaat alleen binnen de serveractie
            en wordt op alle foutpaden opgeruimd zonder de normale browsersessie
            te wijzigen.
          </li>
          <li>
            Na een geslaagde wijziging wordt globale sign-out aangevraagd en
            moet de gebruiker normaal opnieuw inloggen.
          </li>
          <li>
            Wanneer alleen de globale session cleanup mislukt, blijft de
            password-change status geslaagd met een afzonderlijke waarschuwing;
            de password-update wordt niet opnieuw uitgevoerd.
          </li>
        </ul>

        <p>
          Reeds uitgegeven access tokens zijn JWT&apos;s en kunnen na globale
          sign-out nog geldig blijven tot hun eigen vervaltijd. Daarom wordt
          niet geclaimd dat alle bestaande access direct onmogelijk is. De
          proxy en server-side autorisatie blijven onafhankelijk van de
          instellingen-UI van kracht.
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
          <li>
            Landcodes gebruiken ISO 3166-1 alpha-2 en worden gevalideerd tegen
            de centrale landenreferentie.
          </li>
          <li>
            <code>food_region</code> is een gebruikerskeuze voor een land en
            gebruikt nooit de technische systeemscope <code>GLOBAL</code>.
          </li>
        </ul>

        <p>
          Door deze architectuur blijven identiteit, toegangscontrole en
          gebruikersgegevens overzichtelijk, veilig en eenvoudig uitbreidbaar.
        </p>
      </section>

      <section>
        <h2>Geverifieerde wijziging van het e-mailadres</h2>

        <p>
          Het bevestigde <code>auth.users.email</code> van Supabase Auth is de
          canonieke e-mailidentiteit. Een wijzigingsverzoek gebruikt dezelfde
          geïsoleerde fresh-password-authenticatie en exacte user-ID-binding als
          andere gevoelige accountacties. Accounts zonder bruikbare
          password-identiteit falen in deze flow gesloten.
        </p>

        <ul>
          <li>
            Supabase Secure Email Change en double confirmation bepalen wanneer
            de nieuwe waarde bevestigd is; een pending adres is nog niet
            canoniek.
          </li>
          <li>
            <code>public.customers.email</code> is uitsluitend een afgeleide
            kopie. Stripe-webhooks, Checkout en andere billingroutes schrijven
            deze kolom niet zelfstandig.
          </li>
          <li>
            Na een bevestigde Auth-wijziging maakt een database-trigger een
            dataminimale, generation-based synchronisatiejob. De job bewaart
            geen e-mailadres, wachtwoord, token of providerpayload; de
            noodzakelijke <code>user_id</code> blijft aanwezig als pseudonieme
            accountidentifier en foutopslag blijft beperkt tot gesanitiseerde
            foutcodes. Een service-role-only worker leest de actuele
            Auth-identiteit opnieuw en synchroniseert eerst de lokale customer
            en daarna de exact gekoppelde Stripe Customer.
          </li>
          <li>
            De kleine <code>AFTER UPDATE</code>-trigger en de outbox-write zijn
            synchroon onderdeel van dezelfde Auth-databasetransactie. Een
            trigger- of outboxfout kan daardoor de Auth-update laten falen; de
            trigger vangt fouten niet af en voert nooit downstream-, netwerk-
            of Stripe-acties uit.
          </li>
          <li>
            Jobs gebruiken leases, begrensde retries en stale-generationchecks.
            Een inconsistente lokale of Stripe-identiteit gaat naar handmatige
            controle en wordt nooit op basis van clientinput gerepareerd.
          </li>
          <li>
            Ontbreekt een lokale customerrow, dan geldt dit alleen als een
            legitieme no-billing no-op wanneer ook via het bestaande Stripe
            <code> metadata.user_id</code>-contract geen orphan Customer wordt
            gevonden. Een aanwezige of gevonden maar inconsistente koppeling
            faalt gesloten en gaat naar handmatige controle.
          </li>
        </ul>

        <p>
          De e-mailtemplate-, SMTP-, rate-limit- en deliverabilityvoorwaarden
          voor productie blijven afzonderlijke open pre-launchpunten in
          Handbook 5.10. Deze identityarchitectuur kiest geen mailprovider.
        </p>

        <p>
          Vóór live uitvoering van de migration is een echte, geïsoleerde
          database-integratietest verplicht. Die test moet aantonen dat een
          bevestigde <code>auth.users.email</code>-wijziging de outboxgeneration
          atomair verhoogt, een oudere lease ongeldig maakt en bij een bewust
          veroorzaakte trigger-/outboxfout volledig met de Auth-transactie
          terugrolt. Deze pre-live test wordt niet vervangen door statische
          migrationtests.
        </p>
      </section>
    </DocumentLayout>
  );
}
