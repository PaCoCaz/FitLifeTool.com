// app/handbook/doc-l3-0014/page.tsx

import DocumentPager from "../documentPager";

export default function DocL30014() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            4.5 - Visuele hiërarchie & Status
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft hoe visuele hiërarchie en
            status-indicatie binnen FitLifeTool worden ingezet
            om informatie snel scanbaar, begrijpelijk en
            cognitief licht te houden.
          </p>
  
          <p className="text-gray-700">
            De UI communiceert continu status en prioriteit,
            zonder expliciete uitleg of extra interactie
            van de gebruiker te vereisen.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            Visual hierarchy bepaalt <strong>wat eerst wordt gezien</strong>,
            terwijl status signaling bepaalt <strong>wat het betekent</strong>.
          </p>
  
          <p className="text-gray-700">
            FitLifeTool gebruikt hiervoor een beperkt,
            consequent toegepast systeem van:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>kleurintensiteit</li>
            <li>typografisch gewicht</li>
            <li>ruimte en positionering</li>
            <li>subtiele contrastverschillen</li>
          </ul>
  
          <p className="text-gray-700">
            Status wordt primair impliciet gecommuniceerd:
            de gebruiker <em>ziet</em> vooruitgang of achterstand,
            voordat deze wordt gelezen.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            De UI maakt onderscheid tussen primaire,
            secundaire en ondersteunende elementen via
            vaste conventies:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              <strong>Primair:</strong> donkerblauw, hogere font-weight,
              prominente plaatsing
            </li>
            <li>
              <strong>Secundair:</strong> neutrale tinten,
              kleiner lettertype
            </li>
            <li>
              <strong>Status:</strong> kleuraccenten met lage verzadiging
            </li>
          </ul>
  
          <p className="text-gray-700">
            Status signaling volgt vaste regels:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>positief: koele of groene tinten</li>
            <li>neutraal: grijs of gedempt blauw</li>
            <li>waarschuwing: warm accent, beperkt in oppervlak</li>
          </ul>
  
          <p className="text-gray-700">
            Decoratieve elementen worden vermeden;
            elke visuele variatie heeft een functionele betekenis.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Beperkt kleurpalet:</strong>
              voorkomt visuele ruis en betekenisverwarring.
            </li>
            <li>
              <strong>Status ≠ decoratie:</strong>
              elke kleurverandering draagt informatie.
            </li>
            <li>
              <strong>Subtiele nadruk boven expliciete labels:</strong>
              minder tekst, sneller begrip.
            </li>
            <li>
              <strong>Consistentie boven creativiteit:</strong>
              voorspelbaarheid vergroot gebruiksgemak.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Deze aanpak maakt het mogelijk om complexe
            statusinformatie te tonen zonder de interface
            zwaar of technisch te laten aanvoelen.
          </p>
        </section>
  
      {/* ───────────────── Navigatie ───────────────── */}
      <DocumentPager />
      </div>
    );
  }
  