// app/(public)/(categories)/hydratatie/waterbehoefte/page.tsx

export default function WaterbehoeftePage() {
    return (
      <section className="category-card category-article">
        <div className="category-label">HYDRATATIE</div>
  
        <h1>Hoeveel water moet je per dag drinken?</h1>
  
        {/* DIRECT ANTWOORD (snippet friendly) */}
        <p>
          Hoeveel je per dag moet drinken hangt af van je gewicht, activiteit en
          omgeving. Een eenvoudige richtlijn is ongeveer
          <strong>30–35 ml per kilogram lichaamsgewicht</strong>, wat voor
          veel volwassenen neerkomt op <strong>±2,5 – 3,0 liter</strong>
          totaal vocht per dag — inclusief vocht uit voeding en andere dranken.
        </p>
  
        {/* PAGINASTRUCTUUR */}
  
        {/* ▪️ Wat is hydratatie en waarom belangrijk? */}
        <h2>Wat betekent goed gehydrateerd zijn?</h2>
        <p>
          Hydratatie verwijst naar de balans tussen vochtinname en vochtverlies.
          Je lichaam heeft voldoende vocht nodig voor:
        </p>
        <ul>
          <li>temperatuurregulatie</li>
          <li>draagfunctie van bloed en voedingsstoffen</li>
          <li>spijsvertering</li>
          <li>cel- en orgaanfunctie</li>
        </ul>
  
        {/* ▪️ Basis richtlijnen */}
        <h2>Algemene richtlijn voor dagelijkse vochtinname</h2>
        <p>
          Veel richtlijnen adviseren ongeveer <strong>1,5–2,0 liter</strong> per
          dag voor volwassenen als basis. Dit is inclusief vocht uit voeding en
          dranken zoals thee, koffie en melk. Voor individuen is dit echter vaak
          te algemeen.
        </p>
  
        <h3>Waarom richtlijnen kunnen variëren</h3>
        <ul>
          <li>verschil in lichaamsgewicht</li>
          <li>activiteitsniveau (sport, werk)</li>
          <li>klimaat (warmte/vochtigheid)</li>
          <li>medische situatie of medicatie</li>
        </ul>
  
        {/* ▪️ Persoonlijke berekening */}
        <h2>Hoe je je eigen behoefte berekent</h2>
        <p>
          Een eenvoudig startpunt is <strong>30–35 ml per kg</strong> lichaamsgewicht:
        </p>
        <ul>
          <li>gewicht × 30 ml = minimumrichtlijn</li>
          <li>gewicht × 35 ml = hogere behoefte bij inspanning of warmte</li>
        </ul>
        <p>
          <em>Voorbeeld:</em> iemand van 86 kg heeft een richtlijn van ±2,6 – 3,0 liter
          vocht per dag, inclusief voeding en dranken.
        </p>
  
        {/* ▪️ Drinkmomenten */}
        <h2>Wanneer moet je drinken?</h2>
        <p>
          Verspreid je vochtinname gelijkmatig over de dag om pieken en dalen
          in hydratatie te voorkomen.
        </p>
        <ul>
          <li>Begin de dag met een glas water</li>
          <li>Drink tijdens maaltijden</li>
          <li>Neem extra na inspanning</li>
          <li>Vermijd grote hoeveelheden in korte tijd</li>
        </ul>
  
        {/* ▪️ Signalen van te weinig drinken */}
        <h2>Hoe weet je of je genoeg drinkt?</h2>
        <p>
          Let op deze aanwijzingen dat je vocht tekort kan hebben:
        </p>
        <ul>
          <li>dorst</li>
          <li>donkere urine</li>
          <li>vermoeidheid of concentratieproblemen</li>
          <li>droge mond of lippen</li>
        </ul>
  
        {/* ▪️ Te veel drinken? (hyponatriëmie) */}
        <h2>Kan het kwaad om te veel te drinken?</h2>
        <p>
          Te veel water in een korte periode kan je natriumgehalte verdunnen
          (hyponatriëmie). Dit komt vooral voor bij extreme situaties zoals
          langdurige inspanning zonder elektrolyten, of zeer grote hoeveelheden
          binnen korte tijd. Voor de meeste mensen is dit geen risico bij normale
          dagelijkse inname.
        </p>
  
        {/* ▪️ Praktische tips */}
        <h2>Praktische tips voor voldoende hydratatie</h2>
        <ul>
          <li>Gebruik een herbruikbare waterfles en stel reminders in</li>
          <li>Drink water bij maaltijden</li>
          <li>Houd je vochtinname bij in je dagboek of tracker</li>
          <li>Pas je drinken aan bij inspanning en warmte</li>
        </ul>
  
        {/* ▪️ Interne links & FitLifeTool context */}
        <h2>Hoe FitLifeTool je hierbij helpt</h2>
        <p>
          In FitLifeTool kun je je hydratatie bijhouden zodat je
          trendinzichten krijgt en je dagelijkse doel ziet groeien of
          dalen gebaseerd op je activiteit. Je ziet direct of je genoeg drinkt
          tegenover je persoonlijke richtlijn.
        </p>
        <p>
          <a href="/hydratatie/drinkmomenten" className="category-card-link">
            Lees meer over wanneer je het beste kunt drinken →
          </a>
        </p>
        <p>
          <a href="/hydratatie/uitdroging" className="category-card-link">
            Lees meer over signalen van te weinig drinken →
          </a>
        </p>
      </section>
    );
  }
  