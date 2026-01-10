// app/handbook/chapter-02/page.tsx
export default function Chapter02Page() {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-[#191970]">
          B1. Profiles — gebruikersdata & autorisatie
        </h1>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Wat is een profile?
          </h2>
          <p>
            Elke gebruiker in FitLifeTool heeft exact één profiel
            in de tabel <code>profiles</code>.  
            Dit profiel is de centrale bron voor:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li>persoonlijke gegevens (gewicht, lengte, leeftijd)</li>
            <li>doelstellingen (afvallen, onderhouden, aankomen)</li>
            <li>autorisatie (rol)</li>
            <li>toegangsniveau (abonnement)</li>
          </ul>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Rol vs Abonnement
          </h2>
  
          <p>
            FitLifeTool maakt bewust onderscheid tussen
            <strong> rol </strong> en <strong> abonnement </strong>.
          </p>
  
          <div className="bg-gray-50 border rounded p-4">
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                <strong>role</strong>  
                → bepaalt <em>wat iemand mag</em> binnen het systeem
              </li>
              <li>
                <strong>abonnement</strong>  
                → bepaalt <em>welke features beschikbaar zijn</em>
              </li>
            </ul>
          </div>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Rollen (role)
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li><strong>owner</strong> — volledige toegang</li>
            <li><strong>admin</strong> — beheer & moderatie</li>
            <li><strong>developer</strong> — technische inzage</li>
            <li><strong>user</strong> — reguliere eindgebruiker</li>
          </ul>
  
          <p className="text-gray-600">
            Rollen worden gebruikt voor:
            autorisatie, beveiliging en interne tools
            (zoals dit handbook).
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Abonnementen (abonnement)
          </h2>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li><strong>free</strong></li>
            <li><strong>premium</strong></li>
            <li><strong>pro</strong></li>
            <li><strong>coach</strong> (toekomstig)</li>
          </ul>
  
          <p className="text-gray-600">
            Abonnementen sturen uitsluitend feature-toegang
            (bijv. analytics, coaching, export).
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Ontwerpprincipe
          </h2>
  
          <p>
            Door <strong>rol</strong> en <strong>abonnement</strong> te scheiden:
          </p>
  
          <ul className="list-disc pl-5 text-gray-700">
            <li>kan een coach een free-abonnement hebben</li>
            <li>kan een premium gebruiker géén admin zijn</li>
            <li>blijft autorisatie los van monetisatie</li>
          </ul>
  
          <p className="text-gray-600">
            Dit voorkomt technische schuld en maakt toekomstige
            uitbreidingen eenvoudiger.
          </p>
        </section>
      </div>
    );
  }
  