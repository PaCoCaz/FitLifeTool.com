// app/(app)/handbook/doc-l3-0021/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30021() {
    return (
      <DocumentLayout>

        <header>
          <h1>2.4 Authenticatie, Onboarding & Toegangscontrole</h1>
        </header>
  
        <section>
          <h2>Introductie: wat & waarom</h2>
  
          <p>
            Dit document beschrijft hoe authenticatie, onboarding en toegangscontrole
            binnen FitLifeTool architectonisch zijn ontworpen en geïmplementeerd.
          </p>
  
          <p>
            Deze onderdelen vormen samen geen losse UX-flow, maar één samenhangend
            systeem dat bepaalt:
          </p>
  
          <ul>
            <li>of een gebruiker toegang heeft tot de applicatie</li>
            <li>in welke status een profiel zich bevindt</li>
            <li>welke routes bereikbaar zijn</li>
            <li>wanneer een gebruiker als “operationeel” wordt beschouwd</li>
          </ul>
  
          <p>
            De beschreven regels zijn normatief en bepalend voor routing, middleware,
            UI-gedrag en dataconsistentie.
          </p>
        </section>
  
        <section>
          <h2>Conceptueel model: hoe het bedoeld is</h2>
  
          <p>
            Authenticatie, onboarding en toegangscontrole worden binnen FitLifeTool
            behandeld als een <strong>statusgedreven levenscyclus</strong>.
          </p>
  
          <p>
            Een gebruiker doorloopt conceptueel de volgende fasen:
          </p>
  
          <ol>
            <li>Niet-geauthenticeerd (publiek)</li>
            <li>Geauthenticeerd, maar onvolledig profiel</li>
            <li>Geauthenticeerd met volledig operationeel profiel</li>
          </ol>
  
          <p>
            Deze fasen worden niet bepaald door routes of UI, maar door de combinatie
            van:
          </p>
  
          <ul>
            <li>auth-state (Supabase session)</li>
            <li>profieldata in <code>profiles</code></li>
            <li>impliciete onboarding-voltooiing</li>
          </ul>
  
          <div className="info-box">
            Onboarding is geen aparte modus of applicatietoestand, maar een tijdelijk
            onvolledige profielstatus binnen het normale datamodel.
          </div>
        </section>
  
        <section>
          <h2>Implementatie: hoe het gebouwd is</h2>
  
          <h3>Authenticatie</h3>
  
          <p>
            Authenticatie wordt verzorgd door Supabase Auth. De applicatie beschouwt
            een gebruiker als ingelogd wanneer een geldige session beschikbaar is.
          </p>
  
          <p>
            De UI exposeert geen aparte loginpagina als primaire instroom. Inloggen
            en registreren verlopen via het header-menu.
          </p>
  
          <ul>
            <li><code>/login</code> is gedegradeerd tot technische fallback</li>
            <li><code>/register</code> bevat geen zelfstandige flow meer</li>
            <li>de homepage (<code>/</code>) fungeert als centrale instroom</li>
          </ul>
  
          <h3>Onboarding</h3>
  
          <p>
            Onboarding bestaat uit een vaste, meerstaps-flow die direct volgt op
            succesvolle registratie.
          </p>
  
          <p>
            Elke stap schrijft onmiddellijk persistente profieldata weg. Er bestaat
            geen “tijdelijke onboarding state” buiten de database.
          </p>
  
          <ul>
            <li>stap 1: accountgegevens</li>
            <li>stap 2: persoonlijke gegevens</li>
            <li>stap 3: lichaamsgegevens</li>
            <li>stap 4: doelen & berekeningen</li>
          </ul>
  
          <p>
            Na voltooiing van de laatste stap wordt het profiel beschouwd als volledig
            operationeel en wordt de gebruiker doorgestuurd naar het dashboard.
          </p>
  
          <h3>Toegangscontrole & redirects</h3>
  
          <p>
            Toegangscontrole wordt gecentraliseerd afgehandeld in middleware.
            Componenten bevatten geen autorisatie-logica.
          </p>
  
          <p>
            De middleware handhaaft onder andere:
          </p>
  
          <ul>
            <li>blokkeren van protected routes voor niet-ingelogde gebruikers</li>
            <li>automatische redirect van ingelogde gebruikers weg van publieke instroom</li>
            <li>rolgebaseerde toegang tot specifieke secties (bijv. handbook)</li>
          </ul>
  
          <div className="info-box">
            Routes worden nooit beschouwd als bron van waarheid voor status of rechten.
            Zij volgen uitsluitend uit auth- en profieldata.
          </div>
        </section>
  
        <section>
          <h2>Belangrijke beslissingen: waarom deze keuzes</h2>
  
          <ul>
            <li>
              <strong>Header-gedreven auth-flow</strong><br />
              Vermijdt duplicatie van login- en registratie-UX en houdt instroom
              consistent.
            </li>
  
            <li>
              <strong>Onboarding als datamodel-probleem</strong><br />
              Vereenvoudigt state management en voorkomt tijdelijke of onbetrouwbare
              client-side status.
            </li>
  
            <li>
              <strong>Middleware als enige autorisatie-laag</strong><br />
              Garandeert consistente toegang, ongeacht renderingcontext.
            </li>
  
            <li>
              <strong>Redirects als systeemgedrag</strong><br />
              Gebruikers kunnen geen “verkeerde” pagina bereiken; het systeem corrigeert
              dit automatisch.
            </li>
          </ul>
        </section>
  
        <section>
          <h2>Afbakening & expliciete niet-doelen</h2>
  
          <p>
            Dit document beschrijft niet:
          </p>
  
          <ul>
            <li>UI-styling van login- of registercomponenten</li>
            <li>UX-copy of micro-interacties</li>
            <li>toekomstige uitbreidingen zoals SSO of magic links</li>
          </ul>
  
          <p>
            Deze aspecten vallen onder respectievelijk H4 (UI-systeem) of H5
            (Uitbreidbaarheid).
          </p>
        </section>
      </DocumentLayout>
    );
  }
  