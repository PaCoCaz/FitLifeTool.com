// app/handbook/doc-l3-0011/page.tsx

import DocumentPager from "../documentPager";

export default function DocL30011() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            4.2 - Kaartsysteem & Compositie
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft het card-systeem van FitLifeTool:
            hoe informatieblokken zijn opgebouwd, hergebruikt en
            consistent gepresenteerd binnen de UI.
          </p>
  
          <p className="text-gray-700">
            Cards vormen de primaire bouwsteen van het dashboard
            en andere overzichtspagina’s. Ze zijn ontworpen om
            zelfstandige, begrijpelijke eenheden te zijn met
            een duidelijke verantwoordelijkheid.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            Het card-systeem is gebaseerd op het principe van
            <strong> compositie boven variatie </strong>.
            In plaats van veel verschillende card-types is er
            één generiek card-frame waarin specifieke inhoud
            wordt geplaatst.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Elke card vertegenwoordigt één domeinconcept</li>
            <li>Cards zijn visueel consistent maar inhoudelijk vrij</li>
            <li>Acties en statusinformatie zijn optioneel</li>
          </ul>
  
          <p className="text-gray-700">
            Hierdoor blijft het systeem uitbreidbaar zonder dat
            de UI fragmenteert in uitzonderingen.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            Technisch is het card-systeem geïmplementeerd als een
            herbruikbare React component:
            <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">
              Card
            </code>.
          </p>
  
          <p className="text-gray-700">
            Deze component accepteert vaste structurele props
            (zoals titel en actiegebied) en render daarna
            willekeurige children als inhoud.
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Header-sectie met titel en optionele acties</li>
            <li>Inhoudssectie voor grafieken, formulieren of tekst</li>
            <li>Visuele scheiding via padding en achtergrond</li>
          </ul>
  
          <p className="text-gray-700">
            Domeinspecifieke cards (zoals Gewicht, Hydratatie,
            Activiteit) zijn dunne wrappers rondom deze basiskaart
            en bevatten uitsluitend logica en data.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Eén card-component:</strong> voorkomt visuele
              inconsistentie en code-duplicatie.
            </li>
            <li>
              <strong>Compositie via children:</strong> maakt cards
              flexibel zonder extra configuratie-opties.
            </li>
            <li>
              <strong>Dunne domein-cards:</strong> houden businesslogica
              los van layoutcode.
            </li>
            <li>
              <strong>Dashboard als grid van cards:</strong> ondersteunt
              herschikking en toekomstige personalisatie.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Deze keuzes zorgen ervoor dat het UI-systeem schaalbaar
            blijft naarmate het aantal features en datapunten groeit.
          </p>
        </section>
  
      {/* ───────────────── Navigatie ───────────────── */}
      <DocumentPager />
      </div>
    );
  }
  