import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { kalenderdag } from "@/lib/kalenderdag";

// Beschikbaarheid verandert bij elke boeking: nooit cachen.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const datum = new URL(request.url).searchParams.get("datum");

  if (!datum || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    return NextResponse.json(
      { error: "Geef een datum mee als ?datum=JJJJ-MM-DD" },
      { status: 400 }
    );
  }

  const payload = await getPayload({ config });
  const beschikbaarheid = await payload.findGlobal({ slug: "beschikbaarheid" });

  // Dagen in het verleden (en vandaag) zijn nooit boekbaar
  if (datum <= kalenderdag(new Date())) {
    return NextResponse.json({ open: false, sloten: [] });
  }

  // Feestdag of sluitingsdag? (kalenderdag() omdat het admin-paneel de
  // gekozen dag als lokaal tijdstip opslaat — zie de normaliseerDatum-hook)
  const geblokkeerd = (beschikbaarheid.geblokkeerdeDatums ?? []).some(
    (blokkade) => blokkade.datum && kalenderdag(blokkade.datum) === datum
  );
  if (geblokkeerd) {
    return NextResponse.json({ open: false, sloten: [] });
  }

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
  ][new Date(`${datum}T00:00:00Z`).getUTCDay()];

  if (!weekdag?.open || !weekdag.tijdsloten?.length) {
    return NextResponse.json({ open: false, sloten: [] });
  }

  // Al geboekte sloten van die dag ophalen (alleen het tijdslot-veld komt
  // deze functie uit — namen en e-mails blijven binnen)
  const geboekt = await payload.find({
    collection: "afspraken",
    where: {
      and: [
        { datum: { like: datum } }, // zie sqlite-datum-kwestie in Afspraken.ts
        { status: { not_equals: "geannuleerd" } },
      ],
    },
    limit: 100,
    overrideAccess: true,
  });
  const bezet = new Set(geboekt.docs.map((afspraak) => afspraak.tijdslot));

  const sloten = (weekdag.tijdsloten ?? [])
    .map((slot) => slot.tijd)
    .filter((tijd) => !bezet.has(tijd))
    .sort();

  return NextResponse.json({ open: true, sloten });
}
