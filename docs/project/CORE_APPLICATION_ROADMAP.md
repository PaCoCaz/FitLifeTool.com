# Core Application roadmap

**Bronbasis:** Centrale projectdocumentatie V1.1 en de aanvullende
uitvoeringsvolgorde van de projecteigenaar, overgenomen op 24 oktober 2026.
**Officiële bron:** dit bestaande Markdown-bestand is de enige SSOT voor
Core Application-planning en fasevoortgang, aangewezen door de eigenaar op
25 oktober 2026. Canonieke ontwikkelbranch: `develop`.
**Voortgangspeildatum:** 25 oktober 2026.
**Git-basis van de F01-documentatiekandidaat:** `3eba7f1d5ff5dbba5a935bb7cd8866229ab41761`.
V1.1 is op 24 oktober vastgelegd in `c71daa94374e6dd9bbd0b7da860ef2febe3c677e`,
lokaal op develop geïntegreerd en naar origin/develop gepusht.
Het centrale roadmapbeheer is vastgelegd en gepubliceerd in
`3eba7f1d5ff5dbba5a935bb7cd8866229ab41761`. De F01-documentatie is gepubliceerd
in `3e0db7bb9ae3fd34fcfcc39a3ac87ba45c02938d`.
**Besluitenaanvulling:** 28 oktober 2026, lokale ongecommitte kandidaat op die
ontwikkelbasis; de read-only GitHub-controle bevestigt dezelfde develop-SHA.
De historische F01-acceptatie en de fasestatussen van 25 oktober blijven behouden.

Dit register maakt productrichtingen, ontwerpkaders, voorgestelde fases en
bewijsgrenzen centraal vindbaar. Het verleent geen toestemming voor
implementatie, formulewijzigingen of release.

[Projectstatus](FITLIFETOOL_PROJECT_STATUS.md) · [Dossierindex](README.md) ·
[Commercieel basisplan](COMMERCIAL_FINANCIAL_BASELINE.md) ·
[A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) · [Bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md)

## Verplicht projectbreed gebruik en eigenaarschap

Deze roadmap- en workflowafspraken gelden als projectbeleid voor alle bestaande
en toekomstige FitLifeTool-chats en Codex-sessies. De projecteigenaar beslist
over productrichting, prioriteit, faseomvang en acceptatie. ChatGPT en Codex
raadplegen en onderhouden deze ene roadmap binnen hun daadwerkelijk goedgekeurde
scope. Deze opdracht start geen nieuwe ontwikkel- of releasefase.

De twaalf fases en voorgestelde volgorde hieronder blijven ongewijzigd.
Een status `PLANNED` is geen uitvoeringsgoedkeuring. De projectstatus is een
navigatie-/werkstromenregister; zij houdt geen tweede tabel met Core-fasestatussen
bij. Afzonderlijke A&S- en productdatabronnen behouden hun eigen detailplanning
en kandidaatgebonden bewijs. Het Handbook blijft de architectuurbron.

De verplichting wordt ontsloten via [AGENTS.md](../../AGENTS.md),
[CODEX.md](../../CODEX.md), [projectcontext](../../FITLIFETOOL_CONTEXT.md) en de
[centrale lees- en overdrachtsafspraken](README.md). De bestaande externe
`FITLIFETOOL_CHATGPT_WORKFLOW.md` verwijst naar dezelfde bron. De exacte
eenmalige ChatGPT-projectinstructie staat in de dossierindex; zij dupliceert
geen faseplanning.

Dit document wijzigen verandert niet automatisch alle bestaande chats,
werkboomkopieën of cloudprojectinstellingen. Oudere branches kunnen oudere
instructies bevatten. Raadpleeg dan deze develop-versie read-only zonder
beschermde branches/worktrees te wijzigen. Bij ontbrekende actuele bron:
expliciet melden vóór een nieuwe fase wordt gekozen. Commit, push en eventuele
projectinstellingen hebben hun eigen bestaande autorisatie; deze kandidaat
claimt nog geen projectbrede technische uitrol.

## Statusmodel en bewijsniveaus

| Status | Definitie en voorwaarde |
|---|---|
| PLANNED | Opgenomen in de roadmap; start/uitvoering niet als begonnen bewezen. Open ontwerpkeuzes en nog niet vervulde afhankelijkheden zijn zichtbaar. Geen impliciete goedkeuring. |
| IN PROGRESS | Binnen bestaande inhoudelijke goedkeuring begonnen werk; relevante resultaten, open criteria en volgende toegestane stap worden bijgehouden. |
| BLOCKED | Een concrete beperking verhindert voortgang binnen een begonnen/goedgekeurde scope. Vermeld oorzaak, bewijs, eigenaar van de oplossing en veilige hervattingsvoorwaarde. |
| DONE | Alle voor die fase vastgestelde acceptatiecriteria zijn aantoonbaar gehaald, inclusief de toepasselijke integratie-/releasecriteria. Ontbrekend of onbekend bewijs verhindert DONE. |

Nog niet begonnen werk krijgt niet alleen wegens een toekomstige afhankelijkheid
de status BLOCKED. Een geblokkeerd deeltraject kan onder een bredere fase
IN PROGRESS vallen zolang ander toegestaan werk doorloopt. Een fase zonder
bevestigde omvang/acceptatiecriteria kan niet achteraf DONE worden verklaard.

Registreer naast de status altijd afzonderlijk: technisch geïmplementeerd,
lokaal gevalideerd, op develop geïntegreerd, naar origin/develop gepubliceerd,
Preview geverifieerd en Production vrijgegeven. Een lokale build of remote
commit-SHA bewijst geen werkende deployment of Production-smoke.

Een ontwerp-/documentatiefase hoeft geen Production-release te hebben wanneer
dat vooraf expliciet niet van toepassing is; leg dat met de goedgekeurde
fasecriteria vast. Voor fase 11 blijven de bestaande release- en
Production-bewijzen vereist. Deze aanvulling keurt geen nieuwe acceptatiecriteria,
algoritmen of productbesluiten stilzwijgend goed.

## Start, uitvoering, afronding en opvolging

1. **Start:** lees deze actuele roadmap, relevante workflow en detailbronnen.
   Noteer branch, commit, lokale documentdiff, peildatum, fase/werkpakket,
   status, prioriteit, afhankelijkheden, bestaand geldig bewijs en de
   inhoudelijke goedkeuring. Voorkom dubbel onderzoek. Is de actuele bron niet
   toegankelijk of haar actualiteit onbekend, meld dat vóór fasekeuze.
2. **Uitvoering:** houd relevante voortgang bij in deze roadmap zonder
   tussentijdse commits af te dwingen. Respecteer de goedgekeurde scope,
   beschermde bestanden/worktrees en alle STOP-/securitygrenzen.
3. **Afronding:** vergelijk resultaten met de voor die fase afgesproken
   acceptatie- en releasecriteria. Werk status, open punten, bewijsverwijzingen,
   beperkingen en volgende toegestane stap bij. Leg bij een statuswijziging
   datum, oud/nieuw, reden, eigenaarbesluit en kandidaat-/omgevingsbewijs vast.
   Neem deze normale documentatiehandeling waar veilig mogelijk mee in dezelfde
   goedgekeurde afrondings- of releaseopdracht, zonder aparte micro-gate.
4. **Schrijfgrens:** read-only autoriseert geen updates. Bij niet-toegestane
   writes of beschermde overlap rapporteer de ontbrekende roadmapupdate; raak
   geen andere worktree aan om de grens te omzeilen. Staging, commit, push,
   merge en deployment behouden hun afzonderlijke bestaande autorisatie.
5. **Na afronding:** bepaal de volgende inhoudelijke fase vanuit de actuele
   roadmap en afhankelijkheden. Start die niet automatisch; vraag alleen de
   noodzakelijke inhoudelijke goedkeuring, geen herhaling van reeds verleende
   goedkeuring voor normale substappen.

Een herbruikbare voortgangsnotitie vermeldt: fase/werkpakket; datum;
statusovergang of reden waarom status gelijk blijft; criteria en open punten;
exacte kandidaat en bestandsmanifest; uitgevoerde controles met uitkomst en
omgeving; develop-/remote-/releasebewijs voor zover van toepassing; bronlocatie
en bewijsgrenzen; eerstvolgende toegestane stap. Bewaar historische resultaten
en voeg latere verificaties gedateerd toe.

## Brongezag en herkomst

1. [AGENTS.md](../../AGENTS.md), [CODEX.md](../../CODEX.md) en toepasselijke
   workflow bepalen uitvoering en beveiligingsgrenzen.
2. Het [Developer Handbook](<../../app/(app)/handbook/>) blijft leidend voor
   functionele en technische architectuur.
3. Specifieke roadmaps en bewijsregisters blijven eigenaar van status en
   validatie van hun eigen traject, waaronder Account & Security en productdata.
4. Eigenaarbron V1.1 en de aanvulling op de uitvoeringsvolgorde vormen de
   inhoudelijke Core-product- en roadmapbasis.
5. Word v1.0 blijft de commerciële/financiële master; zie de
   [masterverwijzing en afgeleide samenvatting](COMMERCIAL_FINANCIAL_BASELINE.md).

