# FitLifeTool — centraal projectstatusoverzicht

[Dossier en onderhoud](README.md) · [Projectstatus](FITLIFETOOL_PROJECT_STATUS.md) · [A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) · [Bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md)

**Reconstructiepeildatum:** 22 oktober 2026\
**Documentstatus:** lokaal opgenomen ter beoordeling; samengesteld uit historische gespreksrapporten, niet opnieuw live geverifieerd\
**Operationele status:** uitsluitend na actuele verificatie van Git/externe systemen als live-status beschouwen.

## Actuele regieverwijzing — 25 oktober 2026

De [Core Application-roadmap](CORE_APPLICATION_ROADMAP.md) is de enige officiële
bron voor Core-planning en fasevoortgang. Deze projectstatus blijft het
regie-/navigatieportaal en onderhoudt geen tweede Core-fasestatusregister.
Raadpleeg de roadmap voor PLANNED/IN PROGRESS/BLOCKED/DONE, fasecriteria,
afhankelijkheden, bewijs, open punten en de volgende toegestane stap.

V1.1 is vastgelegd in `c71daa94374e6dd9bbd0b7da860ef2febe3c677e` en op
24 oktober veilig in develop geïntegreerd en naar origin/develop gepusht.
Daarna volgden de Supabase-fix `a1e383ac3b4a60f09e24466c73910b700196ded8`
en Stripe-fix `be3525c9baa79916ca4c3825569d7cb1f56786d3`, met gerapporteerde
lokale validatie en geverifieerde publicatie. De roadmap bevat de beperkte
bewijsverwijzingen B01–B03; dit rondt geen volledige Core-fase af.
De Vercel Preview-uitkomst na de Stripe-fix en Production-vrijgave zijn niet
bevestigd. Het historische AUTH10-hervattingspunt hieronder blijft een eigen
trajectbron en activeert geen automatische volgende opdracht.

Het centrale roadmapbeheer is gecommit en gepubliceerd als
`3eba7f1d5ff5dbba5a935bb7cd8866229ab41761`; lokale en remote SHA zijn
bij aanvang van F01 op 25 oktober read-only gelijk bevonden.
De actuele F01-documentatieaanvulling is ongecommit; geen staging, commit,
push, merge of deployment.
De [dossierindex](README.md) beschrijft projectbrede instructies, daadwerkelijke
toegang en de handmatige instelling die de eigenaar nog moet uitvoeren.
De reconstructiepeildatum van het oude securitybewijs blijft 22 oktober.

## F01-documentatieafronding — 25 oktober 2026

