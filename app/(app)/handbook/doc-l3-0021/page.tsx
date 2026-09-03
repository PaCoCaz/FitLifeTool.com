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
{`Homepage
      ↓
Header Login / Registratie
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
          <li>De homepage vormt de primaire instroom.</li>
          <li>Login en registratie verlopen via het header-menu.</li>
          <li><code>/login</code> fungeert uitsluitend als technische fallback.</li>
          <li><code>/register</code> bevat geen zelfstandige gebruikersflow.</li>
        </ul>

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
          De tussenstappen schrijven hervatbare profielgegevens direct naar de
          database. Er bestaat geen tijdelijke onboarding-state buiten het
          bestaande datamodel.
        </p>

        <p>
          De laatste onboardingstap vormt één server-owned transactionele
          grens. De actieve doelperiode, de definitieve profielwaarden en alle
          daarvan afgeleide doelen worden atomair vastgelegd. Pas nadat alle
          onderdelen succesvol zijn voltooid, kan de bestaande server-side
          onboardingstatus als compleet worden waargenomen. Een fout rolt de
          volledige finalisatie terug en houdt de gebruiker fail-closed in de
          onboarding.
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
          <li>Rolgebaseerde secties, zoals het Developer Handbook, worden server-side gecontroleerd.</li>
        </ul>

        <div className="info-box">
          Routes zijn nooit de bron van waarheid voor autorisatie. De actuele
          sessie en profielstatus bepalen altijd de uiteindelijke toegang.
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

          <li>
            Onboarding schrijft hervatbare gegevens persistent weg en rondt de
            laatste profiel-, doel- en berekeningswijzigingen atomair af.
          </li>

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
