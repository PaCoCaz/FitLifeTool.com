# Centraal projectstatusdossier

[CORE_APPLICATION_ROADMAP.md](CORE_APPLICATION_ROADMAP.md) is de enige
officiële SSOT voor Core Application-planning en fasevoortgang.
[FITLIFETOOL_PROJECT_STATUS.md](FITLIFETOOL_PROJECT_STATUS.md) is het
regie-/navigatieportaal voor werkstromen, afhankelijkheden, blokkades en Guard;
het onderhoudt geen concurrerende Core-faseplanning. Dit dossier ontsluit ook
de [A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) en het
[bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md). Die bronnen blijven eigenaar
van hun detailbewijs. Het Developer Handbook blijft de architectuurbron.

## Centrale bronnen en leesroute

| Vraag | Leidende bron |
|---|---|
| Projectregie, afhankelijkheden en documentatiestatus | [Projectstatus](FITLIFETOOL_PROJECT_STATUS.md) |
| Officiële Core-planning en voortgang: twaalf fases, volgorde, status, acceptatie en bewijs | [Core Application-roadmap](CORE_APPLICATION_ROADMAP.md), eigenaarbasis V1.1 met aanvulling |
| Commerciële en financiële planning | [Aangewezen Word-master en afgeleide samenvatting](COMMERCIAL_FINANCIAL_BASELINE.md) |
| Functionele en technische architectuur | [Developer Handbook](<../../app/(app)/handbook/>) |
| Account & Security-status en eigen historisch bewijs | [A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) en [bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md) |
| Productdatamethodologie | [Product Data Governance](../product-data/PRODUCT_DATA_GOVERNANCE.md) |

AGENTS.md, CODEX.md en toepasselijke workflow bepalen uitvoeringsgrenzen.
Lees na projectcontext/projectstatus de diepste bron voor de actuele vraag.
Specifieke roadmaps en bewijsregisters blijven eigenaar van hun technische
status; de productroadmap verandert bewezen feiten niet. Productbesluiten,
commerciële planning, implementatie en gevalideerde releases blijven
afzonderlijk. Geen plan of Handbook-beschrijving bewijst op zichzelf werking
of Production. Het externe Word-bestand kent een expliciete toegangsbeperking.

## Begrippen en overdracht tussen chats

- Een **werkstroom** is een inhoudelijk projectonderdeel met een eigen doel.
- Een **roadmap** is een plan voor ontwikkeling en afhankelijkheden; een plan
  bewijst geen implementatie of acceptatie.
- Een **worktree** is een technische Git-werkmap; haar bestaan of chatvolgorde
  bepaalt geen projectprioriteit.

Bij hervatting van een Codex-werkstroom worden de daadwerkelijk toegankelijke,
actuele centrale status en de relevante roadmap en bewijsbronnen gelezen,
naast de toepasselijke AGENTS.md en workflow. Controleer peildatum, kandidaat,
omgeving en geldigheid van bewijs; een historisch resultaat wordt geen live-status.
De centrale planning bepaalt de volgorde en registreert expliciete besluiten
van de projecteigenaar. Een niet-vastgestelde prioriteit blijft onbekend.

ChatGPT-chats worden niet automatisch bijgewerkt door Git-wijzigingen.
De actuele projectdocumenten moeten in de hervatte sessie daadwerkelijk
toegankelijk zijn, met hun versie/commit of lokale wijzigingsstatus. Een
chatverwijzing, chatgeheugen of een pad naar een ontoegankelijk bestand is
geen bewijs dat de actuele inhoud is gelezen. Rapporteer ontbrekende toegang
concreet en vul de inhoud niet uit aannames aan.

Bij afronding van een goedgekeurde fase worden de relevante statusdocumenten
binnen dezelfde fase bijgewerkt, zoals hieronder vastgelegd. Geef bij overdracht
de gebruikte bronversie, eventuele ongecommitte aanvullingen, open blokkades,
besluiten en de eerstvolgende stap binnen de toegestane scope mee.

## Reikwijdte en brongezag

