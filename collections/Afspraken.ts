import type {
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
} from "payload";
import { ValidationError } from "payload";

// Afspraken zijn dag-gebonden; alle datums worden bekeken door de bril van
// de tijdzone van het consulaat, ongeacht waar de server of bezoeker staat.
const KALENDER_TIJDZONE = "Europe/Amsterdam";

// Kalenderdag (YYYY-MM-DD) van een tijdstip, in de consulaat-tijdzone.
// ("sv-SE" is een trucje: de Zweedse notatie is exact YYYY-MM-DD.)
const kalenderdag = (waarde: string | Date): string =>
  new Date(waarde).toLocaleDateString("sv-SE", { timeZone: KALENDER_TIJDZONE });

// Normaliseert de datum vóór validatie/opslag naar UTC-middernacht van de
// bedoelde kalenderdag. Zo staan wizard-boekingen ("2026-07-20") en
// admin-boekingen (lokale tijdstempels) identiek in de database en kan de
// dubbele-boeking-check betrouwbaar op dag-niveau vergelijken.
const normaliseerDatum: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.datum) {
    data.datum = `${kalenderdag(data.datum)}T00:00:00.000Z`;
  }
  return data;
};

// Blokkeert een boeking als hetzelfde tijdslot op dezelfde dag al bezet is.
// Draait server-side bij ELKE create/update: formulier, API én admin-paneel.
const voorkomDubbeleBoeking: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const datum = data.datum ?? originalDoc?.datum;
  const tijdslot = data.tijdslot ?? originalDoc?.tijdslot;
  if (!datum || !tijdslot) return data; // required-validatie vangt dit al af

  const dag = kalenderdag(datum);

  // Bij een update waarbij dag én tijdslot ongewijzigd zijn (bijv. alleen
  // de status wordt omgezet) hoeft er niets gecheckt te worden.
  if (
    operation === "update" &&
    originalDoc?.datum &&
    kalenderdag(originalDoc.datum) === dag &&
    originalDoc.tijdslot === tijdslot
  ) {
    return data;
  }

  // "like" doet een tekst-match op de opgeslagen ISO-string en is de enige
  // dag-vergelijking die betrouwbaar werkt met de SQLite-adapter
  // (equals/gte verschuiven datums door een tijdzone-conversie in de adapter).
  const bestaande = await req.payload.find({
    collection: "afspraken",
    where: {
      and: [
        { datum: { like: dag } },
        { tijdslot: { equals: tijdslot } },
        { status: { not_equals: "geannuleerd" } }, // geannuleerd slot mag opnieuw
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
    limit: 1,
    overrideAccess: true, // servercode mag lezen, ook al mag de anonieme boeker dat niet
    req, // zelfde databasetransactie als de create zelf
  });

  if (bestaande.totalDocs > 0) {
    throw new ValidationError({
      errors: [
        {
          path: "tijdslot",
          message: "Dit tijdslot is al geboekt. Kies een ander moment.",
        },
      ],
    });
  }

  return data;
};

// Genereert een uniek referentienummer bij het aanmaken, bijv. SR-2026-48213.
const genereerReferentie: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== "create" || data.referentie) return data;

  let referentie = "";
  let bezet = true;
  while (bezet) {
    referentie = `SR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const bestaand = await req.payload.find({
      collection: "afspraken",
      where: { referentie: { equals: referentie } },
      limit: 1,
      overrideAccess: true,
      req,
    });
    bezet = bestaand.totalDocs > 0;
  }

  data.referentie = referentie;
  return data;
};

export const Afspraken: CollectionConfig = {
  slug: "afspraken",
  labels: { singular: "Afspraak", plural: "Afspraken" },
  admin: {
    useAsTitle: "referentie",
    defaultColumns: [
      "referentie",
      "naam",
      "dienst",
      "datum",
      "tijdslot",
      "status",
    ],
  },
  access: {
    create: () => true, // het publieke boekingsformulier
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.rol === "admin",
  },
  hooks: {
    beforeValidate: [normaliseerDatum],
    beforeChange: [voorkomDubbeleBoeking, genereerReferentie],
  },

  fields: [
    // AVG: dit is álles wat we van een burger opslaan
    { name: "naam", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "telefoon", type: "text" },
    {
      name: "dienst",
      type: "relationship",
      relationTo: "diensten",
      required: true,
    },
    {
      name: "datum",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" },
      },
    },
    {
      name: "tijdslot",
      type: "text",
      required: true,
      admin: { description: "Bijv. 09:30" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "aangevraagd",
      options: [
        { label: "Aangevraagd", value: "aangevraagd" },
        { label: "Bevestigd", value: "bevestigd" },
        { label: "Afgehandeld", value: "afgehandeld" },
        { label: "Geannuleerd", value: "geannuleerd" },
      ],
    },
    {
      name: "referentie",
      type: "text",
      unique: true,
      index: true,
      admin: { readOnly: true, description: "Wordt automatisch gegenereerd" },
    },
    {
      name: "notities",
      type: "textarea",
      access: {
        // field-level: bestaat simpelweg niet voor niet-admins
        read: ({ req: { user } }) => user?.rol === "admin",
        update: ({ req: { user } }) => user?.rol === "admin",
      },
    },
  ],
};