Het [Core-releasecontract 1.0](CORE_APPLICATION_ROADMAP.md#f01--core-application-releasecontract-10)
staat in de bestaande officiële roadmap: inhoudelijk geaccepteerde eerste
releasescope C01–C11, uitsluitingen, basiservaring voor trial/Premium/Pro,
Pro-meerwaarde, historische/berekeningsgrenzen en vervolgcriteria F02–F11.
De opdracht verleent documentatieautorisatie; formele acceptatie van deze
uitgewerkte kandidaat en technische uitwerking blijven onderscheiden.
Zie uitsluitend de roadmap voor actuele fasestatus en volgende toegestane stap.
Geen A&S-status, AUTH-blokkade of Production-bewijs gewijzigd; F03 niet gestart.
Het laatste inhoudelijke F01-contractbesluit is expliciet door de eigenaar
goedgekeurd: zie uitsluitend het [historische beleid in de roadmap](CORE_APPLICATION_ROADMAP.md#goedgekeurd-historisch-herberekeningsbeleid--25-oktober-2026).
Technische opslag/geldigheid en controles zijn daar toegewezen aan bestaande
vervolgfases; numerieke limieten, algoritmen en juridische/lifecycletoetsen
blijven technische uitwerking, niet als uitgevoerd beschreven.
De eigenaar heeft de definitieve Core-releasecontractversie 1.0 op
25 oktober 2026 formeel geaccepteerd. De [afsluitregistratie](CORE_APPLICATION_ROADMAP.md#f01-documentatieacceptatie-en-overdracht)
in de roadmap bevat de bronversie en bewijsbeoordeling; de centrale fasetabel
is leidend. Dit sluit uitsluitend contract/documentatie af, geen implementatie-,
Preview- of Production-acceptatie. Git-publicatie staat nog open.

## Documentatieconsolidatie V1.1 met aanvulling — 24 oktober 2026

**Historisch kandidaatverslag:** deze sectie beschrijft de schrijf-/validatiefase
vóór commit `c71daa94374e6dd9bbd0b7da860ef2febe3c677e`. Die kandidaat is
nadien met afzonderlijke goedkeuring gecommit, in develop geïntegreerd en
gepubliceerd. De actuele voortgangsbron staat hierboven; de onderstaande
historische operationele bewijscategorieën zijn niet opnieuw live geverifieerd.

| Onderwerp | Centrale vastlegging | Status en bewijsgrens |
|---|---|---|
| Core | [Roadmap V1.1 met aanvulling](CORE_APPLICATION_ROADMAP.md). | Productvisie, doelrichtingen, Leefstijlkwaliteit, één numerieke hoofdscore, interne Excel, app-UX-herziening en coach-ready richting vastgelegd. |
| Uitvoeringsvolgorde | Twaalf voorgestelde fases, genummerd 1–12 in de Core-roadmap. | Voorstel; geen formeel goedgekeurde of afgeronde fases. A&S parallel, UX-ontwerp tijdig parallel en implementatie gefaseerd. Eerste formele releasescope open. |
| Commercieel/financieel | [Word-masterverwijzing en afgeleide samenvatting](COMMERCIAL_FINANCIAL_BASELINE.md). | Maximaal 30 dagen beperkt proefgebruik zonder kaart/automatische omzetting; Premium € 6,95, Pro € 9,95 incl. 21% btw. Planning, geen financiële of app-/Stripevalidatie. |
| Open werk | Open besluiten en faseafhankelijkheden in de Core-roadmap. | Formules, featurematrix (fase 3), proefafloop/export/bewaren, historische contracten, trenddekking, releasescope en actueel implementatie-/acceptatiebewijs open. |
| Overdracht | [Dossierindex](README.md) en [projectcontext](../../FITLIFETOOL_CONTEXT.md). | Bestanden moeten daadwerkelijk leesbaar zijn voor ChatGPT/Codex; externe Word-toegang niet universeel bewezen. |

Strategische prioriteit: eerst Core Application, daarna Public SEO, vervolgens
eventuele mobiele apps. Bestaande goedgekeurde parallelle werkzaamheden blijven
gerespecteerd. A&S/Guard lopen parallel; security, privacy, herstelbaarheid en
noodzakelijke compliance zijn releasevoorwaarden. Fase 12 is latere uitbreiding,
geen automatisch onderdeel van de eerste core-release. De voorgestelde volgorde
vereist geen volledig sequentiële uitvoering en verleent geen uitvoeringsautorisatie.

## Historisch AUTH10-hervattingspunt

Dit is het eerdere hervattingspunt van het afzonderlijke A&S-traject; geen
automatische volgende opdracht voor deze documentatiefase of de Core-roadmap.

**Actief traject:** Account & Security → AUTH10 → Security & Payment / herstel- en containmentvoorbereiding.\
**Eerstvolgende concrete handeling:** Stripe **Sandbox 1 → Developers/Workbench → Webhooks**: read-only overzicht van endpointnamen/URL's, status en eventselecties inventariseren, **zonder API-keys of signing secrets**. Vercel-projectinventarisatie niet herhalen.\
**Stopgrens:** geen credentials wijzigen/intrekken, deployments verwijderen, migraties toepassen, database muteren, Git pushen of Production releasen zonder passende uitvoeringsgoedkeuring.

## Portfolio

| Traject | Bewijsstatus op peildatum | Actie / beperking |
|---|---|---|
| Account & Security | AUTH01–08 grotendeels afgerond; AUTH09 lokaal gevalideerde remediatie, release niet bewezen; AUTH10 kandidaat aanwezig, Production BLOCKED | Zie roadmap en bewijsregister |
| Security & Payment / AUTH10 | Voorbereidende audit afgerond; lokale Stripe-validatie PASS; invoicecorrectie volgens later verslag lokaal gecommit | Credentialafhankelijkheden, historische deployments, herstelbasis, Hosted Staging |
| Backup & Disaster Recovery | Versleutelde back-up 21 oktober gemaakt en technisch gecontroleerd | Geen volledige geïsoleerde restoretest; drie verdachte bestanden uitgesloten |
| Public Homepage | CLOSED / PRODUCTION GREEN in historisch releaseverslag | Geen herhaling zonder nieuw risico |
| Public SEO & Content Architecture | Ontwerpwerk in aparte chat; huidige formele release-/implementatiestatus hier niet vastgesteld | Afzonderlijke statusbron nodig |
| Productdatabase | Eerdere Excel/databasewerkzaamheden bekend; actuele voortgang niet geconsolideerd | Afzonderlijke statusbron nodig |
| Dependency Security Remediation | Lokale kandidaat PASS; resterende npm-auditbevindingen gedocumenteerd | Integratie/Production niet bewezen |
| Legacy Search Function Remediation | Full Catalog Baseline lokaal PASS; migratie lokaal PASS | Externe RPC-consumenten niet uitgesloten; Production BLOCKED |

## Centrale projectregie — aanvulling 22 oktober 2026

Dit register ordent de aantoonbare werkstromen en verwijst naar hun eigen
inhoudelijke bronnen. De historische portfolio- en bewijsgegevens hierboven
blijven intact. Een bestaand bronhoofdstuk bewijst geen actuele implementatie,
release of formele acceptatie. Een ontbrekende roadmapverwijzing betekent dat
de roadmap in de geraadpleegde bronnen nog niet is vastgesteld, niet dat zij
nergens bestaat. Deze aanvulling omvat geen nieuwe live-audit.

### Vastgestelde werkstromen en actief hervattingspunt

| Werkstroom en doel | Roadmap / bewijsbron | Aantoonbare status en afhankelijkheden | Eerstvolgende stap binnen passende scope |
|---|---|---|---|
| Account & Security — account- en autorisatieflows beveiligen | [AUTH01–AUTH14-roadmap](ACCOUNT_SECURITY_ROADMAP.md), [bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md) | Actief hervattingspunt volgens het historische dossier: AUTH10. AUTH09 lokaal gevalideerd; release/provideruitkomst niet bewezen. AUTH09B en AUTH11–AUTH14 OPEN / UNVERIFIED. | Binnen een goedgekeurde read-only hervatting het reeds genoemde Stripe Sandbox 1-webhookoverzicht inventariseren; deze documentatiefase voert dat niet uit. |
| Security & Payment / AUTH10 — veilige betaalintegratie en containment voorbereiden | [AUTH10 en beslisvolgorde](ACCOUNT_SECURITY_ROADMAP.md), bewijs E06–E08 en E14–E15 | Lokale kandidaten gerapporteerd; Hosted Staging/Production BLOCKED door credentialdekking, historische deployments, herstelbasis en externe isolatie. | Bestaand bewijs hergebruiken en ontbrekende webhook-/consumerinformatie gericht vaststellen. Rotatie, stagingmutaties en release vereisen hun eigen passende uitvoeringsgoedkeuring. |
| Backup & Disaster Recovery — herstelbaarheid onderbouwen | [Ondersteunende trajecten](ACCOUNT_SECURITY_ROADMAP.md), bewijs E16 | Back-up van 21 oktober gecontroleerd; geen volledige geïsoleerde restoretest. Herstelbasis voor risicovolle AUTH10-uitvoering nog onvoldoende bewezen. | Ontbrekend herstelbewijs en een afgebakend restoretestplan vaststellen; uitvoering valt buiten deze fase. Geen afzonderlijke volledige DR-roadmap aangetroffen. |
| Public Homepage — publieke introductie en gebruikersinteractie | Bewijs E01–E03; [Public Web-contract en implementatiefasen, Handbook 5.11](<../../app/(app)/handbook/doc-l3-0030/page.tsx>) | Historisch CLOSED / PRODUCTION GREEN; dit geldt niet automatisch voor latere lokale Public Web-wijzigingen. Bestaande develop-worktree bevat beschermd vervolgwerk. | Historische goedkeuring behouden; voor vervolgwerk alleen het eigen actuele plan en bewijs gebruiken. Geen herontwerp of release in deze documentatiefase. |
| Dependency Security Remediation — dependencyrisico's verminderen | [Ondersteunende trajecten](ACCOUNT_SECURITY_ROADMAP.md), bewijs E09 | LOCAL PASS historisch, met resterende auditbevindingen; integratie/Production niet bewezen. | Bij een relevante, goedgekeurde integratiefase kandidaatbasis en resterende bevindingen controleren; geen herhaalde brede audit zonder aanleiding. |
| Database Baseline & Legacy Search Remediation — reproduceerbare basis en veilige opruiming | [Ondersteunende trajecten](ACCOUNT_SECURITY_ROADMAP.md), bewijs E10–E13 | Full Catalog Baseline en legacy-migratie lokaal PASS. Production-drop BLOCKED door onbewezen externe RPC-consumenten/deprecation. | Bestaande fingerprints hergebruiken; ontbrekend consumenten-/deprecationbewijs vaststellen voordat een Production-drop wordt overwogen. Geen databasehandeling toegestaan in deze fase. |

### Bestaande roadmap- en domeinbronnen, nadere inventarisatie nodig

| Werkstroom en doel | Bestaande bron en roadmapdekking | Status / afhankelijkheden | Eerstvolgende documenterende stap |
|---|---|---|---|
| Public SEO & Content Architecture — vindbare, meertalige publieke content | [Handbook 5.11](<../../app/(app)/handbook/doc-l3-0030/page.tsx>), met implementatiefasen in sectie 27 en open owner decisions in sectie 28 | Ontwerpwerk in aparte chat historisch genoemd. Het Handbook bevat een fasering, maar actuele faseacceptaties en de aparte chatroadmap zijn hier niet volledig geïnventariseerd. Definitieve SEO-copy volgt volgens die bron na locale-specifieke research. | De bestaande chatroadmap toegankelijk maken en aan de Handbook-fasen en acceptatiebewijzen koppelen; geen voortgang afleiden uit de aanwezigheid van een worktree. |
| Productdatabase / Product Intelligence — betrouwbare productreferenties en beheer | [Productdatagovernance](../product-data/PRODUCT_DATA_GOVERNANCE.md), Handbook [2.5](<../../app/(app)/handbook/doc-l3-0022/page.tsx>), [2.6](<../../app/(app)/handbook/doc-l3-0023/page.tsx>) en [2.7](<../../app/(app)/handbook/doc-l3-0024/page.tsx>) | Bestaand domein en methodologie; actuele Excel-/databasevoortgang en afzonderlijke roadmap niet geconsolideerd. Canoniek productiewerkboek en provenancepersistentie blijven open beslissingen. | Bestaande roadmap, verantwoordelijke bron en actuele voortgang bevestigen; geen workbook aanwijzen, master wijzigen of datastructuur aanpassen. |
| FitLifeScore — uitlegbare dagelijkse voortgang en coachingfeedback | [Handbook 3.1](<../../app/(app)/handbook/doc-l3-0005/page.tsx>) en H3 via de [documentrouter](../../FITLIFETOOL_CONTEXT.md) | Vastgesteld productdomein; architectuurdocumentatie aanwezig. Sinds 24 oktober ontsloten via de [Core-roadmap V1.1](CORE_APPLICATION_ROADMAP.md), voorgestelde fase 8. Actuele faseacceptatie niet vastgesteld. | Score-/kwaliteitscontracten en bewijs afbakenen. Eén numerieke hoofdscore; geen formule, gewicht of statusregel uit een voorstel afleiden. |
| Legal & Consumer Compliance — juridische en privacyvoorbereiding voor commerciële lancering | [Handbook 5.10](<../../app/(app)/handbook/doc-l3-0029/page.tsx>) | Bestaande interne checklist, inclusief open Privacyverklaring; geen definitieve juridische documenten of actuele acceptatie bewezen. Geen afzonderlijke geconsolideerde roadmap aangetroffen. | Bestaande open beslissingen en reviewverantwoordelijkheid bevestigen; geen juridisch akkoord of afgeronde compliance claimen. |

### Voorgestelde toekomstige werkstromen

[Handbook 5.3 — Roadmap & Ontwikkelvisie](<../../app/(app)/handbook/doc-l3-0017/page.tsx>)
noemt slaap en herstel, lichaamsmetingen en trends, persoonlijke inzichten,
gedragsanalyse, en coaching en begeleiding als toekomstige groeirichtingen.
Deze richtingen zijn hier uitsluitend als toekomstige voorstellen geregistreerd.
Er is in deze inventarisatie geen afzonderlijke uitvoeringstoestemming,
roadmap, startdatum, opleverstatus of onderlinge prioriteit voor vastgesteld.
De volgende stap is alleen bij een expliciete planningsopdracht de bestaande
plannen, gebruikerswaarde en afhankelijkheden bevestigen. Zij voegen nu geen
scope toe aan een actieve werkstroom.

### Prioriteit, volgorde en bevoegdheid

De centrale projectplanning bepaalt de gewenste volgorde. De volgorde van
ChatGPT-/Codex-chats, hun activiteit en de aanwezigheid van Git-worktrees
bepalen geen prioriteit en geven geen uitvoeringsgoedkeuring.

De reconstructiebronnen van 22 oktober legden alleen het AUTH10-hervattingspunt
en de interne [A&S-beslisvolgorde](ACCOUNT_SECURITY_ROADMAP.md) concreet vast.
De consolidatie van 24 oktober ontsluit V1.1 en de aanvulling in de
[Core-roadmap](CORE_APPLICATION_ROADMAP.md): strategie Core → Public SEO →
eventuele mobiele apps, met respect voor goedgekeurd parallel werk. De twaalf
fases hebben een voorgestelde uitvoeringsvolgorde, geen formele fasegoedkeuring
of afronding. A&S loopt parallel; UX-ontwerp start vroeg, implementatie gefaseerd.
Public Web behoudt zijn eigen Handbook 5.11-fasering. Eerste releasescope en
actueel bewijs blijven open. Leg latere eigenaarbesluiten met datum, bron en
afhankelijkheden vast zonder ontbrekende keuzes of acceptaties in te vullen.
Een eerstvolgende stap in dit register wordt alleen uitgevoerd wanneer de
actuele opdracht die scope toestaat; deze fase autoriseert uitsluitend documentatie.

## Permanente Security & Privacy Guard

**Verantwoordelijkheid:** afzonderlijk, doorlopend en projectbreed, vastgelegd
op basis van de goedgekeurde governance-opdracht van 22 oktober 2026.
Privacy-first en Security-first zijn blijvende randvoorwaarden voor iedere
werkstroom. De Guard blijft bestaan na afronding van AUTH14; AUTH14 is een
afgebakende Account & Security-fase en beëindigt deze verantwoordelijkheid niet.

De Guard sluit aan op de bestaande projectbrede uitgangspunten en
[Handbook 1.1](<../../app/(app)/handbook/doc-l3-0001/page.tsx>), de bronrouter in
[projectcontext](../../FITLIFETOOL_CONTEXT.md), de veiligheids- en
uitvoeringsafspraken in [AGENTS.md](../../AGENTS.md), de workflow in Handbook
[5.7](<../../app/(app)/handbook/doc-l3-0025/page.tsx>),
[5.8](<../../app/(app)/handbook/doc-l3-0026/page.tsx>) en
[5.9](<../../app/(app)/handbook/doc-l3-0027/page.tsx>), en de privacy- en publieke
contentafspraken in [5.10](<../../app/(app)/handbook/doc-l3-0029/page.tsx>) en
[5.11](<../../app/(app)/handbook/doc-l3-0030/page.tsx>).
Deze bronnen blijven inhoudelijk eigenaar; de Guard dupliceert, vervangt of
versoepelt hun regels niet. De voor de sessie aangewezen externe
`FITLIFETOOL_CHATGPT_WORKFLOW.md` blijft de bestaande ChatGPT-werkafspraak.

Relevante security- en privacycontroles worden naar risico en scope opgenomen
in de normale goedgekeurde ontwikkel-, validatie- en releasefase. Leg hun
uitkomst en open risico's vast in het relevante status-/bewijsdossier. Gebruik
geldig bewijs opnieuw zolang basis, kandidaat en omgeving dat toelaten; de
Guard introduceert geen onnodige micro-gates of herhaalde brede audits.

Alle bestaande security-, Git-, worktree- en deploymentgrenzen blijven gelden.
Deze vastlegging geeft geen aanvullende bevoegdheid voor secrets, productie,
databasewijzigingen, beschermde worktrees of Git-/releasehandelingen.
**Operationele inrichting: nog niet als geïmplementeerd aangetoond.** Concrete
roltoewijzing, tooling, bewaking en toekomstige werkafspraken moeten nog binnen
passende scope worden uitgewerkt; dit document claimt geen actieve technische
monitor, afgeronde privacyreview of nieuwe certificering.

## Harde openstaande AUTH10-voorwaarden

1. **Credentialtransitie:** exacte oude Stripe-/Supabase-registraties en actieve consumers bevestigen; vervangings-, verificatie- en intrekkingsvolgorde bepalen.
2. **Historische Vercel-deployments:** Preview/deployment-URL's en potentiële eerdere credentialblootstelling afdekken. Een scopewijziging neutraliseert niet noodzakelijk reeds gebouwde deployments.
3. **Herstelbasis:** compatibele Git-code, Supabase-dump/rollen/Auth, Vercel/DNS, Stripe-koppelingen en een onafhankelijke geïsoleerde hersteltest aantonen.
4. **Hosted Staging:** gescheiden Supabase/Vercel/Stripe-sandboxconfiguratie aantoonbaar werkend maken en de noodzakelijke E2E-validatie uitvoeren.
5. **Release:** kandidaat tegen actuele remote basis toetsen; expliciete autorisatie, gecontroleerde uitrol en Production-smoke. Geen Production GREEN zonder bewijs.

## Vercel — reeds geïnventariseerd

- Project `fitlifetool`, repository `PaCoCaz/FitLifeTool.com`, Production-branch `main`, Next.js, Node.js `24.x`, root `./`.
- Domeinen: `fitlifetool.com` en `fitlifetool.vercel.app` naar Production; `www.fitlifetool.com` via 308-redirect.
- Geen gekoppelde Shared Environment Variables; geen Deploy Hooks.
- `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: in later screenshot Production-scope met `Needs Attention`; precieze waarschuwingsoorzaak **niet vastgesteld**.
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`: alle omgevingen; Preview/Development Supabase-doel **niet bewezen**.
- **Tijdgebonden discrepantie:** een eerdere externe preflight rapporteerde dat Production-credentials ook voor Preview beschikbaar waren. Een later screenshot toont drie server-side variabelen met Production-scope. Dit bewijst **niet** dat historische Preview-deployments veilig zijn of dat eerdere blootstelling ongedaan is gemaakt. Beide waarnemingen behouden met tijdcontext.

## Backup — 21 oktober 2026

- Versleutelde APFS-schijf `FITLIFETOOL-BACKUP`, veilig ontkoppeld.
- Gecontroleerde Git-bundle (circa 50,6 MB), archief van 58 geselecteerde niet-gecommitte bestanden, aparte kopie van 10 publieke afbeeldingen (16 uitgesloten bestandsvermeldingen).
- Supabase Production PostgreSQL custom-format dump, rollenexport, Auth-configuratie en e-mailtemplates; configuratie-ZIP gerapporteerd, inhoud niet onafhankelijk opnieuw bevestigd.
- Drie bestanden wegens credentialachtige patronen uitgesloten; geen bewijs dat deze echte actieve secrets bevatten.
- **Back-up gemaakt ≠ volledige disaster-recovery-test geslaagd.**

## Statusconventie

| Status | Betekenis |
|---|---|
| PRODUCTION GREEN | Release werkelijk uitgerold én relevante Production-smoke PASS |
| LOCAL PASS | Afgebakende lokale kandidaat/test gevalideerd; geen releaseclaim |
| PASS (read-only) | Afgesproken inventarisatie/audit afgerond, niet per se veilig ingericht |
| BLOCKED | Concrete voorwaarde verhindert vervolg/release |
| OPEN | Nog niet uitgevoerd |
| UNVERIFIED | Onvoldoende bewijs of mogelijk verouderde observatie |

## Verplichte update bij elke afgeronde fase

Registreer in dezelfde reeds goedgekeurde fase, voor zover binnen scope: datum/tijd, traject, kandidaatbasis en commit, exact manifest, migratiehash, testmatrix, omgeving, gate-uitkomst, gewijzigde risico's, beschermde worktrees, releasebewijs, eerstvolgende actie en STOP-voorwaarden. Geen aparte micro-gate. **Schrijfstatusdocumenten niet automatisch wanneer de bestaande goedkeuring alleen read-only toegang geeft.**

**Bij start nieuwe chat:** lees projectcontext en dit document, daarna de relevante bron via de [dossierindex](README.md): Core-roadmap V1.1 met aanvulling, commercieel basisplan of eigen roadmap/bewijsbron. Voor A&S blijven `ACCOUNT_SECURITY_ROADMAP.md` en `ACCOUNT_SECURITY_EVIDENCE.md` vereist. Controleer versie, ongecommitte aanvullingen en verificatiedatum; vraag alleen ontbrekend bewijs op. Chatgeheugen is geen vervanging voor dit dossier.
