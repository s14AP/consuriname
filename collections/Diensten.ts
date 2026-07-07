import type { CollectionConfig } from "payload";

export const Diensten: CollectionConfig = {
  slug: "diensten",
  labels: { singular: "Dienst", plural: "Diensten" },
  admin: {
    useAsTitle: "naam",
    defaultColumns: ["naam", "slug", "doorlooptijd", "zichtbaar"],
  },
  access: {
    // Publiek leesbaar, maar anoniem alléén zichtbare diensten.
    // Een query-constraint teruggeven = Payload filtert dit automatisch
    // mee in elke query (een WHERE-clausule die altijd meegaat).
    read: ({ req: { user } }) => (user ? true : { zichtbaar: { equals: true } }),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.rol === "admin",
  },
  fields: [
    { name: "naam", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL-naam, bijv. paspoort-aanvragen" },
    },
    { name: "beschrijving", type: "richText" },
    {
      name: "benodigdeDocumenten",
      type: "array",
      labels: { singular: "Document", plural: "Documenten" },
      fields: [{ name: "document", type: "text", required: true }],
    },
    {
      name: "doorlooptijd",
      type: "text",
      admin: { description: "Bijv. '4 tot 6 weken'" },
    },
    { name: "zichtbaar", type: "checkbox", defaultValue: true },
  ],
};
