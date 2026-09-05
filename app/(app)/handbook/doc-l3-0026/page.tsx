import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30026() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.8 Codex Workflow & AI Runbook</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit runbook beschrijft hoe Codex en andere AI-assistenten veilig aan
          FitLifeTool werken. De goedgekeurde scope, bestaande architectuur en
          actuele projectdocumentatie blijven altijd leidend.
        </p>
      </section>

      <section>
        <h2>Capaciteits- en budgetrouting</h2>

        <p>
          Kies voor iedere gate het lichtste capability- en reasoningniveau dat de
          opdracht betrouwbaar kan uitvoeren. Permanente repositorypolicy gebruikt
          capabilityklassen en geen specifieke modelnamen, prijzen, gebruikslimieten
          of aannames over actuele modelbeschikbaarheid. De actuele vertaling van
          capabilityklassen naar beschikbare modellen hoort in de operationele
          taak- of runinstructies.
        </p>

        <h3>LIGHT / MECHANICAL</h3>

        <p>
          Gebruik deze klasse voor deterministisch of hoofdzakelijk mechanisch werk,
          waaronder repositorycheckpoints, inventarisatie, exacte scopevergelijking,
          afgebakende read-only inspectie, uitvoering van vastgelegde validaties,
          staging, commit, push, post-pushcontrole, eenvoudige releasemetadata en
          beperkte productiesmoke zonder semantische diagnose.
        </p>

        <p>
          Wanneer een reeds vastgelegde Git-gate een onverwacht bestand, afwijkende
          commit, divergentie, conflict of ander semantisch probleem aantreft, wordt
          de mechanische actie gestopt en eerst naar een passende hogere
          capabilityklasse geëscaleerd. Lichtgewicht routing verzwakt nooit de
          bestaande toestemmings- en releasegates.
        </p>

        <h3>STANDARD ENGINEERING</h3>

        <p>
          Gebruik deze klasse wanneer semantisch repositorybegrip nodig is,
          waaronder architectuurinterpretatie, contract- en implementatieontwerp,
          normale code-implementatie, testontwerp, foutdiagnose, Git-reconciliatie
          met inhoudelijk oordeel en securitygevoelige implementatie waarvan het
          probleem en de grenzen al voldoende bekend zijn.
        </p>

        <h3>ADVERSARIAL / HIGH-RISK</h3>

        <p>
          Reserveer deze klasse voor moeilijke of impactvolle analyse, waaronder
          onafhankelijke adversarial securityreviews, concurrency en race
          conditions, authorization- en privilegegrenzen, identitytransities,
          atomiciteit en transactionele garanties, ambigue mutation outcomes,
          onomkeerbare state transitions, complexe billing/security-interacties en
          onopgeloste bevindingen met hoge severity. Niet iedere securitygerelateerde
          taak vereist automatisch deze hoogste klasse.
        </p>

        <h3>Escalatie en terugschakeling</h3>

        <p>
          De normale escalatierichting is <code>LIGHT / MECHANICAL</code> naar
          <code> STANDARD ENGINEERING</code> naar
          <code> ADVERSARIAL / HIGH-RISK</code>. Escaleer zodra de huidige klasse
          semantische of securitycomplexiteit niet betrouwbaar kan oplossen. Herhaal
          niet steeds dezelfde laag-capabele aanpak wanneer het probleem aantoonbaar
          een hogere klasse vereist. Schakel terug wanneer het werk opnieuw een
          vastgelegde mechanische gate betreft.
        </p>

        <h3>Validatie-economie</h3>

        <p>
          Reeds GREEN validatiebewijs blijft geldig zolang een latere wijziging dat
          bewijs niet kan ontkrachten. Bepaal na iedere correctie eerst welke eerder
          gevalideerde paden werkelijk zijn geraakt en voer vervolgens de kleinste
          validatieset uit die deze paden betrouwbaar dekt. Brede tests en builds
          blijven verplicht wanneer Handbook 5.9 dat vereist of wanneer de wijziging
          breder bewijs kan hebben geïnvalideerd. Efficiëntie mag nooit worden
          gebruikt om werkelijk geïnvalideerde verplichte validatie over te slaan.
        </p>

        <h3>Onafhankelijke review</h3>

        <p>
          Securitygevoelige implementatie krijgt onafhankelijke review wanneer het
          risico dat rechtvaardigt. De definitieve reviewer steunt bij voorkeur niet
          uitsluitend op dezelfde reasoningcontext die de implementatie heeft
          opgesteld. Dit is contextuele onafhankelijkheid; het runbook claimt geen
          modelonafhankelijkheid die de uitvoeringsomgeving niet kan garanderen.
        </p>

        <p>
          Bevindingen leiden normaal tot gerichte correcties en een gerichte
          re-review van die bevindingen en het nieuw geraakte oppervlak. Herhaal een
          volledige review alleen wanneer de correcties het bredere reviewbewijs
          materieel kunnen hebben geïnvalideerd.
        </p>

        <h3>Operationeel dashboardbewijs</h3>

        <p>
          Direct door de gebruiker waargenomen bewijs uit operationele dashboards
          zoals Vercel, Supabase of Stripe hoeft niet automatisch via aanvullende
          remote metadatarequests te worden gedupliceerd wanneer het bewijs het
          vereiste checkpoint rechtstreeks aantoont, er geen concrete inconsistentie
          bestaat en repository- of securitybeleid geen onafhankelijke
          machineverificatie vereist. Technisch applicatie-, HTTP-, API- en
          securitygedrag wordt waar passend afzonderlijk gecontroleerd.
        </p>

        <h3>Afgebakende read-only gates</h3>

        <p>
          Duidelijk opgesomde externe read-only controles mogen, waar beleid en
          uitvoeringsomgeving dit toestaan, als één begrensde gate worden
          geautoriseerd. Splits zo&apos;n reeds geautoriseerde gate niet onnodig op
          in afzonderlijke toestemmingsvragen voor iedere request. De toegestane
          doelen en handelingen blijven expliciet begrensd; nieuwe doelen of acties
          buiten de gate vereisen waar toepasselijk nieuwe toestemming.
        </p>

        <p>
          Read-only toestemming geeft nooit toestemming voor mutaties. Externe of
          live wijzigingen, waaronder configuratie-, data-, deployment- en
          accountmutaties, blijven afzonderlijk gecontroleerd en mogen niet uit een
          read-only gate worden afgeleid.
        </p>
      </section>

      <section>
        <h2>Fase A — Analyse</h2>

        <ul>
          <li>Begin read-only.</li>
          <li>Inspecteer alle relevante code en documentatie.</li>
          <li>Benoem de concrete scope, aannames en risico&apos;s.</li>
          <li>Wijzig nog niets.</li>
          <li>Doe een concreet, afgebakend voorstel.</li>
        </ul>

        <p>
          Conflicten tussen implementatie en het handbook worden eerst
          gerapporteerd. Een open architectuurvraag wordt niet zelfstandig
          opgelost.
        </p>
      </section>

      <section>
        <h2>Fase B — Implementatie</h2>

        <ul>
          <li>Pas uitsluitend de expliciet goedgekeurde scope aan.</li>
          <li>Neem geen onverwachte bestanden mee.</li>
          <li>
            Voer geen database-, infrastructuur- of productieaanpassing uit
            buiten een expliciete opdracht.
          </li>
          <li>
            Gebruik tijdelijke scripts waar mogelijk in een tijdelijke map.
          </li>
          <li>
            Verwijder tijdelijke meet-, inspectie- en debugcode na gebruik.
          </li>
          <li>Toon of log nooit secrets, tokens, cookies of wachtwoorden.</li>
        </ul>
      </section>

      <section>
        <h2>Fase C — Validatie</h2>

        <ul>
          <li>Voer relevante gerichte tests uit.</li>
          <li>Voer de volledige tests uit waar dat praktisch is.</li>
          <li>Controleer TypeScript, ESLint en de productiebuild.</li>
          <li>Controleer de diff en alle gewijzigde bestanden.</li>
          <li>Controleer staged bestanden afzonderlijk vóór een commit.</li>
          <li>Controleer de werkboom en rapporteer waarschuwingen.</li>
        </ul>

        <p>
          Een waarschuwing wordt niet stilzwijgend genegeerd. Rapporteer of de
          waarschuwing nieuw is of al vóór de wijziging bestond.
        </p>
      </section>

      <section>
        <h2>Fase D — Git en deployment</h2>

        <p>Vraag expliciete toestemming vóór:</p>

        <ul>
          <li>een branch checkout als onderdeel van een release</li>
          <li>een merge</li>
          <li>een push</li>
          <li>een productiedeployment</li>
          <li>een rollback</li>
          <li>een database- of Supabase-wijziging</li>
        </ul>

        <p>
          Gebruik geen force push en maak geen onverwachte commits. Na iedere
          risicodragende stap wordt gerapporteerd:
        </p>

        <ul>
          <li>wat is uitgevoerd</li>
          <li>wat is veranderd</li>
          <li>de huidige branch en commit</li>
          <li>de actuele werkboomstatus</li>
          <li>eventuele fouten of waarschuwingen</li>
        </ul>
      </section>

      <section>
        <h2>Productiedata en testdata</h2>

        <ul>
          <li>
            Pas geen productiegegevens aan voor tests zonder expliciete
            toestemming.
          </li>
          <li>
            Herstel testdata wanneer bestaande functionaliteit dit veilig
            ondersteunt.
          </li>
          <li>
            Gebruik geen directe databasehandeling om testdata te herstellen
            zonder expliciete toestemming.
          </li>
        </ul>
      </section>
    </DocumentLayout>
  );
}
