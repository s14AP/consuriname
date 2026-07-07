import path from "path";
import { fileURLToPath } from "url";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

import { Afspraken } from "./collections/Afspraken";
import { Diensten } from "./collections/Diensten";
import { Gebruikers } from "./collections/Gebruikers";
import { Beschikbaarheid } from "./globals/Beschikbaarheid";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "gebruikers", // welke collection de inlog-accounts bevat
  },
  collections: [Gebruikers, Diensten, Afspraken],
  globals: [Beschikbaarheid],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./consulaat.db",
    },
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
