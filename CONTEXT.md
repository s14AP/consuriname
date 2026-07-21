# CONTEXT — conSuriname

Website voor het consulaat van Suriname in Nederland. Bezoekers boeken online
afspraken; medewerkers beheren afspraken en content via het admin-paneel.

## Stack

- **Next.js 16.2.9** (App Router, Turbopack), React 19, **TypeScript**, **CSS Modules** (geen Tailwind)
- **Payload CMS 3** draait native in dezelfde Next.js-app (geen aparte backend)
- **SQLite** via `@payloadcms/db-sqlite` — databasebestand `consulaat.db` in de projectroot
- Alles draait als **één Node-proces**; geen Docker, geen Postgres

## Mappenstructuur

```
app/
├── (frontend)/          Publieke site — URLs ongewijzigd (/, /diensten, /afspraak, …)
│   ├── afspraak/        Boekingswizard (page.tsx = server component, AfspraakWizard.tsx = client)
│   ├── lib/services.ts  Statische dienstendata — nog gebruikt door /diensten en homepage
│   └── …
├── (payload)/           Payload-scaffold (boilerplate, niet aankomen)
│   ├── admin/           → /admin
│   └── api/[...slug]/   → /api/* (Payload REST API, catch-all)
└── api/
    └── beschikbaarheid/ Eigen endpoint: vrije tijdsloten per dag

collections/             Payload-datamodel (Gebruikers, Diensten, Afspraken)
globals/                 Beschikbaarheid (openingstijden + geblokkeerde datums)
lib/kalenderdag.ts       Gedeelde datum-helper (tijdzone Europe/Amsterdam)
scripts/seed.ts          Vult diensten + openingstijden + (indien leeg) admin-user
payload.config.ts        Centrale Payload-config
payload-types.ts         Gegenereerde types (npm run generate:types)
```

## Datamodel

- **gebruikers** (auth): rol `admin` | `medewerker`. Medewerker ziet alleen zichzelf; alleen admin beheert gebruikers en rollen.
- **diensten**: naam, slug (uniek), beschrijving (rich text), benodigdeDocumenten (array), doorlooptijd, zichtbaar. Publiek leesbaar (anoniem alleen `zichtbaar: true`).
- **afspraken**: naam, email, telefoon, dienst (relationship), datum, tijdslot, status, referentie (auto), notities (alleen admin). **Publiek mag alleen aanmaken, nooit lezen/wijzigen.**
- **beschikbaarheid** (global): per weekdag open + tijdsloten; geblokkeerdeDatums voor feestdagen.

## Businesslogica (server-side afgedwongen)

- **Geen dubbele boekingen**: `beforeChange`-hook in `collections/Afspraken.ts` blokkeert een tweede afspraak op dezelfde dag+tijdslot (tenzij de bestaande geannuleerd is). Geldt voor formulier, API én admin.
- **Referentienummer** (bv. `SR-2026-48213`) wordt automatisch gegenereerd bij aanmaken.
- **AVG**: alleen naam/email/telefoon opgeslagen; de beschikbaarheid-endpoint lekt nooit persoonsgegevens.

## ⚠️ SQLite-adapter datum-eigenaardigheid

`@payloadcms/db-sqlite` geeft foute resultaten bij `equals`/`greater_than_equal`/`less_than`
op date-velden (tijdzone-verschuiving in de adapter). Dag-queries daarom **altijd via `like`**
op de dag-string (`{ datum: { like: "2026-07-20" } }`). Datums worden vóór opslag
genormaliseerd naar UTC-middernacht van de kalenderdag (`normaliseerDatum`-hook +
`lib/kalenderdag.ts`).

## Commando's

```bash
npm run dev              # dev-server (frontend + admin + API)
npm run build            # productie-build
npm run start            # productieserver
npm run seed             # database vullen met diensten + openingstijden
npm run generate:types   # payload-types.ts opnieuw genereren (na wijziging collections)
```

## Eerste keer opstarten

1. `.env` moet `PAYLOAD_SECRET` en `DATABASE_URI=file:./consulaat.db` bevatten (staat niet in git).
2. `npm run dev`, open `/admin`, maak de eerste gebruiker aan met rol **Admin**.
3. `npm run seed` voor de diensten en standaard openingstijden (ma–vr, 09:00–14:30).

## Nog niet gedaan / mogelijke vervolgstappen

- **E-mailbevestiging** versturen na een boeking (nu alleen bevestigingsscherm; Payload logt mail naar console zolang er geen mailadapter is).
- **"Aanvraag volgen"-pagina** (`/aanvraag-volgen`) koppelen aan echte afspraakstatus via referentienummer (nu nog statisch).
- **Dienstenpagina's** (`/diensten`, `/diensten/[slug]`) draaien nog op `app/(frontend)/lib/services.ts`; kunnen later naar het CMS gemigreerd worden (dan is dat bestand overbodig).
- **Optioneel burger-login**: klantwens om accounts te laten inloggen bij het boeken. Aanbevolen als aparte auth-collection `burgers` (gescheiden van personeel), en als uitbreiding — niet als vervanging van gast-boeken.
- **Productie**: reverse proxy met HTTPS (Caddy/nginx) en periodieke backup van `consulaat.db`.
```
