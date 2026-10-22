# Centraal projectstatusdossier

[FITLIFETOOL_PROJECT_STATUS.md](FITLIFETOOL_PROJECT_STATUS.md) is het centrale
startpunt voor projectregie: werkstromen, planningsbesluiten, afhankelijkheden,
blokkades en de Permanente Security & Privacy Guard. Dit dossier ontsluit ook
de [Account & Security-roadmap](ACCOUNT_SECURITY_ROADMAP.md) en het
[bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md). Afzonderlijke roadmaps en
evidence-dossiers blijven de inhoudelijke bron voor hun eigen traject; de
centrale status vat samen en verwijst, zonder hun bewijs of regels te vervangen.

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
`codex/central-project-status-docs`. Zij is niet naar `develop` overgebracht
en binnen deze fasen niet naar GitHub gepusht; er is geen deployment uitgevoerd.
De governance-aanvulling van 22 oktober 2026 wijzigt uitsluitend de centrale
projectstatus en deze dossierindex en blijft unstaged en ongecommit bovenop
die lokale commit. Actuele externe remote- of Production-status wordt hiermee
niet geclaimd. De develop-overdracht blijft geblokkeerd door beschermd lokaal
vervolgwerk in de bestaande develop-worktree.

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
