// app/handbook/chapter-04/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

export default async function Chapter04Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔐 Alleen ingelogde gebruikers
  if (!user) {
    redirect("/login");
  }

  // 🔐 Alleen owner / admin / developer
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    !["owner", "admin", "developer"].includes(profile.role)
  ) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <article
        className="
          prose prose-slate
          prose-headings:font-semibold
          prose-headings:text-[#191970]
          prose-h1:text-3xl
          prose-h2:text-2xl
          prose-h3:text-xl
          prose-p:leading-relaxed
          prose-li:my-1
          prose-ul:pl-6
          prose-ol:pl-6
          prose-code:bg-gray-100
          prose-code:px-1
          prose-code:py-0.5
          prose-code:rounded
          prose-pre:bg-[#0F172A]
          prose-pre:text-gray-100
          prose-pre:rounded-lg
          prose-pre:p-4
          prose-hr:my-10
          max-w-none
        "
      >
        <h1>B3. Dagdoelen, herberekening & morgen-preview</h1>

        <p>
          Dit hoofdstuk beschrijft de dagdoelen-infrastructuur van FitLifeTool.
          Dagdoelen vormen het vaste referentiekader voor logging, scoring en
          gebruikersfeedback.
        </p>

        <h2>4.1 Wat zijn dagdoelen?</h2>
        <p>
          Dagdoelen zijn vaste waarden die gelden voor één kalenderdag
          (00:00–23:59, lokale tijd). Ze worden niet realtime aangepast en
          veranderen nooit midden op een dag.
        </p>

        <ul>
          <li>Hydratatie (ml)</li>
          <li>Dagelijkse activiteiten (kcal)</li>
          <li>Voeding – basis calorie-doel</li>
        </ul>

        <h2>4.2 Waarom dagdoelen immutabel zijn</h2>
        <p>
          FitLifeTool voorkomt dat gebruikers achteraf worden beloond of
          gestraft. Daarom werken gewichtswijzigingen altijd pas vanaf de
          volgende dag door.
        </p>

        <h2>4.3 Gewicht als primaire driver</h2>
        <p>
          Gewicht kan meerdere keren per dag worden aangepast, maar dagdoelen
          worden slechts één keer per dag vastgesteld. Dit voorkomt
          inconsistenties in voortgang en scoreberekening.
        </p>

        <h2>4.4 Herberekening bij dagwissel</h2>
        <p>
          Dagdoelen worden uitsluitend herberekend bij het detecteren van een
          nieuwe kalenderdag. Er zijn geen cronjobs of achtergrondprocessen
          nodig.
        </p>

        <h2>4.5 Bron van waarheid</h2>
        <p>
          De <code>profiles</code>-tabel is de enige bron van waarheid voor
          actieve dagdoelen. Alle cards lezen hieruit en schrijven nooit zelf
          doelen weg.
        </p>

        <h2>4.6 useDailyGoals (conceptueel)</h2>
        <p>
          Binnen de applicatie bestaat exact één logische plek waar dagdoelen
          worden beheerd. Deze detecteert dagwissel, herberekent doelen en stelt
          read-only data beschikbaar aan de UI.
        </p>

        <h2>4.7 Morgen-preview</h2>
        <p>
          De morgen-preview is een UX-laag die transparant toont welke doelen
          morgen actief worden. Deze preview schrijft niets weg en gebruikt
          exact dezelfde formules als de echte dagdoelen.
        </p>

        <h2>4.8 Relatie met activiteit en voeding</h2>
        <p>
          Het activiteitsdoel is een minimaal beweegdoel. Extra activiteit telt
          als calorie-bonus en vergroot de calorie-ruimte, maar verlaagt nooit
          het basisdoel.
        </p>

        <h2>4.9 Wat deze architectuur voorkomt</h2>
        <ul>
          <li>Race conditions</li>
          <li>Dubbele writes</li>
          <li>Inconsistente scores</li>
          <li>Onverklaarbare UI-veranderingen</li>
        </ul>

        <hr />

        <p>
          Volgend hoofdstuk: <strong>Chapter 05 — Scoring & dagschema’s</strong>
        </p>
      </article>
    </div>
  );
}
