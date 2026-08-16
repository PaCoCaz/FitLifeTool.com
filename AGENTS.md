# FitLifeTool - AI Agent Instructions

## Purpose

FitLifeTool is a multilingual health and nutrition platform built with:

- Next.js App Router
- TypeScript
- Supabase
- Tailwind CSS

The application focuses on:

- Nutrition
- Hydration
- Activity
- FitLifeScore

FitLifeTool is a day-driven lifestyle system.
The goal is coaching and adaptive feedback, not only tracking.

---

# Documentation Priority

The internal Developer Handbook is the canonical source of truth.

Location:

app/(app)/handbook/

Before modifying:

- architecture
- database
- scoring
- UI patterns
- data flow

consult the handbook first.

If implementation and documentation conflict:
ask before changing.

Do not invent new patterns.

---

# Core Architecture Rules

## Day-based model

A calendar day is the primary aggregation unit.

A day is derived from logs.

Do not introduce separate day state unless explicitly requested.

---

## Logs

User actions are stored as logs.

Examples:

- nutrition_logs
- activity_logs
- weight_logs

Principles:

- logs are source data
- derived values are recalculated

Nutrition and activity are event logs and are appended as new user actions.
Hydration is derived from nutrition logs and product water data; the current
implementation has no separate `hydration_logs` table.

`weight_logs` represents a daily weight snapshot. The current implementation
may upsert the snapshot for the same user and calendar date.

Do not store calculated progress or scores.

---

# Derived Data

The following are derived:

- progress
- status
- FitLifeScore
- dashboard values

They should always be reproducible from:

- user profile
- goals
- logs
- reference data

---

# FitLifeScore Rules

FitLifeScore is proprietary.

Never change scoring logic unless explicitly instructed.

The system consists of:

- Nutrition
- Hydration
- Activity

Weights:

- Nutrition: 40%
- Hydration: 30%
- Activity: 30%

Scores are numeric indicators.

Status is separate from score.

Do not determine live status only from numeric score.

---

# Domain Interaction Rules

Domains have independent responsibility but can influence each other.

Important:

Activity directly increases the available Nutrition budget.

Flow:

Activity
↓
activity calories
↓
Nutrition daily limit adjustment
↓
NutritionScore recalculation

Do not remove this relationship.

---

# Expected vs Actual Progress

FitLifeTool compares:

expected progress
=
where the user should approximately be based on time

actual progress
=
what the user has logged

Status is based on this comparison.

Being behind is not failure.
Users may intentionally be behind temporarily.

---

# Status System

Status colors are semantic.

Rules:

Green:
- on schedule
- goal reached

Orange:
- slightly behind

Red:
- significantly behind

Blue:
- goal/reference indication only

Do not use blue as "on track".

FitLifeScore status aggregation:

Red has priority.
Then orange.
Green only when all domains are green.

---

# User Interface Rules

FitLifeTool is mobile-first.

Use:

- responsive layouts
- existing grid systems
- existing cards

Reuse before creating.

Preferred:

extend existing components

Avoid:

duplicating components
creating special-case layouts

---

# Cards

Cards are independent domain components.

A card:

- calculates or receives its own domain status
- publishes score/status
- owns its domain presentation

FitLifeScore aggregates.

Do not duplicate card logic inside FitLifeScore.

---

# Translations

Never hardcode user-facing text.

Always use:

- translation keys
- existing language system

All new user-facing features must support multilingual expansion.

---

# Database Rules

Do not modify database schema unless explicitly requested.

Never rename:

- product_key
- existing identifiers
- translation keys

Preserve:

- relations
- historical data
- compatibility

Prefer adding over replacing.

## Sorting Rules

After every change, import, or synchronization, all tables must remain
deterministically sorted.

General rules:

1. Tables containing products
   - Sort by `product_key` ascending (A-Z).