V1.1 is de complete vervangende opdracht binnen dezelfde documentatiefase.
De eerdere schrijfacties zijn geweigerd; daarbij zijn geen bestanden gewijzigd.
Lokale eigenaarbron:
`/Users/paulcastelijns/.codex/attachments/e57138b9-e600-4d62-a3fd-7eebc7c328eb/Geplakte tekst.txt`.
Gelezen SHA-256:
`c29c07e03da1efe2dbfc73285a83b694dee048457e8d9de3196452a8a9e79d70`.
De aanvulling is het daaropvolgende eigenaarbericht in dezelfde chat:
“Aanvulling op de lopende V1.1-documentatieconsolidatie — geen nieuwe opdracht.”
Deze lokale herkomst is niet universeel toegankelijk; de inhoudelijke
besluiten en voorgestelde volgorde zijn daarom hieronder opgenomen.

Het afgeronde documentatie-auditrapport van 24 oktober is hergebruikt:
Core-roadmap ontbrak, Word stond extern, navigatie en commitstatus waren
onvolledig. Eerdere Core-, entitlement-, tijdlijn-, GAP- en value-audits zijn
onderzoekscontext; volledige afzonderlijke versiegebonden rapporten staan niet
als centraal repositorydossier ter beschikking. Een auditopdracht of vermelding
van `INVENTORY: PASS` bewijst geen werkende gebruikersreis. Ontbrekende
kandidaat-SHA's, testuitslagen of acceptaties worden niet ingevuld.

Bij conflicten: onderscheid brongezag, datum en status. Wijzig geen bewezen
technisch feit op basis van een productvoorstel. Dit werkpakket herhaalt geen
code-audit, tests, builds of externe validatie.

## Productvisie en vastgestelde richtingen

FitLifeTool wordt een persoonlijke leefstijlapp die gebruikers helpt doelen
te bereiken en gezondere, evenwichtigere gewoonten te ontwikkelen. Eén
herkenbare ervaring biedt twee complementaire perspectieven:

- **Persoonlijke doelvoortgang:** doe ik vandaag wat nodig is voor mijn doel?
- **Leefstijlkwaliteit:** hoe gezond, gevarieerd en evenwichtig is mijn leefstijl?

V1.1 stelt de algemene visie, persoonlijke doelrichtingen (afvallen, behouden,
aankomen), Leefstijlkwaliteit als kernfunctie, één numerieke hoofd-FitLifeScore,
interne Excel-methodiek, volledige ingelogde-app-UI/UX-herziening en coach-ready
ontwerp als productrichtingen vast. Een tweede numerieke hoofdscore is niet
goedgekeurd. Coaching wordt later afzonderlijk ontwikkeld.

Strategische prioriteit: **eerst Core Application, daarna Public SEO en
vervolgens eventuele mobiele apps**. Bestaande goedgekeurde parallelle
werkzaamheden blijven gerespecteerd. De bestaande zes pijlers blijven:
User-first, SEO-first, Performance-first, Mobile-first, Privacy-first en
Security-first. Security, privacy, herstelbaarheid en noodzakelijke compliance
blijven releasevoorwaarden; de permanente Guard is doorlopend. Operationele
Guard-inrichting is hiermee niet bewezen.

## Besluitstatus en bewijs

| Status | Betekenis |
|---|---|
| Vastgestelde productrichting | Gekozen gebruikerswaarde/richting; geen uitvoeringsgoedkeuring of bewijs van realisatie. |
| Commercieel planningsbesluit | Goedgekeurd zakelijke uitgangspunt; onderliggende tarieven/berekeningen kunnen ongevalideerde aannames blijven. |
| Ontwerpkader / voorstel | Nog uit te werken of te valideren, waaronder mijlpalen, ±2%, zes indicatorgroepen en twaalf fases. |
| Nog te besluiten | Productcontract, algoritme, scope of acceptatie ontbreekt. |
| Gedocumenteerd | Beschreven in een bron; geen zelfstandig bewijs van actuele implementatie. |
| Geïmplementeerd | Vereist herleidbare code op een exacte kandidaatbasis. |
| Gevalideerd | Vereist resultaat, scope, kandidaat, datum en omgeving; een testbestand is geen geslaagde test. |
| Production bevestigd | Vereist afzonderlijk release- en relevant Production-smokebewijs. |

Besluit- en bewijsstatus zijn afzonderlijke dimensies. Een productrichting kan
vaststaan zonder implementatie; een lokaal testresultaat bewijst geen release.
Niet-gevalideerde implementaties worden nooit als afgerond geregistreerd.

## Functionele scope, bronnen en open werkzaamheden

Onderstaande inventaris geeft de V1.1-bronbasis weer. Het F01-releasecontract
1.0 hieronder concretiseert de eerste release, waaronder stappen, favorieten,
eenvoudige ritmes en Pro-positionering. Bestaande bronnen bewijzen
documentatiedekking, geen nieuwe code- of runtimeacceptatie.

| Onderdeel en gebruikerswaarde | Besluit / bestaande bron | Afhankelijkheden en open werk | Acceptatiebewijs en beperking |
|---|---|---|---|
| Dashboard: persoonlijk, overzichtelijk, snel en actiegericht. | Productrichting; [Handbook 4.1](<../../app/(app)/handbook/doc-l3-0010/page.tsx>) en [4.2](<../../app/(app)/handbook/doc-l3-0011/page.tsx>). | Dagcontext, complete reizen, laden/fout/leeg, mobiel, vertalingen en toegankelijkheid; fase 9 vroeg betrekken. | Architectuur beschreven; actuele browser-, visuele en deviceacceptatie niet vastgesteld. |
| Voeding: producten zoeken, hoeveelheden registreren, wijzigen en historisch terugzien. | Productscope; [Handbook 2.2](<../../app/(app)/handbook/doc-l3-0003/page.tsx>). | Productreferenties, hoeveelheden, bereiding, correcties en rechten; fases 3/4. | Basis beschreven; volledige actuele gebruikersreis niet in deze fase gevalideerd. |
| Hydratatie: drank en vochtbijdragen uit voeding bijhouden. | Productscope; Handbook 2.2 beschrijft afleiding uit registraties en productdata. | Waterbijdragen, drankregistratie en dagtotalen; fases 3/4. | Geen databasecheck; bestaande hydration_logs-drift blijft open, geen schemawijziging goedgekeurd. |
| Activiteit: beweging registreren, corrigeren en analyseren. | Productscope; [Handbook 3.6](<../../app/(app)/handbook/doc-l3-0028/page.tsx>) beschrijft selectie, minuten en calorie-preview. | Gewichtsbron/fallback is volgens 3.6 open; correcties, analyse en intensiteitscontract; fases 4/6. | Documentatie met open architectuurvraag; geen nieuwe formule of complete reisacceptatie vastgesteld. |
| Gewicht en persoonlijke doelen: metingen, trends, afvallen/behouden/aankomen. | Doelrichtingen vastgesteld; adaptieve aanpasbare mijlpalen en ±2%-standaard als ontwerpkaders. | Trend over zeven kalenderdagen bij voldoende gegevens, dekking/algoritmen/veiligheidsgrenzen open; fase 5. | Geen actuele integrale implementatie- of acceptatieverklaring voor dit doelontwerp. |
| Historie: betrouwbare eerdere dagen en correcties. | V1.1: eerdere registraties niet stilzwijgend laten veranderen door latere product-, doel-, profiel- of methodewijziging; [Handbook 2.3](<../../app/(app)/handbook/doc-l3-0004/page.tsx>) beschrijft herberekening. | Historische berekeningscontracten, geldigheid en reproduceerbaarheid; fases 1/4. Geen opslagmodel hiermee gekozen. | Spanning tussen herberekenen en historische stabiliteit blijft contractvraag; implementatie niet aangepast of conform verklaard. |
| Combinaties: voedings-, drank- en trainingssjablonen hergebruiken. | V1.1: hoeveelheid of duur per registratie aanpassen zonder oorspronkelijk sjabloon te wijzigen. | Componenten/logs behouden, bewerken/verwijderen, intensiteit en rechten; fase 6. | Complete template-implementatie/acceptatie niet vastgesteld; niet als gereed of geheel afwezig veronderstellen. |
| Persoonlijke ritmes: eigen dagindeling, uitzonderingen en wisselende diensten. | Productscope; bestaande kalenderdagarchitectuur blijft leidend. | Weekdagen, nachtwerk, rotaties, tijdzone/DST, historie en schemageldigheid; invloed op verwachtingen versus totalen/score besluiten; fase 7. | Geen nieuwe claim over vaste standaardtijden/formules of werkende persoonlijke schema's. |
| FitLifeScore en Leefstijlkwaliteit: verklaarbare voortgang en inzichten. | Eén hoofdscore als richting; [Handbook 3.1](<../../app/(app)/handbook/doc-l3-0005/page.tsx>) blijft bestaande scorearchitectuurbron. | Contracten, productindicatoren, historie en validatie; fases 1/3/8. | Nieuwe formules/2.0-implementatie en integrale acceptatie niet vastgesteld. |
| Abonnementen: bruikbaar beperkt proefgebruik en betekenisvolle betaalde meerwaarde. | [Commercieel plan](COMMERCIAL_FINANCIAL_BASELINE.md); [Handbook 5.2](<../../app/(app)/handbook/doc-l3-0016/page.tsx>). | Featurematrix, catalogus-/favorietenlimieten, server-side rechten, proefafloop en lifecycle; fases 3/10 en AUTH10/AUTH11. | Canonical bron get_user_plan_features() beschreven; geen bewijs dat ieder pad afdwingt of nieuwe trial/prijzen geïmplementeerd zijn. |
| Productdatabase: betrouwbare gepubliceerde waarden zonder interne methodiek prijs te geven. | [Productdatagovernance](../product-data/PRODUCT_DATA_GOVERNANCE.md) en Handbook 2.5–2.7. | Gevalideerde import, categorieën/indicatoren en versiebeheer; fase 3. | Methodologie aanwezig; geen actuele volledigheids- of databasevalidatie uitgevoerd. |
| Account & Security: veilige toegang, herstel en levenscyclus/privacy. | Eigen [roadmap](ACCOUNT_SECURITY_ROADMAP.md), [bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md), [Handbook 5.10](<../../app/(app)/handbook/doc-l3-0029/page.tsx>). | Open AUTH-, staging-, herstel- en compliancevoorwaarden behouden; fases 2/10. | Historisch AUTH09 lokaal gevalideerd zonder bewezen release; AUTH10 lokale kandidaten met Hosted Staging/Production BLOCKED; back-up zonder volledige restoretest. Niet opnieuw geverifieerd. |
| Coach: latere begeleiding voorbereiden. | Coach-ready richting vastgesteld; implementatie later afzonderlijk. | Verklaarbare, historisch herleidbare indicatoren en latere rechten/flows. | Geen coachactivatie of implementatie goedgekeurd of bewezen. |
| Apple Health / Health Connect: later minder handmatige invoer. | Toekomstig voorstel, fase 12. | Toestemming/intrekken, bronidentiteit, interfaces, synchronisatie en deduplicatie. | Geen werkende koppeling of sync bewezen; niet automatisch in eerste core-release. |

