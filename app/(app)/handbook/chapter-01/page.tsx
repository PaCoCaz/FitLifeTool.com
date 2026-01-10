// app/handbook/chapter-01/page.tsx
export default function Chapter01Page() {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-[#191970]">
          A1. Overzicht & kernprincipes
        </h1>
  
        <p>
          FitLifeTool is opgebouwd rond daglogica, niet rond losse logs.
          Elke berekening, score en status is dag-gebonden.
        </p>
  
        <ul className="list-disc pl-5 text-gray-700">
          <li>Dag = autoriteit</li>
          <li>Doelen zijn voorspelbaar</li>
          <li>Scores zijn schema-afhankelijk</li>
          <li>UI is afgeleid van status, nooit andersom</li>
        </ul>
      </div>
    );
  }
  