# Productdatagovernance

## Scope en eigenaarschap

Dit document is de canonieke bron voor de operationele
productdatamethodologie van FitLifeTool. Het vult Developer Handbook 2.5–2.7
aan; het vervangt die hoofdstukken niet.

Handbook 2.5 is eigenaar van Product Intelligence en de runtime
discoveryarchitectuur. Handbook 2.6 is eigenaar van de
productuitbreidingspipeline. Handbook 2.7 is eigenaar van export,
synchronisatie en de gerealiseerde aliasflow. Dit document is eigenaar van de
gedetailleerde werkregels voor bronnen, porties, units, provenance, naamgeving
en deterministische sortering.

Productbeheer in Excel/VBA is een afzonderlijk toolingdomein naast de
runtime-applicatie. De interne werking van afzonderlijke VBA-modules valt
buiten dit document.

## Werkboekgovernance

Er is nog geen canoniek productiewerkboek formeel aangewezen. Import-, test- en
back-upwerkboeken zijn nooit automatisch een bron van waarheid. De naam,
inhoud of wijzigingsdatum van een bestand kent die rol niet toe.

`Database Products FitLifeTool (master).xlsm` is beschermd:

- AI/Codex mag het bestand nooit rechtstreeks wijzigen.
- Inhoudelijke wijzigingen worden voorbereid via
  `FitLifeTool Product Import.xlsx` of handmatig uitgevoerd in het
  masterwerkboek.
- De rol van het bestand is beperkt tot synchronisatie, berekening en
  validatie.
- Deze bescherming betekent **niet** dat het werkboek de formeel aangewezen
  canonieke productiebron is. Dat blijft een open beslissing van de eigenaar.

## Bronmethodologie

NEVO is de primaire voorkeursbron voor voedingswaarden. Wanneer NEVO geen
geschikte waarde bevat, wordt de bestaande fallbackhiërarchie gebruikt:

1. NEVO;
2. vergelijkbare officiële voedingsdatabases;
3. fabrikantgegevens;
4. berekende fallbackwaarden, uitsluitend waar de bestaande workflow dit
   toestaat.

Bewaar altijd bron- en provenancemetadata. Een auditbevinding geeft geen
toestemming voor een nieuwe berekening of scoreregel.

### NEVO-bestandsworkflow

Gebruik voor read-only productgroepanalyses standaard:

`Sources/NEVO/NEVO2025_FitLifeTool_extract.csv`

Het oorspronkelijke bestand blijft gezaghebbend voor definitieve
voedingswaarden, bronvalidatie, implementatie van
`PRODUCT_PREPARATIONS_IMPORT` en controles vóór het schrijven:

`Sources/NEVO/NEVO2025_v9.0.xlsx`

Het extract is een hulpmiddel voor analyses; het vervangt het oorspronkelijke
bestand niet voor definitieve bronvalidatie of voorbereiding van
schrijfacties.

## Portie Online-methodologie

Gebruik de ongewijzigd samengevoegde officiële RIVM-exports van Portie Online,
versie 2026/2.0, als primaire bron voor consumentenporties en huishoudelijke
maten:

`Sources/PortieOnline/PortieOnline_2026_2.0.xlsx`

Gebruik dit bestand voor:

- selectie van consumentenporties;
- gram- en millilitergewichten van maten;
- koppeling van maten aan bestaande FitLifeTool-waarden voor `unit_key`;
- beoordeling of een nieuwe `unit_key` werkelijk nodig is;
- validatie van `PORTIONS_IMPORT`.

De bronhiërarchie voor porties is:

1. Portie Online is primair voor consumentenporties en maten.
2. NEVO blijft primair voor voedingswaarden per 100 g / 100 ml.
3. Een interne FitLifeTool-portieconventie mag alleen worden gebruikt wanneer
   Portie Online geen geschikte maat bevat en de conventie expliciet is
   goedgekeurd.
4. Verzin nooit een portiegewicht wanneer een bronwaarde ontbreekt.

