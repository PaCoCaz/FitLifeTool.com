// app/(public)/(categories)/hydratatie/wanneer-moet-je-water-drinken/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import FAQAccordion from "@/components/seo/FAQAccordion";

export default function DrinkmomentenPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-article-intro-card category-equal-card seo-intro-text">
        <div className="category-label">HYDRATATIE</div>

        <h1>Wanneer moet je water drinken op een dag?</h1>

        <p>
        Niet alleen de hoeveelheid water die je drinkt is belangrijk, maar ook <strong> wanneer je drinkt</strong>. 
        Lees ook hoeveel water je per dag nodig hebt op onze pagina over <a href="/hydratatie/hoeveel-water-moet-je-per-dag-drinken">dagelijkse waterbehoefte</a>.
        </p>

        <p>
          Regelmatig kleine hoeveelheden drinken werkt beter dan in korte tijd veel
          water nemen. Je lichaam kan vocht dan efficiënter opnemen en gebruiken.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/hydration-timing.png"
          alt="Iemand drinkt water gedurende de dag"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card">
        <h2>Waarom spreiden van water drinken beter werkt</h2>
        <p>
          Je lichaam kan maar een beperkte hoeveelheid vocht per keer verwerken.
          Wanneer je in korte tijd veel drinkt, plas je een groot deel weer uit zonder
          dat je lichaam het optimaal benut. Door je inname te verspreiden blijft je
          vochtbalans stabieler.
        </p>

        <h2>De beste momenten om water te drinken</h2>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Moment</th>
                <th>Waarom dit belangrijk is</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Na het opstaan</td>
                <td>Vult vochttekort na de nacht aan en helpt je metabolisme op gang</td>
              </tr>
              <tr>
                <td>Tussen maaltijden</td>
                <td>Houdt je energieniveau stabiel en voorkomt dorstgevoel</td>
              </tr>
              <tr>
                <td>Voor het sporten</td>
                <td>Bereidt je lichaam voor op extra vochtverlies</td>
              </tr>
              <tr>
                <td>Tijdens het sporten</td>
                <td>Vult vocht aan dat je verliest via zweet</td>
              </tr>
              <tr>
                <td>Na het sporten</td>
                <td>Helpt bij herstel en aanvullen van vochtbalans</td>
              </tr>
              <tr>
                <td>Bij warm weer</td>
                <td>Voorkomt uitdroging door verhoogd zweten</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Moet je water drinken bij elke maaltijd?</h2>
        <p>
          Water drinken bij maaltijden is prima, maar het is beter om het grootste
          deel van je vocht tussen de maaltijden door te drinken. Zo blijft je
          hydratatie gelijkmatiger verdeeld over de dag.
        </p>

        <h2>Is 's avonds veel drinken een goed idee?</h2>
        <p>
          Voldoende drinken overdag is belangrijker dan 's avonds grote hoeveelheden
          water nemen. Veel drinken vlak voor het slapen kan je nachtrust verstoren
          doordat je vaker moet plassen.
        </p>

        <h2>Signalen dat je eerder moet drinken</h2>
        <ul>
          <li>Dorstgevoel</li>
          <li>Droge mond of lippen</li>
          <li>Donkere urine</li>
          <li>Vermoeidheid of concentratieverlies</li>
        </ul>

        <h2>Hoe verdeel je je waterinname over de dag?</h2>

        <p>
            Je lichaam neemt vocht beter op wanneer je regelmatig kleine hoeveelheden drinkt.
            In plaats van in korte tijd veel water te drinken, kun je je vochtinname beter
            verdelen over vaste momenten.
        </p>

        <ul>
            <li>Begin je dag met 1 glas water na het opstaan</li>
            <li>Drink 1-2 glazen in de ochtend tussen maaltijden</li>
            <li>Neem water rond lichamelijke inspanning</li>
            <li>Drink verspreid in de middag en vroege avond</li>
            <li>Beperk grote hoeveelheden vlak voor het slapen</li>
        </ul>

        <p>
            Door deze spreiding blijft je vochtbalans stabieler en voorkom je grote schommelingen in energie of concentratie.
        </p>

        <h2>Veelgestelde vragen over drinkmomenten</h2>

        <FAQAccordion
          items={[
            {
              question: "Moet je wachten met drinken tot je dorst hebt?",
              answer: "Nee, dorst is een laat signaal. Het is beter om regelmatig kleine hoeveelheden water te drinken.",
            },
            {
              question: "Is water drinken in de ochtend belangrijk?",
              answer: "Ja, na de nacht heeft je lichaam vocht verloren. Een glas water na het opstaan helpt je hydratatie snel herstellen.",
            },
            {
              question: "Hoeveel moet je drinken tijdens het sporten?",
              answer: "Dit verschilt per persoon, maar vaak 0,5 tot 1 liter per uur bij intensieve inspanning.",
            },
            {
              question: "Is 's avonds veel water drinken slecht?",
              answer: "Niet slecht, maar het kan je slaap verstoren doordat je vaker moet plassen.",
            },
          ]}
        />

        <h2>Wanneer moet je minimaal water drinken?</h2>

        <p>
        Je zou in elk geval water moeten drinken op deze momenten:
        </p>

        <ul>
            <li>Na het opstaan</li>
            <li>Voor, tijdens en na het sporten</li>
            <li>Bij warm weer</li>
            <li>Wanneer je dorst hebt</li>
            <li>Wanneer je urine donkerder wordt</li>
        </ul>

        <h2>Samenvatting</h2>
        <p>
          Regelmatig kleine hoeveelheden water drinken verspreid over de dag helpt je
          lichaam beter gehydrateerd te blijven. Vooral na het opstaan, rond
          inspanning en bij warm weer is voldoende drinken belangrijk.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je automatisch herinneringen om water te drinken?</h2>

        <p>
          FitLifeTool helpt je om je vochtinname over de dag te spreiden met inzicht in je persoonlijke hydratatiedoel.
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
