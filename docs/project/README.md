# Centraal projectstatusdossier

Dit dossier is het centrale startpunt voor projectvoortgang, Account & Security-
roadmap en historisch bewijs voor volgende ChatGPT- en Codex-sessies.
Lees eerst [projectstatus](FITLIFETOOL_PROJECT_STATUS.md), daarna de
[roadmap](ACCOUNT_SECURITY_ROADMAP.md) en het
[bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md).

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
Alles blijft lokaal, unstaged en ongecommit ter beoordeling.

Exact documentatiemanifest:

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
