# Core Application roadmap

**Bronbasis:** Centrale projectdocumentatie V1.1 en de aanvullende
uitvoeringsvolgorde van de projecteigenaar, overgenomen op 24 oktober 2026.
**Officiële bron:** dit bestaande Markdown-bestand is de enige SSOT voor
Core Application-planning en fasevoortgang, aangewezen door de eigenaar op
25 oktober 2026. Canonieke ontwikkelbranch: `develop`.
**Voortgangspeildatum:** 25 oktober 2026.
**Git-basis van deze documentatiekandidaat:** `be3525c9baa79916ca4c3825569d7cb1f56786d3`.
V1.1 is op 24 oktober vastgelegd in `c71daa94374e6dd9bbd0b7da860ef2febe3c677e`,
lokaal op develop geïntegreerd en naar origin/develop gepusht.
De huidige governance-aanvulling is nog ongecommit en ongepubliceerd.

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

Alle beoogde gebruikerswaarde komt uit V1.1. Onderstaande bestaande bronnen
bewijzen documentatiedekking, geen nieuwe code- of runtimeacceptatie.

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

Historische registraties moeten verklaarbaar blijven bij latere wijzigingen
van product, doel, profiel of methode. Welke historische context wordt bewaard
en hoe herberekening werkt moet in fase 1 worden besloten. Deze roadmap
schrijft geen snapshots, aparte dagstatus of migraties voor.

## FitLifeScore en Leefstijlkwaliteit 1.0

Voorlopig blijft voeding **40%**, hydratatie **30%**, activiteit **30%** het
vertrekpunt. Deze bestaande verdeling is niet opnieuw gevalideerd en is geen
definitieve formule voor Leefstijlkwaliteit. Geen tweede numerieke hoofdscore.

Zes indicatorgroepen vormen het onderzoeks- en ontwerpkader:

1. Voedingskwaliteit en voedingsbalans.
2. Voedingsvariatie.
3. Hydratatie.
4. Lichamelijke activiteit.
5. Consistentie over meerdere dagen.
6. Registratiedekking en betrouwbaarheid van conclusies.

De eerste vijf beschrijven gedrag; de zesde bepaalt mede de betrouwbaarheid.
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

Onderzoek in fase 3 of productcategorieën en indicatoren voldoende zijn.
Verzadigd vet, toegevoegde suikers en productgroepclassificaties zijn mogelijke
aanvullingen; eerst datakwaliteit/haalbaarheid beoordelen, niet automatisch
toevoegen. De productdatagovernance blijft leidend; de beschermde Excel-master
wordt niet gewijzigd of aangewezen als canoniek productiewerkboek.

## App UI/UX

