// app/handbook/doc-l3-0019/page.tsx

import DocumentPager from "../documentPager";

export default function DocL30019() {
    return (
      <div className="space-y-10">
  
        {/* ───────────────── Introductie ───────────────── */}
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-[#191970]">
            5.5 - Stabiliteit vs Innovatie
          </h1>
  
          <p className="text-gray-700">
            Dit hoofdstuk beschrijft hoe FitLifeTool omgaat met backward
            compatibility en het gecontroleerd introduceren van breaking changes.
          </p>
  
          <p className="text-gray-700">
            Omdat FitLifeTool een levend product is met bestaande gebruikersdata,
            is stabiliteit net zo belangrijk als innovatie.
          </p>
        </section>
  
        {/* ───────────────── Conceptueel model ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Conceptueel model
          </h2>
  
          <p className="text-gray-700">
            Binnen FitLifeTool geldt het principe dat bestaande data en gedrag
            niet onverwacht mogen breken.
          </p>
  
          <p className="text-gray-700">
            Backward compatibility betekent hier:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>bestaande gebruikersflows blijven werken</li>
            <li>historische data blijft interpreteerbaar</li>
            <li>UI-wijzigingen geen functioneel verlies veroorzaken</li>
          </ul>
  
          <p className="text-gray-700">
            Breaking changes zijn toegestaan, maar uitsluitend wanneer deze
            expliciet gepland en beheerst worden doorgevoerd.
          </p>
        </section>
  
        {/* ───────────────── Implementatie ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Implementatie
          </h2>
  
          <p className="text-gray-700">
            In de praktijk wordt backward compatibility geborgd door:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>schema-uitbreidingen in plaats van mutaties</li>
            <li>optionele velden met veilige defaults</li>
            <li>versionering van logica waar nodig</li>
          </ul>
  
          <p className="text-gray-700">
            Breaking changes volgen een vast patroon:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>oude en nieuwe logica bestaan tijdelijk naast elkaar</li>
            <li>migratie wordt expliciet uitgevoerd</li>
            <li>oude paden worden pas later verwijderd</li>
          </ul>
  
          <p className="text-gray-700">
            Hierdoor kunnen wijzigingen gecontroleerd en veilig worden uitgerold.
          </p>
        </section>
  
        {/* ───────────────── Beslissingen ───────────────── */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#191970]">
            Belangrijke beslissingen
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <strong>Stabiliteit boven snelheid:</strong>
              brekende wijzigingen worden nooit impulsief doorgevoerd.
            </li>
            <li>
              <strong>Expliciete migraties:</strong>
              data wordt niet stilzwijgend aangepast.
            </li>
            <li>
              <strong>Tijdelijke dubbele paden:</strong>
              oud en nieuw mogen naast elkaar bestaan.
            </li>
            <li>
              <strong>Documentatie is verplicht:</strong>
              elke breaking change wordt vastgelegd in het handboek.
            </li>
          </ul>
  
          <p className="text-gray-700">
            Deze aanpak voorkomt regressies, beschermt gebruikersdata
            en maakt doorontwikkeling veilig en voorspelbaar.
          </p>
        </section>
  
      {/* ───────────────── Navigatie ───────────────── */}
      <DocumentPager />
      </div>
    );
  }
  