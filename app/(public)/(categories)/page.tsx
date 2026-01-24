// app/(public)/(categories)/page.tsx

export default function PublicHomePage() {
    return (
      <div className="handbook-public">
        {/* =====================================================
           INTRO
        ===================================================== */}
        <div className="category-label">FITLIFETOOL</div>
  
        <header>
          <h1>Dagelijks inzicht in je gezondheid</h1>
        </header>
  
        <p>
          FitLifeTool brengt hydratatie, activiteiten en voeding samen
          in één helder dagoverzicht. Je ziet waar je staat, wat je doelen
          zijn en wat je vandaag kunt doen — zonder giswerk, zonder losse apps.
        </p>
  
        {/* =====================================================
           DASHBOARD PREVIEW (WOW)
        ===================================================== */}
        <section>
          <h2>Zo ziet je dag eruit in FitLifeTool</h2>
  
          <div className="feature-grid">
            {/* ================= Hydratatie ================= */}
            <article className="feature-card">
              <h3>Hydratatie</h3>
  
              <p>
                Je dagelijkse vochtinname afgezet tegen je persoonlijke
                waterdoel, realtime bijgehouden.
              </p>
  
              <img
                src="/previews/preview-hydratatie.png"
                alt="Voorbeeld van het hydratatiedashboard in FitLifeTool"
              />
  
              <br/><br/><br/>

              <div className="feature-meta">
                Voorbeeld: 2.650 / 2,989 ml
              </div>
            </article>
  
            {/* ================= Activiteiten ================= */}
            <article className="feature-card">
              <h3>Activiteiten</h3>
  
              <p>
                Beweging en energieverbruik vertaald naar concrete
                en haalbare dagdoelen.
              </p>
  
              <img
                src="/previews/preview-activiteiten.png"
                alt="Voorbeeld van het activiteitenoverzicht in FitLifeTool"
              />
  
              <div>
                <span />
              </div>
  
              <div className="feature-meta">
                Voorbeeld: 394 / 396 kcal
              </div>
            </article>
  
            {/* ================= Voeding ================= */}
            <article className="feature-card">
              <h3>Voeding</h3>
  
              <p>
                Calorie-inname en macro’s afgezet tegen je persoonlijke
                daglimiet, automatisch aangepast aan je activiteit.
              </p>
  
              <img
                src="/previews/preview-voeding.png"
                alt="Voorbeeld van het voedingsdashboard in FitLifeTool"
              />

              <br/><br/><br/>

              <div className="feature-meta">
                Voorbeeld: 1.700 / 1.844 kcal
              </div>
            </article>
          </div>
        </section>
  
        {/* =====================================================
           WAAROM DIT WERKT
        ===================================================== */}
        <section>
          <h2>Waarom FitLifeTool werkt</h2>
  
          <ul>
            <li>Alle doelen zijn persoonlijk en herleidbaar</li>
            <li>Dagelijkse inzichten in plaats van losse data</li>
            <li>Geen medische claims of black boxes</li>
            <li>Je data blijft altijd van jou</li>
          </ul>
        </section>
      </div>
    );
  }
  