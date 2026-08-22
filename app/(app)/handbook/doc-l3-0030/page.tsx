import DocumentLayout from "../documentLayout";
import HandbookMeta from "../HandbookMeta";

export default function DocL30030() {
  return (
    <DocumentLayout>
      <header>
        <h1>5.11 Public Web, SEO &amp; Performance Architecture</h1>
        <HandbookMeta />
      </header>

      <section>
        <h2>1. Purpose</h2>

        <p>
          Dit document is de technische, SEO- en performancebron van waarheid
          voor alle publieke acquisitiepagina&apos;s van FitLifeTool. Daaronder
          vallen pagina&apos;s die organisch verkeer aantrekken, toekomstige
          gebruikers converteren, meertalig en afzonderlijk indexeerbaar zijn en
          snel laden op mobiele apparaten.
        </p>

        <p>
          SEO, performance en mobile-first zijn architectuurvoorwaarden vanaf
          de eerste implementatiefase. Zij zijn geen afsluitende polish. Dit
          document bevat geen definitieve marketingcopy, keywordstrategie,
          deploymentplan of vervanging van het UI-design system.
        </p>
      </section>

      <section>
        <h2>2. Public versus authenticated application architecture</h2>

        <h3>Public Web Layer</h3>

        <p>De Public Web Layer bedient:</p>

        <ul>
          <li>de homepage</li>
          <li>category- en hubpagina&apos;s</li>
          <li>artikelen en publieke educatieve content</li>
          <li>pricing- en andere publieke conversionpagina&apos;s</li>
        </ul>

        <p>Deze laag is:</p>

        <ul>
          <li>static of server-rendered waar mogelijk</li>
          <li>SEO-first, performance-first en CDN/cachevriendelijk</li>
          <li>voorzien van zo weinig mogelijk client-side JavaScript</li>
          <li>onafhankelijk van auth voor gewone publieke content</li>
          <li>vrij van onnodige dashboard- en authenticated-app-providers</li>
        </ul>

        <h3>Authenticated App Layer</h3>

        <p>
          De Authenticated App Layer bedient dashboard, user data, settings,
          billing, tracking en andere ingelogde functionaliteit. Deze laag mag
          de providers, dynamische data en securitycontroles laden die daarvoor
          werkelijk nodig zijn.
        </p>

        <p>
          Beide lagen delen alleen bewust gekozen componenten. Zij hebben
          verschillende performance- en securityverantwoordelijkheden. Het
          lichter maken van de Public Web Layer mag de beveiliging van de
          Authenticated App Layer nooit verzwakken.
        </p>
      </section>

      <section>
        <h2>3. Canonical locale routing</h2>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr>
                <th>Locale</th>
                <th>Canonical homepage</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>English</td><td><code>/</code></td></tr>
              <tr><td>Nederlands</td><td><code>/nl</code></td></tr>
              <tr><td>Français</td><td><code>/fr</code></td></tr>
              <tr><td>Deutsch</td><td><code>/de</code></td></tr>
              <tr><td>Polski</td><td><code>/pl</code></td></tr>
            </tbody>
          </table>
        </div>

        <ul>
          <li>De Engelse root is de canonical default en heeft geen locale-prefix.</li>
          <li>De andere ondersteunde talen gebruiken een locale-prefix.</li>
          <li>Iedere gepubliceerde taalvariant is afzonderlijk indexeerbaar.</li>
          <li>Iedere variant gebruikt een self-canonical.</li>
          <li>Equivalenten worden via wederkerige <code>hreflang</code> gekoppeld.</li>
          <li><code>x-default</code> wijst naar de Engelse equivalent, tenzij later expliciet anders wordt besloten.</li>
          <li>De canonical host is <code>https://fitlifetool.com</code>, zonder <code>www</code>.</li>
        </ul>
      </section>

      <section>
        <h2>4. Equivalent page mapping</h2>

        <p>
          Iedere publieke pagina krijgt een stabiele canonical page identity,
          aangeduid als <code>pageKey</code>. Locale-URL&apos;s worden expliciet
          aan die identity gekoppeld.
        </p>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr><th>Locale</th><th><code>pageKey = pricing</code></th></tr>
            </thead>
            <tbody>
              <tr><td>EN</td><td><code>/pricing</code></td></tr>
              <tr><td>NL</td><td><code>/nl/prijzen</code></td></tr>
              <tr><td>FR</td><td><code>/fr/prix</code></td></tr>
              <tr><td>DE</td><td><code>/de/preise</code></td></tr>
              <tr><td>PL</td><td><code>/pl/cennik</code></td></tr>
            </tbody>
          </table>
        </div>

        <ul>
          <li>Er wordt geen string-replacement routing gebruikt.</li>
          <li>Een expliciete locale-route registry is de canonical bron.</li>
          <li>Language switcher, sitemap, <code>hreflang</code> en interne links gebruiken dezelfde registry.</li>
          <li>De registry voorkomt dubbele locale/pathcombinaties.</li>
          <li>Ontbrekende vertalingen worden gecontroleerd behandeld.</li>
          <li>Een ontbrekende equivalent mag nooit stilzwijgend naar een willekeurige homepage leiden.</li>
        </ul>
      </section>

      <section>
        <h2>5. Mobile-first principle</h2>

        <div className="info-box">
          <strong>MANDATORY:</strong> Mobile-first is een verplicht
          kernprincipe en mobile performance is de primaire release gate voor
          de Public Web Layer.
        </div>

        <h3>Design</h3>
        <ul>
          <li>Layouts worden eerst voor mobiel ontworpen.</li>
          <li>Desktop is progressive enhancement.</li>
          <li>Contenthiërarchie en CTA-prioriteit worden op mobiel bepaald.</li>
          <li>Mobile navigation is primary.</li>
          <li>De language switcher is direct bruikbaar op mobiel.</li>
          <li>Forms en auth-UI zijn touch-friendly.</li>
        </ul>

        <h3>Interaction</h3>
        <ul>
          <li>Touch targets zijn voldoende groot.</li>
          <li>Kritieke interacties zijn niet hover-only.</li>
          <li>Kleine clickzones worden vermeden.</li>
          <li>Keyboard- en screenreadertoegankelijkheid blijven behouden.</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>Lighthouse mobile is de primaire synthetische benchmark.</li>
          <li>De mobile LCP-resource bepaalt de imagestrategie.</li>
          <li>Images worden responsive geleverd.</li>
          <li>Zware desktop-assets worden niet onnodig mobiel gedownload.</li>
          <li>Het client-JavaScriptbudget wordt primair op mobiel bewaakt.</li>
        </ul>

        <h3>Content</h3>
        <ul>
          <li>De belangrijkste waardepropositie en CTA staan op mobiel boven de vouw.</li>
          <li>Hero&apos;s duwen de kerninhoud niet onnodig omlaag.</li>
          <li>Tekst is scanbaar en headings zijn logisch en compact.</li>
          <li>Tabellen en andere inhoud blijven mobiel bruikbaar.</li>
        </ul>
      </section>

      <section>
        <h2>6. Core Web Vitals contract</h2>

        <div className="table-scroll">
          <table className="label-column">
            <thead>
              <tr><th>Metric</th><th>Google good threshold</th><th>Intern FitLifeTool-doel</th></tr>
            </thead>
            <tbody>
              <tr><td>LCP</td><td>≤ 2,5 seconden</td><td>≤ 2,0 seconden</td></tr>
              <tr><td>INP</td><td>≤ 200 milliseconden</td><td>≤ 150 milliseconden</td></tr>
              <tr><td>CLS</td><td>≤ 0,10</td><td>≤ 0,05</td></tr>
            </tbody>
          </table>
        </div>

        <p>
          De interne doelen zijn FitLifeTool-engineeringdoelen en geen officiële
          Google-thresholds. Mobile is leidend voor acceptatie. Metingen worden
          beoordeeld op representatieve routes en later, wanneer beschikbaar,
          op field data op het 75e percentiel.
        </p>
      </section>

      <section>
        <h2>7. Performance budgets</h2>

        <ul>
          <li>Initial client JavaScript blijft zo laag mogelijk.</li>
          <li>De richtwaarde voor compressed initial client JavaScript is ≤ 100 KB waar realistisch.</li>
          <li>De volledige authenticated-app-runtime wordt niet op publieke pagina&apos;s geladen.</li>
          <li>De eerste publieke release heeft bij voorkeur 0 niet-essentiële third-party scripts.</li>
          <li>De hero- of LCP-image wordt agressief en visueel gecontroleerd geoptimaliseerd.</li>
          <li>Images krijgen responsive varianten.</li>
          <li>Fontkosten blijven minimaal.</li>
          <li>Ontbrekende image dimensions mogen geen layout shift veroorzaken.</li>
          <li>Onnodige clienthydratie wordt vermeden.</li>
        </ul>

        <p>
          Deze budgetten zijn voorlopige engineering- en releasecriteria. Zij
          worden met production builds, echte assets en meetdata gevalideerd en
          mogen alleen na een expliciet architectuurbesluit worden verruimd.
        </p>
      </section>

      <section>
        <h2>8. Rendering strategy</h2>

        <ul>
          <li>Publieke pagina&apos;s zijn bij voorkeur static/server-rendered.</li>
          <li>Locale-content wordt waar mogelijk build-time geladen.</li>
          <li>Metadata wordt server-side of build-time gegenereerd.</li>
          <li>Client-side locale switching is niet de primaire routingmethode.</li>
          <li>Gewone publieke content vereist geen request-time auth-call.</li>
          <li>Client islands worden alleen gebruikt waar interactie dat vereist.</li>
          <li>Publieke content en H1 moeten zonder client-JavaScript in de initiële HTML staan.</li>
        </ul>

        <p>
          De Public Web Foundation gebruikt afzonderlijke App Router-rootlayouts.
          De Engelse homepage op <code>/</code> wordt statisch gegenereerd en de
          geprefixte homepages op <code>/nl</code>, <code>/fr</code>,
          <code>/de</code> en <code>/pl</code> hebben ieder een expliciete statische
          locale-rootroute. Iedere publieke rootlayout levert de juiste initiële
          <code> html lang</code> zonder request-time headers of client-side
          documentmutatie. Request-afhankelijke locale-overname blijft beperkt
          tot app-, auth-, onboarding- en recoveryroutes die daarvoor dynamisch
          mogen renderen.
        </p>
      </section>

      <section>
        <h2>9. Public client-islands policy</h2>

        <p>Geschikte geïsoleerde client islands zijn onder andere:</p>

        <ul>
          <li>een interactieve language switcher wanneer serverlinks niet volstaan</li>
          <li>een lazy-loaded login- of registratiemodal</li>
          <li>een accordion</li>
          <li>een beperkte interactieve CTA</li>
          <li>een compact mobiel navigatiemenu</li>
        </ul>

        <p>
          Een client island mag niet veroorzaken dat de volledige publieke
          pagina client-rendered wordt of dat app-, dashboard- en authcode zonder
          gebruikersintentie wordt geladen.
        </p>
      </section>

      <section>
        <h2>10. Auth/proxy performance</h2>

        <p>
          De audit heeft vastgesteld dat publieke routes momenteel onnodige
          auth- en runtimeoverhead kunnen dragen. Publieke SEO-routes mogen niet
          standaard een <code>auth.getUser()</code>-network check uitvoeren
          wanneer die functioneel niet nodig is.
        </p>

        <p>
          De proxy/middleware matcher wordt vóór definitieve performanceacceptatie
          expliciet geoptimaliseerd. Beschermde dashboard-, settings-, billing-,
          handbook- en onboardingroutes behouden hun server-side beveiliging.
          Muterende en gevoelige API-routes blijven zelf autorisatie afdwingen.
        </p>

        <p>
          <strong>Status:</strong> de Fase 1-routegrens is geïmplementeerd:
          gewone publieke homepages verlaten de proxy vóór de Supabase-client
          wordt aangemaakt, terwijl beschermde routes server-side beveiligd
          blijven. Production performance-, Lighthouse- en volledige
          routevalidatie blijven open vóór publieke release.
        </p>
      </section>

      <section>
        <h2>11. Image performance contract</h2>

        <ul>
          <li>Gebruik <code>next/image</code> waar passend.</li>
          <li>Images krijgen vaste of intrinsieke dimensions.</li>
          <li><code>sizes</code> correspondeert met het echte responsive grid.</li>
          <li>Responsive varianten en moderne formaten worden gebruikt waar beschikbaar.</li>
          <li>De werkelijke LCP-image wordt niet lazy-loaded.</li>
          <li>Below-the-fold images worden wel lazy-loaded.</li>
          <li>Alt-tekst is inhoudelijk correct en locale-specifiek.</li>
          <li>Decoratieve images krijgen een lege alt-tekst.</li>
          <li>Multi-megabyte bronassets worden niet ongeoptimaliseerd uitgeleverd.</li>
          <li>Een vaste aspect ratio voorkomt CLS.</li>
        </ul>

        <div className="info-box">
          De huidige homepage-assets zijn substantieel zwaar. Image optimization
          en een echte mobile waterfallcontrole zijn verplicht vóór release.
        </div>
      </section>

      <section>
        <h2>12. Font performance</h2>

        <ul>
          <li>Het systeemfont blijft voorlopig behouden.</li>
          <li>Externe fontrequests worden niet zonder budgetbesluit toegevoegd.</li>
          <li>Een later custom font gebruikt bij voorkeur <code>next/font</code>.</li>
          <li>Weights en subsets blijven beperkt tot wat zichtbaar nodig is.</li>
          <li>Preload wordt selectief gebruikt.</li>
          <li>Fontkeuzes mogen CLS en LCP niet onnodig verslechteren.</li>
        </ul>
      </section>

      <section>
        <h2>13. Third-party scripts</h2>

        <p>
          De eerste publieke release gebruikt bij voorkeur 0 niet-essentiële
          third-party scripts. Analytics-, consent-, experiment- en andere
          tooling wordt alleen toegevoegd na een expliciete privacy- en
          performancebeoordeling. Scriptloading staat nooit automatisch boven
          de vastgestelde Core Web Vitals- en JavaScriptbudgetten.
        </p>
      </section>

      <section>
        <h2>14. SEO content principle</h2>

        <ul>
          <li>Definitieve SEO-copy volgt pas na echte locale-specifieke keyword- en SERP-research.</li>
          <li>Nederlandse SEO-copy wordt niet letterlijk naar andere talen vertaald.</li>
          <li>Zoekvolumes worden nooit verzonnen.</li>
          <li>Zoekintentie en keywordfocus worden per locale onafhankelijk bepaald.</li>
          <li>Content is people-first en bedient één duidelijke hoofdintentie.</li>
          <li>Keyword stuffing en generieke AI-vulling zijn niet toegestaan.</li>
          <li>Native of aantoonbaar locale-deskundige review is vereist.</li>
        </ul>
      </section>

      <section>
        <h2>15. Health-content quality</h2>

        <ul>
          <li>Concrete gezondheidsclaims zijn zorgvuldig, controleerbaar en herleidbaar.</li>
          <li>Voor health- en nutrition-content is een bron- en reviewbeleid vereist.</li>
          <li>Dunne of onbeoordeelde health-content wordt niet als sterke indexeerbare SEO-landingspagina gepubliceerd.</li>
          <li>FitLifeTool doet geen medische claims waar het geen medische dienst levert.</li>
          <li>Expertise-, auteur-, reviewer-, bron- en revisiesignalen worden expliciet toegevoegd waar passend.</li>
          <li>Formules, tabellen en concrete ranges vermelden hun methode en beperkingen.</li>
        </ul>

        <p><strong>Status: OPEN content-governance item vóór indexering van health-content.</strong></p>
      </section>

      <section>
        <h2>16. SEO metadata contract</h2>

        <p>Iedere indexeerbare publieke pagina heeft:</p>

        <ul>
          <li>een unieke title</li>
          <li>een unieke meta description</li>
          <li>een self-canonical</li>
          <li>locale alternates en wederkerige <code>hreflang</code></li>
          <li>een correcte <code>x-default</code></li>
          <li>een locale-correcte OG title en description</li>
          <li>een passende OG image</li>
          <li>een correct breadcrumblabel</li>
          <li>exact één duidelijke H1</li>
          <li>de juiste initiële <code>html lang</code></li>
        </ul>

        <p>
          Metadata wordt per pageKey en locale ontworpen. Een generieke template
          mag niet leiden tot tientallen inhoudelijk identieke titles of
          descriptions.
        </p>
      </section>

      <section>
        <h2>17. Internal linking</h2>

        <ul>
          <li>Hubpagina&apos;s linken naar hun gepubliceerde artikelen.</li>
          <li>Artikelen linken terug naar hun hub.</li>
          <li>Artikelen linken naar inhoudelijk verwante artikelen.</li>
          <li>Educatieve content linkt naar een relevante product- of signup-CTA.</li>
          <li>Breadcrumbs en locale-equivalenten komen uit de route registry.</li>
          <li>Anchors zijn natuurlijk en beschrijven de bestemming.</li>
          <li>SEO-spam anchors en links naar ongepubliceerde routes zijn niet toegestaan.</li>
        </ul>
      </section>

      <section>
        <h2>18. Hub-and-spoke model</h2>

        <p>De voorlopige topical-authorityclusters zijn:</p>

        <ul>
          <li>Nutrition</li>
          <li>Activity</li>
          <li>Hydration</li>
          <li>Weight</li>
          <li>Recovery</li>
          <li>Lifestyle</li>
          <li>Health/BMI</li>
        </ul>

        <p>
          Ieder cluster wordt als hub-and-spoke-structuur ontwikkeld. Iedere
          pagina krijgt één dominante zoekintentie. Overlap tussen hubs,
          artikelen, calculators en commerciële productpagina&apos;s wordt vóór
          publicatie op cannibalization beoordeeld.
        </p>
      </section>

      <section>
        <h2>19. Language switcher</h2>

        <ul>
          <li>Iedere publieke pagina linkt direct naar beschikbare equivalente pagina&apos;s.</li>
          <li>De links zijn echte crawlbare anchors.</li>
          <li>De actieve taal is duidelijk zichtbaar.</li>
          <li>De bediening is mobile-first, touch-friendly en toegankelijk.</li>
          <li>Een bestaande equivalent valt nooit terug naar de homepage.</li>
          <li>De pageKey-registry is de enige bron voor equivalenten.</li>
          <li>Ontbrekende vertalingen worden niet als bestaande equivalent getoond.</li>
        </ul>
      </section>

      <section>
        <h2>20. Route slug policy</h2>

        <p>
          Niet-Engelse publieke pagina&apos;s gebruiken bij voorkeur
          locale-specifieke slugs. De mapping staat expliciet in de registry en
          wordt niet via automatische string replacement of woord-voor-woord
          vertaling afgeleid. Concrete slugs worden later per pagina inhoudelijk
          en SEO-technisch bepaald.
        </p>
      </section>

      <section>
        <h2>21. Sitemap and robots</h2>

        <ul>
          <li>De sitemap wordt uit de route registry gegenereerd.</li>
          <li>Alleen indexeerbare locale-equivalenten worden opgenomen.</li>
          <li>Auth-, dashboard-, settings-, handbook-, API- en andere private routes worden niet geïndexeerd.</li>
          <li>Robotsbeleid wordt expliciet vastgelegd.</li>
          <li><code>hreflang</code> in metadata en sitemap blijft consistent.</li>
          <li>Search Console wordt vóór publieke lancering geconfigureerd en gevalideerd.</li>
        </ul>
      </section>

      <section>
        <h2>22. Thin-content policy</h2>

        <p>
          Een publieke indexeerbare SEO-pagina wordt nooit uitsluitend gemaakt
          om een URL te vullen. Een dunne pagina krijgt eerst inhoud die de
          zoekintentie daadwerkelijk beantwoordt, of blijft non-indexable of
          unpublished. Kwaliteit gaat boven het aantal pagina&apos;s.
        </p>
      </section>

      <section>
        <h2>23. Conversion and SEO</h2>

        <p>Publieke pagina&apos;s moeten tegelijk:</p>

        <ul>
          <li>de zoekintentie volledig en betrouwbaar beantwoorden</li>
          <li>de relevante productwaarde tonen</li>
          <li>een duidelijke, passende CTA hebben</li>
          <li>conversionelementen gebruiken zonder LCP, CLS of INP significant te verslechteren</li>
        </ul>

        <p>
          Fake social proof is niet toegestaan. Testimonials, aantallen,
          endorsements en andere bewijssignalen worden alleen gebruikt wanneer
          zij echt, actueel en controleerbaar zijn.
        </p>
      </section>

      <section>
        <h2>24. Performance test strategy</h2>

        <ol>
          <li>voer een production build uit</li>
          <li>controleer routeclassificatie en bundles</li>
          <li>voer Lighthouse mobile uit als primaire synthetische benchmark</li>
          <li>voer Lighthouse desktop uit</li>
          <li>controleer LCP, INP, CLS en hun concrete oorzaken</li>
          <li>meet een echte Vercel Preview</li>
          <li>verzamel later production field data</li>
          <li>controleer Search Console Core Web Vitals na launch</li>
        </ol>

        <p>
          Mobile is de primaire release gate. Een desktopresultaat compenseert
          geen onvoldoende mobiele ervaring.
        </p>
      </section>

      <section>
        <h2>25. SEO test strategy</h2>

        <p>Automatische en handmatige controles omvatten minimaal:</p>

        <ul>
          <li>unieke titles en descriptions</li>
          <li>exact één H1</li>
          <li>exact één self-canonical</li>
          <li>wederkerige <code>hreflang</code></li>
          <li>correcte <code>x-default</code> en <code>html lang</code></li>
          <li>geldige sitemap en robotsregels</li>
          <li>geen gebroken interne links</li>
          <li>geen mixed-language UI</li>
          <li>structured-data-validatie</li>
          <li>eenduidige route- en pageKey-mapping</li>
          <li>geen private routes in de publieke sitemap</li>
        </ul>
      </section>

      <section>
        <h2>26. Pre-launch checklist</h2>

        <h3>SEO</h3>
        <ul>
          <li>☐ locale keyword research uitgevoerd</li>
          <li>☐ search intent vastgesteld</li>
          <li>☐ final copy inhoudelijk en native reviewed</li>
          <li>☐ titles en descriptions uniek</li>
          <li>☐ canonicals, <code>hreflang</code> en <code>x-default</code> correct</li>
          <li>☐ sitemap en robots correct</li>
          <li>☐ interne links gecontroleerd en broken links opgelost</li>
          <li>☐ structured data gevalideerd</li>
          <li>☐ Search Console ingericht</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>☐ Lighthouse mobile uitgevoerd</li>
          <li>☐ Lighthouse desktop uitgevoerd</li>
          <li>☐ interne LCP-, INP- en CLS-targets gehaald</li>
          <li>☐ JavaScript-, image- en fontbudget gecontroleerd</li>
          <li>☐ third-party scripts beoordeeld</li>
          <li>☐ proxy/auth-overhead gecontroleerd</li>
          <li>☐ responsive en mobile UX gecontroleerd</li>
        </ul>

        <h3>Mobile</h3>
        <ul>
          <li>☐ mobile-first layout review afgerond</li>
          <li>☐ touch targets gecontroleerd</li>
          <li>☐ mobile navigation en language switching gecontroleerd</li>
          <li>☐ mobiele forms en auth-UI gecontroleerd</li>
          <li>☐ geen horizontale overflow</li>
          <li>☐ responsive images gecontroleerd</li>
          <li>☐ CTA-hiërarchie gecontroleerd</li>
          <li>☐ meerdere device widths getest</li>
        </ul>
      </section>

      <section>
        <h2>27. Implementation phases</h2>

        <ol>
          <li>public/web/SEO contract</li>
          <li>locale/page registry</li>
          <li>public versus authenticated-app architectuursplit</li>
          <li>mobile-first lightweight public renderer</li>
          <li>proxy/auth-overhead reduction</li>
          <li>English reference homepage</li>
          <li>baseline performance measurement</li>
          <li>locale keyword- en contentbriefs</li>
          <li>NL/FR/DE/PL-homepagevarianten</li>
          <li>metadata, canonical en <code>hreflang</code></li>
          <li>equivalent-page language switcher</li>
          <li>auth locale inheritance</li>
          <li>sitemap, robots en structured data</li>
          <li>contenthubs en artikelen</li>
          <li>final SEO-, mobile- en performancevalidatie</li>
        </ol>

        <p>
          Definitieve SEO-copy wordt niet ingevuld vóór locale-specifieke
          keyword- en SERP-research. Iedere fase bewaakt mobile, SEO en
          performance binnen haar eigen acceptancecriteria.
        </p>
      </section>

      <section>
        <h2>28. Owner decisions</h2>

        <h3>Vastgestelde uitgangspunten</h3>
        <ul>
          <li>canonical host zonder <code>www</code></li>
          <li>English root op <code>/</code></li>
          <li>locale-prefixes voor NL, FR, DE en PL</li>
          <li>locale-specifieke slugs</li>
          <li>public/app architecture split toegestaan</li>
          <li>mobile-first is mandatory</li>
          <li>mobile performance is de primaire release gate</li>
          <li>het systeemfont blijft voorlopig behouden</li>
          <li>bij de eerste release bij voorkeur 0 niet-essentiële third-party scripts</li>
          <li>thin content wordt niet geïndexeerd</li>
          <li>healthclaims vereisen review</li>
          <li>alleen echte social proof</li>
          <li>performancebudgetten gelden als releasecriteria</li>
        </ul>

        <h3>Open beslissingen</h3>
        <ul>
          <li>analyticsplatform</li>
          <li>cookie- en consentstack</li>
          <li>OG-assetstrategie</li>
          <li>exacte keywordfocus per locale</li>
          <li>vereiste contentdiepte per cluster</li>
          <li>health-reviewworkflow, reviewers en bronnenhiërarchie</li>
        </ul>
      </section>
    </DocumentLayout>
  );
}
