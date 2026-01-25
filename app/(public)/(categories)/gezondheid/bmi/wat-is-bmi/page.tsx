// app/(public)/(categories)/gezondheid/bmi/wat-is-bmi/page.tsx

export default function WatIsBmiPage() {
    return (
      <section className="category-card category-span-full category-article">
        <div className="category-label">GEZONDHEID</div>
  
        <h1>Wat is BMI (Body Mass Index)?</h1>
  
        <p>
          BMI, oftewel Body Mass Index, is een veelgebruikte maat om
          lichaamsgewicht te relateren aan lengte. Het wordt vaak ingezet
          als eerste indicatie van gewichtsstatus, maar vertelt niet het
          volledige verhaal over gezondheid.
        </p>
  
        <h2>Hoe wordt BMI berekend?</h2>
        <p>
          BMI wordt berekend door het gewicht in kilogrammen te delen
          door het kwadraat van de lengte in meters.
        </p>
  
        <p className="formula">
          <strong>Formule:</strong> gewicht (kg) / lengte² (m²)
        </p>
  
        <h2>Wat zegt BMI wél?</h2>
        <ul>
          <li>Geeft een snelle globale indicatie</li>
          <li>Wordt gebruikt in populatieonderzoek</li>
          <li>Kan trends over tijd zichtbaar maken</li>
        </ul>
  
        <h2>Wat zegt BMI niet?</h2>
        <p>
          BMI houdt geen rekening met spiermassa, vetverdeling,
          lichaamsbouw of conditie. Hierdoor kan iemand met veel
          spiermassa een hoge BMI hebben zonder ongezond te zijn.
        </p>
  
        <h2>BMI binnen FitLifeTool</h2>
        <p>
          Binnen FitLifeTool wordt BMI nooit los geïnterpreteerd.
          Het wordt altijd gecombineerd met gewichtsverloop,
          activiteit, voeding en herstel om een realistischer beeld
          van gezondheid te geven.
        </p>
      </section>
    );
  }
  