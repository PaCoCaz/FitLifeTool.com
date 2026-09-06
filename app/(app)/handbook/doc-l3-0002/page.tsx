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
        <h2>Uitloggen en sessieverloop</h2>
        <p>
          Uitloggen is één server-owned POST-handeling die uitsluitend de huidige
          FitLifeTool-sessie lokaal beëindigt. Een uitlogpoging geldt pas als
          voltooid nadat de server betrouwbaar heeft vastgesteld dat geen geldige
          identiteit meer aanwezig is; providerfouten worden nooit aan de gebruiker getoond.
        </p>
        <p>
          Een begrensde, sessiegebonden <code>__Host-flt-auth-context</code>-cookie
          bewaart alleen de laatst geverifieerde onboardingstatus en interface-locale.
          Deze marker bevat geen identiteit of PII en is nooit authenticatie- of
          autorisatiebewijs. Hij onderscheidt uitsluitend gewone anonimiteit,
          betrouwbaar sessieverloop en een onbeschikbare auth-state voor veilige UX-routing.
        </p>
      </section>
      <section>
        <h2>Wachtwoordherstel en sessie-isolatie</h2>
        <p>
          Een wachtwoordherstellink wordt uitsluitend verwerkt door een tijdelijke,
          action-scoped Supabase-client zonder cookie- of browseropslag. De
          herstelcredential blijft alleen in het geheugen, wordt niet gelogd of
          gerenderd en wordt uit de browser-URL verwijderd voordat providerverificatie
          plaatsvindt. De normale FitLifeTool-browserclient is geen authority binnen
          deze herstelhandeling.
        </p>
        <p>
          Na lokale wachtwoordvalidatie voert dezelfde geïsoleerde client achtereenvolgens
          recovery-verificatie, maximaal één wachtwoordmutatie en globale afmelding uit.
          Een onzekere mutation-uitkomst wordt nooit automatisch herhaald. Wanneer de
          mutatie aantoonbaar is geslaagd maar afmelding of lokale sessieopruiming niet
          volledig kan worden bevestigd, geldt dit als partial success en mag alleen de
          opruiming opnieuw worden geprobeerd.
        </p>
        <p>
          Providerstatussen zoals verlopen of reeds gebruikte links kunnen alleen binnen
          de garanties van Supabase worden genormaliseerd. FitLifeTool toont daarom geen
          ruwe providerfouten en claimt geen sterkere token-, replay- of revocatiegaranties
          dan in productie afzonderlijk zijn gevalideerd.
        </p>
      </section>
      <section>
        <h2>Wachtwoord wijzigen</h2>
        <p>
          Wachtwoord wijzigen is een afzonderlijke, geauthenticeerde instellingenflow.
          De normale, server-owned identiteit is daarbij de enige authority: de request-body
          bevat nooit een gebruiker, e-mailadres of andere identiteit. De server bindt de
          geverifieerde claims-sub aan die normale identiteit en sluit de flow fail-closed
          wanneer de AMR ontbreekt, ongeldig is of niet uitsluitend <code>password</code> is.
        </p>
        <p>
          De eerste fase ondersteunt uitsluitend <code>aal1</code>-naar-<code>aal1</code>.
          MFA- of <code>aal2</code>-sessies zijn daarin niet ondersteund. Voor de actuele
          identiteitsbinding gebruikt de server een geïsoleerde, niet-persistente
          fresh-auth-client. Die gebruikt alleen het server-afgeleide e-mailadres en het
          tijdelijke huidige wachtwoord voor een verse password sign-in; de verse gebruiker
          moet exact dezelfde identiteit zijn als de normale geauthenticeerde gebruiker.
        </p>
        <p>
          De flow hergebruikt de canonieke gedeelde <code>passwordPolicy</code> zonder
          trimming of een tweede wachtwoordregel. Per actie wordt maximaal één
          wachtwoordmutatie geprobeerd. Een ambigue mutatie-uitkomst wordt nooit automatisch
          herhaald. Providerberichten, secrets en wachtwoorden worden niet gelogd of aan de
          gebruiker getoond; er is geen service-role-wachtwoordmutatie en geen afleiding uit
          <code>user.identities</code> of <code>app_metadata</code>-providers.
        </p>
      </section>
      <section>
        <h2>Open PRELAUNCH-verificatie — Password Change</h2>
        <p>
          <strong>AUTH-JOURNEY-08 implementation/release: PRODUCTION GREEN.</strong>{" "}
          De exact gereleasete commit is <code>900a92eb574dbf7db81078c1b68f165282c6e241</code>.
          De smalle publieke/negatieve production smoke is eveneens <strong>GREEN</strong>.
        </p>
        <p>
          <strong>Authenticated/provider PRELAUNCH-evidence: OPEN.</strong>{" "}
          Dit is geen releasefout, maar vereist nog gecontroleerde live-evidence met een
          daarvoor bestemd testaccount. De volgende verificaties staan open:
        </p>
        <ul>
          <li>een gecontroleerde geauthenticeerde wachtwoordwijziging met een testaccount;</li>
          <li>de live Supabase Secure Password Change-configuratie en het gedrag daarvan;</li>
          <li>de live Require Current Password-configuratie en het gedrag daarvan;</li>
          <li>de provider-wachtwoordregels, inclusief toepasselijke regels en leaked-password protection;</li>
          <li>het password-change rate-limitgedrag;</li>
          <li>password-change security notifications;</li>
          <li>global refresh-token revocation na een wachtwoordwijziging;</li>
          <li>access-token expiry/survival na een wachtwoordwijziging;</li>
          <li>de MFA-ineligible Password Change-UX met een gecontroleerd geauthenticeerd account.</li>
        </ul>
        <p>
          De initiële fase blijft beperkt tot password-authenticated <code>aal1</code>-naar-
          <code>aal1</code>; MFA- of <code>aal2</code>-sessies zijn daarin bewust niet
          ondersteund. Na een aantoonbaar geslaagde mutatie wordt een globale provider-afmelding
          geprobeerd, terwijl Phase06 de enige authority voor lokale logout blijft. Totdat de
          open evidence is verzameld, wordt geen onmiddellijke access-tokeninvalidatie, bewezen
          globale revocation, providernotification of live providerconfiguratie geclaimd; bestaande
          access tokens kunnen binnen providersemantiek tot hun eigen verloop bruikbaar blijven.
        </p>
      </section>
    </DocumentLayout>
  );
}
