# FitLifeTool — centraal projectstatusoverzicht

[Dossier en onderhoud](README.md) · [Projectstatus](FITLIFETOOL_PROJECT_STATUS.md) · [A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) · [Bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md)

**Reconstructiepeildatum:** 22 oktober 2026\
**Documentstatus:** lokaal opgenomen ter beoordeling; samengesteld uit historische gespreksrapporten, niet opnieuw live geverifieerd\
**Operationele status:** uitsluitend na actuele verificatie van Git/externe systemen als live-status beschouwen.

## Direct hervattingspunt

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

**Bij start nieuwe chat:** lees dit document, daarna `ACCOUNT_SECURITY_ROADMAP.md` en `ACCOUNT_SECURITY_EVIDENCE.md`; controleer de laatst gemarkeerde verificatiedatum en vraag alleen ontbrekend bewijs op. Chatgeheugen is geen vervanging voor dit dossier.