Verwijder of normaliseer bronrecords niet automatisch. Meerdere
`Productnaam`-records met dezelfde NEVO-code en dubbele bronrecords mogen in de
bron blijven bestaan. Selecteer een compacte, gebruikersgerichte verzameling
realistische consumentenporties; kopieer niet automatisch iedere maat uit
Portie Online naar `PORTIONS_IMPORT`.

`GRAM` blijft beschikbaar als exacte invoer voor vaste voeding. Iedere gekozen
portie moet herleidbaar blijven naar een bron of een expliciet goedgekeurde
interne conventie.

## Unitselectie

Hergebruik een bestaande generieke `unit_key` wanneer deze semantisch correct
is. Wanneer een consumentenmaat een eigen betekenis heeft, ken dan een eigen
key toe; voeg maten niet samen alleen omdat hun vorm vergelijkbaar is. Een
snee brood (`snee brood`) is niet dezelfde maat als een dun plakje (`plakje`).

Goedgekeurde generieke units uit de huidige audit:

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

`PLATE` is momenteel niet goedgekeurd als generieke unit, omdat verschillende
bordtypen wezenlijk verschillende hoeveelheden kunnen vertegenwoordigen.
Beoordeel deze unit alleen opnieuw voor een concreet, goedgekeurd productmodel.

`GRAM = 1 g` en `ML = 1 ml` zijn architecturale basisinvoereenheden en hoeven
niet uit Portie Online afkomstig te zijn.

## Slice-semantiek

Voor kaas en vergelijkbare producten:

- `SLICE` betekent een normaal plakje van het product, waaronder een plak met
  een kaasschaaf wanneer dat de relevante Portie Online-maat is.
- `SLICE_PRECUT` betekent een voorgesneden plak.
- `SLICE_SMALL` en `SLICE_LARGE` beschrijven grootte en mogen niet het
  semantische verschil tussen voorgesneden en zelf gesneden modelleren.

Wanneer Portie Online meerdere voorgesneden varianten bevat, neem dan niet
automatisch iedere variant op. Gebruik voor de huidige harde-kaasimplementatie
de gewone Portie Online-maat `voorgesneden plak`; voeg de afzonderlijke variant
`voorgesneden plak (los verpakt)` niet automatisch toe.

## Classificaties voor portion provenance

Dit zijn methodologische/documentatieclassificaties. Zij betekenen **niet**
dat provenance technisch al is opgeslagen in Excel, Supabase, tabellen of
databasekolommen.

### `SOURCE_DIRECT`

De maat en het gewicht komen rechtstreeks uit de primaire Portie Online-bron
voor het relevante product, de relevante bereiding en `source_id`.

### `SOURCE_DERIVED`

De consumentenmaat is exact en reproduceerbaar afgeleid uit één
`SOURCE_DIRECT`-maat:

- er is geen gemiddelde, afronding of inhoudelijke interpretatie nodig;
- de bronmaat vertegenwoordigt consumeerbaar gewicht en bevat geen afval dat
  de afleiding ongeldig zou maken.

Voorbeelden zijn `HALF = 0.5 × WHOLE` en één stuk dat is afgeleid uit een
Portie Online-maat die expliciet het gewicht van een bekend aantal stuks geeft.

### `INTERNAL_CONVENTION`

Een expliciet goedgekeurde FitLifeTool-portie die niet rechtstreeks uit Portie
Online komt en ook niet exact als `SOURCE_DERIVED` kwalificeert. Maak nooit
automatisch een `INTERNAL_CONVENTION`.

Persistentie van provenance blijft een open architectuur-/databesluit. Nieuwe
provenancevelden, -tabellen of -kolommen mogen niet worden geïntroduceerd
zonder een afzonderlijk expliciet goedgekeurd data-/architectuurbesluit.

## Afgeleide porties

Een exact afgeleide consumentenportie zoals `HALF` mag alleen worden gebruikt
wanneer deze aan `SOURCE_DERIVED` voldoet.

