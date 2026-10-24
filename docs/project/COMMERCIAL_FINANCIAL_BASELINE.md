# Commercieel en financieel basisplan

**Peildatum:** 24 oktober 2026. **Status:** vastgestelde zakelijke
planningsuitgangspunten; bedragen en berekeningen niet onafhankelijk gevalideerd.

## Eén aangewezen masterbron

De enige commerciële/financiële master is
[FitLifeTool_Commercieel_Financieel_Basisplan_v1.0.docx](</Users/paulcastelijns/Projects/FitLifeTool_Commercieel_Financieel_Basisplan_v1.0.docx>).
Versie **1.0, 24 oktober 2026**, status in Word: **vastgelegde planningsuitgangspunten**.
Eigenaarbron V1.1 bevestigt deze master. Gelezen SHA-256:
`2ad469d4c858c353565d81c56f94f18fd31fd23d0ce6ecee7e73564d4c7bc22b`.

Word blijft extern en ongewijzigd; geen kopie toegevoegd. De absolute link werkt
alleen waar dat lokale pad beschikbaar is. Universele toegang voor ChatGPT of
andere computers is niet aangetoond. Deze repositorysamenvatting is leesbaar
zonder Word maar blijft afgeleid van de genoemde bronversie, geen tweede
zelfstandig beheerde master. Voor bronverificatie is toegang tot de originele
Word-versie nodig; een pad of hash alleen bewijst geen gelezen inhoud.

Wijzig zakelijke bronbesluiten in een expliciet goedgekeurde masterversie en
synchroniseer daarna samenvatting, versie, hash en verwijzingen. Wijzig bedragen
niet zelfstandig in deze samenvatting. Bij verschillen tussen bronnen of een
later eigenaarbesluit: rapporteer brongezag, datum en verschil; pas app of Stripe
niet zelfstandig aan.

## Abonnementen

| Onderwerp | Vastgesteld planningsuitgangspunt |
|---|---|
| Free Trial | Maximaal 30 dagen beperkt maar bruikbaar proefgebruik; geen permanent gratis abonnement. |
| Betaalkaart | Geen betaalkaart vereist voor de proefperiode. |
| Betaalomzetting | Geen automatische omzetting naar betaald; uitsluitend na expliciete toestemming. |
| Premium | € 6,95 per maand inclusief 21% btw. |
| Pro | € 9,95 per maand inclusief 21% btw. |
| Verdeling | 80% Premium / 20% Pro als aanname, geen gemeten klantenverdeling. |
| Rechten | Definitieve featurematrix, limieten, server-side rechten en Pro-meerwaarde uitwerken in fase 3. |

De oudere permanent-Free-richting en eerdere prijsopties (€ 4,95/€ 8,95 en de
kandidaat € 6,95/€ 11,95 uit de value-auditopdracht) zijn geen actuele
planningsprijzen. Deze master en V1.1 leggen € 6,95/€ 9,95 vast. Dit bewijst
geen gewijzigde applicatieprijzen, Stripe-producten of proeflogica en
autoriseert zulke wijzigingen niet.

Proefbeperkingen, start/afloop, toegang na afloop, export en
verwijder-/bewaartermijnen blijven open. Het eerdere gewenste contract voor
correcte basisberekeningen en historische correcties verleent geen onbeperkte
toegang na proefafloop. Downgrade verwijdert historie niet stilzwijgend.

## Vaste kosten en opschaling

| Onderwerp | Begrotingsaanname en grens |
|---|---|
| Vercel | Pro vanaf commerciële lancering. |
| Supabase | Aanvankelijk Free; Pro financieel vanaf 15 betalende klanten of eerder bij technische/operationele noodzaak, capaciteit, beschikbaarheid, veiligheid of voorwaarden. Geen capaciteitsgarantie. |
| GitHub | Free voorlopig € 0 per maand; betaalde functies/Actions-overages afzonderlijk beoordelen. |
| Opschaling | Onderbouwen met aantoonbaar gebruik of reële operationele noodzaak; geen fictieve vaste meerkosten per betalende klant. |
| Basis met Supabase Free | € 675,08 per jaar; circa € 56,26 vaste maanduitgaven. |
| Basis met Supabase Pro | € 987,26 per jaar; circa € 82,27 vaste maanduitgaven. |

Jaarlijkse ontwikkelkosten uit V1.1: FitLifeTool.nl € 19,97, FitLifeTool.com
€ 32,67, e-mail € 94,38, ChatGPT Plus € 276,00; totaal € 423,02. Word begroot
daarnaast Vercel Pro op € 252,07 en Supabase Pro op € 312,18 per jaar.