2. `PRODUCT_PREPARATIONS` and `PRODUCT_PREPARATIONS_IMPORT`
   - Primary: `product_key` ascending (A-Z).
   - Secondary: `preparation.sort_order` ascending.
   - Never sort `preparation_key` alphabetically.

3. `PRODUCT_SCORES` and `PRODUCT_SCORES_IMPORT`
   - Primary: `product_key` ascending (A-Z).
   - Secondary: `goal_key` in the fixed order:
     - `LOSE`
     - `MAINTAIN`
     - `GAIN`

4. Translation tables
   - Primary: the key (`product_key`, `preparation_key`, etc.) ascending.
   - Secondary: language order:
     - `nl`
     - `en`
     - `fr`
     - `de`
     - `pl`

5. Reference tables
   - Always use `sort_order` when that column is present.
   - Only when no `sort_order` exists, sort alphabetically by the primary key.

A table must never remain in insertion order. Sorting is a mandatory final step
before saving changes.

---

# Product Database

Reference data is separated from user data.

Products, portions, translations and nutrition models are reference data.

User logs reference these.

Never mix user state into reference tables.

After every addition, removal, or change of product records:

- sort the full table alphabetically by `product_key`
- renumber `sort_order` completely as a contiguous integer sequence starting at `1`
- never use decimal intermediate values

`group_display_key` and `group_model_key` describe a product's classification.
`lose_modifier_group`, `maintain_modifier_group`, and `gain_modifier_group`
describe score behavior only and do not have to match the product group.

## Nutrition Market Discovery

Nutrition market filtering is discovery filtering only. It is not an
authorization boundary.

- When `profiles.food_region` matches an active regional record in
  `nutrition_markets`, the discovery scope is `GLOBAL` plus that
  `food_region`.
- When the region is unsupported, inactive, missing, invalid, or unexpectedly
  equals `GLOBAL`, the discovery scope is `GLOBAL` only.
- `nutrition_markets` is the sole source of truth for supported nutrition
  markets. Never hardcode the supported market list in application code.
- Apply market eligibility before ranking and before the search candidate
  limit. Market membership never changes relevance or ranking.
- Food and drink discovery use the same market resolver.
- Do not market-filter favorites, history, existing logs, direct product URLs,
  explicit `product_key` lookups, or internal/admin functionality.
- `GLOBAL` is a system scope and is never a valid `profiles.food_region`.
- Cross-market exact-match or synonym fallback is not part of phase 1 and must
  not be introduced without a separate approved design.

## Master Database

**Codex mag nooit rechtstreeks wijzigingen aanbrengen in
`Database Products FitLifeTool (master).xlsm`. Alle inhoudelijke wijzigingen
verlopen via `FitLifeTool Product Import.xlsx` of worden handmatig in de master
uitgevoerd. De masterdatabase wordt uitsluitend gebruikt voor synchronisatie,
berekening en validatie.**

## NEVO Sources

For read-only product group analyses, use by default:

`Sources/NEVO/NEVO2025_FitLifeTool_extract.csv`

The original file:

`Sources/NEVO/NEVO2025_v9.0.xlsx`

remains the authoritative source for:

- definitive nutritional values
- source validation
- implementation of `PRODUCT_PREPARATIONS_IMPORT`
- checks before writing

## Portie Online Sources

Voor consumentenporties en huishoudelijke maten wordt standaard gebruikt:

`Sources/PortieOnline/PortieOnline_2026_2.0.xlsx`

Dit bestand bevat de ongewijzigd samengevoegde officiële Portie-online exports,
versie 2026/2.0 van RIVM.

Gebruik deze bron voor:

- selectie van consumentenporties;
- gram- en ml-gewichten van maten;
- mapping naar bestaande FitLifeTool `unit_keys`;
- beoordeling of een nieuwe `unit_key` werkelijk nodig is;
- validatie van `PORTIONS_IMPORT`.

Bronhiërarchie voor porties:

1. `PortieOnline_2026_2.0.xlsx` is de primaire bron voor consumentenporties en
   maten.
2. NEVO blijft de primaire bron voor voedingswaarden per 100 gram / 100 ml.
3. Een FitLifeTool-interne portieconventie mag alleen worden gebruikt wanneer
   Portie Online geen geschikte maat bevat en dit expliciet is goedgekeurd.
4. Verzin nooit zelfstandig portiegewichten wanneer een bronwaarde ontbreekt.

Belangrijke regels:

- Verwijder of normaliseer bronrecords niet automatisch.
- Meerdere `Productnaam`-records met dezelfde NEVO-code zijn toegestaan.
- Dubbele bronrecords mogen in de bron blijven bestaan.
- Voor FitLifeTool wordt uit de beschikbare bronmaten een compacte,
  gebruikersgerichte selectie gemaakt.
- Neem niet automatisch iedere Portie-online maat op in `PORTIONS_IMPORT`.
- Gebruik waar mogelijk bestaande generieke `unit_keys`.
- Introduceer alleen een nieuwe `unit_key` wanneer een belangrijke
  consumentenmaat semantisch niet correct met een bestaande unit kan worden
  weergegeven.
- `GRAM` blijft beschikbaar als exacte invoereenheid voor vaste voeding.
- De gekozen FitLifeTool-porties moeten altijd herleidbaar zijn naar de bron of
  naar een expliciet goedgekeurde interne conventie.

## Units

When a consumer measure has its own meaning and is not semantically equivalent
to an existing unit, assign it its own `unit_key`.

Do not merge distinct user-facing measures merely because they have a similar
shape. A slice of bread (`snee brood`) is not the same as a thin slice
(`plakje`).

## Portie-unitselectie

Goedgekeurde nieuwe generieke FitLifeTool-units:

- `TEASPOON`
- `HANDFUL`
- `FOR_1_TOAST`
- `FOR_1_CRACKER`
- `FLORET`
- `SLICE_PRECUT`
- `WEDGE`

Niet toevoegen op basis van de huidige audit:

- `PLATE`
- `STRIP`
- `BUNDLE`
- `BUNCH`

`PLATE` wordt voorlopig niet als generieke unit toegevoegd omdat verschillende
bordtypen sterk verschillende hoeveelheden vertegenwoordigen. Een bordmaat mag
later opnieuw worden beoordeeld wanneer daar een concreet productmodel voor
nodig is.

## Slice-semantiek

Voor kaas en vergelijkbare producten geldt:

- `SLICE` = een normaal plakje van het product, waaronder een plak met
  kaasschaaf wanneer dat de relevante Portie-online-maat is;
- `SLICE_PRECUT` = een voorgesneden plak;
- `SLICE_SMALL` en `SLICE_LARGE` beschrijven grootte en mogen niet worden
  gebruikt om een semantisch verschil zoals voorgesneden versus zelf gesneden
  te modelleren.

Wanneer Portie-online meerdere varianten van een voorgesneden plak bevat, wordt
niet automatisch iedere variant opgenomen.

Voor de huidige harde kaasimplementatie wordt de gewone Portie-online-maat
`voorgesneden plak` gebruikt. Een afzonderlijke variant `voorgesneden plak (los
verpakt)` wordt niet automatisch toegevoegd.

## Portie-provenance

FitLifeTool onderscheidt conceptueel drie soorten porties:

`SOURCE_DIRECT`

- maat en gewicht komen rechtstreeks uit de primaire Portie-online-bron voor
  de relevante product/preparation/source_id.

`SOURCE_DERIVED`

- de consumentenmaat is exact en reproduceerbaar afgeleid uit één
  `SOURCE_DIRECT`-bronmaat;
- geen gemiddelde, afronding of inhoudelijke interpretatie is nodig;
- de bronmaat vertegenwoordigt consumeerbaar gewicht en bevat geen afval dat
  de afleiding ongeldig maakt.

