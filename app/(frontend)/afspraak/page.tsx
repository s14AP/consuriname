import config from "@payload-config";
import type { Metadata } from "next";
import Link from "next/link";
import { getPayload } from "payload";
import { Suspense } from "react";
import AfspraakWizard, { type DienstOptie } from "./AfspraakWizard";
import styles from "./afspraak.module.css";

export const metadata: Metadata = {
  title: "Afspraak maken",
  description:
    "Maak in een paar stappen een afspraak op het consulaat van Suriname in Den Haag.",
};

// Diensten komen live uit het CMS; niet cachen.
export const dynamic = "force-dynamic";

export default async function AfspraakPage() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "diensten",
    where: { zichtbaar: { equals: true } },
    sort: "naam",
    limit: 100,
    depth: 0,
  });

  const diensten: DienstOptie[] = docs.map((dienst) => ({
    id: dienst.id,
    naam: dienst.naam,
    slug: dienst.slug,
    doorlooptijd: dienst.doorlooptijd ?? null,
  }));

  return (
    <div>
      <section className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Kruimelpad">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Afspraak maken</span>
          </nav>
          <h1 className={styles.title}>Afspraak maken</h1>
          <p className={styles.intro}>
            Plan in een paar stappen uw bezoek aan het consulaat. U ontvangt een
            referentienummer waarmee u uw aanvraag later kunt volgen.
          </p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <Suspense fallback={<p className={styles.loading}>Bezig met laden…</p>}>
          <AfspraakWizard diensten={diensten} />
        </Suspense>
      </div>
    </div>
  );
}
