// app/(public)/(categories)/gezondheid/bmi/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wat is BMI en wat zegt het écht over je gezondheid?",
  description:
    "Uitleg over wat BMI is, hoe het wordt berekend, wat de beperkingen zijn en waarom BMI niet altijd een volledig beeld geeft van gezondheid.",
};

export default function BMIPage() {
  return (
    <>
      <div className="category-label">GEZONDHEID</div>

      <header>
        <h1>Wat is BMI en wat zegt het écht over je gezondheid?</h1>
      </header>

      <section>
        <p>
          BMI staat voor <strong>Body Mass Index</strong> en is een veelgebruikte maat om lichaamsgewicht te relateren aan lengte. De uitkomst wordt vaak gebruikt om een globale inschatting te maken van gezondheidsrisico's.
        </p>

        <p>
          Hoewel BMI eenvoudig te berekenen is, zegt het niet alles over hoe
          gezond iemand daadwerkelijk is. Het is daarom belangrijk om BMI
          altijd in context te bekijken.
        </p>
      </section>

      <section>
        <h2>Hoe wordt BMI berekend?</h2>

        <p>
          BMI wordt berekend door het lichaamsgewicht (in kilogrammen) te delen
          door het kwadraat van de lengte (in meters).
        </p>

        <p className="muted">
          BMI = gewicht (kg) / lengte² (m²)
        </p>
      </section>

      <section>
        <h2>Wat zegt BMI wél?</h2>

        <ul>
          <li>Geeft een snelle, globale indicatie</li>
          <li>Wordt gebruikt in populatieonderzoek</li>
          <li>Kan trends over tijd zichtbaar maken</li>
        </ul>

        <p>
          Op groepsniveau kan BMI nuttig zijn om patronen te herkennen, maar
          individuele verschillen blijven buiten beeld.
        </p>
      </section>

      <section>
        <h2>Beperkingen van BMI</h2>

        <ul>
          <li>Maakt geen onderscheid tussen vet- en spiermassa</li>
          <li>Houdt geen rekening met lichaamsbouw</li>
          <li>Zegt niets over conditie of herstelvermogen</li>
        </ul>

        <p>
          Hierdoor kan iemand met veel spiermassa een hoge BMI hebben zonder
          ongezond te zijn, terwijl iemand met weinig spiermassa en meer vet
          juist een ‘normale’ BMI kan hebben.
        </p>
      </section>

      <section>
        <h2>BMI in relatie tot gezondheid</h2>

        <p>
          Gezondheid is meer dan één getal. BMI krijgt pas betekenis wanneer het
          wordt gecombineerd met andere factoren zoals voeding, beweging,
          herstel en energieverbruik.
        </p>

        <p>
          Daarom wordt BMI binnen FitLifeTool nooit los gebruikt, maar altijd
          bekeken in samenhang met andere inzichten.
        </p>
      </section>

      <section>
        <p className="muted">
          BMI is een hulpmiddel, geen oordeel. Het helpt bij het begrijpen van
          trends, niet bij het trekken van conclusies op zichzelf.
        </p>
      </section>
    </>
  );
}
