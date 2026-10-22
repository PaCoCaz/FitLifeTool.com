# FitLifeTool — Account & Security-roadmap (AUTH01–AUTH14)

[Dossier en onderhoud](README.md) · [Projectstatus](FITLIFETOOL_PROJECT_STATUS.md) · [A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) · [Bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md)

**Peildatum:** historische reconstructie t/m 22 oktober 2026. **Geen actuele live-herverificatie.**\
**Werkgrenzen:** `FITLIFETOOL_CHATGPT_WORKFLOW.md` en toepasselijke `AGENTS.md` blijven leidend.

| Fase | Onderwerp | Laatst onderbouwde status | Wat resteert / nuance |
|---|---|---|---|
| AUTH01 | Account & Security basis | COMPLETE (historische roadmap) | Exacte acceptatieartefacten niet volledig opgenomen |
| AUTH02 | Auth foundation | COMPLETE (historische roadmap) | Idem |
| AUTH03 | Auth/security foundation | COMPLETE (historische roadmap) | Idem |
| AUTH04A–04E | Auth hardening + DB/security | COMPLETE / PRODUCTION GREEN (historisch) | Releasebewijs alleen waar overgeleverd |
| AUTH05 | DB/auth vervolg | COMPLETE (historische roadmap) | Exacte acceptatieartefacten niet volledig opgenomen |
| AUTH06 | Auth Journey | COMPLETE / PRODUCTION GREEN (historisch) | Geen herhaling zonder relevante wijziging |
| AUTH07 | Password Recovery | COMPLETE / PRODUCTION GREEN (historisch) | Geen herhaling zonder relevante wijziging |
| AUTH08 | Password Change | COMPLETE / PRODUCTION GREEN (historisch) | Geen herhaling zonder relevante wijziging |
| AUTH09 | Email Change | IN PROGRESS; Generation 1-cancellation remediatie LOCAL PASS | Release/deployment niet aangetoond; provider callback-reconciliatie afzonderlijk |
| AUTH09B | Lost Old Email Access | OPEN / UNVERIFIED | Ontwerp, implementatie, E2E en acceptatie ontbreken in beschikbare bewijsset |
| AUTH10 | Stripe Readiness | LOCAL PASS; releasekandidaat gerapporteerd; latere invoicecorrectie lokaal gevalideerd en gecommit | Hosted Staging BLOCKED; secret containment, herstelbasis, externe isolatie en Production-release OPEN |
| AUTH11 | Stripe lifecycle | OPEN / UNVERIFIED | Live/sandbox lifecycle-E2E en Production-acceptatie niet bewezen |
| AUTH12 | Role provenance | OPEN / UNVERIFIED | Implementatie en formele acceptatie niet bewezen |
| AUTH13 | Account deletion | OPEN / UNVERIFIED | Privacy-/data-/billing-afhandeling en acceptatie niet bewezen |
| AUTH14 | Final security/audit | OPEN / UNVERIFIED | Integrale audit, herstel-/releasebewijzen en formele afsluiting niet bewezen |

## AUTH09 — precieze checkpoint

- Historisch Production-schema-incident (`AUTH_STATE_UNAVAILABLE`, ontbrekende RPC's) afzonderlijk gerapporteerd; **niet zonder actuele observatie als huidig incident behandelen**.
- Callback-observatie: 3-file geïsoleerde kandidaat; structurele metadata, geen tokens, focused/adversarial 11/11 PASS; echte provider-callbackuitkomst niet bewezen.
- Generation 1-cancellation: 5-file kandidaat, schema fail-closed correctie; focused 12/12, canonical 468/468, TypeScript/lint/diff PASS; protected callback fingerprints 3/3 MATCH.
- Laatst expliciet: **READY FOR RELEASE PLANNING RESUMPTION**, niet PRODUCTION GREEN.

## AUTH10 — precieze checkpoint

- Lokale Stripe Readiness: 30/30 focused, 496/496 canonical, TypeScript, lint, lokale production build en PostgreSQL-runtime/concurrency PASS. Eén 20-file kandidaat in geïsoleerde worktree; geen Production/live Stripe-mutatie.
- Latere overlevering: AUTH10-releasekandidaatcommit `7b51c04c966757408093621be6c59dcdbb522e6f`; migratiehash `86fac2321e1eb1177b902c47b22d7ee56335547fdab46f0e01515539bf5c0486`. De relatie tot de eerdere lokale migratiehash moet bij daadwerkelijke release worden vastgesteld, niet aangenomen.
- Nog later: **invoicecorrectie lokaal gevalideerd en gecommit**, exacte SHA/testmatrix in beschikbare samenvatting onbekend.
- External Isolation Preflight read-only PASS; Hosted Staging BLOCKED. Vercel Preview-secretblootstelling historisch gerapporteerd, Supabase Staging apart maar nog niet volledig geprovisioneerd, Stripe-sandboxwebhook historisch naar Production-domein.
- Laatste gesprekspunt: Vercel-configuratie-inventarisatie afgerond; **Stripe Sandbox 1 webhookoverzicht** is eerstvolgende read-only stap.

## Ondersteunende trajecten en afhankelijkheden

| Traject | Status | Releaserelevantie |
|---|---|---|
| Full Catalog Baseline | LOCAL PASS: 55 tabellen, twee installaties, zes gelijke fingerprints | Niet opnieuw installeren zonder nieuw materieel risico |
| Legacy search overload removal | LOCAL PASS; Production BLOCKED | Externe RPC-consumenten/deprecation bewijs vereist vóór Production-drop |
| Dependency Security Remediation | LOCAL PASS; geen releasebewijs | Gecombineerde kandidaat en auditresiduen controleren bij relevante release |
| Security & Payment containment | Voorbereiding afgesloten, uitvoering BLOCKED | Oude credentials, historische deployments, herstelbasis |
| Backup & DR | Backupcreatie gecontroleerd; restoretest OPEN | Herstelgarantie vóór risicovolle wijzigingen |

## Beslisvolgorde zonder dubbel werk

1. Reeds gevalideerde feiten en hun exacte kandidaatbasis hergebruiken.
2. Stripe-webhookherstelmetadata gericht afronden; geen secretwaarden tonen.
3. Alleen ontbrekende credential-consumer- en historische deploymentdekking vaststellen.
4. Herstelbasis en geïsoleerde restoretest aantonen.
5. Na expliciete passende toestemming containment/rotatie/neutralisatie uitvoeren, Production behouden tot veilig alternatief.
6. Hosted Staging correct isoleren, relevante AUTH10 E2E en actuele integratievalidatie uitvoeren.
7. Production-release pas na releasegate; daarna AUTH11–AUTH14 op bewijs afwerken.

**Geen autorisatie in dit document voor uitvoering, Git-write, secretrotatie, databasewijziging of deployment.**
