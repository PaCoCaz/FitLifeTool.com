// app/(app)/handbook/doc-l3-0019/page.tsx

import DocumentLayout from "../documentLayout";

export default function DocL30019() {
  return (
    <DocumentLayout>

      <header>
        <h1>5.5 Stabiliteit vs Innovatie</h1>
      </header>

      <section>
        <p>
          Dit hoofdstuk beschrijft hoe FitLifeTool omgaat met backward
          compatibility en het gecontroleerd introduceren van breaking changes.
        </p>

        <p>
          Omdat FitLifeTool een levend product is met bestaande gebruikersdata,
          is stabiliteit net zo belangrijk als innovatie.
        </p>
      </section>

      <section>
        <h2>Conceptueel model</h2>

        <p>
          Binnen FitLifeTool geldt het principe dat bestaande data en gedrag
          niet onverwacht mogen breken.
        </p>

        <p>
          Backward compatibility betekent hier:
        </p>

        <ul>
          <li>bestaande gebruikersflows blijven werken</li>
          <li>historische data blijft interpreteerbaar</li>
          <li>UI-wijzigingen veroorzaken geen functioneel verlies</li>
        </ul>

        <p>
          Breaking changes zijn toegestaan, maar uitsluitend wanneer deze
          expliciet gepland en beheerst worden doorgevoerd.
        </p>
      </section>

      <section>
        <h2>Implementatie</h2>

        <p>
          In de praktijk wordt backward compatibility geborgd door:
        </p>

        <ul>
          <li>schema-uitbreidingen in plaats van mutaties</li>
          <li>optionele velden met veilige defaults</li>
          <li>versionering van logica waar nodig</li>
        </ul>

        <p>
          Breaking changes volgen een vast patroon:
        </p>

        <ul>
          <li>oude en nieuwe logica bestaan tijdelijk naast elkaar</li>
          <li>migraties worden expliciet uitgevoerd</li>
          <li>oude paden worden pas later verwijderd</li>
        </ul>

        <p>
          Hierdoor kunnen wijzigingen gecontroleerd en veilig worden uitgerold.
        </p>
      </section>

      <section>
        <h2>Belangrijke beslissingen</h2>

        <ul>
          <li>
            <strong>Stabiliteit boven snelheid:</strong> brekende wijzigingen worden nooit impulsief doorgevoerd.
          </li>
          <li>
            <strong>Expliciete migraties:</strong> data wordt niet stilzwijgend aangepast.
          </li>
          <li>
            <strong>Tijdelijke dubbele paden:</strong> oud en nieuw mogen naast elkaar bestaan.
          </li>
          <li>
            <strong>Documentatie is verplicht:</strong> elke breaking change wordt vastgelegd in het handboek.
          </li>
        </ul>

        <p>
          Deze aanpak voorkomt regressies, beschermt gebruikersdata
          en maakt doorontwikkeling veilig en voorspelbaar.
        </p>
      </section>

    </DocumentLayout>
  );
}
