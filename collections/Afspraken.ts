import type {
  CollectionBeforeChangeHook,
  CollectionBeforeOperationHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  FieldAccess,
} from "payload";
import { APIError, ValidationError } from "payload";

import { vrijeSloten } from "../lib/beschikbaarheid";
import { kalenderdag } from "../lib/kalenderdag";
import { binnenLimiet, clientIp } from "../lib/rateLimit";

// Velden die alleen personeel mag invullen. Voor een anonieme boeker
// bestaan ze niet: Payload gooit meegestuurde waarden weg (status valt
// dan terug op de standaardwaarde "aangevraagd").
const alleenPersoneel: FieldAccess = ({ req: { user } }) => Boolean(user);

const MAX_BOEKINGEN_PER_IP = 5;
const LIMIET_VENSTER_MS = 60 * 60 * 1000; // 1 uur

// Spam-rem: een anonieme bezoeker kan niet alle sloten volboeken.
const beperkAnoniemeBoekingen: CollectionBeforeOperationHook = ({
  operation,
  req,
}) => {
  if (operation !== "create" || req.user) return;

  const ip = clientIp(req.headers);
  if (!binnenLimiet(`afspraak:${ip}`, MAX_BOEKINGEN_PER_IP, LIMIET_VENSTER_MS)) {
    throw new APIError(
      "U heeft te veel afspraken in korte tijd gemaakt. Probeer het later opnieuw of neem contact op met het consulaat.",
      429,
      undefined,
      true
    );
  }
};

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

// Anonieme boekers mogen alleen een moment kiezen dat de wizard ook zou
// tonen (geen zondag, feestdag, verleden of verzonnen tijdslot) en alleen
// een zichtbare dienst. Personeel mag via het admin-paneel uitzonderingen maken.
const controleerAnoniemeBoeking: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== "create" || req.user) return data;

  const dienstId =
    typeof data.dienst === "object" && data.dienst !== null
      ? data.dienst.id
      : data.dienst;
  const dienst = dienstId
    ? await req.payload.find({
        collection: "diensten",
        where: {
          and: [{ id: { equals: dienstId } }, { zichtbaar: { equals: true } }],
        },
        limit: 1,
        overrideAccess: true,
        req,
      })
    : null;
  if (!dienst?.totalDocs) {
    throw new ValidationError({
      errors: [{ path: "dienst", message: "Deze dienst kan niet online geboekt worden." }],
    });
  }

  const { sloten } = await vrijeSloten(req.payload, kalenderdag(data.datum), req);
  if (!sloten.includes(data.tijdslot)) {
    throw new ValidationError({
      errors: [
        {
          path: "tijdslot",
          message: "Dit moment is niet (meer) beschikbaar. Kies een ander moment.",
        },
      ],
    });
  }

  return data;
};

// Unieke sleutel per bezet slot ("2026-07-20_09:30"). De database weigert
// een tweede record met dezelfde sleutel, zodat twee gelijktijdige
// boekingen niet allebei door voorkomDubbeleBoeking kunnen glippen.
// Geannuleerde afspraken krijgen null: dat slot mag opnieuw geboekt worden.
const zetSlotSleutel: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const datum = data.datum ?? originalDoc?.datum;
  const tijdslot = data.tijdslot ?? originalDoc?.tijdslot;
  const status = data.status ?? originalDoc?.status;

  data.slotSleutel =
    datum && tijdslot && status !== "geannuleerd"
      ? `${kalenderdag(datum)}_${tijdslot}`
      : null;
  return data;
};

// Genereert een uniek referentienummer bij het aanmaken, bijv. SR-2026-48213.
// Alleen personeel mag zelf een referentie opgeven.
const genereerReferentie: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== "create" || (req.user && data.referentie)) return data;

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
    beforeOperation: [beperkAnoniemeBoekingen],
    beforeValidate: [normaliseerDatum],
    beforeChange: [
      voorkomDubbeleBoeking,
      controleerAnoniemeBoeking,
      zetSlotSleutel,
      genereerReferentie,
    ],
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
      access: { create: alleenPersoneel },
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
      access: { create: alleenPersoneel },
      admin: { readOnly: true, description: "Wordt automatisch gegenereerd" },
    },
    {
      name: "notities",
      type: "textarea",
      access: {
        // field-level: bestaat simpelweg niet voor niet-admins
        create: ({ req: { user } }) => user?.rol === "admin",
        read: ({ req: { user } }) => user?.rol === "admin",
        update: ({ req: { user } }) => user?.rol === "admin",
      },
    },
    {
      // Technisch veld voor de unieke-slot-controle (zie zetSlotSleutel)
      name: "slotSleutel",
      type: "text",
      unique: true,
      admin: { hidden: true },
    },
  ],
};
