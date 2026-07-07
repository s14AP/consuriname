import type { Metadata } from "next";
import Link from "next/link";
import { services, type Service } from "../lib/services";
import ServiceCard from "../components/ServiceCard";
import styles from "./diensten.module.css";

export const metadata: Metadata = {
  title: "Diensten",
  description:
    "Overzicht van alle consulaire diensten van Suriname: paspoort, visum, legalisatie, burgerzaken en zakelijke documenten.",
};

const categoryOrder: Service["category"][] = [
  "Reizen & documenten",
  "Burgerzaken",
  "Legalisatie",
  "Zakelijk",
];

export default function DienstenPage() {
  const grouped = categoryOrder
    .map((category) => ({
      category,
      items: services.filter((service) => service.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div>
      <section className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Kruimelpad">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Diensten</span>
          </nav>
          <h1 className={styles.title}>Onze diensten</h1>
          <p className={styles.intro}>
            Het consulaat van Suriname biedt onderstaande diensten aan voor
            burgers en bezoekers in Nederland. Kies een dienst voor de
            benodigde documenten, het stappenplan en het maken van een afspraak.
          </p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        {grouped.map((group) => (
          <section key={group.category} className={styles.group}>
            <h2 className={styles.groupTitle}>{group.category}</h2>
            <div className={styles.grid}>
              {group.items.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
