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

## Ontwerpbesluit 2026-11-01

**Onderwerp:** Productdatabase en FitLifeScore 2.0. **Besluitstatus:**
goedgekeurde functionele ontwerpuitgangspunten; geen goedgekeurde
formulewijzigingen, implementatie of release. Herkomst: het aangeleverde
eigenaarbesluit
`FitLifeTool_Productdatabase_FitLifeScore_2_0_Ontwerpbesluit_2026-11-01.md`,
gebaseerd op de read-only productdatabase-audit van 1 november 2026 en de
eigenaarbevestiging in ChatGPT op dezelfde datum.

Deze gedateerde aanvulling beschrijft het goedgekeurde doelbeeld en het nog
open onderzoek. Zij stelt niet dat de bestaande Excel- of applicatieketen dit
al uitvoert. Handbook 2.5–2.7 blijven eigenaar van de bestaande architectuur;
de [officiële Core-roadmap](../project/CORE_APPLICATION_ROADMAP.md) op `develop`
blijft de enige bron voor de twaalf Core-fasen, volgorde, prioriteiten en
voortgang. De eerdere besluiten en goedgekeurde parallelle werkzaamheden
blijven behouden.

### Vastgestelde invoer- en modeluitgangspunten

- De scheiding tussen bronimport, berekening en export blijft uitgangspunt.
  Nieuwe product-/bereidingsrecords bevatten productidentiteit, productgroep,
  bereiding, bron/provenance, eenheid en feitelijke voedingswaarden.
- Productgegevens worden éénmaal vastgelegd of geïmporteerd. LOSE-, MAINTAIN-
  en GAIN-scores worden automatisch en deterministisch afgeleid met de
  toepasselijke centrale modelinstellingen. Curveparameters en modifiers
  worden niet per nieuw product handmatig overgenomen.
- Eén centrale modeldefinitie levert de toepasselijke parameters. De feitelijke
  Excel- en applicatiearchitectuur wordt eerst getoetst; dit besluit schrijft
  geen nieuwe fysieke werkbladen, tabellen of databasevelden voor.
- Groeps- en bereidingsmodifiers zijn in het doelbeeld standaard nul.
  Afwijkingen vereisen een expliciete, toetsbare reden. Dit is geen opdracht
  om bestaande modifiers nu te wijzigen.
- Absolute voedingskundige bijdrage en relatieve positie binnen een
  productgroep blijven onderscheiden: drie gram eiwit blijft drie gram eiwit,
  ongeacht productgroep. Groepsvergelijkingen mogen de voedingsbijdrage niet
  onbedoeld vertekenen. Groepsspecifieke parameters vereisen aangetoonde
  inhoudelijke meerwaarde.

### Nog te onderzoeken scoremethodiek

De vastgestelde onderzoeksvolgorde begint bij de LOSE-energiecurve, daarna
volgen MAINTAIN, GAIN en andere componenten. Een gekozen curve wordt pas na
onderbouwing, vergelijking en acceptatie geïmplementeerd. Onderzoek afzonderlijk
geschikte functies voor energie, eiwit, vezels, suikers, vetten, natrium/zout,
alcohol en water; niet iedere voedingsstof krijgt dezelfde curve.

- Voor eiwit en vezels kunnen stijgende functies met verzadiging worden
  onderzocht; er is hiermee geen functie of parameter gekozen.
- Totaal vet alleen is onvoldoende om vetkwaliteit te beoordelen.
- Onderscheid totale van vrije/toegevoegde suikers en beoordeel de beschikbare
  brongegevens; ontbrekende suikergegevens zijn geen bewezen nulwaarden.
- Onderzoek afwaardering voor hoge natrium- en alcoholgehalten.
- Voorkom dubbeltelling, onder meer tussen watergehalte en energiedichtheid.
- Wegingen en A–E-grenzen zijn niet wetenschappelijk gevalideerd door de
  technische audit en blijven onderzoeks- en beslispunten. Ook de eerdere
  open vierpijlerweging wordt hier niet ingevuld.

