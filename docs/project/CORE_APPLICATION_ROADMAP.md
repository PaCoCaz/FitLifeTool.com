# Core Application roadmap

**Bronbasis:** Centrale projectdocumentatie V1.1 en de aanvullende
uitvoeringsvolgorde van de projecteigenaar, overgenomen op 24 oktober 2026.
**Documentatiestatus:** nieuwe ongecommitte kandidaat op
`codex/central-project-status-docs`, basis
`3b24cbf8ecce92e02f5165754ac08cd4769e7eca`.

Dit register maakt productrichtingen, ontwerpkaders, voorgestelde fases en
bewijsgrenzen centraal vindbaar. Het verleent geen toestemming voor
implementatie, formulewijzigingen of release.

[Projectstatus](FITLIFETOOL_PROJECT_STATUS.md) · [Dossierindex](README.md) ·
[Commercieel basisplan](COMMERCIAL_FINANCIAL_BASELINE.md) ·
[A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) · [Bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md)

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
