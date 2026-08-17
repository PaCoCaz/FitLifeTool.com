import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30029() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.10 Legal & Consumer Compliance</h1>
        <HandbookMeta />
      </header>

      <section>
        <h2>Purpose</h2>

        <p>
          Dit document is de interne bron van waarheid en checklist voor de
          juridische en consumer-complianceonderwerpen die vóór commerciële
          lancering van FitLifeTool nog moeten worden uitgewerkt.
        </p>

        <p>
          Het document registreert open beslissingen, reviewpunten en de
          raakvlakken tussen productontwikkeling, abonnementen, accountbeheer
          en consumentenrechten. Het bevat geen definitieve consumententeksten.
        </p>

        <div className="info-box">
          Dit document is geen juridisch advies, Algemene Voorwaarden,
          Privacyverklaring of definitief refundbeleid. Definitieve juridische
          documenten en productteksten moeten waar nodig professioneel worden
          beoordeeld voordat FitLifeTool commercieel wordt gelanceerd.
        </div>
      </section>

      <section>
        <h2>General Terms &amp; Conditions</h2>

        <p>
          <strong>Status: TO DO vóór commerciële lancering.</strong>
        </p>

        <p>
          De Algemene Voorwaarden moeten later minimaal de volgende onderwerpen
          behandelen, zonder dat dit document de voorwaarden zelf formuleert:
        </p>

        <ul>
          <li>de dienstverlening van FitLifeTool</li>
          <li>het gebruikersaccount</li>
          <li>abonnementen en beschikbare abonnementsvormen</li>
          <li>prijzen en betaling</li>
          <li>looptijd en automatische verlenging</li>
          <li>opzegging</li>
          <li>definitieve accountverwijdering</li>
          <li>beperking of beëindiging van de dienstverlening</li>
          <li>toepasselijke wettelijke consumentenrechten</li>
        </ul>
      </section>

      <section>
        <h2>Privacy</h2>

        <p>
          <strong>Status: TO DO / afzonderlijk juridisch document.</strong>
        </p>

        <p>
          De uiteindelijke Privacyverklaring moet aansluiten op de daadwerkelijk
          geïmplementeerde FitLifeTool-datastromen. Daaronder vallen in ieder
          geval account- en gezondheidsgegevens, Supabase, Stripe en eventuele
          andere processors of subprocessors die vóór lancering worden gebruikt.
        </p>

        <p>
          Datacategorieën, doeleinden, grondslagen, bewaartermijnen,
          verwijdergedrag, internationale doorgifte en gebruikersrechten moeten
          worden vastgesteld op basis van de uiteindelijke productiearchitectuur.
          Dit Handbook-document is geen Privacyverklaring.
        </p>
      </section>

      <section>
        <h2>Subscription &amp; cancellation policy</h2>

        <p>
          Vóór commerciële lancering moet één helder en consistent beleid zijn
          vastgesteld voor:
        </p>

        <ul>
          <li>maand- en jaarabonnementen, indien beide worden aangeboden</li>
          <li>automatische verlenging en het moment van facturering</li>
          <li>opzegging en de gevolgen daarvan</li>
          <li>beheer via de Stripe Customer Portal</li>
          <li><code>cancel_at_period_end</code></li>
          <li>het moment waarop betaalde toegang daadwerkelijk eindigt</li>
          <li>het verschil tussen abonnement opzeggen en account verwijderen</li>
        </ul>

        <p>
          Een geplaatste cancel request is niet automatisch hetzelfde als een
          reeds beëindigd abonnement. Productteksten en technische statusweergave
          moeten dit onderscheid consequent gebruiken.
        </p>
      </section>

      <section>
        <h2>Right of withdrawal / consumer cancellation</h2>

        <p>
          De volgende onderwerpen zijn expliciete juridische reviewpunten:
        </p>

        <ul>
          <li>
            de toepasselijkheid van het EU- en Nederlandse herroepingsrecht op
            de aangeboden online of digitale diensten
          </li>
          <li>de relevante bedenktijd</li>
          <li>het starten van dienstverlening binnen de bedenktijd</li>
          <li>vereiste informatie en eventuele uitdrukkelijke toestemming</li>
          <li>eventueel vereiste online herroepingsfunctionaliteit</li>
          <li>gevolgen voor restitutie en reeds geleverde dienstverlening</li>
        </ul>

        <div className="info-box">
          Zonder juridische review wordt geen definitieve conclusie over
          toepasselijkheid, termijnen, toestemming, herroeping of restitutie als
          vaststaand FitLifeTool-beleid vastgelegd.
        </div>
      </section>

      <section>
        <h2>Refund policy</h2>

        <p>
          Vóór commerciële lancering is een definitief refundbeleid nodig dat
          aansluit op de abonnementsvormen, Stripe-flow, consumentenrechten en
          uiteindelijke juridische documenten.
        </p>

        <div className="info-box">
          <p>
            <strong>
              PROVISIONAL — legal review required before commercial launch
            </strong>
          </p>

          <p>
            Vrijwillige definitieve accountverwijdering tijdens een resterende
            betaalde periode geeft op zichzelf geen automatische pro-rata
            restitutie van reeds betaalde abonnementskosten. Eventuele
            toepasselijke wettelijke herroepings-, ontbindings- en
            restitutierechten blijven onverlet.
          </p>
        </div>
      </section>

      <section>
        <h2>Account deletion</h2>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Flow</th>
                <th>Betekenis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Subscription cancellation</td>
                <td>
                  Beëindigt het abonnement volgens de geldende billing- en
                  subscriptionregels.
                </td>
              </tr>
              <tr>
                <td>Statutory withdrawal/termination</td>
                <td>
                  Een afzonderlijke juridische flow waarop wettelijke regels
                  van toepassing kunnen zijn.
                </td>
              </tr>
              <tr>
                <td>Account deletion</td>
                <td>
                  Verwijdert het FitLifeTool-account en de user-data definitief
                  volgens de Account &amp; Security-architectuur.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          De huidige voorlopige productbeslissing voor de technische
          Account &amp; Security-uitwerking is:
        </p>

        <ul>
          <li>
            een actieve of anderszins blocking Stripe subscription verhindert
            account deletion
          </li>
          <li>
            de gebruiker beëindigt de subscription eerst via de bestaande
            billing- of Customer Portal-flow
          </li>
          <li>
            een terminal canceled subscription kan account deletion toestaan
          </li>
          <li>
            eventuele resterende FitLifeTool-toegang vervalt bij onmiddellijke
            account deletion
          </li>
          <li>
            vrijwillige account deletion leidt op zichzelf niet automatisch tot
            een pro-rata refund
          </li>
          <li>toepasselijke wettelijke rechten blijven onverlet</li>
        </ul>

        <p>
          De juridische onderdelen van deze voorlopige productbeslissing moeten
          vóór commerciële lancering worden beoordeeld. Zij mogen niet zonder die
          review als onveranderlijke technische invariant worden behandeld.
        </p>
      </section>

      <section>
        <h2>Checkout / purchase compliance</h2>

        <p>
          Controleer vóór commerciële lancering de volledige aankoopflow op:
        </p>

        <ul>
          <li>duidelijke en volledige prijsweergave</li>
          <li>belastingen, voor zover relevant</li>
          <li>abonnementsduur</li>
          <li>automatische verlenging</li>
          <li>cancellation information</li>
          <li>duidelijke betalingsverplichting</li>
          <li>beschikbaarheid van voorwaarden vóór aankoop</li>
          <li>beschikbaarheid van privacyinformatie</li>
          <li>eventueel vereiste withdrawal-informatie en toestemming</li>
          <li>teksten en gedrag van Stripe Checkout en Customer Portal</li>
        </ul>

        <p>
          De technische Stripe-configuratie wordt pas aangepast nadat de
          vereiste product- en juridische teksten zijn vastgesteld.
        </p>
      </section>

      <section>
        <h2>Languages</h2>

        <p>
          Vóór lancering moet worden bepaald welke juridische informatie en
          documenten beschikbaar moeten zijn in de ondersteunde talen:
        </p>

        <ul>
          <li>NL</li>
          <li>EN</li>
          <li>FR</li>
          <li>DE</li>
          <li>PL</li>
        </ul>

        <p>
          Juridische teksten worden pas vertaald nadat de brontekst inhoudelijk
          en juridisch is vastgesteld. Vertalingen moeten vervolgens op betekenis
          en consistentie worden gecontroleerd en niet alleen technisch worden
          toegevoegd.
        </p>
      </section>

      <section>
        <h2>Compliance decision log</h2>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Onderwerp</th>
                <th>Beslissing/status</th>
                <th>Review nodig</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-08-16</td>
                <td>Account deletion tijdens resterende betaalde periode</td>
                <td>
                  Voorlopig geen automatische pro-rata refund uitsluitend wegens
                  vrijwillige account deletion; resterende toegang vervalt bij
                  onmiddellijke deletion. Wettelijke rechten blijven onverlet.
                </td>
                <td>Ja — juridische review vóór commerciële lancering</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Pre-launch checklist</h2>

        <ul>
          <li>☐ Algemene Voorwaarden gereed</li>
          <li>☐ Privacyverklaring gereed</li>
          <li>☐ subscription/cancellation policy gecontroleerd</li>
          <li>☐ withdrawal- en herroepingsflow gecontroleerd</li>
          <li>☐ refundbeleid vastgesteld</li>
          <li>☐ account-deletionteksten gecontroleerd</li>
          <li>☐ Stripe Checkout gecontroleerd</li>
          <li>☐ Stripe Customer Portal gecontroleerd</li>
          <li>☐ juridische teksten en flows afgestemd op NL/EN/FR/DE/PL</li>
          <li>☐ professionele juridische review uitgevoerd waar nodig</li>
          <li>
            <strong>OPEN — Supabase Auth password minimum:</strong> live
            ingesteld op minimaal 10 tekens. Vóór productielancering controleren
            dat de applicatie en Supabase Auth dezelfde minimumlengte van minimaal
            10 tekens blijven afdwingen.
          </li>
          <li>
            <strong>OPEN — Supabase Auth leaked-password protection:</strong> deze
            functie is momenteel niet beschikbaar op het gebruikte Supabase
            Free-plan. Vóór productielancering opnieuw beoordelen en de status
            open houden totdat deze productiecontrole daadwerkelijk is uitgevoerd.
            Als het gekozen productieplan de functie ondersteunt, moet zij worden
            ingeschakeld en moeten registratie, password change en password
            recovery daarna opnieuw worden getest. Het ontbreken van deze functie
            op het huidige Free-plan is geen reden om een eigen of custom
            leaked-passwordmechanisme te bouwen. Dit is een technisch pre-launch
            security- en configuratiepunt en geen juridisch oordeel.
          </li>
          <li>☐ finale productteksten geïmplementeerd</li>
          <li>☐ relevante tests en smoke tests uitgevoerd</li>
        </ul>
      </section>

      <section>
        <h2>Relationship with Account &amp; Security</h2>

        <p>
          Account &amp; Security bouwt de technische mechanismen voor onder meer
          wachtwoordbeheer, recovery, fresh authentication, subscriptionguards
          en definitieve user-data cleanup.
        </p>

        <p>
          Dit document registreert de juridische en productmatige open punten die
          deze mechanismen beïnvloeden. Een voorlopige product- of juridische
          keuze wordt niet automatisch een permanente technische regel. Wanneer
          juridische review tot een andere uitkomst leidt, moeten producttekst,
          UX, Stripe-flow, tests en technische documentatie gezamenlijk worden
          herbeoordeeld.
        </p>
      </section>
    </DocumentLayout>
  );
}