De drie aangeleverde documenten reconstrueren rapporten tot 22 oktober 2026.
Opname in dit dossier bevestigt hun onderlinge consistentie, maar verifieert
geen historische commits, testuitslagen, acceptaties of externe systemen opnieuw.
Historische Production GREEN, LOCAL PASS, open blokkades en actuele live-status
blijven afzonderlijke bewijscategorieën. Een lokale documentatiecontrole is geen
Production- of releasegoedkeuring. Ontbrekend bewijs blijft expliciet onbekend.

De inhoud bevat hervattingsvoorstellen, geen uitvoeringsopdracht: de genoemde
Stripe-inventarisatie, hersteltest, credentialtransitie en release vallen buiten
deze documentatie-integratie. Raadpleeg de door de projecteigenaar beschikbaar
gestelde `FITLIFETOOL_CHATGPT_WORKFLOW.md` voor de ChatGPT-werkafspraken.
Dit document wordt buiten de repository beheerd; gebruik de voor de sessie
aangewezen versie. Het workflowbestand wordt hier niet verplaatst of gekopieerd.

Het [Developer Handbook](<../../app/(app)/handbook/>) blijft canoniek voor
architectuur, gedrag en technische workflow; [AGENTS.md](../../AGENTS.md) bepaalt
de uitvoeringsgrenzen. Zie ook de [projectrouter](../../FITLIFETOOL_CONTEXT.md).
Dit statusdossier vervangt geen van die bronnen en introduceert geen nieuwe
businessregels. Bestaande productdatadocumentatie blijft ongewijzigd.

## Onderhoud binnen dezelfde goedgekeurde fase

Na iedere afgeronde ontwikkel-, validatie- of releasefase wordt de relevante
statusdocumentatie binnen dezelfde goedgekeurde fase bijgewerkt, mits schrijven
binnen die scope is toegestaan. Hiervoor is geen afzonderlijke micro-gate nodig.
Een uitsluitend read-only fase levert een rapport; zij autoriseert geen writes.

- Projectstatus: huidig traject, verificatiedatum, blokkades en eerstvolgende stap.
- Roadmap: fasestatus, afhankelijkheden en resterende acceptatievoorwaarden.
- Bewijsregister: exacte kandidaat/basis, manifest, testmatrix, omgeving, tijdstip,
  uitkomst, bron, beschermde worktrees en eventueel release-/Productionbewijs.

Behoud historische resultaten en vermeld latere verificaties afzonderlijk.
Promoveer LOCAL PASS nooit zonder releasebewijs tot PRODUCTION GREEN.
Maak bron-, kandidaat- en omgevingsverschillen expliciet; vul ontbrekende SHA's,
tests of acceptaties niet in op basis van aannames.

## Integratie en manifest — 22 oktober 2026

Deze documentatieworktree is geïsoleerd aangemaakt vanaf de lokaal gelijke refs
`develop` en `origin/develop`, basis `f90c074ef8eaa592a9ca180cb192f0804c32c20e`.
Deze gelijkheid betreft de aanwezige refs; er is geen remote fetch of live
releaseverificatie uitgevoerd. De beschermde main-checkout blijft afzonderlijk.
De oorspronkelijke zesbestandenintegratie is lokaal gecommit als
`126ecc7d438970b69c8a38062ee94c5f944c55ee` op
`codex/central-project-status-docs`. De governance-aanvulling is gecommit als
`3b24cbf8ecce92e02f5165754ac08cd4769e7eca` en V1.1 als
`c71daa94374e6dd9bbd0b7da860ef2febe3c677e`. De complete achtbestanden-set is
op 24 oktober fast-forward in lokale develop geïntegreerd en daarna naar
origin/develop gepusht; de push-SHA is toen geverifieerd. De eerdere
niet-geïntegreerde/kandidaatstatus is historisch, niet de huidige Git-status.
Er is geen Production-release mee bewezen. Beschermd Public Web-vervolgwerk
is behouden. Deze documentatiefase doet geen nieuwe fetch of live-verificatie.

Exact documentatiemanifest van de oorspronkelijke integratie:

