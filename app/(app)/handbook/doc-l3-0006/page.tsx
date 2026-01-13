// app/handbook/doc-l3-0006/page.tsx

import DocumentPager from "../documentPager";

export default function DocL30006() {
    return (
      <article className="space-y-12 max-w-4xl">
  
        {/* Titel */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#191970]">
            3.2 Status & Kleuren
          </h1>
          <p className="text-gray-600">
            Hoe statussen en kleuren worden bepaald, gecombineerd en
            consequent toegepast binnen FitLifeTool.
          </p>
        </header>
  
        {/* Introductie */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Introductie
          </h2>
  
          <p className="text-gray-700">
            Naast numerieke scores gebruikt FitLifeTool kleurcodes om
            voortgang en status intuïtief zichtbaar te maken.
          </p>
  
          <p className="text-gray-700">
            Kleuren zijn geen decoratie, maar onderdeel van de logica.
            Ze fungeren als snelle feedbacklaag bovenop cijfers.
          </p>
        </section>
  
        {/* Status per card */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Status per card
          </h2>
  
          <p className="text-gray-700">
            Elke card (Hydration, Activity, Nutrition) publiceert een
            eigen status op basis van de voortgang ten opzichte van
            het dagdoel.
          </p>
  
          <p className="text-gray-700">
            De status is altijd één van de volgende waarden:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li><strong>behind</strong> — gebruiker loopt achter op schema</li>
            <li><strong>onTrack</strong> — gebruiker ligt op schema</li>
            <li><strong>completed</strong> — dagdoel is behaald</li>
          </ul>
        </section>
  
        {/* Kleurmapping */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Kleurmapping
          </h2>
  
          <p className="text-gray-700">
            Elke status correspondeert met een vaste kleur:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>behind</strong> → rood / oranje tint
            </li>
            <li>
              <strong>onTrack</strong> → blauw (neutraal positief)
            </li>
            <li>
              <strong>completed</strong> → groen
            </li>
          </ul>
  
          <p className="text-gray-700">
            Deze mapping is overal identiek: cards, progress bars,
            iconen en de FitLifeScore zelf.
          </p>
        </section>
  
        {/* Aggregatie naar FitLifeScore */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Aggregatie naar FitLifeScore
          </h2>
  
          <p className="text-gray-700">
            De FitLifeScore bepaalt zijn kleur niet op basis van
            het numerieke eindresultaat, maar op basis van de
            gecombineerde card-statussen.
          </p>
  
          <p className="text-gray-700">
            De aggregatieregel is expliciet conservatief:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              Als <strong>alle</strong> cards <em>completed</em> zijn →
              scorekleur = groen
            </li>
            <li>
              Als één of meerdere cards <em>behind</em> zijn →
              scorekleur = rood / waarschuwing
            </li>
            <li>
              In alle andere gevallen →
              scorekleur = blauw
            </li>
          </ul>
        </section>
  
        {/* Geen numerieke shortcuts */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Geen numerieke shortcuts
          </h2>
  
          <p className="text-gray-700">
            Een hoge FitLifeScore (bijvoorbeeld 90+) kan nog steeds
            een waarschuwingskleur tonen als één card achterloopt.
          </p>
  
          <p className="text-gray-700">
            Dit voorkomt dat gebruikers een “goed getal” zien terwijl
            er feitelijk onbalans bestaat.
          </p>
        </section>
  
        {/* Implementatie */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            Cards exposen hun status via props of context.
            De ScoreCard luistert hierop en bepaalt de eindkleur.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Geen herberekening in de ScoreCard</li>
            <li>Geen duplicatie van card-logica</li>
            <li>Status is leidend, niet score</li>
          </ul>
        </section>
  
        {/* Belangrijke beslissingen */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Kleuren zijn semantisch, niet cosmetisch</li>
            <li>Aggregatie is conservatief</li>
            <li>Status gaat boven getal</li>
            <li>Consistente mapping door de hele applicatie</li>
          </ul>
  
          <p className="text-gray-700">
            Hierdoor blijft de visuele feedback betrouwbaar en
            voorspelbaar, ook bij uitbreiding van het systeem.
          </p>
        </section>
  
      {/* ───────────────── Navigatie ───────────────── */}
      <DocumentPager />
      </article>
    );
  }
  