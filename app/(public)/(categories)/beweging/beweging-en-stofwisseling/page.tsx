// app/(public)/(categories)/beweging/beweging-en-stofwisseling/page.tsx

import CategoryGrid from "@/components/layout/CategoryGrid";
import RegisterButton from "@/components/cta/RegisterButton";
import Accordion from "@/components/ui/Accordion";

export default function StofwisselingPage() {
  return (
    <CategoryGrid>
      {/* ================= RIJ 1 ================= */}

      <div className="category-card category-intro-card category-equal-card seo-intro-text">
        <div className="category-label">BEWEGING</div>

        <h1>Hoe beïnvloedt beweging je stofwisseling?</h1>

        <p>
          Beweging heeft een directe invloed op je <strong>stofwisseling</strong>, het proces waarbij je lichaam energie verbruikt om te functioneren. 
          Door regelmatig te bewegen verhoog je je dagelijkse energieverbruik en verbeter je hoe efficiënt je lichaam met brandstof omgaat.
        </p>

        <p>
          Zowel lichte dagelijkse activiteit als intensieve training zorgen ervoor dat je lichaam meer calorieën verbrandt, niet alleen tijdens het bewegen, maar ook daarna.
        </p>
      </div>

      <div className="category-card category-equal-card category-image-fill seo-intro-image">
        <img
          src="/images/categories/activity-metabolism.png"
          alt="Persoon in beweging als symbool voor verhoogde stofwisseling"
        />
      </div>

      {/* ================= RIJ 2 ================= */}

      <div className="category-span-full category-card category-article">
        <h2>Wat is je stofwisseling precies?</h2>
        <p>
          Je stofwisseling (metabolisme) is het geheel van processen waarmee je lichaam energie aanmaakt en gebruikt, dit gebeurt continu, zelfs wanneer je rust.
        </p>

        <ul>
          <li><strong>Ruststofwisseling (BMR)</strong> - energie die je lichaam in rust verbruikt</li>
          <li><strong>Activiteitsverbruik</strong> - energie die je verbruikt door bewegen</li>
          <li><strong>Thermisch effect van voeding</strong> - energie die nodig is om voedsel te verteren</li>
        </ul>

        <h2>Hoe verhoogt beweging je stofwisseling?</h2>
        <p>
          Beweging verhoogt je energieverbruik op meerdere manieren. Tijdens inspanning
          verbrandt je lichaam direct calorieën, maar ook daarna blijft je verbranding
          tijdelijk verhoogd.
        </p>

        <div className="table-scroll handbook">
          <table className="table label-column">
            <thead>
              <tr>
                <th>Effect van beweging</th>
                <th>Wat gebeurt er in je lichaam?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tijdens activiteit</td>
                <td>Spieren gebruiken meer energie, hartslag en ademhaling stijgen</td>
              </tr>
              <tr>
                <td>Na inspanning</td>
                <td>Je lichaam herstelt en blijft tijdelijk extra calorieën verbranden</td>
              </tr>
              <tr>
                <td>Op lange termijn</td>
                <td>Meer spiermassa verhoogt je ruststofwisseling</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>De rol van spiermassa</h2>
        <p>
          Spieren verbruiken meer energie dan vetweefsel, zelfs in rust. Hoe meer
          spiermassa je hebt, hoe hoger je rustverbranding. Krachttraining is daarom
          een effectieve manier om je stofwisseling op lange termijn te verhogen.
        </p>

        <h2>Cardio vs krachttraining voor je stofwisseling</h2>
        <ul>
          <li><strong>Cardio</strong> verhoogt vooral je calorieverbruik tijdens de activiteit</li>
          <li><strong>Krachttraining</strong> verhoogt je verbranding langdurig via spieropbouw</li>
          <li>Een combinatie van beide geeft het beste effect</li>
        </ul>

        <h2>Waarom regelmatig bewegen belangrijker is dan intensiteit</h2>
        <p>
          Dagelijkse lichte beweging (wandelen, fietsen, traplopen) telt sterk mee
          voor je totale energieverbruik. Veel kleine momenten van activiteit kunnen
          samen een groot verschil maken voor je stofwisseling.
        </p>

        <h2>Veelgestelde vragen over stofwisseling en beweging</h2>

        <Accordion
          items={[
            {
              question: "Verhoogt sporten mijn stofwisseling blijvend?",
              answer: "Ja, vooral krachttraining kan je ruststofwisseling verhogen door meer spiermassa op te bouwen.",
            },
            {
              question: "Is cardio of krachttraining beter voor vetverbranding?",
              answer: "Cardio verbrandt meer calorieën tijdens de training, maar krachttraining verhoogt je verbranding op lange termijn.",
            },
            {
              question: "Kan ik mijn stofwisseling versnellen met alleen beweging?",
              answer: "Beweging helpt, maar voeding, slaap en stress spelen ook een belangrijke rol.",
            },
            {
              question: "Blijft mijn verbranding hoger na het sporten?",
              answer: "Ja, na intensieve inspanning blijft je lichaam tijdelijk extra calorieën verbranden tijdens het herstel.",
            },
          ]}
        />

        <h2>Samenvatting</h2>
        <p>
          Beweging verhoogt je stofwisseling direct tijdens activiteit en indirect
          op lange termijn via spieropbouw. Door dagelijks te bewegen en krachttraining
          toe te voegen, ondersteun je een hogere rustverbranding en betere energiebalans.
        </p>
      </div>

      {/* ================= RIJ 3 — CTA ================= */}

      <div className="category-span-full category-card">
        <h2>Wil je zien hoeveel beweging bijdraagt aan jouw verbranding?</h2>

        <p>
          FitLifeTool laat zien hoeveel calorieën je verbruikt door dagelijkse activiteit
          en training, en hoe dit samenhangt met je stofwisseling.
        </p>

        <div className="hero-cta">
          <RegisterButton className="hero-primary-btn">
            Start met je activiteit bijhouden
          </RegisterButton>
        </div>
      </div>
    </CategoryGrid>
  );
}