## Gewichtsbegeleiding en historie

Adaptieve, aanpasbare mijlpalen en de aanpasbare standaardbehoudsband van ±2%
zijn ontwerpkaders. Voorkom overreactie op één gewichtsmeting. Trends gebruiken
zeven **kalenderdagen** bij voldoende gegevens; exacte dekkingscriteria,
algoritmen en veiligheidsgrenzen blijven open.

Het historische productbeleid is in F01 door de eigenaar vastgesteld; zie
het goedgekeurde historische herberekeningsbeleid in releasecontract 1.0.
Concrete opslag, historische geldigheid en implementatiecontroles volgen in de
daar aangewezen bestaande fases. Geen snapshots, aparte dagstatus of migraties
worden hiermee voorgeschreven.

## FitLifeScore en Leefstijlkwaliteit 1.0

### Goedgekeurde richting met vier pijlers — 28 oktober 2026

Herkomst: eigenaaropdracht “Core Roadmap Documentatieupdate” in deze chat.
FitLifeScore blijft de **enige overkoepelende numerieke dagscore**, met vier
ondersteunende pijlers: **Voeding, Hydratatie, Activiteit en Voedingskwaliteit**.
Dit is een goedgekeurde productrichting, geen bewijs van implementatie of
scorevalidatie. Het Developer Handbook blijft de architectuurbron voor de
bestaande werking; deze aanvulling beschrijft het te realiseren doelbeeld.

De vierde pijler heeft de volgende vastgestelde namen:

| Taal | Naam |
|---|---|
| NL | Voedingskwaliteit |
| EN | Nutrition Quality |
| FR | Qualité nutritionnelle |
| DE | Ernährungsqualität |
| PL | Jakość odżywcza |

Technische ontwerpnaam: `nutrition_quality_score`. Dit is geen besluit tot
het toevoegen van een databasekolom, opgeslagen dagscore of API-veld.

Voedingskwaliteit beoordeelt de voedingskundige kwaliteit en samenstelling van
de dagelijkse voeding, aanvullend op de doelgerichte VoedingsScore.
Onderzoek doelafhankelijkheid waar inhoudelijk relevant voor afvallen,
gewicht behouden en aankomen. Producteigenschappen, persoonlijke behoeften,
geregistreerde hoeveelheden en de samenstelling van een kalenderdag blijven
onderscheiden. De kwaliteitsmethodiek, indicatoren, drempels, aggregatie en
omgang met onvolledige registratie zijn nog uit te werken in F08, afgestemd
met de productdatabehoeften van F03. Geen tweede numerieke hoofdscore.

#### Goedgekeurde functionele ontwerpeis: productkwaliteit en dagkwaliteit

Aanvullend eigenaarbesluit van 28 oktober 2026: **productkwaliteit is niet
hetzelfde als dagelijkse voedingskwaliteit**. Een afzonderlijk voedingsmiddel
kan een gunstige productscore hebben terwijl een volledige dagvoeding met
uitsluitend dat product voedingskundig onvoldoende is.

**Concreet acceptatiescenario voor F08:** wanneer een gebruiker daadwerkelijk
een hele dag uitsluitend sla eet, mag de dagelijkse VoedingskwaliteitScore
niet hoog uitvallen, ook al scoort sla als afzonderlijk product positief.

De dagbeoordeling moet daarom rekening kunnen houden met:

- voedingskundige balans en toereikendheid;
- gegeten hoeveelheden;
- relevante voedingsmiddelgroepen en variatie;
- persoonlijke voedingsbehoeften en doelen waar toepasselijk;
- betrouwbaarheid en volledigheid van de registratie.

Een eenvoudig gemiddelde van productscores is niet voldoende als volledige
dagbeoordeling. Eén geregistreerd product bewijst op zichzelf niet dat iemand
daadwerkelijk de hele dag alleen dat product heeft gegeten; onvolledige
registratie blijft herkenbaar en wordt niet automatisch als onvoldoende
dagvoeding beoordeeld.

Dit is een **goedgekeurde functionele ontwerpeis**, geen geïmplementeerde of
gevalideerde scoremethodiek. Exacte formules, gewichten, drempelwaarden en
operationalisering van het acceptatiescenario blijven open voor F08.
F03 moet de benodigde betrouwbare product- en bereidingsgegevens voor
voedingsstoffen, hoeveelheden, relevante groepen en datadekking mogelijk maken.
Persoonlijke behoeften en feitelijke daginname blijven gebruikers- en
dagcontext; dit besluit schrijft geen nieuwe importkolommen voor.

De huidige driepijlerweging voeding **40%**, hydratatie **30%**, activiteit
**30%** wordt **herzien voor vier pijlers**. Er is nog geen nieuwe weging of
formule goedgekeurd. De bestaande berekening blijft een technisch feit, geen
vastgestelde eindverdeling voor het vierpijlermodel. De 40/30/30-vermelding
in het formeel geaccepteerde F01-contract blijft het historische vertrekpunt
van 25 oktober; deze gedateerde aanvulling wijzigt geen historische acceptatie.
Implementatie, nieuwe scoregewichten en herberekening worden hiermee niet
geautoriseerd.

### Bestaand onderzoeks- en ontwerpkader

Zes indicatorgroepen vormen het onderzoeks- en ontwerpkader:

1. Voedingskwaliteit en voedingsbalans.
2. Voedingsvariatie.
3. Hydratatie.
4. Lichamelijke activiteit.
5. Consistentie over meerdere dagen.
6. Registratiedekking en betrouwbaarheid van conclusies.

Deze zes indicatorgroepen zijn een onderzoeks- en ontwerpkader, geen zes
ondersteunende scorepijlers. De eerste vijf beschrijven gedrag; de zesde bepaalt
mede de betrouwbaarheid.
Onvolledige registratie mag niet automatisch als ongezond gedrag worden
geïnterpreteerd. Indicatoren moeten historisch verklaarbaar en coach-ready zijn.
Slaap, herstel en aanvullende voedingsindicatoren blijven mogelijke
uitbreidingen. Geen formules, drempels, indicatorgewichten of coachimplementatie
worden hiermee goedgekeurd.

## Productdata en bedrijfskennis

**Interne Excel → gevalideerde import → Supabase → FitLifeTool-app.**

Excel bevat complexe productberekeningen en vertrouwelijke methodiek; de
import verzorgt datakwaliteit, controles en versiebeheer. Supabase bevat
vooraf berekende productgegevens/productscores. De app verzorgt registraties,
dagtotalen en persoonlijke berekeningen. Complexe interne productformules
worden niet naar browser of publieke database verplaatst. Gepubliceerde
waarden mogen zichtbaar zijn voor zover de app die nodig heeft. Productscore,
persoonlijke behoefte en FitLifeScore blijven onderscheiden.

### Goedgekeurde ontwerpprincipes — 28 oktober 2026

- **Correctness-first:** betrouwbare brondata, expliciet onderscheid tussen
  nul en onbekend, uniforme en toetsbare berekeningen, versiebeheer en
  reproduceerbaarheid. Een aanwezige numerieke waarde of formule is geen
  zelfstandig bewijs van inhoudelijke juistheid.
- **Performance-first:** bereken zoveel mogelijk productgebonden waarden en
  scores offline in Excel. Beperk runtimeberekeningen tot noodzakelijke
  gebruikers- en dagafhankelijke verwerking. Dit verplaatst geen persoonlijke
  dagberekeningen naar vaste productdata en schrijft geen nieuwe opslag voor.
- **Zero-downtime productdata-updates:** nieuwe en gewijzigde productgegevens
  moeten snel, gevalideerd, consistent en zonder merkbare gebruikersverstoring
  gepubliceerd kunnen worden. Ontwerp voor veilige staging, gecontroleerde
  atomische publicatie, herstelbaarheid en behoud van historische juistheid.
  De technische oplossing en meetbare acceptatiegrenzen zijn nog niet
  vastgesteld. Bestaande synchronisatiedocumentatie is geen bewijs dat deze
  eigenschappen voor alle productdatastromen al gerealiseerd zijn.

