# FitLifeTool — Account & Security-bewijsregister

[Dossier en onderhoud](README.md) · [Projectstatus](FITLIFETOOL_PROJECT_STATUS.md) · [A&S-roadmap](ACCOUNT_SECURITY_ROADMAP.md) · [Bewijsregister](ACCOUNT_SECURITY_EVIDENCE.md)

**Peildatum:** 22 oktober 2026. Dit register indexeert historische Codex-/chatrapporten; het is geen onafhankelijke heruitvoering of live-stand.\
**Regel:** bewijs hoort bij een exacte kandidaat, basis, omgeving en tijdstip. Verplaats PASS niet stilzwijgend naar gewijzigde code of Production.

| ID | Fase / gebeurtenis | Bewijs en identifiers | Reikwijdte / beperking |
|---|---|---|---|
| E01 | Public Homepage | Commit `734916915979b28c3b916548f90ab36e2ca7eef6`; Vercel `dpl_BVSDFu4bEKFvdd5KefLMGv88yMGB`; 5 public routes 200 | CLOSED / PRODUCTION GREEN historisch |
| E02 | Auth Test Interop | Commit `df9f8f1d079c1ff2b66f37572f71507fc8795729`; Vercel `Duss2F9YP63gSeDfwsMTBeGiQtFC`; 2 testfiles | PRODUCTION GREEN historisch, geen runtimewijziging |
| E03 | Admin Registration Control | Commit `a47a4d7d314523efc8de551f0843b8876cf9f85d`; Vercel `EywXBsqL5Y6pvCmQyvfeYa3EEdte`; 69/69 focused | PRODUCTION GREEN historisch |
| E04 | AUTH09 callback metadata | 3 files, 11/11 focused/adversarial PASS | Provider-reële callback niet bewezen |
| E05 | AUTH09 Generation 1-cancellation | 5-file manifest; focused 12/12; canonical 468/468; migration SHA `12d227a197a39d2e8f052a69bf99270f61c567463ab3f96a04e02e399758da6b`; test SHA `68316223032670d0025026a640a2a7727d885153c4ebca3fb889bb4f7fbf8190` | LOCAL PASS / releaseplanning klaar, geen Productionbewijs |
| E06 | AUTH10 Stripe Readiness | 30/30 focused, 496/496 canonical, PostgreSQL concurrency en rollback PASS; migratie `20261017100000_harden_stripe_webhook_transactionality.sql`, SHA `9d8df244c90432d823434f1294a2e32b0d62329c540a52b2b2a6193abaf7ef39` | Geïsoleerde LOCAL PASS; geen live Stripe E2E |
| E07 | AUTH10 latere kandidaat | Commit `7b51c04c966757408093621be6c59dcdbb522e6f`; migratiehash `86fac2321e1eb1177b902c47b22d7ee56335547fdab46f0e01515539bf5c0486` | Kandidatenintegriteit in read-only preflight gerapporteerd; SHA-relatie met E06 niet bewezen |
| E08 | AUTH10 invoicecorrectie | Volgens later verslag lokaal gevalideerd en gecommit | Exact commit-SHA, manifest, tests in aangeleverde samenvatting niet bekend |
| E09 | Dependency Security Remediation | 14-file kandidaat; 64/64 registration/Public Web, 3/3 onboarding, 483/483 canonical; Next 16.4.2; prod audit 0 critical/0 high/2 moderate, full audit 0 critical/8 high/3 moderate | LOCAL PASS, niet vrij van alle auditbevindingen, release niet bewezen |
| E10 | Legacy search migration | `20261020120000_drop_legacy_search_food_products.sql`, SHA `c382065f626fa7580d8dce638b6a86a46fb010e92a5ff325693c59e4f5e7ca89` | Verwijdert lokaal 2 oude overloads, behoudt `(text, integer, boolean)`; Production-consumentenrisico |
| E11 | Full Catalog Baseline | 982 records; 55 tabellen (38 operationeel + 17 staging); 396 kolommen; 126 constraints; 79 indexen (48 constraint-backed + 31 standalone); 50 policies; 4 triggers; 2 views; 1 sequence; 36 actuele functies | Twee netwerkloze onafhankelijke lokale installs PASS; geen Productionmutatie |
| E12 | Baseline reproducibility | Columns `52f12f12e5874a57fb90a15f166215e6`; constraints `d5d0e00a961111af31e65e80b3d9b8f4`; functions `6a769c41bc9130d45a9468c33a848bcf`; indexes `8692749fc775e817aa5afefb837ff118`; policies `1c94a5a22af67e13fd840adc7b752043`; tables/RLS/ACL `cb48e48b517bdef173b1fb54a12c8e41` | Zes fingerprints A=B, cleanup PASS |
| E13 | Object Identity Recovery | 21/21 matches, 11 constraints, 10 policies, alle `match_count=1` | Read-only schema-identiteit PASS |
| E14 | External Isolation Preflight | GitHub-basis VERIFIED, AUTH10 candidate intact; Vercel Preview-secretrisico; aparte Supabase Staging; Stripe sandboxwebhook historisch Production-domein | Read-only audit PASS; Hosted Staging BLOCKED |
| E15 | Vercel recovery inventory | 6 projectvariables, 0 shared; Production `main`; `fitlifetool.com`, `fitlifetool.vercel.app`, www 308; 3 server-side `Needs Attention` | Screenshot-tijdstip; geen secretwaarden; historische URLs en DNS-herstel niet compleet |
| E16 | Backup 21 okt | APFS encrypted `FITLIFETOOL-BACKUP`; Git-bundle ~50.6 MB; 58 changed files; 10 images; PostgreSQL custom dump + roles; Auth-config | Kopieën gecontroleerd; geen volledige restoretest |