De volledige ingelogde-appherziening volgt User-first, Mobile-first,
Performance-first, Accessibility-first, Privacy & Security en visuele
consistentie. De goedgekeurde homepage-uitstraling geeft richting; de app wordt
ontworpen voor intensief dagelijks gebruik. Ontwerp tijdig parallel starten,
implementatie gefaseerd. Deze productrichting is geen goedgekeurd schermontwerp
of nieuw technisch patroon. Handbook-patronen blijven leidend tot expliciete
uitwerking. De publieke homepage blijft ongewijzigd.

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
| 3 — Productdata en abonnementsrechten | Excel-import, kwaliteit, proefmodel, Premium/Pro, server-side rechten, featurematrix en financiële onderbouwing; gebruikt contracten 1 en A&S. | Methodologie en entitlementarchitectuur beschreven; actuele volledigheid/handhaving en nieuwe trial niet hiermee gevalideerd. |
| 4 — Basisregistratie en historie | Betrouwbare dagelijkse/historische voeding-, drank-, activiteit- en gewichtsregistratie; gebruikt 1/3. | Geen complete actuele kandidaatgebonden CRUD-/herberekeningsacceptatie in dit dossier. |
| 5 — Persoonlijke doelen en gewicht | Adaptieve mijlpalen, behoudsband en trends; gewichtbron, dekking en veiligheid uitwerken op basis van 1/4. | Richting vastgesteld, algoritmen en meetcriteria open; geen afgeronde implementatieclaim. |
| 6 — Voedingscombinaties en trainingen | Herbruikbare aanpasbare voedings-/drank-/trainingssjablonen; template-/logcontract, componenten en intensiteit; bouwt op 3/4. | Geen complete template-acceptatie vastgesteld; registratie mag oorspronkelijke sjabloon niet wijzigen. |
| 7 — Persoonlijke dagritmes | Dagindelingen, uitzonderingen en ploegendiensten; dag/historie 1/4, rechten 3, tijdzone/DST, rotaties en schemageldigheid. | Geen nieuwe tijdlijnvalidatie; toegestane invloed op berekeningen nog kiezen. |
| 8 — FitLifeScore 2.0 en Leefstijlkwaliteit | Doelvoortgang, kwaliteit/balans/variatie/patronen en coach-ready indicatoren; gebruikt 1/3/4 en doelen/ritmes waar relevant. | Bestaande scorearchitectuur beschreven; definitieve formules en validatie open. |
| 9 — App UI/UX en Design System | Ontwerp tijdig parallel starten; implementatie gefaseerd, afgestemd op 3–8; mobiel, toegankelijk, snel en visueel consistent. | Productrichting vastgesteld; scherm-, browser-, eigenaar- en deviceacceptatie open. |
| 10 — Account-, consumenten- en privacyafsluiting | Accountlevenscyclus, proefafloop, abonnementen, export, bewaren, privacy en communicatie; afhankelijk van 2/3 en app-UX. | Dossiers/checklists aanwezig; geen afgeronde lifecycle-, juridische of complianceacceptatie claimen. |
| 11 — Integrale coreacceptatie en release | E2E-, performance-, security- en rechtenvalidatie op exacte kandidaat; herstel/compliance en gekozen releasescope afdekken, gecontroleerd vrijgeven. | Geen actuele integrale Core-acceptatie of releasegoedkeuring; afzonderlijke autorisatie en Production-bewijs nodig. |
| 12 — Apple Health en Health Connect: latere uitbreiding | Toestemming, intrekken, synchronisatie, bronidentiteit en deduplicatie; later afzonderlijk prioriteren/ontwerpen. | Voorstel; geen werkende koppeling bewezen, niet automatisch onderdeel eerste core-release. |

Account & Security loopt parallel. Fase 9 betekent niet dat UX-ontwerp pas na
fase 8 begint. De eerste formele core-releasescope blijft open. De strategische
prioriteit Core → Public SEO → eventuele mobiele apps is geen bewijs van
goedkeuring of afronding van afzonderlijke fases.

## Actuele fasevoortgang

Peildatum 25 oktober 2026; gebaseerd op V1.1, de bestaande detaildossiers,
de in deze chat afgeronde herstel-/publicatierapporten en lokaal aanwezige
Git-objecten. Geen nieuwe code-audit, tests, build of live herverificatie.
De onderstaande criteria concretiseren uitsluitend bestaande roadmapinhoud
voor beoordeling; zij zijn geen nieuwe productkeuze of fase-uitvoeringstoestemming.
De eerste formele releasescope en definitieve faseacceptaties blijven open.