F03 beoordeelt productcategorieën, brondekking en importbehoeften in afstemming
met het kwaliteitsmethodiekcontract voor F08, inclusief de hierboven vastgelegde
dagbalans, toereikendheid, hoeveelheden en variatie. Betrouwbare productgegevens
moeten die dagbeoordeling mogelijk maken; een gunstige productscore alleen is
geen voldoende gegevensbasis. Verzadigd vet, toegevoegde of
vrije suikers en productgroepclassificaties zijn te beoordelen gegevens,
geen automatisch goedgekeurde nieuwe kolommen. Maak onderscheid tussen
ontbrekende brongegevens, afgeleide Excel-berekeningen en noodzakelijke
dagberekeningen in de applicatie.

De **definitieve uitbreiding van `PRODUCT_PREPARATIONS_IMPORT` volgt pas na
vaststelling van de kwaliteitsmethodiek en een onderbouwde kolommen-gapanalyse**.
De volgorde van de twaalf fases verandert hierdoor niet; noodzakelijke
contractafstemming start geen afzonderlijke implementatiefase.
De productdatagovernance blijft leidend; de beschermde Excel-master wordt niet
gewijzigd of aangewezen als canoniek productiewerkboek.

### Scoreaudit: te beoordelen afhankelijkheden voor F03/F08

De read-only scoreaudit in deze chat onderzocht develop
`3e0db7bb9ae3fd34fcfcc39a3ac87ba45c02938d`, het oorspronkelijke importbestand
en de opgeslagen lokale master. Zij stelde onder meer afwijkende
MAINTAIN-formules, suikerbronmapping en ontbrekende-waardenverwerking vast.
Deze bevindingen moeten inhoudelijk worden beoordeeld voordat betrokken
gegevens of berekeningen als gevalideerde basis voor Voedingskwaliteit worden
hergebruikt. Ze zijn **niet opgelost** en vormen geen toestemming voor
automatische formule-, bronwaarde- of importcorrecties.

F03 behandelt brondefinities, eenheden, nul versus onbekend, datadekking,
import-/versiegeldigheid en de veilige publicatieketen. F08 behandelt de
uniforme en toetsbare scoremethodiek, relevante doelafhankelijkheid, weging,
dubbeltelling en dagelijkse aggregatie; benodigde brongegevens worden met
F03 afgestemd. Het oorspronkelijke `FitLifeTool Product Import.xlsx` is de
primaire referentie voor de bestaande keten; `(new)` is de herinrichting.
Verschillen met die werkversie zijn niet automatisch fouten of reeds
gevalideerde functionaliteit. Het auditrapport staat in deze chat; er wordt
geen afzonderlijk Git-bewijsregister of nieuwe audit mee aangemaakt.
Er is geen live database-, Excel-engine-, Preview- of Production-validatie
aan deze documentatieaanvulling verbonden.

## App UI/UX

De volledige ingelogde-appherziening volgt User-first, Mobile-first,
Performance-first, Accessibility-first, Privacy & Security en visuele
consistentie. De goedgekeurde homepage-uitstraling geeft richting; de app wordt
ontworpen voor intensief dagelijks gebruik. Ontwerp tijdig parallel starten,
implementatie gefaseerd. Deze productrichting is geen goedgekeurd schermontwerp
of nieuw technisch patroon. Handbook-patronen blijven leidend tot expliciete
uitwerking. De publieke homepage blijft ongewijzigd.

## F01 — Core Application-releasecontract 1.0

**Versie en herkomst:** 1.0, 25 oktober 2026. Eigenaaropdracht
“F01 Core Application Releasecontract 1.0 — Documentation only” in deze chat.
De eigenaar bevestigt inhoudelijke goedkeuring van de hieronder beschreven
releaseomvang. Deze vastlegging is een lokale documentatiekandidaat op
`develop`, basis `3eba7f1d5ff5dbba5a935bb7cd8866229ab41761`.
Zij is geen uitvoeringsgoedkeuring voor F03 of een release.

### Besluitniveau en bewijsgrens

- **Productbesluit:** de eerste Core-release omvat de onderstaande gebruikersreizen,
  basiservaring en abonnementspositionering. Dit concretiseert V1.1; oudere
  vermeldingen dat de eerste releasescope geheel open was zijn historisch.
- **Ontwerpkader:** adaptiviteit, aanpasbare ±2%-behoudsband, zeven kalenderdagen,
  zes indicatorgroepen en eenvoudige dagritmes bepalen de richting.
  Rekenkundige regels, grenswaarden en dekkingscriteria zijn hiermee niet ingevuld.
- **Open technisch detail:** de onderstaande uitwerkingspunten hebben een eigenaarfase
  en moeten vóór acceptatie van het betreffende onderdeel worden besloten en getoetst.
  Er worden geen ontbrekende aantallen, schema's, formules of API-contracten verzonnen.
- **Gevalideerd bewijs:** B01–B03 blijven uitsluitend het eerder geregistreerde,
  beperkte documentatie-/buildbewijs. Deze fase levert documentatiecontrole,
  geen nieuwe implementatie-, betaal-, juridische of gebruikersreisvalidatie.
  Het Handbook blijft de architectuurbron; dit contract beschrijft het gewenste
  product en verklaart afwijkende huidige implementaties niet conform.

### Eerste releasescope en minimale gebruikersreizen

| ID | Inhoudelijk vastgelegde eerste-releasefunctionaliteit | Uitwerking en latere acceptatie |
|---|---|---|
| C01 | Dashboard en actuele dagtotalen voor Free Trial, Premium en Pro; één consistente dagcontext voor voeding, hydratatie, activiteit, handmatige stappen en gewicht waar beschikbaar. | Na registreren/corrigeren/verwijderen zijn totalen en relevante afgeleide waarden consistent; ontbrekende gegevens blijven herkenbaar. Dashboardtoegang is geen belofte van onbeperkte historische analyse. F04/F09. |
| C02 | Voeding en drinken zoeken, selecteren en in passende hoeveelheid registreren; registraties terugzien en corrigeren/verwijderen. Hydratatie omvat drinken en vochtbijdragen uit voeding. | Eenheden, porties en referentiedata controleerbaar; geen dubbele vochtregistratie. Bestaande afleiding uit consumptielogs behouden; geen nieuwe hydratatietabel besloten. F03/F04. |
| C03 | Activiteiten registreren en corrigeren met passende duur en, waar van toepassing, intensiteit; handmatige stappen registreren en corrigeren. | Eenheid, dagtoewijzing en opslag van stappen, relatie met activiteit en voorkomen van dubbele energietoekenning expliciet uitwerken. Geen nieuwe stappen-naar-calorieënformule vastgesteld. F04/F06. |
| C04 | Gewicht handmatig registreren/corrigeren en historie bekijken. Historische registraties en correcties voor alle relevante domeinen behoren tot de Core-ervaring. | Dagelijkse gewichtssnapshot onderscheiden van nutrition-/activity-events. Historiediepte per plan en toegang na proefafloop nog bepalen; correcties herberekenen de bedoelde dag zonder stilzwijgende wijziging van andere dagen. F04/F05/F10. |
| C05 | Afvallen/aankomen ondersteunen met adaptieve tussentijdse streefdoelen; gewicht behouden met een aanpasbare standaardband van ±2%; trends over zeven kalenderdagen bij voldoende gegevens. | Mijlpalen aanpasbaar en verklaarbaar, geen overreactie op één meting. Referentiegewicht, aanpassingsfrequentie, minimumdekking, ontbrekende dagen, veiligheidsgrenzen en algoritmen nog besluiten. Zeven kalenderdagen zijn geen zeven willekeurige metingen. F05. |
| C06 | Eén numerieke FitLifeScore en aanvullende Leefstijlkwaliteit; doelvoortgang onderscheiden van kwaliteit, balans, variatie en patronen. | Geen tweede numerieke hoofdscore. Basisinzichten onderscheiden van Pro-verdieping; indicatoren/formules en presentatiediepte per plan nog uitwerken. Registratiedekking begrenst conclusies. F08/F09. |
| C07 | Favorieten voor voeding, drinken en activiteiten met oplopende limieten Free Trial → Premium → Pro. | Concrete limieten per domein en eventuele gezamenlijke quota zijn niet aangeleverd en blijven open voor F03. Server-side afdwingen; favoriet is geen log en telt niet als consumptie/activiteit. Bestaand behoud/lockgedrag bij downgrade respecteren. |
| C08 | Een bruikbare Free Trial-basiservaring: dashboard, actuele dagtotalen en de basisreizen voor registreren, terugzien en corrigeren daadwerkelijk kunnen ervaren. | Beperkingen mogen de basiservaring niet onbruikbaar maken. Exacte catalogus-, historie- en favorietenlimieten vaststellen en met scenario's aantonen. Trial maximaal 30 dagen, zonder kaart, automatische betaling of permanent gratis plan. F03/F04/F10. |
| C09 | Eenvoudige persoonlijke dagritmes vanaf de eerste release: eigen opsta- en bedtijden als minimale productuitwerking. | Rechten per plan, standaard/fallback, geldigheid, tijdzone/DST en invloed op verwachting versus totalen/score nog expliciet vastleggen. Week-, rotatie-, nachtwerk- en uitzonderingsschema's blijven roadmapscope, maar zijn niet vanzelf dit eenvoudige minimum of een toegezegde eerste-releasevariant. F07. |
| C10 | Pro biedt herbruikbare voedings-/drankcombinaties en trainingen plus verdiepende analyses; Pro omvat de Premium-basis. | Bij registratie hoeveelheden, duur en relevante intensiteit aanpassen zonder het sjabloon te wijzigen; componenten behouden; sjabloon bewerken/verwijderen tast eerdere logs niet aan. Analysevragen, benodigde gegevens, beperkingen en concrete Pro-grenzen nog uitwerken. Geen onbewezen gezondheidsconclusies. F03/F06/F08. |
| C11 | Account-, privacy- en abonnementsreizen horen bij de eerste release, inclusief veilige toegang/herstel, accountbeheer, proefafloop, expliciete betaalkeuze, opzegging/planwijziging en gegevensrechten. | A&S-contracten en blokkades blijven leidend. Export, verwijderen/bewaren, consumentencommunicatie, privacygrondslagen en betaalstatusovergangen vragen nog juridische én technische toetsing. Geen compliance- of betaalacceptatie geclaimd. F02/F03/F10/F11. |