Voorbeelden:

- `HALF = 0,5 × WHOLE`;
- één stuk uit een Portie-online-maat die expliciet het gewicht van een bekend
  aantal stuks geeft.

`INTERNAL_CONVENTION`

- een expliciet goedgekeurde FitLifeTool-portie die niet rechtstreeks uit
  Portie-online komt en niet exact volgens `SOURCE_DERIVED` kan worden
  berekend.

Verzin nooit automatisch een `INTERNAL_CONVENTION`.

## Afgeleide porties

Exact afgeleide consumentenporties zoals `HALF` mogen worden gebruikt wanneer
aan `SOURCE_DERIVED` wordt voldaan.

`SMALL`, `MEDIUM` en `LARGE` mogen nooit rekenkundig uit elkaar worden afgeleid.
Dit zijn categorische bronmaten en geen vaste fracties.

Gemiddelden tussen verschillende Portie-online-maten worden niet automatisch
gemaakt.

Daarom worden bijvoorbeeld:

- een braam van 5 g als gemiddelde/keuze tussen 2 g en 7 g;
- een framboos van 4 g als gemiddelde tussen 3 g en 5 g;

niet als `SOURCE_DERIVED` beschouwd en niet automatisch behouden.

## Basisunits

`GRAM = 1 g` en `ML = 1 ml` blijven architecturale basisinvoer en hoeven niet
uit Portie-online afkomstig te zijn.

De provenance-classificatie is vooralsnog een ontwerpconcept.

Voeg in deze stap geen provenance-kolommen, tabellen of databasevelden toe.

## Productvertalingen en zoeknamen

De gebruikersgerichte productnaam is primair geoptimaliseerd voor zoeken en
herkenbaarheid.

Gebruik daarom deze volgorde:

1. Begin, wanneer zinvol, met het belangrijkste zoekwoord (meestal de
   productfamilie).
2. Voeg daarna de belangrijkste onderscheidende eigenschap toe.
3. Gebruik komma's om de onderdelen logisch te scheiden.
4. Houd de naam in iedere taal natuurlijk en gangbaar voor eindgebruikers.

Voorbeelden:

- `Kaas, 30+`
- `Kaas, 48+, Goudse`
- `Kaas, Brie`
- `Brood, Volkoren`
- `Brood, Bruin`
- `Melk, Halfvol`
- `Milk, Semi-skimmed`
- `Milk, Whole`
- `Cola, Diet`
- `Cola, Zero`
- `Paprika, Groen`
- `Paprika, Rood`
- `Kool, Rode`
- `Kool, Witte`
- `Kool, Savooie`

Uitzonderingen:

Wanneer een product internationaal of nationaal als zelfstandig product
bekendstaat en het omzetten naar de productfamilie de herkenbaarheid
vermindert, blijft de natuurlijke productnaam behouden.

Voorbeelden:

- `Zoete aardappel`
- `Sweet potato`
- `Patate douce`
- `Süßkartoffel`
- `Batat`

Voeg hetzelfde voedingsmiddel nooit meerdere keren toe uitsluitend voor extra
zoektermen.

Per product bestaat exact één officiële gebruikersnaam per taal.

Synoniemen en alternatieve zoektermen worden in de toekomst beheerd via een
afzonderlijke `PRODUCT_SEARCH_TERMS`-laag.

---

# Development Workflow

Branches:

develop:
active development

main:
production

Rules:

- work on develop
- never commit directly to main
- keep changes small
- maintain backwards compatibility
- follow Handbook sections 5.7 through 5.9 for validation, fast-forward-only
  releases, Codex approval gates and production verification

---

# Code Style

Prefer:

- clarity
- explicit logic
- maintainability

Avoid:

- clever abstractions
- hidden state
- duplicated business rules

---

# When uncertain

Ask before:

- changing architecture
- changing scoring
- changing database structure
- introducing new patterns
