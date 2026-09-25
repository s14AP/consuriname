# Consulaat van Suriname - website

Website voor het Surinaams consulaat in Nederland. Bezoekers bekijken diensten
en boeken online een afspraak; medewerkers beheren afspraken, diensten en
openingstijden via het admin-paneel.

Afspraken boeken werkt echt (opgeslagen in de database). Een deel van de site
is nog demo-inhoud: zie [Stand van zaken](#stand-van-zaken).

## Tech

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Payload CMS 3** draait in dezelfde Next.js-app (admin op `/admin`, REST API op `/api/*`)
- **SQLite** via `@payloadcms/db-sqlite` - één databasebestand (`consulaat.db`), geen aparte databaseserver
- **CSS Modules** voor styling (`*.module.css`); huisstijl-variabelen staan in
  [`app/(frontend)/globals.css`](<app/(frontend)/globals.css>). Geen Tailwind.

## Aan de slag

1. Installeer de dependencies:

   ```bash
   npm install
   ```

2. Kopieer `.env.example` naar `.env` en vul in:

   | Variabele | Betekenis |
   | --- | --- |
   | `PAYLOAD_SECRET` | Lange willekeurige string. **Verplicht** - zonder start de app niet. |
   | `DATABASE_URI` | Pad naar de SQLite-database, standaard `file:./consulaat.db` |
   | `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Eerste admin-account, aangemaakt door `npm run seed` als er nog geen gebruikers zijn |

   `.env` staat niet in git en mag er ook nooit in.

3. Vul de database met diensten, standaard openingstijden (ma-vr, 09:00-14:30)
   en het admin-account:

   ```bash
   npm run seed
   ```

   Het seed-script is idempotent: opnieuw draaien werkt bestaande diensten bij
   in plaats van ze te dupliceren.

4. Start de dev-server:

   ```bash
   npm run dev
   ```

   - Site: http://localhost:3000
   - Admin-paneel: http://localhost:3000/admin

## Commando's

```bash
npm run dev                  # dev-server (site + admin + API)
npm run build                # productie-build
npm run start                # productieserver
npm run lint                 # eslint
npm run seed                 # diensten, openingstijden en admin-account aanmaken/bijwerken
npm run generate:types       # payload-types.ts opnieuw genereren na wijzigingen in collections/globals
npm run generate:importmap   # importMap van het admin-paneel opnieuw genereren
```

## Structuur

| Pad | Inhoud |
| --- | --- |
| `app/(frontend)/` | Publieke site: home, diensten, afspraak-wizard, FAQ, nieuws, over ons, contact |
| `app/(frontend)/afspraak/` | Boekingswizard (server-pagina + `AfspraakWizard.tsx` client-component) |
| `app/(frontend)/lib/services.ts` | Statische dienstendata (nog gebruikt door home en `/diensten`, en als bron voor de seed) |
| `app/(payload)/` | Payload-scaffold voor `/admin` en `/api/*` - niet handmatig aanpassen |
| `app/api/beschikbaarheid/` | Eigen endpoint: vrije tijdsloten per dag (`?datum=JJJJ-MM-DD`) |
| `collections/` | Datamodel: `Gebruikers`, `Diensten`, `Afspraken` |
| `globals/Beschikbaarheid.ts` | Openingsdagen, tijdsloten en geblokkeerde datums (feestdagen) |
| `lib/` | Gedeelde serverlogica: beschikbaarheid, datum-helper (tijdzone Europe/Amsterdam), rate limiter |
| `scripts/seed.ts` | Seed-script |
| `payload.config.ts` | Centrale Payload-configuratie |
| `payload-types.ts` | Gegenereerde types (niet met de hand bewerken) |

## Afspraken boeken

- De wizard haalt vrije sloten op via `/api/beschikbaarheid` en maakt de
  afspraak aan via de Payload REST API (`POST /api/afspraken`).
- Bezoekers mogen afspraken alleen **aanmaken**, nooit lezen of wijzigen.
  Er worden alleen naam, e-mail en telefoon opgeslagen (AVG).
- Alle controles gebeuren server-side, ook voor boekingen via de API of het admin-paneel:
  - geen dubbele boekingen op hetzelfde tijdslot (hook + unieke database-sleutel per slot);
  - anonieme boekingen alleen op een echt beschikbaar moment en voor een zichtbare dienst;
  - maximaal 5 anonieme boekingen per IP-adres per uur.
- Elke afspraak krijgt automatisch een referentienummer, bijv. `SR-2026-48213`.
- Rollen: **admin** beheert alles, inclusief gebruikers; **medewerker** beheert
  afspraken, diensten en beschikbaarheid.

Meer achtergrond (datamodel, een eigenaardigheid van de SQLite-adapter met
datums, vervolgstappen) staat in [`CONTEXT.md`](CONTEXT.md).

## Stand van zaken

Nog niet gekoppeld aan het CMS / nog demo-inhoud:

- `/diensten` en de homepage lezen nog uit `app/(frontend)/lib/services.ts`.
- `/aanvraag-volgen` is nog statisch (niet gekoppeld aan echte afspraken).
- Er wordt nog geen bevestigingsmail verstuurd na een boeking.
- Contactgegevens, prijzen en doorlooptijden zijn voorbeeldinhoud.

Voor productie: draai achter een reverse proxy met HTTPS (Caddy/nginx) en maak
periodiek een backup van `consulaat.db`. De rate limiter houdt tellingen in het
geheugen bij en gaat uit van één serverproces.

Zie [`AGENTS.md`](AGENTS.md) voor ontwikkelafspraken.
