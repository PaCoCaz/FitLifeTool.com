// app/(app)/handbook/doc-l3-0021/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30021() {
  return (
    <DocumentLayout>
      <header>
        <h1>2.4 Onboarding & Toegangsflow</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe een nieuwe gebruiker de applicatie
          binnenkomt, hoe een profiel operationeel wordt en hoe FitLifeTool
          bepaalt welke onderdelen van de applicatie toegankelijk zijn.
        </p>

        <p>
          Authenticatie, onboarding en toegangscontrole vormen samen één
          samenhangende gegevensstroom. Zij bepalen niet alleen of een gebruiker
          toegang heeft, maar ook in welke operationele status het profiel zich
          bevindt.
        </p>

        <p>
          De beschreven architectuur vormt de basis voor routing,
          middleware, beveiliging en de initiële gebruikerservaring.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Binnen FitLifeTool bevindt een gebruiker zich altijd in precies één
          operationele status.
        </p>

        <ol>
          <li>Niet geauthenticeerd</li>
          <li>Geauthenticeerd met onvolledig profiel</li>
          <li>Geauthenticeerd met volledig operationeel profiel</li>
        </ol>

        <p>
          Deze status wordt niet bepaald door de huidige route of de
          gebruikersinterface, maar uitsluitend door:
        </p>

        <ul>
          <li>de actuele Supabase-sessie</li>
          <li>de gegevens in de <code>profiles</code>-tabel</li>
          <li>de voltooiing van de onboarding</li>
        </ul>

        <div className="info-box">
          Onboarding is geen aparte applicatiestatus, maar een tijdelijk
          onvolledig gebruikersprofiel binnen het bestaande datamodel.
        </div>
      </section>

      <section>
        <h2>Gegevensstroom</h2>

        <p>
          Nieuwe gebruikers doorlopen steeds dezelfde architecturale flow:
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Publieke pagina
      ↓
Locale-aware /login of /register
      ↓
Supabase Authentication
      ↓
Profiles
      ↓
Onboarding
      ↓
Dashboard`}
          </pre>
        </div>

        <p>
          Iedere stap bouwt voort op de vorige. Zodra het profiel volledig is,
          wordt de gebruiker beschouwd als operationeel.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <h3>Authenticatie</h3>

        <p>
          Authenticatie wordt verzorgd door Supabase Authentication. Een
          gebruiker wordt als ingelogd beschouwd zodra een geldige sessie
          beschikbaar is.
        </p>

        <ul>
          <li>Publieke pagina&apos;s vormen de primaire instroom.</li>
          <li>
            Zij kunnen locale-aware linken naar de publieke auth-entrypoints.
          </li>
          <li>
            <code>/login</code> is een zelfstandige, locale-aware publieke
            entrypoint voor authenticatie.
          </li>
          <li>
            <code>/register</code> is een zelfstandige, locale-aware publieke
            registratie-entrypoint die de bestaande account creation-,
            e-mailbevestigings- en onboardingarchitectuur gebruikt.
          </li>
        </ul>

        <p>
          Deze authroutes gebruiken ieder een geschikte layout- en
          providergrens. Hun publieke routing en locale-aware navigatie vormen
          geen autorisatiegrens en vervangen geen server-side validatie.
          Toegang tot beschermde onderdelen blijft onafhankelijk daarvan
          afgedwongen op basis van de actuele sessie, profielstatus, middleware
          en server-side controles.
        </p>

        <h3>Onboarding</h3>

        <p>
          Onboarding bestaat uit een vaste meerstapsprocedure die direct volgt
          op een succesvolle registratie.
        </p>

        <ul>
          <li>Accountgegevens</li>
          <li>Verplichte keuze van het woonland</li>
          <li>Persoonlijke gegevens</li>
          <li>Lichaamsgegevens</li>
          <li>Doelen en berekeningen</li>
        </ul>

        <p>
          Iedere stap schrijft direct gegevens weg naar de database. Er bestaat
          geen tijdelijke onboarding-state buiten het profiel.
        </p>

        <p>
          Bij registratie worden de profielgegevens eerst als bevestigingsmetadata
          aan de auth-gebruiker gekoppeld. Na e-mailbevestiging maakt een
          geauthenticeerde, idempotente bootstrap het profiel aan. De actuele
          profielinhoud bepaalt daarna steeds welke onboardingstap nodig is, zodat
          de flow na vernieuwen of opnieuw inloggen veilig kan worden hervat.
        </p>

        <h3>Toegangscontrole</h3>

        <p>
          Toegangscontrole wordt centraal afgehandeld via middleware en
          server-side controles.
        </p>

        <p>
          Componenten mogen nooit verantwoordelijk zijn voor
          toegangscontrole.
        </p>

        <ul>
          <li>Niet-ingelogde gebruikers krijgen geen toegang tot protected routes.</li>
          <li>Ingelogde gebruikers worden automatisch doorgestuurd naar de juiste omgeving.</li>
          <li>
            Rolgebaseerde secties, zoals het Developer Handbook, gebruiken in
            proxy en serverlayout dezelfde centrale, fail-closed rolehelper.
          </li>
          <li>
            Die helper ontvangt uitsluitend <code>public.profiles.role</code>
            uit de eigen profielrow. Auth-metadata, clientstate en caller-input
            zijn geen roleauthority.
          </li>
          <li>
            De navigatie mag dezelfde helper gebruiken om een item te verbergen,
            maar blijft presentationeel; de serverlayout vormt een zelfstandige
            autorisatiegrens.
          </li>
          <li>
            Profielbootstrap accepteert alleen de expliciete onboardingvelden
            en nooit een caller-supplied role. De standaardrol wordt door het
            server- en databasecontract bepaald.
          </li>
        </ul>

        <div className="info-box">
          Routes en UI zijn nooit de bron van waarheid voor autorisatie. De
          actuele sessie, profielstatus en waar relevant de server-controlled
          profielrol bepalen de uiteindelijke toegang.
        </div>
      </section>

      <section>
        <h2>Routing</h2>

        <p>
          De routing volgt rechtstreeks uit de operationele status van de
          gebruiker.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-5">
          <pre className="whitespace-pre-wrap text-sm leading-7">
{`Niet ingelogd
      ↓
Homepage

Ingelogd + onvolledig profiel
      ↓
Onboarding

Ingelogd + volledig profiel
      ↓
Dashboard`}
          </pre>
        </div>

        <p>
          Hierdoor kan een gebruiker zich nooit langdurig in een ongeldige
          toestand bevinden. Het systeem corrigeert de navigatie automatisch.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Authenticatie en profielgegevens blijven strikt gescheiden.</li>

          <li>Profielstatus is de enige bron van waarheid voor onboarding.</li>

          <li>Onboarding schrijft direct persistente gegevens weg.</li>

          <li>Middleware bepaalt de toegangsrechten.</li>

          <li>Componenten bevatten geen autorisatielogica.</li>

          <li>Routing volgt altijd uit sessie en profielstatus.</li>
        </ul>

        <p>
          Door authenticatie, onboarding en toegangscontrole centraal te
          organiseren blijft de applicatie veilig, voorspelbaar en eenvoudig
          uitbreidbaar.
        </p>
      </section>

      <section>
        <h2>Afbakening</h2>

        <p>
          Dit document beschrijft uitsluitend de architectuur van
          authenticatie, onboarding en routing.
        </p>

        <p>
          Zaken zoals de visuele vormgeving van logincomponenten,
          gebruikersinteracties of toekomstige uitbreidingen zoals Single
          Sign-On vallen buiten de scope van dit hoofdstuk en worden behandeld
          in respectievelijk hoofdstuk 4 (UI-systeem) en hoofdstuk 5
          (Uitbreidbaarheid).
        </p>
      </section>
    </DocumentLayout>
  );
}
