// app/handbook/doc-l3-0016/page.tsx

import DocumentPager from "../documentPager";

export default function DocL30016() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            5.2 - Feature flags & Uitrol
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft hoe nieuwe functionaliteit
            binnen FitLifeTool gecontroleerd wordt uitgerold
            met behulp van feature flags.
          </p>
  
          <p className="text-gray-700">
            Het doel is risico beperken, regressies voorkomen
            en nieuwe features veilig testen in productie,
            zonder impact op bestaande gebruikers.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            Feature flags worden gezien als
            <strong> tijdelijke controlemechanismen</strong>,
            niet als permanente configuratie.
          </p>
  
          <p className="text-gray-700">
            Een feature doorloopt meerdere fasen:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>ontwikkeling (uitgeschakeld)</li>
            <li>interne test (beperkte toegang)</li>
            <li>gradual rollout (subset van gebruikers)</li>
            <li>volledige activatie</li>
            <li>verwijderen van de flag</li>
          </ul>
  
          <p className="text-gray-700">
            Flags zijn dus expliciet <em>tijdelijk</em>
            en maken geen onderdeel uit van het
            definitieve systeemontwerp.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            Binnen FitLifeTool worden feature flags
            toegepast op duidelijke grenzen:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>UI-weergave (cards, acties, visualisaties)</li>
            <li>berekeningslogica (nieuwe score-varianten)</li>
            <li>workflow-stappen (bijv. nieuwe onboarding)</li>
          </ul>
  
          <p className="text-gray-700">
            Flags worden idealiter centraal beheerd
            en via context of providers beschikbaar gesteld,
            zodat conditionele logica niet verspreid raakt.
          </p>
  
          <p className="text-gray-700">
            Gradual rollout kan plaatsvinden op basis van:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>gebruikersrol (admin, developer, testgroep)</li>
            <li>account-leeftijd</li>
            <li>feature-specifieke criteria</li>
          </ul>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Flags zijn tijdelijk:</strong>
              langdurige flags leiden tot verborgen complexiteit.
            </li>
            <li>
              <strong>Geen flags diep in business-logica:</strong>
              voorkomt onvoorspelbaar gedrag.
            </li>
            <li>
              <strong>Expliciete rollout-fases:</strong>
              elke feature volgt dezelfde levenscyclus.
            </li>
            <li>
              <strong>Opruimen is verplicht:</strong>
              een feature zonder flag is het einddoel.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Door feature flags bewust en beperkt in te zetten,
            blijft FitLifeTool stabiel terwijl het
            gecontroleerd kan evolueren.
          </p>
        </section>
  
      {/* ───────────────── Navigatie ───────────────── */}
      <DocumentPager />
      </div>
    );
  }
  