| Bestand | Integratie |
|---|---|
| [Projectstatus](FITLIFETOOL_PROJECT_STATUS.md) | Nieuw; bron plus navigatie en aangepaste lokale documentstatus |
| [A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) | Nieuw; bron plus navigatie |
| [Bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md) | Nieuw; bron plus navigatie |
| [Dossierindex](README.md) | Nieuw; scope, brongezag, onderhoud en manifest |
| [Repository-README](../../README.md) | Verwijzing naar dit dossier |
| [Projectcontext](../../FITLIFETOOL_CONTEXT.md) | Statusdossier toegevoegd aan documentrouter |

Er bestond op deze basis geen afzonderlijk status-, roadmap- of bewijsdossier
om mee samen te voegen. Bestaande autoritatieve documentatie is behouden.
Er zijn geen applicatie-, database-, migratie-, dependency- of secretwijzigingen.
De harde regeleinden uit de drie bronnen zijn met Markdown-backslashes behouden
in plaats van afsluitende spaties, zodat ook nieuwe bestanden de whitespacecheck
doorstaan. De overige broninhoud is behouden, met uitsluitend de navigatie en
lokale documentstatus zoals hierboven vermeld.

## Governance-aanvulling — 22 oktober 2026

Documentatie-impact: uitsluitend
[FITLIFETOOL_PROJECT_STATUS.md](FITLIFETOOL_PROJECT_STATUS.md) en deze
[dossierindex](README.md). De oorspronkelijke zesbestandencommit blijft intact.
De roadmap en het evidence-register zijn niet gewijzigd; hun historische
resultaten, open voorwaarden en onderscheid tussen lokale en Production-status
blijven behouden. Handbook, AGENTS.md en de bestaande documentrouter blijven
inhoudelijk ongewijzigd. Er is in deze fase geen staging, commit, branchverplaatsing,
overdracht, push of deployment toegestaan of uitgevoerd.

Werkstromen en toekomstvoorstellen zijn gekoppeld aan de aanwezige
Handbook-/dossierbronnen. Een bronhoofdstuk is geen bewijs van een afzonderlijke
roadmap of actuele faseacceptatie. De Permanente Security & Privacy Guard is
als blijvende verantwoordelijkheid vastgelegd, met operationele inrichting nog
open. Er is geen projectbrede rangorde bedacht.

### Herkomst

Bronmap: `/Users/paulcastelijns/Projects/fitlifetool_status/`.
SHA-256 van de oorspronkelijke aangeleverde bestanden, vóór navigatietoevoeging:

| Bronbestand | SHA-256 |
|---|---|
| ACCOUNT_SECURITY_EVIDENCE.md | `7e2d62f4f2384457eee92bc7242c1df72f6d693fc6ce99a343513549c8253f12` |
| ACCOUNT_SECURITY_ROADMAP.md | `cd060ffa4078a6a71e45d9ee47dcad3d8908ec7b60280ae561440f833b132ad2` |
| FITLIFETOOL_PROJECT_STATUS.md | `d64564cb16fc9910cf2bcc58d849e253eb11fc94b6b85f17c27e069fef2f07a8` |

### Consistentie en resterend bewijs

De drie bronnen beschrijven AUTH09 als lokaal gevalideerd zonder bewezen
release, AUTH10 als lokale kandidaat met geblokkeerde Hosted Staging/Production,
en de back-up als gemaakt zonder volledige restoretest. De eerdere en latere
AUTH10-migratiehash blijven gescheiden (E06/E07). De latere invoicecorrectie
blijft zonder exacte SHA/testmatrix (E08). De tijdgebonden Vercel-waarnemingen
blijven beide staan; een later screenshot heft historische blootstelling niet op.
Er is geen onderlinge tegenspraak gevonden die een nieuwe statusclaim vereist.

De open bewijs- en releasepunten in de drie documenten blijven open.
Documentatievalidatie controleert Markdown-structuur, verwijzingen, bronbehoud,
manifest, diff-whitespace en worktree-integriteit; applicatie-, database- en
integratietests zijn niet nodig voor deze uitsluitend documenterende wijziging.

