// app/handbook/chapter-02/page.tsx
export default function Chapter02() {
  return (
    <article className="space-y-12 max-w-4xl">

      {/* Titel */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#191970]">
          H2.1 Profiles & Authorization
        </h1>
        <p className="text-gray-600">
          Gebruikersidentiteit, rollen en toegangscontrole binnen FitLifeTool.
        </p>
      </header>

      {/* Introductie */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Introductie
        </h2>

        <p className="text-gray-700">
          FitLifeTool maakt een strikt onderscheid tussen
          <strong> authenticatie</strong> en <strong>autorisatie</strong>.
          Authenticatie bepaalt <em>wie</em> iemand is, autorisatie bepaalt <em>wat</em> iemand mag.
        </p>

        <p className="text-gray-700">
          Dit hoofdstuk beschrijft hoe gebruikersprofielen zijn opgebouwd,
          waarom er een aparte <code>profiles</code>-tabel bestaat en hoe
          rollen systematisch worden toegepast in de applicatie.
        </p>
      </section>

      {/* Conceptueel model */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Conceptueel model
        </h2>

        <p className="text-gray-700">
          Elke gebruiker in FitLifeTool bestaat uit twee conceptueel
          gescheiden entiteiten:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            <strong>Auth user</strong> - beheerd door Supabase Auth
          </li>
          <li>
            <strong>Profile</strong> - domeinspecifieke gebruikersdata
          </li>
        </ul>

        <p className="text-gray-700">
          Het profiel fungeert als centrale bron voor:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>persoonlijke kenmerken (gewicht, lengte, leeftijd)</li>
          <li>doelstellingen (afvallen, onderhouden, aankomen)</li>
          <li>rol en toegangsrechten</li>
          <li>feature-gating (abonnementen)</li>
        </ul>

        <p className="text-gray-700">
          De applicatie werkt <em>nooit</em> rechtstreeks met alleen de auth-user; vrijwel alle logica verloopt via het profiel.
        </p>
      </section>

      {/* Implementatie */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Implementatie
        </h2>

        <p className="text-gray-700">
          Technisch is deze scheiding geïmplementeerd via:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            Supabase Auth voor login, sessies en tokens
          </li>
          <li>
            Een <code>profiles</code>-tabel gekoppeld via <code>id = auth.user.id</code>
          </li>
          <li>
            Server-side guards in Next.js layouts
          </li>
        </ul>

        <p className="text-gray-700">
          Autorisatie vindt primair plaats op layout-niveau, niet op component-niveau.
          Hierdoor:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>worden ongeautoriseerde pagina’s nooit gerenderd</li>
          <li>blijft client-side code eenvoudiger</li>
          <li>ontstaat er één centrale toegangslogica</li>
        </ul>
      </section>

      {/* Rollen */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Rollenmodel
        </h2>

        <p className="text-gray-700">
          FitLifeTool hanteert een beperkt maar expliciet rollenmodel:
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li><strong>owner</strong> - volledige toegang</li>
          <li><strong>admin</strong> - beheer en moderatie</li>
          <li><strong>developer</strong> - technische inzage</li>
          <li><strong>user</strong> - reguliere eindgebruiker</li>
        </ul>

        <p className="text-gray-700">
          Rollen zijn bedoeld voor <em>autorisatie</em>, niet voor
          monetisatie of feature-ontsluiting.
        </p>
      </section>

      {/* Belangrijke beslissingen */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#191970]">
          Belangrijke beslissingen
        </h2>

        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            Rollen worden server-side afgedwongen
          </li>
          <li>
            UI veronderstelt nooit impliciet toegangsrechten
          </li>
          <li>
            Profieldata is altijd leidend boven auth-metadata
          </li>
          <li>
            Autorisatie gebeurt zo vroeg mogelijk in de render-keten
          </li>
        </ul>

        <p className="text-gray-700">
          Dit voorkomt security-lekken, conditionele spaghetti en
          onvoorspelbaar gedrag bij uitbreiding van het systeem.
        </p>
      </section>

    </article>
  );
}
