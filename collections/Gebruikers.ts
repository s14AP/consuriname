import type { CollectionConfig } from "payload";

export const Gebruikers: CollectionConfig = {
  slug: "gebruikers",
  labels: { singular: "Gebruiker", plural: "Gebruikers" },
  auth: true, // login, sessies, wachtwoord-hashing: allemaal hierdoor
  admin: { useAsTitle: "email" },
  access: {
    // Admins zien iedereen; medewerkers alleen zichzelf (query-constraint)
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.rol === "admin") return true;
      return { id: { equals: user.id } };
    },
    create: ({ req: { user } }) => user?.rol === "admin",
    update: ({ req: { user }, id }) =>
      user?.rol === "admin" || (user ? user.id === id : false),
    delete: ({ req: { user } }) => user?.rol === "admin",
  },
  fields: [
    { name: "naam", type: "text" },
    {
      name: "rol",
      type: "select",
      required: true,
      defaultValue: "medewerker",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Medewerker", value: "medewerker" },
      ],
      access: {
        // alleen admins mogen rollen uitdelen
        update: ({ req: { user } }) => user?.rol === "admin",
      },
    },
  ],
};
