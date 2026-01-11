// app/handbook/page.tsx
export default function HandbookIndexPage() {
  return (
    <div className="space-y-10">

      {/* Titel */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#191970]">
          FitLifeTool - Intern Handboek
        </h1>
        <p className="text-gray-600 max-w-3xl">
          Dit handboek beschrijft de volledige architectuur, datamodellen,
          daglogica en UI-structuur van FitLifeTool.  
          Het dient als technisch naslagwerk en beslisdocument voor
          ontwikkeling en onderhoud.
        </p>
      </header>

      {/* Inhoudsopgave */}
      <section className="space-y-8">

        {/* H1 */}
        <div>
          <h2 className="font-semibold text-[#191970] mb-3">
            H1. Core Architecture
          </h2>

          <ul className="space-y-2 pl-4 border-l border-gray-200 text-sm">
            <li>
              <a
                href="/handbook/chapter-01"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">1.1</span> - Overview & Principles
              </a>
            </li>
          </ul>
        </div>

        {/* H2 */}
        <div>
          <h2 className="font-semibold text-[#191970] mb-3">
            H2. Data Model & Persistence
          </h2>

          <ul className="space-y-2 pl-4 border-l border-gray-200 text-sm">
            <li>
              <a
                href="/handbook/chapter-02"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">2.1</span> - Profiles & Authorization
              </a>
            </li>
            <li>
              <a
                href="/handbook/chapter-03"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">2.2</span> - Day Structure & Logs
              </a>
            </li>
            <li>
              <a
                href="/handbook/chapter-04"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">2.3</span> - Daily Goals & Recalculation
              </a>
            </li>
          </ul>
        </div>

        {/* H3 */}
        <div>
          <h2 className="font-semibold text-[#191970] mb-3">
            H3. Goals, Scoring & Progression
          </h2>

          <ul className="space-y-2 pl-4 border-l border-gray-200 text-sm">
            <li>
              <a
                href="/handbook/chapter-05"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">3.1</span> - FitLifeScore fundamentals
              </a>
            </li>
            <li>
              <a
                href="/handbook/chapter-06"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">3.2</span> - Colors & Status aggregation
              </a>
            </li>
            <li>
              <a
                href="/handbook/chapter-07"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">3.3</span> - Expected vs Actual progress
              </a>
            </li>
            <li>
              <a
                href="/handbook/chapter-08"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">3.4</span> - Partial completion & Recovery
              </a>
            </li>
            <li>
              <a
                href="/handbook/chapter-09"
                className="text-gray-800 hover:underline"
              >
                <span className="font-medium">3.5</span> - Aggregation & Safeguards
              </a>
            </li>
          </ul>
        </div>        

        {/* H4–H5 (toekomst) */}
        <div className="text-gray-400 italic space-y-3">

          <div>
            <h2 className="font-semibold">
              H4. UI System & Cards
            </h2>
            <p className="text-sm">In voorbereiding</p>
          </div>

          <div>
            <h2 className="font-semibold">
              H5. Extensibility & Roadmap
            </h2>
            <p className="text-sm">In voorbereiding</p>
          </div>
        </div>

      </section>
    </div>
  );
}
