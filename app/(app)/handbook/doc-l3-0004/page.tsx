// app/handbook/doc-l3-0004/page.tsx

import DocumentPager from "../documentPager";

export default function DocL30004() {
  return (
    <article className="space-y-12 max-w-4xl">

      {/* Titel */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#191970]">
          2.3 Dagdoelen & Herberekening
        </h1>
        <p className="text-gray-600">
          Hoe FitLifeTool dagdoelen bepaalt, herberekent en vooruitkijkt.
        </p>
      </header>

      {/* Introductie */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Introductie
        </h2>

        <p className="text-gray-700">
          Dagdoelen vormen het hart van FitLifeTool. Ze bepalen niet alleen
          wat “goed bezig” betekent, maar sturen ook feedback, progressie
          en motivatie gedurende de dag.
        </p>

        <p className="text-gray-700">
          Dit hoofdstuk beschrijft hoe dagdoelen dynamisch worden berekend,
          waarom ze kunnen veranderen en hoe het systeem vooruitkijkt
          zonder historische data aan te passen.
        </p>
      </section>

      {/* Conceptueel model */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Conceptueel model
        </h2>

        <p className="text-gray-700">
          Een dagdoel is geen statische waarde. Het is een
          <strong> afgeleide projectie</strong> gebaseerd op:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>gebruikersprofiel (doel, gewicht, niveau)</li>
          <li>dag van de week</li>
          <li>historische prestaties</li>
          <li>eventuele gemiste of overgeslagen dagen</li>
        </ul>

        <p className="text-gray-700">
          Dagdoelen bestaan daarom niet als database-records, maar
          worden telkens opnieuw berekend.
        </p>
      </section>

      {/* Waarom herberekening nodig is */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Waarom herberekening nodig is
        </h2>

        <p className="text-gray-700">
          Een vast dagdoel zou leiden tot onnauwkeurige of demotiverende
          feedback wanneer:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>een gebruiker een dag overslaat</li>
          <li>doelen tussentijds wijzigen</li>
          <li>het gedrag structureel verandert</li>
        </ul>

        <p className="text-gray-700">
          Door dagdoelen dynamisch te herberekenen:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>blijft feedback eerlijk</li>
          <li>wordt progressie realistisch weergegeven</li>
          <li>ontstaat ruimte voor adaptief gedrag</li>
        </ul>
      </section>

      {/* Morgen-preview */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Morgen-preview
        </h2>

        <p className="text-gray-700">
          FitLifeTool toont bewust een <strong>morgen-preview</strong>:
          een voorspelling van de dagdoelen voor de volgende dag.
        </p>

        <p className="text-gray-700">
          Deze preview is gebaseerd op:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>huidige voortgang</li>
          <li>resterende dagen in de week</li>
          <li>gemiddelde prestaties</li>
        </ul>

        <p className="text-gray-700">
          Cruciaal: de preview schrijft niets weg. Het is uitsluitend
          informatief en heeft geen effect op logs of scores.
        </p>
      </section>

      {/* Implementatie */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Implementatie
        </h2>

        <p className="text-gray-700">
          Technisch worden dagdoelen berekend via:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>het ophalen van profielinstellingen</li>
          <li>het analyseren van logdata</li>
          <li>het toepassen van verdelingslogica per dag</li>
        </ul>

        <p className="text-gray-700">
          Er wordt expliciet onderscheid gemaakt tussen:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>doel (wat wil de gebruiker bereiken)</li>
          <li>schema (hoe wordt dit verdeeld)</li>
          <li>status (loopt de gebruiker voor of achter)</li>
        </ul>
      </section>

      {/* Belangrijke beslissingen */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Belangrijke beslissingen
        </h2>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Dagdoelen worden niet opgeslagen</li>
          <li>Herberekening gebeurt realtime</li>
          <li>Morgen-preview is read-only</li>
          <li>Historische logs blijven onaangetast</li>
        </ul>

        <p className="text-gray-700">
          Deze aanpak voorkomt technische schuld en maakt toekomstige
          uitbreidingen zoals weekplanning en coaching mogelijk.
        </p>
      </section>

    {/* ───────────────── Navigatie ───────────────── */}
    <DocumentPager />
    </article>
  );
}