`SMALL`, `MEDIUM` en `LARGE` mogen nooit rekenkundig uit elkaar worden
afgeleid. Het zijn categorische bronmaten, geen vaste fracties. Maak niet
automatisch een gemiddelde van verschillende Portie Online-maten.

Daarom kwalificeert noch een braam van 5 g die is gekozen of gemiddeld tussen
2 g en 7 g, noch een framboos van 4 g die is gemiddeld tussen 3 g en 5 g als
`SOURCE_DERIVED`; zulke waarden worden niet automatisch behouden.

## Productdisplaynamen en zoeknamen

Ieder product heeft per taal exact één officiële gebruikersgerichte
displaynaam. Optimaliseer die naam voor herkenbaarheid en zoeken zonder
uitsluitend voor extra zoektermen dubbele producten te maken:

1. Begin, waar dit natuurlijk is, met het belangrijkste zoekwoord, meestal de
   productfamilie.
2. Voeg de belangrijkste onderscheidende eigenschap toe.
3. Gebruik komma's om de onderdelen logisch te scheiden.
4. Houd de naam in iedere taal natuurlijk en gangbaar.

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

Behoud de natuurlijke productnaam wanneer een nationaal of internationaal
bekende zelfstandige naam minder herkenbaar zou worden als deze rond de
productfamilie wordt herschreven. Bestaande voorbeelden zijn `Zoete
aardappel`, `Sweet potato`, `Patate douce`, `Süßkartoffel` en `Batat`.

Een alias is geen officiële displaynaam. De runtime alias- en zoekarchitectuur
blijft canoniek in Handbook 2.5–2.7, inclusief de gerealiseerde
`PRODUCT_SEARCH_ALIASES`-flow; dupliceer die architectuur hier niet.

## Deterministische sortering

Na iedere wijziging, import of synchronisatie moet iedere tabel in een
deterministische volgorde worden opgeslagen. Geen enkele tabel mag in
invoegvolgorde blijven staan.

1. Tabellen die producten bevatten: sorteer oplopend (A–Z) op `product_key`.
2. `PRODUCT_PREPARATIONS` en `PRODUCT_PREPARATIONS_IMPORT`: eerst oplopend op
   `product_key`, daarna oplopend op `preparation.sort_order`. Sorteer
   `preparation_key` nooit alfabetisch.
3. `PRODUCT_SCORES` en `PRODUCT_SCORES_IMPORT`: eerst oplopend op
   `product_key`, daarna op `goal_key` in de vaste volgorde `LOSE`, `MAINTAIN`,
   `GAIN`.
4. Vertalingstabellen: eerst oplopend op de toepasselijke key (`product_key`,
   `preparation_key`, enzovoort), daarna op taal in de vaste volgorde `nl`,
   `en`, `fr`, `de`, `pl`.
5. Referentietabellen: gebruik `sort_order` wanneer die kolom aanwezig is.
   Sorteer alleen alfabetisch op de primaire key wanneer `sort_order` niet
   bestaat.

Sorteer na iedere toevoeging, verwijdering of wijziging van productrecords de
volledige producttabel op `product_key` en hernummer `sort_order` als een
aaneengesloten reeks gehele getallen vanaf `1`. Gebruik nooit decimale
tussenwaarden.

Productclassificatie en scoregedrag blijven gescheiden: `group_display_key` en
`group_model_key` beschrijven de productclassificatie;
`lose_modifier_group`, `maintain_modifier_group` en `gain_modifier_group`
beschrijven scoregedrag en hoeven niet overeen te komen met de productgroep.

## Grenzen en open beslissingen

- Handbook 2.6 en 2.7 blijven canoniek voor export, synchronisatie en
  runtimegebruik.
- Het canonieke productiewerkboek blijft een open beslissing van de eigenaar.
- Persistentie van provenance blijft een open data-/architectuurbesluit.
- Auditbevindingen over de productscoremethodologie zijn geen nieuwe
  scorebusinessregels en mogen niet zonder expliciete goedkeuring in formules
  worden omgezet.