## AUTH10 lokaal exact manifest (20 gewijzigde bestanden, oorspronkelijke geïsoleerde kandidaat)

- `app/(app)/handbook/doc-l3-0016/page.tsx`
- `app/api/stripe/change-plan/route.ts`
- `app/api/stripe/checkout/route.ts`
- `app/api/stripe/portal-update/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/lib/stripe/entitlementRules.test.mts`
- `app/lib/stripe/entitlementRules.ts`
- `app/lib/stripe/handlers/handleCheckoutSession.ts`
- `app/lib/stripe/handlers/handleCustomer.ts`
- `app/lib/stripe/handlers/handleInvoice.ts`
- `app/lib/stripe/handlers/handlePrice.ts`
- `app/lib/stripe/handlers/handleProduct.ts`
- `app/lib/stripe/handlers/handleSubscription.ts`
- `app/lib/stripe/stripeHandlerSafety.test.mts`
- `app/lib/stripe/subscriptionPersistence.ts`
- `app/lib/stripe/webhook.ts`
- `app/lib/stripe/stripeBillingRouteSafety.test.mts`
- `app/lib/stripe/stripeWebhookMigration.test.mts`
- `app/lib/stripe/stripeWebhookTransaction.test.mts`
- `supabase/migrations/20261017100000_harden_stripe_webhook_transactionality.sql`

**Let op:** dit manifest hoort bij E06, niet automatisch bij de latere commit E07 of invoicecorrectie E08.

## AUTH09 Generation 1-cancellation exact manifest

- `supabase/migrations/20261015100000_add_auth_email_change_cancellation.sql`
- `app/lib/auth/emailChangeCancellationMigration.test.mts`
- `app/lib/auth/emailChangeState.ts`
- `app/lib/auth/emailChangeState.test.mts`
- `app/(app)/handbook/doc-l3-0002/page.tsx`

## Backup: drie bewust uitgesloten bestanden

- `app/lib/auth/registrationFlow.test.mts`
- `app/lib/publicWeb.ts` in de preview-worktree
- `app/lib/publicWeb.ts` in de afzonderlijke public-web-worktree

**Geen conclusie dat dit echte actieve secrets zijn.** Behandel deze bestanden uitsluitend volgens de bestaande securitygrenzen.

## Nog te verifiëren zonder werk te herhalen

- Exacte commit, manifest en testmatrix van de latere AUTH10-invoicecorrectie.
- Verhouding tussen AUTH10-migratiehash E06 en latere E07; huidige branch-/remote-/worktreebasis vóór eventuele release.
- Definitieve AUTH09-release/provideruitkomst.
- Actuele Production-/Preview-secretdekking inclusief oude directe deployment-URL's; betekenis van `Needs Attention`.
- Stripe webhook-endpoints/events en sandbox/live scheiding, credentialconsumers.
- Herstelbaarheid Vercel/DNS/Stripe en geïsoleerde volledige restoretest.
- Formele acceptatie AUTH09B en AUTH11–AUTH14.

## Registratiesjabloon voor volgende gate

`YYYY-MM-DD HH:MM TZ | TRAJECT | FASE | KANDIDAAT/BASE SHA | MANIFEST | TESTS | ENVIRONMENT | GATE | PROTECTED WORKTREES | RISICO/STOP | NEXT ACTION | BRON`

Werk dit register bij als onderdeel van een goedgekeurde write-scope; een read-only fase mag een rapport opleveren, maar niet stilzwijgend Git-documenten wijzigen.