Dashboard, actuele dagtotalen en correcte basisberekeningen worden niet als
uitsluitend Pro-meerwaarde gepositioneerd. Favorieten versnellen een losse
registratie; herbruikbare combinaties/trainingen zijn een afzonderlijke Pro-functie.
Een lager abonnement verandert niet de betekenis van reeds geregistreerde brondata.
Een bruikbare trial impliceert geen onbeperkte toegang na afloop.

De commerciële master en [afgeleide samenvatting](COMMERCIAL_FINANCIAL_BASELINE.md)
blijven leidend voor de bestaande prijs-/planningsuitgangspunten:
Premium € 6,95 en Pro € 9,95 per maand inclusief 21% btw.
Dit contract concretiseert productpositionering; een volledige featurematrix,
quota, proefstart/-afloop en downgradecontracten zijn nog geen gevalideerde
entitlementconfiguratie. De externe Word-master wordt hier niet aangepast.

### Expliciete uitsluitingen en niet-besloten uitbreiding

De eerste Core-release omvat geen activering van Coach, Apple Health of
Health Connect (F12), native mobiele apps, Public SEO-uitbreiding of
advertentietechnologie. Bestaand goedgekeurd parallel Public Web-/A&S-werk
blijft gerespecteerd. Geen advertenties in dashboards of ingelogde functies.
Geen tweede numerieke hoofdscore of medische diagnose-/behandelclaim.

Deze documentatieopdracht omvat geen implementatie, migratie, databasewijziging,
authenticatie-/betalingsaanpassing, nieuwe formule, infrastructuurmutatie of release.
Geavanceerde ritmevarianten, aanvullende slaap-/herstelindicatoren en niet
gespecificeerde analyses worden niet automatisch aan de eerste release toegevoegd;
eerste-releasegrenzen daarvoor moeten expliciet worden bevestigd.

### Historische stabiliteit en berekeningsgrenzen

1. Kalenderdagen en bronregistraties blijven de basis; geen aparte opgeslagen
   dagstatus, progressie of score. Nutrition-/activity-events en dagelijkse
   gewichtssnapshots behouden hun onderscheiden betekenis.
2. Voor historische stabiliteit, expliciete correcties, controleerbaarheid,
   ernstige fouten en onzekerheid geldt uitsluitend het goedgekeurde beleid
   hieronder. Het laatste inhoudelijke F01-contractbesluit is daarmee vastgelegd.
3. Het Handbook beschrijft bestaande dynamische herberekening met actuele
   instellingen; dit bewijst geen naleving van het historische productcontract.
   Technische aansluiting en validatie horen bij de hieronder aangewezen fases,
   zonder wijziging aan het Handbook of de applicatie in deze opdracht.
4. Activiteitsenergie blijft het beschikbare voedingsbudget van dezelfde dag
   beïnvloeden. Handmatige stappen, trainingscomponenten en toekomstige imports
   mogen niet ongemerkt dubbel meetellen. Gewichtsbron/fallback is een bekende
   open architectuurvraag (Handbook 3.6), geen in F01 gekozen nieuwe bron.
5. Persoonlijke dagritmes wijzigen niet automatisch kalenderdaggrenzen, calorieën,
   hydratatie- of activiteitstotalen. Toegestane invloed op verwachte voortgang,
   status en FitLifeScore expliciet besluiten in F07/F08; geen formulewijziging
   afleiden uit alleen een opsta-/bedtijd.
6. Voeding 40%, hydratatie 30%, activiteit 30% blijft het bestaande vertrekpunt.
   Geen nieuwe gewichten, veiligheidsdrempels, afronding, energiebehoefte-,
   mijlpaal- of trendformule goedgekeurd. Productscore blijft onderscheiden van
   persoonlijke behoefte en FitLifeScore; onvolledige registratie is geen bewijs
   van ongezond gedrag.
7. Lokale datum, tijdzone, middernacht, zomer-/wintertijd en schemawijziging
   met historie moeten in contracten en acceptatiescenario's worden afgedekt.
   Geen nieuwe tijdzone- of dagmodelimplementatie gekozen.

#### Goedgekeurd historisch herberekeningsbeleid — 25 oktober 2026

De projecteigenaar heeft onderstaande vijf regels expliciet goedgekeurd als
laatste inhoudelijke F01-contractbesluit in de voortzetting van deze opdracht.
Dit is een productcontract voor de toekomstige implementatie, geen bewijs dat
het huidige dynamische herberekeningspad hier al aan voldoet.

1. **Historische stabiliteit:** latere wijzigingen in profiel, gewicht, doelen,
   dagritme, productgegevens of berekeningsmethoden veranderen eerdere
   beoordelingen niet stilzwijgend.
2. **Expliciete correcties:** historische registraties mogen worden gecorrigeerd.
   Correcties werken uitsluitend door in de relevante kalenderdagen, dagtotalen
   en afgeleide resultaten, met de voor die dagen geldige historische context.
3. **Controleerbaarheid:** de oorspronkelijke beoordeling en eventuele latere
   correcties blijven verklaarbaar en controleerbaar. Dit besluit schrijft geen
   specifieke database- of opslagarchitectuur voor.
4. **Ernstige fouten:** aantoonbare ernstige gegevens- of berekeningsfouten
   worden uitsluitend via een gecontroleerd, transparant en toetsbaar
   correctiebeleid behandeld. Geen ongecontroleerde massale herberekening.
5. **Onzekerheid:** ontbrekende historische context of onvoldoende betrouwbare
   gegevens worden herkenbaar gemaakt. Presenteer geen schijnprecisie of
   onbewezen historische reconstructies.

Een latere wijziging met toekomstige geldigheid is geen doelbewuste historische
correctie en verleent geen toestemming om eerdere beoordelingen ongemerkt
te vervangen. Een doelbewuste historische correctie past de relevante invoer
en resultaten aan binnen de destijds geldige context. Een gecontroleerde
correctie van een ernstige fout is een afzonderlijke, transparante procedure;
zij volgt niet automatisch uit een nieuwe product- of methodeversie.

Technische uitwerking blijft binnen bestaande fases: F03 voor geldigheid en
herleidbaarheid van product-/rechtencontext; F04 voor historische broncontext,
effectieve datums, opslag/versies, correcties en reconstructie; F05 voor
doel-/gewichtscontext en doorwerking in relevante trendvensters; F06 voor
template-/componentcontext; F07 voor ritme-/tijdzonegeldigheid; F08 voor
berekeningsversies, oorspronkelijke/gecorrigeerde beoordelingen, ernstige fouten
en betrouwbaarheidsweergave. F09 verzorgt de begrijpelijke presentatie en
F10 de bewaartermijnen/gegevensrechten in samenhang met dit beleid.
F11 toetst de integrale samenhang met de bestaande F02-securityvoorwaarden.

Opslagkeuze, versievelden en concrete geldigheids-/correctiemechanismen moeten
dit beleid uitvoeren; zij mogen de vijf regels niet opnieuw ter discussie
stellen. Implementatiecontroles dekken toekomstige wijzigingen, expliciete
correcties, ernstige fouten en ontbrekende context afzonderlijk, inclusief de
afbakening van relevante kalenderdagen en afhankelijke resultaten.
Die technische uitwerking en uitvoering zijn geen resterend F01-productbesluit
en worden in deze documentatieopdracht niet geïmplementeerd of getest.

### Afhankelijkheden en acceptatie voor F02–F11

Dit is contracttraceerbaarheid binnen deze roadmap, geen tweede planning of
fasestatusregister. Onderstaande controles zijn nog uit te voeren criteria;
geen van deze rijen verklaart een fase gevalideerd of vrijgegeven.