De productscore is niet gelijk aan de dagelijkse VoedingskwaliteitScore.
De dagbeoordeling houdt rekening met hoeveelheden, balans, variatie,
persoonlijke behoeften en volledigheid van registraties. Eén geregistreerd
product bewijst niet dat iemand de hele dag uitsluitend dat product at.
De bestaande F08-eis, inclusief het uitsluitend-sla-acceptatiescenario, blijft
gelden; dit besluit kiest geen dagelijkse aggregatieformule en wijzigt geen
persoonlijke behoeftenberekening of bestaande FitLifeScore-formule.

### Datakwaliteit, eenheden en historische reproduceerbaarheid

- Leg een eenduidig beleid vast voor `0`, ontbrekend, onbekend en niet van
  toepassing. Behandel een ontbrekende bronwaarde niet stilzwijgend als nul.
- De aangeleverde audit rapporteert 20 bevestigde NEVO-afwijkingen: 15 bij
  suiker en 5 bij alcohol. De vastgestelde vervolgrichting is gecontroleerde
  correctie of gedocumenteerde onderbouwing, herstel van de gerapporteerde
  USDA-vezeldubbeltelling in de massabalans en onafhankelijke dichtheidscontroles.
  Deze registratie bewijst geen uitgevoerd herstel en autoriseert geen
  automatische correcties in deze documentatiefase.
- Leg één contract vast voor gram/ml, dichtheid en conversies over import,
  Excel, export en applicatie. Het concrete contract is nog uit te werken.
- Maak scores historisch reproduceerbaar via bronversie, formule-/modelversie,
  parameters en export-/publicatie-identiteit. Een inhoudelijk gewijzigde
  score mag niet ongemerkt dezelfde betekenis onder `score_version = 1`
  behouden. De concrete versie- en publicatie-uitwerking blijft open; het
  reeds vastgestelde historische herberekeningsbeleid blijft gelden.

### Latere acceptatie en bewijsgrenzen

De latere uitvoering moet aantonen dat een nieuw product zonder handmatige
invoer van curveparameters of modifiers kan worden toegevoegd, gelijke
bronwaarden en modelversies dezelfde scores geven, en ontbrekende waarden en
ongeldige eenheden expliciet worden afgehandeld. Centrale modelwijzigingen
moeten toetsbaar zijn, met impactvergelijking per productgroep en zonder
historische resultaten stilzwijgend te herschrijven. Product- en dagkwaliteit
blijven functioneel gescheiden.

Het eigenaarbesluit verwijst naar 5.985 onafhankelijk herberekende formulecellen,
3.040 gecontroleerde exportcellen en 67 geïnventariseerde afgeleide kolommen
in de audit van 1 november 2026. Deze aantallen zijn overgenomen auditbewijs,
geen nieuwe heruitvoering, wetenschappelijke scorevalidatie of volledige
runtimevalidatie. De werkelijke Excel-refresh, VBA-macro's en de applicatie-/
databaseketen moeten bij latere uitvoering nog worden gevalideerd.

F03 behandelt betrouwbare productdata, broncorrecties, invoer-/eenheidscontracten,
validatie, export en relevante versiecontracten. F08 behandelt voedingskundige
kalibratie, scorecurven, wegingen, A–E-grenzen en dagelijkse Voedingskwaliteit.
De eerder besproken zes werkpakketten zijn een inhoudelijke werkvolgorde,
geen nieuwe officiële Core-fasen en geen automatische uitvoeringsgoedkeuring.
Deze documentatie start F03 of F08 niet en wijzigt geen fasestatus.
De Excel-master blijft beschermd tegen directe AI/Codex-wijzigingen; deze
registratie verleent geen Excel-, VBA-, applicatie-, database-, formule- of
releaseautorisatie. De overige werkboek- en veiligheidsafspraken blijven gelden.

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
