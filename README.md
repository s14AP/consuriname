# Consulaat van Suriname — demo-website

Klikbare demo voor een nieuwe website van het Surinaams consulaat in Nederland.
Doel van deze fase: de flow en het ontwerp tastbaar tonen aan de klant. Er is
**geen backend** — alle data is hardcoded en formulieren/afspraken zijn gefaket.

## Tech

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **CSS Modules** voor styling (`*.module.css`); huisstijl-variabelen staan in
  [`app/globals.css`](app/globals.css). Geen Tailwind.

## Aan de slag

```bash
npm install
npm run dev      # start de dev-server op http://localhost:3000
npm run build    # productie-build
npm run lint     # eslint
```

## Structuur

| Pad | Inhoud |
| --- | --- |
| `app/page.tsx` | Home |
| `app/diensten/` | Dienstenoverzicht + detailpagina's (`[slug]`) |
| `app/afspraak/` | Afspraak-wizard (stap voor stap) |
| `app/aanvraag-volgen/` | Status van een aanvraag volgen (gefaket) |
| `app/faq/`, `app/nieuws/`, `app/over-ons/`, `app/contact/` | Overige pagina's |
| `app/components/` | Gedeelde UI (header, footer, topbar, dienstkaart) |
| `app/lib/services.ts` | Hardcoded dienstendata |

## Belangrijk

Dit is een demo, geen officiële site. Contactgegevens, prijzen en doorlooptijden
zijn voorbeeldinhoud. Zie [`AGENTS.md`](AGENTS.md) voor ontwikkelafspraken.
