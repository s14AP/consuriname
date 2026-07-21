/*
  Seed-script: vult de database met de diensten uit de oude statische lijst,
  standaard openingstijden en (indien nog leeg) een admin-gebruiker.

  Draaien met:  npm run seed
  Idempotent: bestaande diensten (op slug) worden bijgewerkt, niet gedupliceerd.
*/
import { getPayload } from "payload";
import config from "../payload.config";
import type { Diensten } from "../payload-types";
import { services } from "../app/(frontend)/lib/services";

// Wikkelt platte tekst in een minimale Lexical-richtext-structuur, zodat het
// beschrijving-veld gevuld kan worden zonder de editor-UI. De cast naar het
// gegenereerde veldtype voorkomt dat de literals (format: "" e.d.) als brede
// string worden gezien.
function richText(tekst: string): Diensten["beschrijving"] {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr" as const,
          textFormat: 0,
          children: [
            {
              type: "text",
              format: 0,
              style: "",
              mode: "normal",
              detail: 0,
              text: tekst,
              version: 1,
            },
          ],
        },
      ],
    },
  } as Diensten["beschrijving"];
}

// Standaard openingstijden (de oude hardcoded TIME_SLOTS uit de wizard)
const STANDAARD_SLOTEN = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "13:30",
  "14:00",
  "14:30",
].map((tijd) => ({ tijd }));

const payload = await getPayload({ config });

// 1. Diensten
for (const s of services) {
  const bestaand = await payload.find({
    collection: "diensten",
    where: { slug: { equals: s.slug } },
    limit: 1,
  });

  const data = {
    naam: s.title,
    slug: s.slug,
    beschrijving: richText(s.intro),
    benodigdeDocumenten: s.requiredDocuments.map((document) => ({ document })),
    doorlooptijd: s.processingTime,
    zichtbaar: true,
  };

  if (bestaand.docs[0]) {
    await payload.update({
      collection: "diensten",
      id: bestaand.docs[0].id,
      data,
    });
    console.log(`↻ bijgewerkt: ${s.title}`);
  } else {
    await payload.create({ collection: "diensten", data });
    console.log(`+ aangemaakt: ${s.title}`);
  }
}

// 2. Beschikbaarheid: maandag t/m vrijdag open met de standaard sloten
const dagOpen = { open: true, tijdsloten: STANDAARD_SLOTEN };
await payload.updateGlobal({
  slug: "beschikbaarheid",
  data: {
    openingsdagen: {
      maandag: dagOpen,
      dinsdag: dagOpen,
      woensdag: dagOpen,
      donderdag: dagOpen,
      vrijdag: dagOpen,
      zaterdag: { open: false, tijdsloten: [] },
    },
  },
});
console.log("↻ openingstijden ingesteld (ma–vr, 09:00–14:30)");

// 3. Admin-gebruiker alleen aanmaken als er nog geen gebruikers zijn
const gebruikers = await payload.find({ collection: "gebruikers", limit: 1 });
if (gebruikers.totalDocs === 0) {
  await payload.create({
    collection: "gebruikers",
    data: {
      email: "admin@consulaat.nl",
      password: "WijzigDitWachtwoord!",
      naam: "Beheerder",
      rol: "admin",
    },
  });
  console.log("+ admin-gebruiker aangemaakt: admin@consulaat.nl (wachtwoord wijzigen!)");
} else {
  console.log("• gebruiker(s) bestaan al — geen admin aangemaakt");
}

console.log("Seed voltooid.");
process.exit(0);
