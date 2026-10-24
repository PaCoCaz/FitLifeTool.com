# FitLifeTool-projectcontext

## Doel

FitLifeTool is een meertalig gezondheids- en voedingsplatform voor voeding,
hydratatie, activiteit, adaptieve doelen en de FitLifeScore. Het is niet alleen
een calorieënteller. De interpretatielaag zet ruwe gebruikers- en productdata
om in voortgang, status en coachingfeedback waarmee een gebruiker gedurende de
dag kan bijsturen.

De applicatie gebruikt Next.js App Router, TypeScript, Supabase en Tailwind CSS.

## Kernoriëntatie

- FitLifeTool is daggedreven: een kalenderdag is de primaire aggregatie-eenheid.
- Brondata wordt opgeslagen; afgeleide voortgang, status en dagscores worden
  centraal herberekend.
- Referentiedata en gebruikersdata hebben gescheiden verantwoordelijkheden.
- De runtime-applicatie gebruikt gevalideerde productreferentiedata;
  productbeheer is een afzonderlijk toolingdomein.
- De UI is mobile-first en meertalig en mag geen businesslogica verbergen.
- Bestaande architectuur wordt uitgebreid voordat nieuwe patronen worden
  geïntroduceerd.

Belangrijke verschillen:

- FitLifeScore is niet hetzelfde als een productscore op productniveau.
- Een productscore is geen persoonlijke voedingsbehoefte.
- Score is niet hetzelfde als status.
- Brondata is niet hetzelfde als afgeleide data.
- Supabase runtime-productopslag is niet de bron van productwaarheid.
- Productbeheertooling is niet de runtime-applicatie.
- Een auditbevinding is geen goedgekeurde businessregel.

Doelafhankelijke scores op productniveau uit Excel/Product Intelligence mogen
niet rechtstreeks worden gebruikt om BMR, TDEE, macrodoelen, eiwitbehoeften,
vezelbehoeften, suikerbehoeften, hydratatiebehoeften, NutritionScore,
HydrationScore of FitLifeScore te bepalen. Dit is een guardrail tegen een
onjuiste koppeling; het wijzigt geen enkele scoremethodologie.

## Systeem- en documentatiekaart

- **Webapplicatie/runtime:** gedrag van de Next.js-applicatie, gebruikersflows
  en runtimeberekeningen.
- **Developer Handbook:** canonieke functionele, technische en architectuur-
  documentatie in `app/(app)/handbook/`.
- **Productbeheer / Excel-tooling:** afzonderlijk toolingdomein voor
  productinvoer, berekening, validatie en export. Deze projectkaart
  documenteert geen afzonderlijke interne werking van VBA-modules.
- **Supabase:** runtime-opslag voor gebruikersdata en gevalideerde
  product-/referentiedata; het is op zichzelf niet de upstream bron van
  productwaarheid.
- **Product Data Governance:** canonieke operationele productdatamethodologie
  in `docs/product-data/PRODUCT_DATA_GOVERNANCE.md`.

Gebruik deze router om de diepste canonieke bron te vinden:

- Projectvoortgang, Account & Security-roadmap en historisch bewijs →
  [centraal projectstatusdossier](docs/project/README.md); lees de peildatum en
  houd lokale validatie, historische resultaten en Production-status gescheiden.
- De enige officiële Core-planning én fasevoortgang (SSOT), inclusief visie,
  twaalf fases, voorgestelde volgorde, acceptatie, status en bewijs →
  [Core Application-roadmap](docs/project/CORE_APPLICATION_ROADMAP.md) op `develop`.
  Verplicht raadplegen bij iedere ontwikkel-, ontwerp-, validatie-, release-
  of prioriteringsopdracht. PLANNED/IN PROGRESS/BLOCKED/DONE betekenen geen
  nieuwe uitvoeringstoestemming; DONE vereist toepasselijk bewijs.
  Bij ontbrekende actuele bron: melden vóór fasekeuze. A&S en vroeg UX-ontwerp
  lopen parallel; start een volgende fase niet automatisch.
- Projectbrede ChatGPT-instructietekst, bronversies en praktische toegang →
  [centrale lees- en overdrachtsafspraken](docs/project/README.md).
  Projectstatus is het regieportaal, geen tweede Core-fasestatusregister.
  Een upload is niet automatisch Git-gesynchroniseerd; de projectinstellingen
  moeten door de eigenaar worden geplaatst als de beschikbare tools dat niet kunnen.
- Commerciële/financiële planning → [basisplan en aangewezen Word-master](docs/project/COMMERCIAL_FINANCIAL_BASELINE.md).
  De samenvatting is afgeleid, geen tweede master; externe Word-toegang is niet
  universeel bewezen. Bedragen zijn planning, geen financiële validatie.

- Architectuur en kernprincipes → Handbook H1
- Identiteit, dag-/datamodel en producten → Handbook H2
- FitLifeScore, status en voortgang → Handbook H3
- UI-systeem en componenten → Handbook H4
- Ontwikkeling, release, AI, testen en public web → Handbook H5
- Productdatabronnen, porties, units, provenance, naamgeving en
  deterministische sortering → `docs/product-data/PRODUCT_DATA_GOVERNANCE.md`

Handbook 2.5–2.7 blijven canoniek voor Product Intelligence,
productuitbreiding, runtime-alias-/zoekarchitectuur, export en synchronisatie.
Handbook 5.11 blijft canoniek voor Public Web, SEO and Performance Architecture.

## Invarianten en open beslissingen

- Er is nog geen canoniek productiewerkboek formeel aangewezen. Import-, test-
  en back-upwerkboeken zijn nooit automatisch een bron van waarheid.
- `Database Products FitLifeTool (master).xlsm` is beschermd tegen directe
  wijzigingen door AI/Codex. Die bescherming wijst het bestand niet aan als
  het canonieke productiewerkboek.
- Voedings- en activiteitenlogs zijn eventregistraties. `weight_logs` is een
  dagelijkse snapshot en de huidige implementatie kan hetzelfde
  `user_id + log_date`-record bijwerken.
- Een live `hydration_logs`-tabel is een auditbevinding / drift / open issue.
  Los dit niet zelfstandig op en behandel het niet als goedgekeurde
  architectuur.
- Persistentie van portion provenance in Excel, Supabase, tabellen of kolommen
  is nog niet besloten.
- Auditbevindingen over de productscoremethodologie zijn geen goedgekeurde
  formules of nieuwe scoreregels.
- Persistente identifiers en historische compatibiliteit moeten behouden
  blijven.

## Omgaan met onzekerheid

Raadpleeg altijd de diepste canonieke bron die eigenaar is van het onderwerp.
Als documentatie en implementatie conflicteren, rapporteer dan het conflict in
plaats van te gokken. Implementatie is een verificatiebron, maar mag
documentatie niet stilzwijgend herschrijven. Nieuwe architectuur of
businessregels vereisen expliciete goedkeuring voordat zij canoniek worden.