| Fase | Status | Acceptatiecriteria / bestaande scope | Afhankelijkheden en open punten | Bewijs en beperking | Eerstvolgende toegestane stap |
|---|---|---|---|---|---|
| F01 | PLANNED | Contracten voor berekeningen, historie, Leefstijlkwaliteit, schaalbaarheid en kosten; eerste releasescope expliciet afgebakend en geaccepteerd. | Open contracten in dit document; geen complete acceptatieset vastgesteld. | Product-/architectuurbronnen aanwezig, geen integrale F01-acceptatie. V1.1-consolidatie alleen rondt F01 niet af. | Na inhoudelijke goedkeuring contracten en acceptatieomvang afbakenen; nu geen ontwikkeling starten. |
| F02 | IN PROGRESS | Veiligheid en herstelbaarheid volgens eigen A&S-roadmap; relevante AUTH-, herstel-, isolatie- en releasecriteria aantonen. | Bestaand parallel traject; AUTH10 Hosted Staging/Production historisch BLOCKED, restoretest en overige AUTH-punten open. | Bestaand dossier en ondersteunende buildfixes B02/B03 hieronder. Geen volledige fase- of Production-afsluiting. | Relevante bestaande goedkeuring en het eigen A&S-hervattingspunt raadplegen; ontbrekend bewijs gericht aanvullen binnen passende scope. |
| F03 | PLANNED | Productkwaliteit/import, definitieve trial-/Premium-/Pro-matrix, server-side rechten en financiële onderbouwing beoordeeld. | F01, A&S-betaalvoorwaarden; featurematrix/limieten en datadekking open. | Governance en financieel plan beschreven; actuele integrale datakwaliteits-/rechtenacceptatie ontbreekt. | Eerst contracten en productkeuzes afbakenen; geen data- of rechtenwijziging zonder goedkeuring. |
| F04 | PLANNED | Dagelijkse en historische voeding-, drank-, activiteit- en gewichtsreizen met betrouwbare correctie/herberekening geaccepteerd. | F01/F03, dagcontext, historische geldigheid en gewichtsbron. | Bestaande basis beschreven; geen complete actuele CRUD-/herberekeningsacceptatie. | Relevante auditresultaten hergebruiken en ontbrekende acceptatiescenario's na goedkeuring afbakenen. |
| F05 | PLANNED | Doelrichtingen, adaptieve mijlpalen, onderhoudsband en trends volgens expliciet geaccepteerde regels onderbouwd. | F01/F04; algoritmen, meetdekking en veiligheidsgrenzen open. | Gewenst ontwerp aanwezig; geen afgeronde algoritme-/implementatieacceptatie. | Product- en trendcontracten vaststellen binnen een goedgekeurde fase. |
| F06 | PLANNED | Herbruikbare voedings-, drank- en trainingssjablonen; registratiehoeveelheid/duur aanpasbaar zonder het origineel te wijzigen. | F03/F04; component-/logcontract, bewerken/verwijderen en intensiteit open. | Geen complete template-acceptatie in dit dossier. | Sjabloon-/logcontract en acceptatiescenario's afbakenen vóór implementatie. |
| F07 | PLANNED | Persoonlijke ritmes, uitzonderingen en diensten met verklaarbare tijdlijn/historie geaccepteerd. | F01/F03/F04; tijdzone/DST, rotaties, schemageldigheid en invloed op berekeningen open. | Geen actuele complete persoonlijke-ritmeacceptatie. | Toegestane invloed op verwachtingen, totalen en scores eerst besluiten. |
| F08 | PLANNED | Doelvoortgang en Leefstijlkwaliteit met verklaarbare, historisch herleidbare indicatoren gevalideerd; één numerieke hoofdscore. | F01/F03/F04 en doelen/ritmes waar relevant; formules en indicatorvalidatie open. | Bestaande 40/30/30-architectuur en zes ontwerpgroepen zijn geen geaccepteerde nieuwe formule. | Definitieve indicator-/scorecontracten en hun validatie afbakenen; geen formulewijziging zonder besluit. |
| F09 | PLANNED | Ingelogde app en design system passend bij dagelijkse taken, mobiel, toegankelijkheid, performance en identiteit geaccepteerd. | Ontwerp tijdig parallel, implementatie gefaseerd in afstemming met F03–F08; schermacceptaties open. | Productrichting vastgesteld; beschermd Public Web-werk bewijst geen afgeronde app-UX-fase. | Vroeg ontwerp binnen passende goedkeuring afbakenen; homepage en goedgekeurd parallel werk respecteren. |
| F10 | PLANNED | Accountlevenscyclus, proefafloop, abonnementen, export, bewaren, privacy en communicatie volgens afgesproken scope geaccepteerd. | F02/F03 en app-UX; gegevensrechten en juridische review open. | Checklists/detaildossiers, geen volledige lifecycle-/complianceacceptatie. | Open consumenten-/privacycontracten en reviewverantwoordelijkheid afbakenen. |
| F11 | PLANNED | Gekozen core-releasescope integraal op exacte kandidaat gevalideerd en volgens bestaande releasegates gecontroleerd vrijgegeven. | Toepasselijke voorgaande fases, herstelbaarheid/compliance en eigen releaseautorisatie; releasescope open. | Geen integrale Core-acceptatie of Production-vrijgave. Lokale builds B02/B03 zijn geen F11-releasebewijs. | Eerst releasescope en acceptatieplan bevestigen; geen vrijgave starten. |
| F12 | PLANNED | Health-integratie met toestemming/intrekken, synchronisatie, bronidentiteit en deduplicatie geaccepteerd. | Latere uitbreiding, afzonderlijk prioriteren; niet automatisch eerste core-release. | Geen werkende koppeling of geslaagde sync vastgesteld. | Later inhoudelijk prioriteren en ontwerpen; nu niet starten. |