## Consolidatie V1.1 met uitvoeringsvolgorde — 24 oktober 2026

Historisch verslag van de toen goedgekeurde schrijf-/validatiefase. De
commit- en integratiehandelingen volgden met afzonderlijke goedkeuring, zoals
hierboven vermeld; de toenmalige ongecommitte status geldt niet meer.

Complete vervangende eigenaaropdracht binnen dezelfde documentatiefase, met de
daaropvolgende aanvulling over voorgestelde uitvoeringsvolgorde. Eerdere
schrijfacties zijn geweigerd wegens aanvullende eigenaarinformatie en hebben
geen bestanden gewijzigd. De eigenaar autoriseert deze bestaande worktree:
`codex/central-project-status-docs`, basis
`3b24cbf8ecce92e02f5165754ac08cd4769e7eca`; geen nieuwe worktree/branchwissel.

Exact kandidaatmanifest:

- Nieuw: `docs/project/CORE_APPLICATION_ROADMAP.md`.
- Nieuw: `docs/project/COMMERCIAL_FINANCIAL_BASELINE.md`.
- Gewijzigd: `docs/project/README.md`, `docs/project/FITLIFETOOL_PROJECT_STATUS.md`,
  `FITLIFETOOL_CONTEXT.md` en repository-`README.md`.

V1.1 en aanvulling leggen productrichtingen en twaalf voorgestelde fases in
voorgestelde uitvoeringsvolgorde vast; geen formele fasegoedkeuring, afronding
of eerste releasescope. A&S loopt parallel, UX-ontwerp start tijdig parallel
en implementatie gefaseerd. Strategie: Core, daarna Public SEO, vervolgens
eventuele mobiele apps; bestaande goedgekeurde parallelle werkzaamheden blijven
gerespecteerd. Health is latere uitbreiding.

Word blijft de enige commerciële/financiële master, extern en ongewijzigd;
geen kopie toegevoegd. De repositorysamenvatting is afgeleid. A&S-roadmap,
bewijsregister, Handbook, agentinstructies en productdatagovernance blijven
ongewijzigd. Securityreconstructiepeildatum blijft 22 oktober; deze nieuwe
documentatiedatum actualiseert geen operationele/Production-status.

Deze kandidaat blijft unstaged en ongecommit. Geen commit, branchintegratie,
push, merge of deployment. Latere Git-/releaseacties vereisen hun bestaande
expliciete autorisatie.

Normale documentatiecontrole: exact manifest, volledige diff, whitespace,
lokale links, twaalf fases/volgorde, prijs-/trialconsistentie, besluit- versus
bewijsstatus, masterintegriteit en behoud van worktrees. Resultaten staan in
de oplevering. Geen applicatietests, builds, brede audit of externe validatie.


## Roadmapbeheer en projectbrede toegang — 25 oktober 2026

De bestaande roadmap is nu tevens het enige actuele Core-fasestatusregister.
De eigenaaropdracht Centrale roadmap & voortgangsbeheer en de aanvulling voor
alle chats autoriseren deze documentatie-/workflow-inrichting, geen nieuwe
ontwikkelfase. De twaalf fases, volgorde en prioriteiten blijven behouden.
Statusdefinities, fasecriteria, bewijsgrenzen, open punten en de volgende
toegestane stap staan uitsluitend in de [roadmap](CORE_APPLICATION_ROADMAP.md).
De projectstatus verwijst; kopieer geen onafhankelijk wijzigende fasetabel.

### Daadwerkelijk beschikbare toegang

- Codex kan in deze sessie de lokale develop-werkboom en Git-objecten lezen.
  Gitbasis: `be3525c9baa79916ca4c3825569d7cb1f56786d3`; de huidige documentdiff
  is nog ongecommit en staat dus nog niet in de gedeelde Git-versie.