Bedragen bevatten eerdere btw- en wisselkoersaannames. Word rekent met
jaarbedragen / 12; maandbedragen zijn afgerond. Dit zijn modelinvoerwaarden,
geen in deze fase geverifieerde facturen of actuele leverancierstarieven.

## Financiële rekenaannames

- Gemiddelde betaling bij 80/20: € 7,55 incl. btw per klant/maand.
- Omzet excl. btw = ontvangen abonnementsgelden / 1,21; gemiddeld circa
  € 6,24 per klant/maand volgens V1.1.
- Stripe Payments voorlopig: 1,5% + € 0,25 per succesvolle maandbetaling.
- Stripe Billing voorlopig: 0,7%.
- Bijdrage na btw en aangenomen Stripe-kosten circa € 5,82 per betalende
  klant/maand; Word-model circa € 5,8239 vóór vaste en overige kosten.
- Scenario 5/10 klanten gebruikt Supabase Free; vanaf 15 Pro. Bij kleine
  aantallen is 80/20 een gewogen model, geen letterlijke fractie van klanten.

Tarieven, toepasselijkheid, fiscale behandeling en wisselkoers blijven te
verifiëren. Deze documentatiefase controleert die niet opnieuw.

## Tien indicatieve scenario's

Ongewijzigd overgenomen uit Word v1.0, niet opnieuw berekend of onafhankelijk
gevalideerd. Advertentie-inkomsten steeds € 0.

| Betalende klanten | Omzet per maand incl. btw | Basisresultaat per maand | Basisresultaat per jaar |
|---|---|---|---|
| 5 | € 37,75 | −€ 27,14 | −€ 325,67 |
| 10 | € 75,50 | € 1,98 | € 23,75 |
| 15 | € 113,25 | € 5,08 | € 60,98 |
| 20 | € 151,00 | € 34,20 | € 410,40 |
| 25 | € 188,75 | € 63,32 | € 759,81 |
| 50 | € 377,50 | € 208,91 | € 2.506,88 |
| 100 | € 755,00 | € 500,09 | € 6.001,02 |
| 250 | € 1.887,50 | € 1.373,62 | € 16.483,45 |
| 500 | € 3.775,00 | € 2.829,51 | € 33.954,16 |
| 1.000 | € 7.550,00 | € 5.741,30 | € 68.895,57 |

Voorlopige vereenvoudigde kasgerichte basisresultaten: marketing, ondersteuning,
administratie, verzekering, belastingen en eigen arbeid zijn niet volledig
verwerkt, extra infrastructuur evenmin. Begrote vaste kosten incl. inkoop-btw
zijn in het model afgetrokken. Dit is geen volledige ondernemingswinst,
boekhoudkundige nettowinst, gegarandeerde winst of fiscale prognose.
Een jaarresultaat veronderstelt twaalf maanden op hetzelfde klantenniveau.

## Advertenties

Beperkte advertenties zijn uitsluitend een toekomstige optie op geschikte
publieke informatie-, SEO- en contentpagina's, rustig geplaatst en duidelijk
gemarkeerd. Geen advertenties in persoonlijke dashboards of ingelogde
appfuncties, waaronder registratie, analyses, accountinstellingen en abonnementen.
De master vermijdt advertenties bij voorkeur ook op de homepage.

Privacy, toestemming, beveiliging, performance en SEO zijn voorwaarden vóór
activering; geen persoonlijke leefstijldata voor advertentietargeting.
Advertentie-inkomsten blijven voorlopig **€ 0** in de basisbegroting.
Inkomsten later onderbouwen met werkelijk verkeer en geschikte monetisatie.
Geen advertentietechnologie of leverancier voor implementatie gekozen.

## Open uitwerking en samenhang

Featurematrix en betekenisvolle Pro-meerwaarde, proefafloop/gebruikerservaring,
export en bewaartermijnen blijven open. Conversie, churn, proefgebruik, opslag
en capaciteit meten voor betrouwbare ramingen. Administratie, verzekering,
belastingen en overige kosten verder uitwerken.

[Handbook 5.2](<../../app/(app)/handbook/doc-l3-0016/page.tsx>) blijft eigenaar
van entitlementarchitectuur; [A&S](ACCOUNT_SECURITY_ROADMAP.md) behoudt
AUTH10/AUTH11 en eigen bewijsvoorwaarden. De [Core-roadmap](CORE_APPLICATION_ROADMAP.md)
bevat de twaalf voorgestelde fases en uitvoeringsvolgorde: rechten in fase 3,
account-/consumenten-/privacyafsluiting in fase 10. Dit is geen financiële,
juridische, implementatie- of releasevalidatie en geen uitvoeringsopdracht.