F02 is IN PROGRESS wegens het al lopende, afzonderlijk goedgekeurde A&S-traject,
niet omdat hiermee de volledige voorgestelde Core-fase 2 is vrijgegeven.
Een geblokkeerd AUTH10-deeltraject wordt daarmee niet groen gemaakt.
De overige fases zijn PLANNED omdat uitvoering/volledige acceptatie van hun
geconsolideerde scope niet is vastgesteld; dat ontkent bestaande deelimplementaties
niet. Geen van de twaalf fases is achteraf DONE verklaard.

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

De eerstvolgende openstaande inhoudelijke fase in de vastgelegde voorgestelde
volgorde is **F01 — Contracten en integratiebasis**. Afbakenen/starten vereist
inhoudelijke goedkeuring. Bestaande goedgekeurde parallelle werkzaamheden
blijven gerespecteerd. De open verificatie van de Stripe-Preview na B03 is
een relevant vervolg binnen het bestaande incidenttraject; deze documentatieopdracht
voert haar niet uit en verleent geen nieuwe releaseautorisatie.

| Datum | Wijziging | Herkomst / besluit | Bewijsgrens |
|---|---|---|---|
| 25 oktober 2026 | Bestaande V1.1-roadmap aangewezen als enige SSOT; vier statussen toegevoegd; initiële registratie F01/F03–F12 PLANNED en F02 IN PROGRESS. | Eigenaaropdracht Centrale roadmap & voortgangsbeheer plus aanvulling projectbrede verplichting. | Dit registreert bestaand werk, geen nieuwe fase gestart of DONE gemaakt; nieuwe documentatie nog ongecommit. |

## Open besluiten en overdracht

- Definitieve scoreformules, indicatorbetekenis en validatie.
- Volledige Premium-/Pro-featurematrix, limieten en betekenisvolle Pro-meerwaarde.
- Precieze trialrechten, proefafloop, export, bewaartermijnen en gebruikerservaring.
- Historische berekeningscontracten en voldoende meetgegevens voor gewichtstrends.
- Algoritmen/veiligheid voor doelen, dagritme-/tijdzonecontract en productdatadekking.
- Eerste formele core-releasescope; actuele implementatie en acceptatie per fase
  met kandidaat, omgeving, datum en resultaat.

Baken deze punten af binnen een afzonderlijk goedgekeurde inhoudelijke opdracht.
Hergebruik geldige auditresultaten; vul alleen ontbrekend/ongeldig bewijs aan.
Het historische AUTH10-hervattingspunt blijft in het eigen dossier; deze roadmap
activeert geen Stripe-, database- of productieactie. Werk in elke volgende
goedgekeurde fase relevante roadmap, status en bewijs samen bij. ChatGPT/Codex
moeten de actuele versie daadwerkelijk kunnen lezen.