| Fase | Contractafhankelijkheid | Vereist acceptatiebewijs vóór afsluiting van de relevante scope |
|---|---|---|
| F02 | C11; bestaande A&S-roadmap en bewijsregister. | Veilige auth-/herstel-/accountreizen en toepasselijke herstel-/isolatievoorwaarden op exacte kandidaat; open AUTH- en containmentblokkades aantoonbaar behandeld. Bestaand parallel traject niet herstarten. |
| F03 | C02/C07–C11; productdata en commerciële master. | Geaccepteerde featurematrix met concrete catalogus-/favorieten-/historielimieten, trial/upgrade/downgrade; server-side weigering van ongeoorloofde toegang óók buiten UI; consistente canonical entitlements, gevalideerde referentiedata/import en onderbouwde capaciteit/kosten. Geen ontbrekende quota als onbeperkt interpreteren. |
| F04 | C01–C04/C08; F01-contract en relevante F03-rechten. | Registreren, bekijken, wijzigen/verwijderen op actuele én eerdere dag voor alle basisdomeinen; totalen/herberekening coherent, gewichtsnapshot correct, stappen niet dubbel geteld; dagwisseling en historische wijzigingsscenario's aantoonbaar. |
| F05 | C04/C05; betrouwbare historie en gewichtsbron. | Geaccepteerde algoritmen, veiligheidsgrenzen, aanpasbare mijlpalen/behoudsband en zeven-kalenderdagdekking; scenario's afvallen/behouden/aankomen, ontbrekende/uitbijtermetingen en doelwijziging met historie. |
| F06 | C03/C10; losse registratie en Pro-rechten. | Combinaties/trainingen opslaan, hergebruiken, per component aanpassen, bewerken/verwijderen; oorspronkelijke template en eerdere logs blijven intact; relevante duur/intensiteit en totalen correct. |
| F07 | C09; F04-historie en F03-rechten. | Eenvoudig persoonlijk ritme bruikbaar bij eerste release; fallback, geldigheidsdatum, tijdzone/DST en historische wijziging getest; contract bepaalt aantoonbaar welke verwachting/status verandert en welke totalen niet. Complexere schema's alleen in expliciet bevestigde scope. |
| F08 | C05/C06/C10; betrouwbare brondata, F05/F07 waar relevant. | Eén numerieke hoofdscore; indicatoren en Pro-verdieping verklaarbaar, privacybewust en historisch herleidbaar; definitieve berekeningen met referentiescenario's en dekkings-/betrouwbaarheidsgrenzen gevalideerd. |
| F09 | C01–C11; vroeg parallel ontwerp, gefaseerde implementatie. | Complete mobiele, meertalige en toegankelijke reizen voor trial/Premium/Pro; actuele dagtotalen, fout-/leeg-/laadstatus en locked-functionaliteit duidelijk; relevante browser-, eigenaar- en deviceacceptatie en afgesproken performancecriteria. |
| F10 | C08/C11; F02/F03 en account-UX. | Juridische beoordeling en technische lifecycle-E2E voor proefstart/-afloop, expliciete betaalkeuze, opzegging, downgrade, gegevensrechten/export/verwijderen/bewaren en communicatie; geen stilzwijgende dataverwijdering door downgrade. Geen juridische termijnen verzinnen. |
| F11 | C01–C11 en toepasselijke F02–F10-bewijzen. | Traceerbare integrale acceptatieset op één exacte releasekandidaat, inclusief security/rechten, historie, herstelbaarheid, schaalbaarheid/kosten en afgesproken performancecriteria; open releaseblokkades opgelost, expliciete releasegoedkeuring en relevante Production-/smokebewijzen. |

Kwantitatieve limieten, prestatiedoelen, trenddekking en analysegrenzen moeten
vóór de betreffende validatie zijn vastgesteld; zonder deze grenzen is geen
volledige acceptatie mogelijk. Gebruik bestaande kandidaatgebonden resultaten
waar geldig, vul alleen ontbrekend of ongeldig bewijs aan. Geen nieuwe audit
of test-/buildfase gestart door deze documentatie.

### F01-documentatieacceptatie en overdracht

Voor formele documentatieacceptatie zijn nodig: C01–C11 volledig en vindbaar,
uitsluitingen expliciet, productbesluiten gescheiden van ontwerp/open techniek,
historische/berekeningsgrenzen benoemd, vervolgcriteria traceerbaar en de normale
documentatie-/beschermingscontroles PASS. De eigenaar accepteert daarna deze
vastlegging en de expliciet doorgeschoven uitwerkingspunten.

De eigenaar heeft releasescope C01–C11 en het historische beleid als laatste
inhoudelijke F01-contractbesluit goedgekeurd. Favorietenquota, algoritmen,
opslag/geldigheid, ritme-invloed en lifecycletoetsen zijn expliciet belegd in
F03–F10; schaalbaarheid/kosten in F03 en integrale toetsing in F11. Zij zijn
geen bewijs van huidige implementatie en geen nieuw open F01-productbesluit.
De bestaande F01-criteria worden hiermee niet geschrapt of vervangen.

**Formele acceptatie en afsluitregistratie — 25 oktober 2026.**
De projecteigenaar heeft in de opdracht “F01 | Formele acceptatie en
afsluitregistratie” de definitieve documentversie van Core-releasecontract 1.0
expliciet formeel geaccepteerd. Dit betreft C01–C11, de uitsluitingen, het
goedgekeurde historische herberekeningsbeleid en de belegging van vervolgdetails.
Verwijzing: de sectie F01 — Core Application-releasecontract 1.0 in dit bestand,
inclusief het historische beleid van 25 oktober 2026.
De geaccepteerde roadmapversie vóór toevoeging van deze afsluitregistratie heeft
SHA-256 `4f581205c3313fbd1b024a2ae4435414f4d5d2918f0dba762c05fac0a6da9a42`;
Git-basis `3eba7f1d5ff5dbba5a935bb7cd8866229ab41761`, met lokale F01-documentdiff.
Deze hash identificeert de geaccepteerde documentinhoud, geen Git-commit.

| Toepasselijke F01-voorwaarde | Bewijs en oordeel |
|---|---|
| Releasescope, uitsluitingen en productbesluiten | PASS: C01–C11 inhoudelijk goedgekeurd, ongewijzigd en opgenomen in de formeel geaccepteerde versie. |
| Historisch contract en berekeningsgrenzen | PASS: vijf expliciet goedgekeurde historische regels; geen opslagarchitectuur of nieuwe formule voorgeschreven. |
| Belegging technische vervolgdetails en afhankelijkheden | PASS: F03–F10 voor uitwerking, F02 blijft parallel; integrale acceptatie en releasebewijs bij F11. |
| Documentatiekwaliteit en bescherming | PASS: eerdere diff-/opmaakcontrole en 91 lokale verwijzingen; geaccepteerde kandidaat via hashes bevestigd. Alleen de afsluitpassages worden gericht opnieuw gecontroleerd. |
| Formele eigenaaracceptatie en gedateerde registratie | PASS: expliciete eigenaaracceptatie van 25 oktober 2026, vastgelegd in deze registratie. |

Daarmee zijn de toepasselijke voorwaarden voor deze F01-contract- en
documentatiefase vervuld: **IN PROGRESS → DONE op 25 oktober 2026**.
Dit is uitsluitend documentatieacceptatie; geen implementatie-, runtime-,
Preview- of Production-acceptatie. Voor deze documentatiefase is een
applicatierelease niet van toepassing; het latere F11-releasebewijs blijft
onverkort vereist. Technische vervolgdetails blijven toegewezen, niet uitgevoerd.

Volgende toegestane stap is afzonderlijk goedgekeurde Git-publicatie van de
documentatie. Geen staging, commit, push, merge of deployment in deze opdracht.
F03 wordt niet gestart; geen andere fase krijgt automatisch uitvoeringstoestemming.
Het parallelle A&S-traject behoudt zijn eigen autorisatie en hervattingspunt.

## Voorgestelde uitvoeringsvolgorde: twaalf fases

Onderstaande volgorde is de expliciete voorgestelde uitvoeringsvolgorde uit de
aanvulling op V1.1. Zij bewijst **geen formeel goedgekeurde of afgeronde fases**
en verleent geen implementatie- of releaseautorisatie. Fases zijn niet verplicht
volledig sequentieel; bestaande goedgekeurde parallelle werkzaamheden blijven
gerespecteerd. Afhankelijkheden en acceptatievoorwaarden zijn voorstellen,
geen geslaagde validatie.

| Fase in voorgestelde volgorde | Doel, afhankelijkheden en resterend werk | Beschikbaar acceptatiebewijs en grens |
|---|---|---|
| 1 — Contracten en integratiebasis | Berekeningen, datahistorie, Leefstijlkwaliteit-contracten, schaalbaarheid en kosten; eerste releasescope en ontbrekende auditmanifesten afbakenen. | Architectuurbronnen aanwezig; nieuw integraal contract en actuele acceptatie open. |
| 2 — Account & Security: bestaand parallel traject | Veiligheid en herstelbaarheid; eigen roadmap/bewijs behouden, open AUTH-, containment-, staging- en herstelvoorwaarden. | Alleen historisch kandidaatgebonden bewijs uit eigen dossier; geen nieuwe audit/vrijgave. |
| 3 — Productdata en abonnementsrechten | Excel-import, kwaliteit, proefmodel, Premium/Pro, server-side rechten, featurematrix en financiële onderbouwing; gebruikt contracten 1 en A&S. Bron-/kolommenbehoeften voor Voedingskwaliteit en veilige productdatapublicatie afstemmen volgens de aanvulling van 28 oktober. | Methodologie en entitlementarchitectuur beschreven; actuele volledigheid/handhaving en nieuwe trial niet hiermee gevalideerd. Auditafhankelijkheden en publicatieontwerp niet opgelost of gevalideerd. |
| 4 — Basisregistratie en historie | Betrouwbare dagelijkse/historische voeding-, drank-, activiteit- en gewichtsregistratie; gebruikt 1/3. | Geen complete actuele kandidaatgebonden CRUD-/herberekeningsacceptatie in dit dossier. |
| 5 — Persoonlijke doelen en gewicht | Adaptieve mijlpalen, behoudsband en trends; gewichtbron, dekking en veiligheid uitwerken op basis van 1/4. | Richting vastgesteld, algoritmen en meetcriteria open; geen afgeronde implementatieclaim. |
| 6 — Voedingscombinaties en trainingen | Herbruikbare aanpasbare voedings-/drank-/trainingssjablonen; template-/logcontract, componenten en intensiteit; bouwt op 3/4. | Geen complete template-acceptatie vastgesteld; registratie mag oorspronkelijke sjabloon niet wijzigen. |
| 7 — Persoonlijke dagritmes | Dagindelingen, uitzonderingen en ploegendiensten; dag/historie 1/4, rechten 3, tijdzone/DST, rotaties en schemageldigheid. | Geen nieuwe tijdlijnvalidatie; toegestane invloed op berekeningen nog kiezen. |
| 8 — FitLifeScore 2.0 en Leefstijlkwaliteit | Doelvoortgang, kwaliteit/balans/variatie/patronen en coach-ready indicatoren; gebruikt 1/3/4 en doelen/ritmes waar relevant. Vier ondersteunende pijlers met Voedingskwaliteit onder één numerieke FitLifeScore uitwerken; productkwaliteit onderscheiden van dagbalans, toereikendheid en variatie. | Richting van 28 oktober goedgekeurd; nieuwe weging, kwaliteitsmethodiek, uniforme berekeningen en validatie open. |
| 9 — App UI/UX en Design System | Ontwerp tijdig parallel starten; implementatie gefaseerd, afgestemd op 3–8; mobiel, toegankelijk, snel en visueel consistent. | Productrichting vastgesteld; scherm-, browser-, eigenaar- en deviceacceptatie open. |
| 10 — Account-, consumenten- en privacyafsluiting | Accountlevenscyclus, proefafloop, abonnementen, export, bewaren, privacy en communicatie; afhankelijk van 2/3 en app-UX. | Dossiers/checklists aanwezig; geen afgeronde lifecycle-, juridische of complianceacceptatie claimen. |
| 11 — Integrale coreacceptatie en release | E2E-, performance-, security- en rechtenvalidatie op exacte kandidaat; herstel/compliance en gekozen releasescope afdekken, gecontroleerd vrijgeven. | Geen actuele integrale Core-acceptatie of releasegoedkeuring; afzonderlijke autorisatie en Production-bewijs nodig. |
| 12 — Apple Health en Health Connect: latere uitbreiding | Toestemming, intrekken, synchronisatie, bronidentiteit en deduplicatie; later afzonderlijk prioriteren/ontwerpen. | Voorstel; geen werkende koppeling bewezen, niet automatisch onderdeel eerste core-release. |

