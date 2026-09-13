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
      <section>
        <h2>Geverifieerde wijziging van het e-mailadres</h2>
        <p>
          <code>auth.users.email</code> is de enige canonieke e-mailidentiteit.
          Een wijzigingsverzoek wordt server-side gebonden aan geverifieerde claims,
          een password-only <code>aal1</code>-sessie en een geïsoleerde fresh-auth-
          authenticatie. De provider krijgt per verzoek maximaal één
          <code>updateUser</code>-poging; een ambigue uitkomst wordt nooit herhaald.
        </p>
        <p>
          Na provideracceptatie wordt onmiddellijk globale afmelding geprobeerd en
          rondt de browser de bestaande Phase06-opruiming af. Provideracceptatie,
          callbackdata en pending adressen bewijzen geen voltooiing. Alleen een
          daadwerkelijke wijziging van <code>auth.users.email</code> activeert de
          e-mailvrije, generation-based synchronisatie naar
          <code>public.customers.email</code> en daarna de exact gekoppelde Stripe Customer.
        </p>
        <p>
          De e-mailsynchronisatiewerker maakt ontbrekende of inconsistente
          customerkoppelingen nooit zelf aan of repareert ze. Leases, begrensde retries,
          stale-generationchecks en Stripe-readback na een ambigue write bewaren de richting
          Auth → customers → Stripe en sturen anomalieën naar handmatige controle.
          Voor live vrijgave blijven provider-, deliverability- en database-integratie-
          evidence afzonderlijke PRELAUNCH-gates.
        </p>
        <p>
          De canonieke Auth-trigger en outbox-write zijn synchroon onderdeel van dezelfde
          Auth-databasetransactie en vangen geen fouten af. Vóór live toepassing is daarom
          een echte, geïsoleerde database-integratietest verplicht; statische migrationtests
          alleen bewijzen de rollback-, trigger- en concurrency-eigenschappen niet.
        </p>
        <p>
          Het canonieke wijzigingsmoment blijft als <code>canonical_changed_at</code> een
          duurzame security-epoch bewaard, ook nadat downstream synchronisatie is voltooid.
          Toegang wordt niet met een user-wide acknowledgement vrijgegeven, maar per actuele
          sessie dynamisch bewezen via een geldige <code>session_id</code>, de bijbehorende
          server-owned <code>auth.sessions</code>-rij en een password-AMR van diezelfde sessie,
          beide strikt na de epoch. Tokenrefresh, access-token <code>iat</code>,
          <code>last_sign_in_at</code>, globale afmelding en voltooide downstream synchronisatie
          zijn geen bewijs van nieuwe authenticatie.
        </p>
        <p>
          De requestreservering levert een generation en correlation ID op waarmee iedere
          post-providertransitie compare-and-set wordt uitgevoerd. Een canonieke Auth-wijziging
          die al tijdens <code>requesting</code> plaatsvindt, wordt door de trigger duurzaam aan
          die generation gebonden en samen met het downstream sync-werk vastgelegd. Een late
          accept- of status-unknown-transitie convergeert daarna monotonic naar
          <code>canonical_changed</code> of <code>completed</code> en kan de canonieke toestand
          nooit terugzetten. Een Auth-wijziging zonder geldige actieve request blijft ongebonden
          en gaat fail-closed naar handmatige controle. De duurzame security-epoch wordt niet
          gewist door een nieuwe reservering, request failure of sync completion.
        </p>
        <p>
          De korte pre-providerreservering heeft een server-owned vervaltijd van vijf minuten.
          Alleen een verlaten <code>requesting</code>-reservering zonder mutation-startmarkering
          en zonder canonieke generation-binding mag daarna met een nieuwe generation en
          correlation ID worden vervangen. Direct vóór <code>updateUser</code> wordt de exacte
          generation/correlation duurzaam als mutation-started gemarkeerd; zonder bevestigde
          markering wordt de providermutatie niet uitgevoerd. Vanaf die grens vervalt de
          reservering nooit automatisch en blijven throws, time-outs en andere ambigue uitkomsten
          geblokkeerd. Definitieve fouten vóór die grens mogen uitsluitend via een exact gefencete
          release retrybaar worden; een stale release of markering kan een nieuwere generation
          niet wijzigen.
        </p>
        <p>
          Een vervallen reservering is alleen via de normale instellingenpagina en de exacte
          Email Change-POST opnieuw bereikbaar wanneer de server bevestigt dat zij nog
          <code>requesting</code>, niet gestart en niet aan canonieke evidence gebonden is.
          Deze beperkte bereikbaarheid herstelt geen algemene applicatie- of Data API-toegang,
          vervangt de verse wachtwoordcontrole niet en geeft de proxy geen mutatiebevoegdheid.
          De transactionele <code>begin_auth_email_change_request</code>-functie blijft de enige
          authority die op het laatste moment een nieuwe generation mag reserveren; een intussen
          geplaatste mutation-startmarkering, canonieke binding of concurrerende reservering
          blokkeert de retry vóór een providermutatie.
        </p>
        <p>
          Downstream workers schrijven de lokale customer-email uitsluitend via één
          transactioneel generation- en lease-gefencete databasefunctie die de actuele
          Auth-email zelf leest. Stripe-writes gebruiken een generation-specifieke
          idempotency key en niet-PII generationmetadata, gevolgd door verplichte Stripe-,
          Auth- en lease-readback bij zowel succes als ambiguïteit. Een stale of onzekere
          externe write kan geen nieuwere job voltooien of downgraden en moet duurzame,
          ongebonden reconciliation behouden. Afgeronde gekoppelde jobs worden periodiek
          op drift gecontroleerd zodat ook een procesuitval na externe acceptatie uiteindelijk
          naar de nieuwste <code>auth.users.email</code> convergeert. Retry-uitputting blijft
          zichtbaar als operationele handmatige controle, maar schakelt automatische reparatie
          niet uit: ook uitgeputte sync-jobs worden met een begrensde dagelijkse cadans opnieuw
          beoordeeld op basis van de actuele Auth-identiteit.
        </p>
        <p>
          Een geldige customer/Stripe-koppeling wordt uitsluitend via service-role-functies
          vastgesteld: gewone vaststelling is exact-pair-idempotent en vervanging vereist een
          afzonderlijke compare-and-set. Installatie faalt gesloten zonder valide, ready, live,
          onmiddellijke globale single-key uniqueness voor beide identitykolommen; INCLUDE-
          kolommen veranderen die keysemantiek niet. Dezelfde databasetransactie opent via een
          mappingtrigger precies één nieuwe synchronisatiegeneration; daardoor heropent ook een
          later ontstane koppeling duurzaam eerder afgerond
          <code>no_local_billing_relation</code>-werk. Een
          mappingevent levert nooit een e-mailadres aan en bindt alleen aan een Email Change-
          request wanneer die generation aantoonbaar de actuele, nog onopgeloste canonieke
          wijziging vertegenwoordigt.
        </p>
      </section>
    </DocumentLayout>
  );
}
