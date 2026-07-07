import type { Field, GlobalConfig } from "payload";

const dag = (name: string, label: string): Field => ({
  name,
  label,
  type: "group",
  fields: [
    { name: "open", type: "checkbox", defaultValue: false },
    {
      name: "tijdsloten",
      type: "array",
      labels: { singular: "Tijdslot", plural: "Tijdsloten" },
      admin: { condition: (_data, siblingData) => Boolean(siblingData?.open) },
      fields: [
        {
          name: "tijd",
          type: "text",
          required: true,
          admin: { description: "24-uurs, bijv. 09:30" },
        },
      ],
    },
  ],
});

export const Beschikbaarheid: GlobalConfig = {
  slug: "beschikbaarheid",
  label: "Beschikbaarheid",
  access: {
    read: () => true, // de wizard moet openingstijden kunnen opvragen
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "openingsdagen",
      type: "group",
      fields: [
        dag("maandag", "Maandag"),
        dag("dinsdag", "Dinsdag"),
        dag("woensdag", "Woensdag"),
        dag("donderdag", "Donderdag"),
        dag("vrijdag", "Vrijdag"),
        dag("zaterdag", "Zaterdag"),
      ],
    },
    {
      name: "geblokkeerdeDatums",
      type: "array",
      labels: { singular: "Geblokkeerde datum", plural: "Geblokkeerde datums" },
      fields: [
        {
          name: "datum",
          type: "date",
          required: true,
          admin: { date: { pickerAppearance: "dayOnly" } },
        },
        {
          name: "omschrijving",
          type: "text",
          admin: { description: "Bijv. 'Onafhankelijkheidsdag'" },
        },
      ],
    },
  ],
};