Account & Security loopt parallel. Fase 9 betekent niet dat UX-ontwerp pas na
fase 8 begint. De eerste core-releasescope staat in het F01-releasecontract;
technische uitwerking en formele documentatieacceptatie blijven onderscheiden.
De strategische
prioriteit Core → Public SEO → eventuele mobiele apps is geen bewijs van
goedkeuring of afronding van afzonderlijke fases.

## Actuele fasevoortgang

Peildatum 25 oktober 2026; gebaseerd op V1.1, de bestaande detaildossiers,
de in deze chat afgeronde herstel-/publicatierapporten en lokaal aanwezige
Git-objecten. Geen nieuwe code-audit, tests, build of live herverificatie.
De onderstaande criteria concretiseren uitsluitend bestaande roadmapinhoud
voor beoordeling; zij zijn geen nieuwe productkeuze of fase-uitvoeringstoestemming.
F01 is formeel afgesloten voor contract/documentatie; technische uitwerking en
acceptatie van de vervolgfases blijven open volgens het contract.

| Fase | Status | Acceptatiecriteria / bestaande scope | Afhankelijkheden en open punten | Bewijs en beperking | Eerstvolgende toegestane stap |
|---|---|---|---|---|---|
| F01 | DONE | Core-releasecontract 1.0 C01–C11, uitsluitingen, historische/berekeningsgrenzen en vervolgcriteria formeel geaccepteerd; afsluitregistratie van 25 oktober 2026 hierboven. | Technische uitwerking F03–F10 en integrale acceptatie/release F11 blijven open; geen nieuwe uitvoeringstoestemming. | Expliciete eigenaaracceptatie 25 oktober 2026, documentatiecontroles PASS, geaccepteerde bronversie via SHA-256 hierboven herleidbaar; uitsluitend contract-/documentatieacceptatie. | Afzonderlijk goedgekeurde Git-publicatie; nu geen staging/commit/push/deployment en F03 niet starten. |
| F02 | IN PROGRESS | Veiligheid en herstelbaarheid volgens eigen A&S-roadmap; relevante AUTH-, herstel-, isolatie- en releasecriteria aantonen. | Bestaand parallel traject; AUTH10 Hosted Staging/Production historisch BLOCKED, restoretest en overige AUTH-punten open. | Bestaand dossier en ondersteunende buildfixes B02/B03 hieronder. Geen volledige fase- of Production-afsluiting. | Relevante bestaande goedkeuring en het eigen A&S-hervattingspunt raadplegen; ontbrekend bewijs gericht aanvullen binnen passende scope. |
| F03 | PLANNED | Productkwaliteit/import, definitieve trial-/Premium-/Pro-matrix, server-side rechten en financiële onderbouwing beoordeeld. Correctness-first, offline productberekeningen en veilige productdatapublicatie volgens de aanvulling van 28 oktober meenemen. | F01, A&S-betaalvoorwaarden; featurematrix/limieten en datadekking open. Kwaliteitsmethodiek en kolommen-gapanalyse vóór definitieve preparations-importuitbreiding; betrouwbare gegevens voor dagbalans, toereikendheid, hoeveelheden en variatie mogelijk maken. Bronmapping/nulwaarden en atomische publicatie/herstelbaarheid nog beoordelen. | Governance en financieel plan beschreven; scoreaudit levert aandachtspunten, geen herstelbewijs. Actuele integrale datakwaliteits-/rechtenacceptatie en zero-downtime-publicatiebewijs ontbreken. | Eerst contracten, productkeuzes en methodiekafhankelijkheden afbakenen; geen data- of rechtenwijziging zonder goedkeuring. |
| F04 | PLANNED | Dagelijkse en historische voeding-, drank-, activiteit- en gewichtsreizen met betrouwbare correctie/herberekening geaccepteerd. | F01/F03, dagcontext, historische geldigheid en gewichtsbron. | Bestaande basis beschreven; geen complete actuele CRUD-/herberekeningsacceptatie. | Relevante auditresultaten hergebruiken en ontbrekende acceptatiescenario's na goedkeuring afbakenen. |
| F05 | PLANNED | Doelrichtingen, adaptieve mijlpalen, onderhoudsband en trends volgens expliciet geaccepteerde regels onderbouwd. | F01/F04; algoritmen, meetdekking en veiligheidsgrenzen open. | Gewenst ontwerp aanwezig; geen afgeronde algoritme-/implementatieacceptatie. | Product- en trendcontracten vaststellen binnen een goedgekeurde fase. |
| F06 | PLANNED | Herbruikbare voedings-, drank- en trainingssjablonen; registratiehoeveelheid/duur aanpasbaar zonder het origineel te wijzigen. | F03/F04; component-/logcontract, bewerken/verwijderen en intensiteit open. | Geen complete template-acceptatie in dit dossier. | Sjabloon-/logcontract en acceptatiescenario's afbakenen vóór implementatie. |
| F07 | PLANNED | Persoonlijke ritmes, uitzonderingen en diensten met verklaarbare tijdlijn/historie geaccepteerd. | F01/F03/F04; tijdzone/DST, rotaties, schemageldigheid en invloed op berekeningen open. | Geen actuele complete persoonlijke-ritmeacceptatie. | Toegestane invloed op verwachtingen, totalen en scores eerst besluiten. |
| F08 | PLANNED | Eén overkoepelende numerieke FitLifeScore met Voeding, Hydratatie, Activiteit en Voedingskwaliteit; doelvoortgang en Leefstijlkwaliteit met verklaarbare, historisch herleidbare indicatoren valideren. Dagkwaliteit onderscheiden van productkwaliteit, inclusief het uitsluitend-sla-acceptatiescenario en de functionele dagbeoordeling uit de aanvulling van 28 oktober. | F01/F03/F04 en doelen/ritmes waar relevant; kwaliteitsmethodiek, relevante doelafhankelijkheid, uniforme berekeningen, nieuwe vierpijlerweging, dubbeltelling en indicatorvalidatie open. MAINTAIN-formulevarianten en ontbrekende-waardenverwerking beoordelen met F03. | Vierpijlerrichting, naamgeving en functionele dagbeoordeling op 28 oktober goedgekeurd; het uitsluitend-sla-scenario is nog niet uitgevoerd/gevalideerd. Bestaande 40/30/30-implementatie, zes ontwerpgroepen en auditbevindingen bewijzen geen nieuwe formule of opgeloste afwijkingen. | Methodiek- en scorecontracten met de bronbehoeften van F03 afstemmen en validatie afbakenen; geen formulewijziging zonder besluit. |
| F09 | PLANNED | Ingelogde app en design system passend bij dagelijkse taken, mobiel, toegankelijkheid, performance en identiteit geaccepteerd. | Ontwerp tijdig parallel, implementatie gefaseerd in afstemming met F03–F08; schermacceptaties open. | Productrichting vastgesteld; beschermd Public Web-werk bewijst geen afgeronde app-UX-fase. | Vroeg ontwerp binnen passende goedkeuring afbakenen; homepage en goedgekeurd parallel werk respecteren. |
| F10 | PLANNED | Accountlevenscyclus, proefafloop, abonnementen, export, bewaren, privacy en communicatie volgens afgesproken scope geaccepteerd. | F02/F03 en app-UX; gegevensrechten en juridische review open. | Checklists/detaildossiers, geen volledige lifecycle-/complianceacceptatie. | Open consumenten-/privacycontracten en reviewverantwoordelijkheid afbakenen. |
| F11 | PLANNED | Gekozen core-releasescope integraal op exacte kandidaat gevalideerd en volgens bestaande releasegates gecontroleerd vrijgegeven. | Toepasselijke voorgaande fases, herstelbaarheid/compliance en eigen releaseautorisatie; releasescope open. | Geen integrale Core-acceptatie of Production-vrijgave. Lokale builds B02/B03 zijn geen F11-releasebewijs. | Eerst releasescope en acceptatieplan bevestigen; geen vrijgave starten. |
| F12 | PLANNED | Health-integratie met toestemming/intrekken, synchronisatie, bronidentiteit en deduplicatie geaccepteerd. | Latere uitbreiding, afzonderlijk prioriteren; niet automatisch eerste core-release. | Geen werkende koppeling of geslaagde sync vastgesteld. | Later inhoudelijk prioriteren en ontwerpen; nu niet starten. |

