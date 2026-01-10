// app/handbook/chapter-03/page.tsx
export default function Chapter03Page() {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-[#191970]">
          B2. Dagstructuur, logs & immutable data
        </h1>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Dag-gedreven architectuur
          </h2>
          <p>
            FitLifeTool is volledig opgebouwd rondom het concept
            van <strong>dagen</strong>.  
            Vrijwel alle kernfunctionaliteit — doelen, scores,
            voortgang — is gekoppeld aan één specifieke dag.
          </p>
  
          <p>
            Dit voorkomt:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li>terugwerkende herberekeningen</li>
            <li>verschuivende voortgang</li>
            <li>historische data die verandert</li>
          </ul>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Wat is een log?
          </h2>
  
          <p>
            Een <strong>log</strong> is een enkele, concrete actie
            van een gebruiker op een specifieke dag.
          </p>
  
          <p>Voorbeelden:</p>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li>200 ml water drinken</li>
            <li>30 minuten wandelen</li>
            <li>500 kcal eten</li>
          </ul>
  
          <p className="text-gray-600">
            Logs worden opgeslagen in aparte tabellen
            (hydration_logs, activity_logs, nutrition_logs).
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Immutable logs (bewuste keuze)
          </h2>
  
          <p>
            Logs in FitLifeTool zijn <strong>immutable</strong>.
          </p>
  
          <p>
            Dat betekent:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li>logs worden <strong>nooit aangepast</strong></li>
            <li>logs worden <strong>nooit herberekend</strong></li>
            <li>fouten corrigeer je door een nieuwe log toe te voegen</li>
          </ul>
  
          <p className="text-gray-600">
            Dit voorkomt complexe state-problemen en maakt
            audit, debugging en analyse eenvoudiger.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Dag-sleutels (dayKey)
          </h2>
  
          <p>
            Elke log is gekoppeld aan een <code>dayKey</code>,
            een string in het formaat:
          </p>
  
          <pre>
  {`YYYY-MM-DD`}
          </pre>
  
          <p>
            Deze sleutel wordt lokaal berekend op basis van
            de tijdzone van de gebruiker.
          </p>
  
          <p className="text-gray-600">
            Hierdoor blijft data correct, ook bij reizen
            of afwijkende tijdzones.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Dagwissel (00:00)
          </h2>
  
          <p>
            Bij het wisselen van de dag:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li>start een nieuwe dag met nieuwe logs</li>
            <li>blijven oude logs ongewijzigd</li>
            <li>worden nieuwe doelen actief</li>
          </ul>
  
          <p>
            De dagwissel is een <strong>hard moment</strong>,
            geen vloeiende overgang.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Waarom deze architectuur?
          </h2>
  
          <p>
            Deze opzet zorgt ervoor dat:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li>historische data altijd klopt</li>
            <li>scores reproduceerbaar zijn</li>
            <li>toekomstige features (rapportages, coaching)
                veilig kunnen worden gebouwd</li>
          </ul>
  
          <p className="text-gray-600">
            Het systeem gedraagt zich voorspelbaar,
            zelfs bij gewichtswijzigingen of doel-aanpassingen.
          </p>
        </section>
      </div>
    );
  }
  