- In de beschikbare tools is geen GitHub-codeleesconnector en geen functie
  voor lezen/schrijven van ChatGPT-projectinstructies aangetroffen.
  Projectlisting toont het actieve ChatGPT-project **FitLifeTool**, naast
  onder meer **FitLifeTool (old)**; de actuele instructie-inhoud en
  accountkoppelingen van die projecten zijn niet uitgelezen of gewijzigd.
  Deze beperking bewijst niet dat de gebruikersinterface die mogelijkheid mist.
- De tool kan projectmetadata tonen; dat verleent geen instellingentoegang.
  Daarom wordt onderstaande tekst aangeleverd voor éénmalige plaatsing door
  de eigenaar. Geen projectinstellingen of chatlidmaatschappen zijn aangepast.
- ChatGPT-projectinstructies kunnen projectchats gedeelde richtlijnen geven;
  een project heeft niet vanzelf toegang tot lokale bestanden. Zie de
  [officiële OpenAI-documentatie](https://learn.chatgpt.com/docs/projects).
  De daadwerkelijk gelezen bronversie blijft bepalend, niet chatgeheugen.
- Er is geen automatische Git-/projectbestandensynchronisatie of automatische
  vernieuwing van alle bestaande chats/werkboomkopieën vastgesteld.

### Praktische broncontrole voor iedere sessie

1. Gebruik repository `PaCoCaz/FitLifeTool.com`, branch `develop`,
   pad `docs/project/CORE_APPLICATION_ROADMAP.md`. Controleer de werkelijk
   toegankelijke branch/commit, eventuele lokale diff en peildatum.
   De default branch main mag niet stilzwijgend als actuele develop gelden.
2. Codex leest de actuele werkboomversie naast HEAD; vermeld ongecommitte
   aanvullingen afzonderlijk. In een oudere/beschermde checkout: raadpleeg de
   aangewezen develop-bron read-only, zonder checkout, reset of worktree-update.
3. Voorkeur voor ChatGPT: een geschikte, door de eigenaar verbonden GitHub-app
   of andere toegestane bron die aantoonbaar dit bestand op develop én de
   bijbehorende commit kan lezen. De eigenaar kiest de juiste account/repository
   en verleent alleen de benodigde toegang. Test dat in een FitLifeTool-projectchat
   door bestand, branch en werkelijke bron-SHA te laten teruggeven.
   Een installatie of zoekhit alleen bewijst geen toegang tot deze branch.
4. Biedt een beschikbare koppeling alleen een defaultbranch, indexsnapshot of
   geen herleidbare versie, claim dan geen actuele Git-status. Als alternatief
   kan de eigenaar een gecontroleerde export van roadmap en benodigde workflow
   met commit-SHA, exportdatum en eventuele lokale diff beschikbaar maken.
   Markeer dit als handmatig aangeleverde momentopname. Actualiseer de kopie na
   relevante goedgekeurde wijzigingen; Git synchroniseert haar niet vanzelf.
5. Als de actualiteit niet kan worden vastgesteld: expliciet melden vóór
   nieuwe fasekeuze. Vraag uitsluitend de ontbrekende bron/versie; start
   geen nieuwe fase op basis van een verouderde upload.
6. Noteer bij overdracht gebruikte branch/SHA, lokale wijzigingen, fase,
   geldig bewijs, open punten en volgende toegestane stap. Hervatte bestaande
   chats moeten dezelfde actuele bron opnieuw raadplegen waar relevant;
   deze documentwijziging herverwerkt hun oude antwoorden niet.

### Eenmalige handeling voor de projecteigenaar

Open de projectinstellingen van het actieve ChatGPT-project **FitLifeTool**,
open het onderdeel voor projectinstructies en voeg onderstaande tekst toe met
behoud van overige geldige instructies. Dit is de aangeleverde tekst, geen
claim dat de instelling al is gewijzigd.

Laat actieve FitLifeTool-chats onder dit project vallen of geef andere bewust
behouden FitLifeTool-projecten dezelfde centrale bronverwijzing in hun eigen
projectinstructies. Chats buiten een project krijgen de instructies van dat
project niet automatisch. Verplaats of wijzig chats niet ongecontroleerd.
Controleer in iedere hervatte/nieuwe relevante chat de bronversie voordat een
nieuwe fase wordt gekozen. Configureer een geschikte bronkoppeling alleen als
die daadwerkelijk beschikbaar is; de huidige Codex-toolset stelt de
ChatGPT-koppeling of instellingen niet voor de eigenaar in.

### Exacte ChatGPT-projectinstructie

<!-- FITLIFETOOL_PROJECT_INSTRUCTIONS_BEGIN -->
```text
Deze afspraken gelden voor alle bestaande en toekomstige FitLifeTool-chats in dit project.

De enige officiële bron voor Core Application-planning en voortgang is docs/project/CORE_APPLICATION_ROADMAP.md in repository PaCoCaz/FitLifeTool.com, branch develop. Raadpleeg ook de toepasselijke AGENTS.md, CODEX.md, projectcontext en FitLifeTool-workflow. Het Developer Handbook blijft leidend voor functionele en technische architectuur; afzonderlijke roadmaps en bewijsregisters behouden hun eigen detailbewijs.

Lees bij iedere ontwikkel-, ontwerp-, validatie-, release- of prioriteringsopdracht de actuele roadmap. Vermeld de gelezen branch, commit-SHA en eventuele ongecommitte aanvullingen. Is de actuele Git-versie niet toegankelijk of kan de actualiteit niet worden vastgesteld, meld dat vóór het kiezen van een nieuwe fase. Gebruik een geüploade projectkopie of chatgeheugen nooit stilzwijgend als actuele status.

Behoud de twaalf fases, hun voorgestelde volgorde, vastgestelde prioriteiten en afgeronde besluiten. Wijk daarvan niet zelfstandig af. Houd rekening met bestaande goedgekeurde parallelle werkzaamheden, waaronder Account & Security en tijdig UX-ontwerp. Maak geen tweede roadmap of concurrerende planning.

Gebruik PLANNED, IN PROGRESS, BLOCKED en DONE volgens de definities in de officiële roadmap. DONE vereist de toepasselijke acceptatie- en releasebewijzen. Onderscheid implementatie, lokale validatie, integratie op develop, remote publicatie, Preview en Production.

Controleer bij faseafronding of de roadmap moet worden bijgewerkt en neem de normale documentatie-update waar veilig mogelijk mee in dezelfde goedgekeurde opdracht. Respecteer read-only scope, STOP-condities en alle Git-, security-, worktree- en deploymentgrenzen. Geen extra micro-goedkeuring voor gewone substappen binnen een goedgekeurde fase.

Bepaal daarna de eerstvolgende fase vanuit de actuele roadmap, maar start die niet automatisch zonder inhoudelijke goedkeuring. Claim geen automatische synchronisatie tussen Git, projectbestanden of bestaande chats.
```
<!-- FITLIFETOOL_PROJECT_INSTRUCTIONS_END -->

### Scope en publicatie van deze kandidaat

Alleen zes bestaande repository-Markdownbestanden wijzigen: `AGENTS.md`,
`CODEX.md`, `FITLIFETOOL_CONTEXT.md`, `docs/project/CORE_APPLICATION_ROADMAP.md`,
`docs/project/README.md` en `docs/project/FITLIFETOOL_PROJECT_STATUS.md`.
Daarnaast is de bestaande externe
`/Users/paulcastelijns/Projects/FITLIFETOOL_CHATGPT_WORKFLOW.md` gericht bijgewerkt.
Dat workflowbestand staat buiten de repository en wordt niet automatisch
meegenomen in een toekomstige Git-commit; er is geen tweede masterkopie gemaakt.

Geen Handbook/applicatiecode, commerciële Word-master, dependencies, database,
credentials, configuratie of beschermde worktree gewijzigd. De 21 beschermde
Public Web-bestanden blijven intact. Bestaande main en andere werkboomversies
van AGENTS.md worden niet aangepast. Zolang deze kandidaat niet afzonderlijk
is gecommit/gepubliceerd en de eigenaar de projectinstructie niet heeft
geplaatst, is projectbrede technische beschikbaarheid niet aangetoond.
Geen tests/build nodig voor deze uitsluitend documenterende wijziging.