F02 is IN PROGRESS wegens het al lopende, afzonderlijk goedgekeurde A&S-traject,
niet omdat hiermee de volledige voorgestelde Core-fase 2 is vrijgegeven.
Een geblokkeerd AUTH10-deeltraject wordt daarmee niet groen gemaakt.
F01 is DONE uitsluitend voor de formeel geaccepteerde contract-/documentatiefase
van 25 oktober 2026. F03–F12 zijn PLANNED omdat uitvoering/
volledige acceptatie van hun
geconsolideerde scope niet is vastgesteld; dat ontkent bestaande deelimplementaties
niet. Geen andere fase is hiermee DONE verklaard.

### Ondersteunende voortgang en bewijs

Deze korte verwijzingen vervangen geen afzonderlijk A&S-bewijsregister.
Bewijsketen: bestaande lokale Git-objecten plus gespreksrapporten van 24 oktober;
lokale controle op 25 oktober. De eerder geverifieerde remote-SHA's zijn
historisch publicatiebewijs, geen nieuwe remote- of live-verificatie.

| ID | Afgebakend resultaat | Technisch / lokaal | Develop en remote-publicatie | Releasegrens |
|---|---|---|---|---|
| B01 | V1.1-documentatieconsolidatie | Documentatiecontroles gerapporteerd PASS, inclusief verwijzingen en bronconsistentie; geen applicatietestclaim. | Commit `c71daa94374e6dd9bbd0b7da860ef2febe3c677e`; op 24 oktober fast-forward geïntegreerd en naar origin/develop gepusht met geverifieerde SHA. | Afgerond documentatiewerkpakket, geen afgeronde Core-ontwikkelfase of Production-release. |
| B02 | Supabase-buildinitialisatie en veilige GET-foutafhandeling | 44/44 gerichte tests, vijf nieuwe tests opnieuw PASS, TypeScript/gerichte lint/lokale production-build PASS; geen live API-validatie. | Commit `a1e383ac3b4a60f09e24466c73910b700196ded8`, drie bestanden; lokale commit en push naar origin/develop gerapporteerd en SHA geverifieerd. | De build gebruikte bestaande lokale configuratie. De latere eigenaarmelding noemt de Supabase-blokkade opgelost maar meldt een Stripe-Previewfout op deze SHA; geen volledige Preview-/Production-PASS. |
| B03 | Uitgestelde Stripe-clientinitialisatie en importregressies | 52/52 gerichte tests inclusief zeven Stripe-tests, TypeScript/gerichte lint/lokale production-build PASS. De aanvankelijke server-only-testadapterfout is vóór de geslaagde run opgelost. | Commit `be3525c9baa79916ca4c3825569d7cb1f56786d3`, tien bestanden; push naar origin/develop met geverifieerde SHA gerapporteerd. | Geen echte betaling, live webhook of Vercel Preview-/Production-resultaat bevestigd. Runtimecredentials blijven noodzakelijk. |

B02/B03 wijzigen geen productprioriteiten en ronden F02 of F11 niet af.
Een nieuw Preview-resultaat moet exact deployment, branch, commit, omgeving,
tijdstip en build-/smoke-uitkomst vermelden voordat een statusclaim verandert.
De 21 beschermde Public Web-bestanden zijn volgens de herstel-/pushrapporten
inhoudelijk behouden; hun aanwezigheid is geen acceptatie van F09.

### Volgende fase en onderhoudslog

**F01 — Contracten en integratiebasis** is inhoudelijk goedgekeurd voor de
documentatieafronding van releasecontract 1.0, inclusief het historische beleid,
en is op 25 oktober 2026 formeel geaccepteerd en afgesloten. Volgende stap is
afzonderlijk goedgekeurde Git-publicatie; F03 wordt niet gestart.
Bestaande goedgekeurde parallelle werkzaamheden blijven gerespecteerd.
De open verificatie van de Stripe-Preview na B03 is
een relevant vervolg binnen het bestaande incidenttraject; deze documentatieopdracht
voert haar niet uit en verleent geen nieuwe releaseautorisatie.

| Datum | Wijziging | Herkomst / besluit | Bewijsgrens |
|---|---|---|---|
| 25 oktober 2026 | Bestaande V1.1-roadmap aangewezen als enige SSOT; vier statussen toegevoegd; initiële registratie F01/F03–F12 PLANNED en F02 IN PROGRESS. | Eigenaaropdracht Centrale roadmap & voortgangsbeheer plus aanvulling projectbrede verplichting. | Dit registreert bestaand werk, geen nieuwe fase gestart of DONE gemaakt; nieuwe documentatie nog ongecommit. |
| 25 oktober 2026 | F01 PLANNED → IN PROGRESS; Core-releasecontract 1.0 opgenomen in deze bestaande roadmap. | Eigenaar bevestigt inhoudelijke goedkeuring en autoriseert uitsluitend documentatieafronding. | Formele documentatieacceptatie nog open; F02 en F03–F12 ongewijzigd; geen implementatie, staging, commit, push of release. |
| 25 oktober 2026 | Laatste inhoudelijke F01-contractbesluit: vijf historische regels door de eigenaar goedgekeurd en vastgelegd. | Eigenaaropdracht historisch herberekeningscontract en formele acceptatieafronding. | F01 blijft IN PROGRESS tot acceptatie van de definitieve documentversie/afsluitregistratie; technische uitwerking belegd, geen implementatie- of releaseclaim. |
| 25 oktober 2026 | F01 IN PROGRESS → DONE, uitsluitend contract- en documentatiefase. | Expliciete formele eigenaaracceptatie van de definitieve Core-releasecontractversie 1.0; afsluitregistratie hierboven. | Documentatiecontroles PASS; geen implementatie-, Preview- of Production-acceptatie; lokale documentatie nog ongecommit, overige fasestatussen behouden. |
| 28 oktober 2026 | Vier ondersteunende pijlers onder één FitLifeScore; naamgeving Voedingskwaliteit, functionele dagbeoordeling met uitsluitend-sla-acceptatiescenario, correctness-first, performance-first en zero-downtime-productdata-updates vastgelegd; F03/F08-afhankelijkheden aangevuld. | Expliciet goedgekeurde eigenaaropdracht Core Roadmap Documentatieupdate; read-only scoreaudit als onderzoeksbewijs, develop-basis `3e0db7bb9ae3fd34fcfcc39a3ac87ba45c02938d`. | Alleen dit roadmapbestand lokaal gewijzigd; twaalf fases, volgorde en statussen behouden. Geen nieuwe weging/formule, importuitbreiding, opgeloste auditbevinding of implementatie-/releaseacceptatie; geen staging, commit, push of deployment. |

## Open besluiten en overdracht

- Definitieve vierpijlerweging, scoreformules, kwaliteitsindicatoren,
  doelafhankelijkheid, dagelijkse aggregatie, dubbeltelling en validatie.
  Richting en naamgeving van Voedingskwaliteit zijn vastgesteld; de methodiek niet.
- Beoordeling van de MAINTAIN-formulevarianten, suikerbronmapping en
  ontbrekende-waardenverwerking; geen herstel of inhoudelijke acceptatie bewezen.
- Kwaliteitsmethodiek en kolommen-gapanalyse vóór definitieve uitbreiding van
  `PRODUCT_PREPARATIONS_IMPORT`; noodzakelijke brongegevens onderscheiden van
  afgeleide productwaarden en dagelijkse verwerking.
- Technische uitwerking en toetsbare acceptatiegrenzen voor veilige staging,
  atomische publicatie, herstelbaarheid, versiebeheer, historische juistheid
  en productdata-updates zonder merkbare gebruikersverstoring.
- Numerieke limieten en volledige featurematrix in F03; Pro-combinaties en
  verdiepende analyses zijn nu als productpositionering vastgesteld.
- Precieze trialrechten, proefafloop, export, bewaartermijnen en gebruikerservaring.
- Technische uitvoering van het vastgestelde historische beleid en voldoende
  meetgegevens voor gewichtstrends in de toegewezen vervolgfases.
- Algoritmen/veiligheid voor doelen, dagritme-/tijdzonecontract en productdatadekking.
- Afzonderlijk goedgekeurde Git-publicatie van de formeel geaccepteerde
  F01-documentatie. Technische details zijn belegd; actuele implementatie en
  acceptatie per vervolgfase met kandidaat,
  omgeving, datum en resultaat. De eerste releasescope staat hierboven.

Baken deze punten af binnen een afzonderlijk goedgekeurde inhoudelijke opdracht.
Hergebruik geldige auditresultaten; vul alleen ontbrekend/ongeldig bewijs aan.
Het historische AUTH10-hervattingspunt blijft in het eigen dossier; deze roadmap
activeert geen Stripe-, database- of productieactie. Werk in elke volgende
goedgekeurde fase relevante roadmap, status en bewijs samen bij. ChatGPT/Codex
moeten de actuele versie daadwerkelijk kunnen lezen.
