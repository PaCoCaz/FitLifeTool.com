// app/handbook/page.tsx
export default function HandbookIndexPage() {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-[#191970]">
          FitLifeTool — Intern Handbook
        </h1>
  
        <p className="text-gray-600">
          Dit document beschrijft de volledige architectuur, logica en
          ontwerpkeuzes van FitLifeTool.  
          Bedoeld als naslagwerk voor ontwikkeling en onderhoud.
        </p>
  
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Delen</h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Deel A — Fundament</li>
            <li>Deel B — Datamodel & opslag</li>
            <li>Deel C — Daglogica & scores</li>
            <li>Deel D — UI & Cards</li>
            <li>Deel E — Toekomst & uitbreidingen</li>
          </ul>
        </div>
      </div>
    );
  }
  