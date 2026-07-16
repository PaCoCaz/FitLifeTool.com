// app/(app)/handbook/doc-l3-0016/page.tsx

import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30016() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.2 Feature Flags & Gecontroleerde Uitrol</h1>
        <HandbookMeta />
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe nieuwe functionaliteit binnen
          FitLifeTool gecontroleerd wordt ontwikkeld, getest en beschikbaar
          gemaakt zonder bestaande gebruikerservaringen of data te beïnvloeden.
        </p>

        <p>
          Feature flags maken het mogelijk om nieuwe onderdelen veilig toe te
          voegen aan het systeem terwijl de bestaande applicatie stabiel blijft.
        </p>

        <p>
          Een feature flag is een tijdelijk technisch controlemechanisme en
          geen onderdeel van het permanente productmodel.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Nieuwe functionaliteit wordt binnen FitLifeTool toegevoegd zonder
          direct beschikbaar te worden voor iedere gebruiker.
        </p>

        <p>
          Een feature doorloopt normaal meerdere fasen:
        </p>

        <ul>
          <li>ontwikkeling binnen bestaande architectuur</li>

          <li>interne activatie voor testen</li>

          <li>beperkte beschikbaarheid voor geselecteerde gebruikers</li>

          <li>volledige uitrol</li>

          <li>verwijderen van de tijdelijke feature flag</li>
        </ul>

        <p>
          Na volledige uitrol verdwijnt de flag en wordt de functionaliteit
          onderdeel van het normale systeemgedrag.
        </p>
      </section>

      <section>
        <h2>Afbakening</h2>

        <p>
          Feature flags hebben één duidelijke verantwoordelijkheid:
          gecontroleerde technische uitrol.
        </p>

        <p>
          Ze worden bewust gescheiden van andere vormen van toegang.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Mechanisme</th>
                <th>Doel</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Feature flag</td>
                <td>
                  Tijdelijk activeren of verbergen van nieuwe functionaliteit.
                </td>
              </tr>

              <tr>
                <td>Rollen</td>
                <td>
                  Autorisatie en beheertoegang.
                </td>
              </tr>

              <tr>
                <td>Abonnementen</td>
                <td>
                  Producttoegang en feature-gating.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Hierdoor blijven technische uitrol, rechten en commerciële keuzes
          volledig gescheiden.
        </p>
      </section>

      <section>
        <h2>Abonnementen en rechten</h2>

        <p>
          Abonnementen bepalen welke productfeatures beschikbaar zijn voor een
          gebruiker. De canonical bron voor deze rechten is
          <code> get_user_plan_features()</code>.
        </p>

        <p>
          Deze functie vertaalt de actuele subscriptionstatus naar één
          feature- en limitobject. Clientcomponenten lezen geen Stripe-status
          en voeren geen eigen planvergelijkingen uit.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Onderdeel</th>
                <th>Rol</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>get_user_plan_features()</td>
                <td>
                  Enige canonical bron voor features en limieten.
                </td>
              </tr>

              <tr>
                <td>DashboardStore</td>
                <td>
                  Leest uitsluitend deze RPC voor client-side entitlements.
                </td>
              </tr>

              <tr>
                <td>Server-side API&apos;s</td>
                <td>
                  Controleren limieten opnieuw via dezelfde canonical bron.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Planrechten worden nooit afgeleid uit hardcoded plannamen in
          componenten. Componenten reageren alleen op ontvangen features en
          limieten.
        </p>
      </section>

      <section>
        <h2>Feature-gating</h2>

        <p>
          Feature-gating gebruikt expliciete featurevelden. Een voorbeeld is
          <code> has_advanced_search_filters</code>, waarmee geavanceerde
          zoekfilters worden vrijgegeven.
        </p>

        <ul>
          <li>
            Free-gebruikers zien een gelockte filterknop.
          </li>

          <li>
            Premium-, Pro- en Coach-gebruikers kunnen filters gebruiken.
          </li>

          <li>
            UI-componenten controleren featurevelden en geen planlabels.
          </li>

          <li>
            Server-side routes blijven verantwoordelijk voor harde limieten.
          </li>
        </ul>

        <p>
          Hierdoor kan het productmodel wijzigen zonder dat clientcomponenten
          opnieuw moeten worden ingericht.
        </p>
      </section>

      <section>
        <h2>Browser return refresh</h2>

        <p>
          Na terugkeer uit Stripe Checkout of Customer Portal wordt de
          client-side entitlementstate automatisch opnieuw opgehaald.
        </p>

        <p>
          DashboardStore gebruikt hiervoor de gedeelde browser-return helper.
          SubscriptionCard gebruikt dezelfde helper om de zichtbare
          abonnementsdetails te verversen.
        </p>

        <ul>
          <li>
            Er wordt geen polling gebruikt.
          </li>

          <li>
            Componenten voegen geen eigen losse browserlisteners toe.
          </li>

          <li>
            Terugkeer via Stripe-markers, pageshow, visibilitychange en focus
            wordt centraal afgehandeld.
          </li>

          <li>
            Gelijktijdige events worden gededupliceerd.
          </li>
        </ul>

        <p>
          Hierdoor worden feature-gated onderdelen direct bijgewerkt zonder
          volledige browserrefresh.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          Feature flags worden toegepast op duidelijke grenzen binnen de
          applicatie.
        </p>

        <ul>
          <li>nieuwe dashboardkaarten</li>

          <li>nieuwe gezondheidsdomeinen</li>

          <li>nieuwe scoremodellen</li>

          <li>nieuwe workflows</li>

          <li>experimentele visualisaties</li>
        </ul>

        <p>
          Nieuwe functionaliteit moet naast bestaande functionaliteit kunnen
          bestaan. Een flag mag bestaande data of bestaande berekeningen nooit
          ongeldig maken.
        </p>

        <p>
          Bijvoorbeeld: een nieuw scoremodel kan parallel worden getest,
          terwijl de bestaande FitLifeScore actief blijft.
        </p>
      </section>

      <section>
        <h2>Data-integriteit</h2>

        <p>
          Feature flags beïnvloeden nooit de betekenis van opgeslagen data.
        </p>

        <p>
          Brondata blijft onafhankelijk van actieve features:
        </p>

        <ul>
          <li>logs blijven geldig</li>

          <li>historische berekeningen blijven reproduceerbaar</li>

          <li>nieuwe features gebruiken bestaande patronen</li>

          <li>uitschakelen van een flag veroorzaakt geen dataverlies</li>
        </ul>

        <p>
          Hierdoor kunnen experimenten veilig plaatsvinden zonder risico voor
          de betrouwbaarheid van het platform.
        </p>
      </section>

      <section>
        <h2>Belangrijke ontwerpprincipes</h2>

        <ul>
          <li>Feature flags zijn tijdelijk.</li>

          <li>Flags bepalen geen gebruikersrechten.</li>

          <li>Nieuwe functionaliteit mag verborgen bestaan.</li>

          <li>Bestaande functionaliteit blijft leidend tijdens uitrol.</li>

          <li>Een verwijderde flag laat geen technische schuld achter.</li>

          <li>Data blijft onafhankelijk van actieve features.</li>

          <li>Abonnementsrechten komen uit één canonical entitlementbron.</li>
        </ul>

        <p>
          Door gecontroleerde uitrol als onderdeel van de architectuur te
          behandelen kan FitLifeTool blijven vernieuwen zonder stabiliteit,
          vertrouwen of dataconsistentie op te offeren.
        </p>
      </section>
    </DocumentLayout>
  );
}
