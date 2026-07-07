import type { Metadata } from "next";
import Link from "next/link";
import VolgForm from "./VolgForm";
import styles from "./volgen.module.css";

export const metadata: Metadata = {
  title: "Aanvraag volgen",
  description:
    "Volg de status van uw afspraak of aanvraag bij het consulaat van Suriname met uw referentienummer.",
};

export default function AanvraagVolgenPage() {
  return (
    <div>
      <section className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Kruimelpad">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Aanvraag volgen</span>
          </nav>
          <h1 className={styles.title}>Aanvraag volgen</h1>
          <p className={styles.intro}>
            Voer uw referentienummer in om de status van uw afspraak of aanvraag te
            bekijken.
          </p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <VolgForm />
      </div>
    </div>
  );
}
