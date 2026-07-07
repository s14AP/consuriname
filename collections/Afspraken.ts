import type { CollectionConfig } from "payload";

export const Afspraken: CollectionConfig = {
  slug: "afspraken",
  labels: { singular: "Afspraak", plural: "Afspraken" },
  admin: {
    useAsTitle: "referentie",
    defaultColumns: ["referentie", "naam", "dienst", "datum", "tijdslot", "status"],
  },
  access: {
    create: () => true, // het publieke boekingsformulier
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.rol === "admin",
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
      admin: { date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" } },
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
