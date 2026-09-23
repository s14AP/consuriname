import type { Payload, PayloadRequest } from "payload";

import { kalenderdag } from "./kalenderdag";

export type Beschikbaarheid = { open: boolean; sloten: string[] };

const DICHT: Beschikbaarheid = { open: false, sloten: [] };

// Vrije tijdsloten op een kalenderdag (JJJJ-MM-DD). Gedeeld door de
// beschikbaarheid-route (wat de wizard toont) en de Afspraken-hook (wat de
// server accepteert), zodat die twee nooit uit elkaar kunnen lopen.
export async function vrijeSloten(
  payload: Payload,
  dag: string,
  req?: PayloadRequest
): Promise<Beschikbaarheid> {
  // Dagen in het verleden (en vandaag) zijn nooit boekbaar
  if (dag <= kalenderdag(new Date())) return DICHT;

  const beschikbaarheid = await payload.findGlobal({
    slug: "beschikbaarheid",
    overrideAccess: true,
    req,
  });

  // Feestdag of sluitingsdag? (kalenderdag() omdat het admin-paneel de
  // gekozen dag als lokaal tijdstip opslaat — zie de normaliseerDatum-hook)
  const geblokkeerd = (beschikbaarheid.geblokkeerdeDatums ?? []).some(
    (blokkade) => blokkade.datum && kalenderdag(blokkade.datum) === dag
  );
  if (geblokkeerd) return DICHT;

  // Welke weekdag is dit? (UTC-middernacht van een kale JJJJ-MM-DD is veilig)
  const dagen = beschikbaarheid.openingsdagen;
  const weekdag = [
    null, // zondag: consulaat altijd dicht
    dagen?.maandag,
    dagen?.dinsdag,
    dagen?.woensdag,
    dagen?.donderdag,
    dagen?.vrijdag,
    dagen?.zaterdag,
  ][new Date(`${dag}T00:00:00Z`).getUTCDay()];

  if (!weekdag?.open || !weekdag.tijdsloten?.length) return DICHT;

  // Al geboekte sloten van die dag ophalen (alleen het tijdslot-veld komt
  // deze functie uit — namen en e-mails blijven binnen)
  const geboekt = await payload.find({
    collection: "afspraken",
    where: {
      and: [
        { datum: { like: dag } }, // zie sqlite-datum-kwestie in Afspraken.ts
        { status: { not_equals: "geannuleerd" } },
      ],
    },
    limit: 100,
    overrideAccess: true,
    req,
  });
  const bezet = new Set(geboekt.docs.map((afspraak) => afspraak.tijdslot));

  const sloten = weekdag.tijdsloten
    .map((slot) => slot.tijd)
    .filter((tijd) => !bezet.has(tijd))
    .sort();

  return { open: true, sloten };
}
