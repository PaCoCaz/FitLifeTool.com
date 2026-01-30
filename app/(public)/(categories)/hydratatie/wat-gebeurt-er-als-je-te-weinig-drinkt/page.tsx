// app/(public)/(categories)/hydratatie/wat-gebeurt-er-als-je-te-weinig-drinkt/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";
import Link from "next/link";

export default function TeWeinigDrinkenPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text category-article-intro-card">
        <div className="category-label">HYDRATATIE</div>

        <h1>Wat gebeurt er als je te weinig drinkt?</h1>

        <p>
          Te weinig drinken heeft sneller effect op je lichaam dan veel mensen denken.
          Zelfs een klein vochttekort kan leiden tot vermoeidheid, hoofdpijn en concentratieproblemen.
          Water is essentieel voor je bloedsomloop, temperatuurregeling en energieniveau.
        </p>

        <p>
          Wanneer je langdurig te weinig drinkt, raakt je vochtbalans verstoord en moet je lichaam harder werken.
          Weet je niet zeker hoeveel jij nodig hebt? Bekijk dit op de pagina{" "}
          <Link href="/hydratatie/hoeveel-water-moet-je-per-dag-drinken">hoeveel water moet je per dag drinken</Link>.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/hydration-dehydration.png"
          alt="Vermoeidheid en hoofdpijn als tekenen van uitdroging"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Vroege symptomen van te weinig drinken</h2>

        <p>
          Je lichaam geeft duidelijke signalen af wanneer het vocht tekort komt. Veel van deze klachten
          worden niet direct gekoppeld aan hydratatie.
        </p>

        <ul>
          <li>Dorstgevoel</li>
          <li>Hoofdpijn</li>
          <li>Vermoeidheid of futloosheid</li>
          <li>Minder concentratie</li>
          <li>Droge mond of lippen</li>
          <li>Donkergele urine</li>
        </ul>

        <h2>Wat gebeurt er in je lichaam bij uitdroging?</h2>

        <p>
          Bij een vochttekort wordt je bloed dikker, waardoor je hart harder moet werken.
          Ook kan je lichaam warmte minder goed afvoeren, wat leidt tot een slap en uitgeput gevoel.
        </p>

        <p>
          Je hersenen reageren gevoelig op vochtverlies. Zelfs lichte uitdroging kan je stemming,
          geheugen en concentratie negatief beïnvloeden. Regelmatig drinken verspreid over de dag,
          zoals je kunt lezen op de pagina{" "}
          <Link href="/hydratatie/wanneer-moet-je-water-drinken">wanneer moet je water drinken</Link>,
          helpt dit te voorkomen.
        </p>

        <h2>Gevolgen van langdurig te weinig drinken</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Periode</th>
                <th>Mogelijke gevolgen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Korte termijn</td>
                <td>Hoofdpijn, vermoeidheid, concentratieverlies</td>
              </tr>
              <tr>
                <td>Middellange termijn</td>
                <td>Verminderde sportprestaties, langzamer herstel</td>
              </tr>
              <tr>
                <td>Lange termijn</td>
                <td>Belasting van de nieren, verhoogde kans op verstopping</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Wie lopen meer risico op uitdroging?</h2>

        <ul>
          <li>Ouderen (minder dorstgevoel)</li>
          <li>Kinderen (sneller vochtverlies)</li>
          <li>Sporters</li>
          <li>Mensen met koorts of maag-darmklachten</li>
          <li>Mensen die werken in warme omgevingen</li>
        </ul>

        <h2>Wanneer wordt uitdroging gevaarlijk?</h2>

        <p>
          Ernstige uitdroging kan leiden tot duizeligheid, verwardheid, flauwvallen en een versnelde hartslag.
          Dit komt vooral voor bij extreme hitte, zware inspanning of ziekte.
        </p>

        <h2>Hoe voorkom je dat je te weinig drinkt?</h2>

        <p>
          Regelmatig kleine hoeveelheden water drinken werkt beter dan in korte tijd veel drinken.
          Lees ook welke dranken bijdragen aan je vochtbalans op{" "}
          <Link href="/hydratatie/dranken">tellen koffie en thee ook mee</Link>.
        </p>

        <h2>Veelgestelde vragen over te weinig drinken</h2>

        <Accordion
          items={[
            {
              question: "Hoe snel merk je dat je te weinig drinkt?",
              answer: "Vaak al binnen enkele uren. Dorst, hoofdpijn en vermoeidheid zijn vroege signalen.",
            },
            {
              question: "Kun je moe worden van te weinig drinken?",
              answer: "Ja, een vochttekort verlaagt je energieniveau doordat je bloedsomloop minder efficiënt werkt.",
            },
            {
              question: "Is hoofdpijn een teken van uitdroging?",
              answer: "Ja, lichte uitdroging kan al hoofdpijn veroorzaken.",
            },
            {
              question: "Wat is het verschil tussen lichte en ernstige uitdroging?",
              answer: "Lichte uitdroging geeft dorst en vermoeidheid. Ernstige uitdroging kan leiden tot duizeligheid en verwardheid.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          Te weinig drinken kan snel invloed hebben op je energie, concentratie en lichamelijke prestaties.
          Door regelmatig te drinken en signalen van je lichaam serieus te nemen, voorkom je klachten en blijf je beter gehydrateerd.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Weet jij of je genoeg drinkt op een dag?</h2>

        <p>
          FitLifeTool helpt je om je dagelijkse vochtinname bij te houden en laat zien
          of je jouw persoonlijke hydratatiedoel haalt.
        </p>

        <div className="hero-cta">
          <RegisterButton className="hero-primary-btn">
            Start met je hydratatie bijhouden
          </RegisterButton>
        </div>
      </div>
    </CategoryGrid>
  );
}
