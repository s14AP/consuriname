import Link from "next/link";
import type { Service } from "../lib/services";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/diensten/${service.slug}`}
      className={styles.card}
      aria-label={`${service.title} — meer informatie`}
    >
      <span className={styles.icon} aria-hidden="true">
        {service.icon}
      </span>
      <span className={styles.category}>{service.category}</span>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.summary}>{service.summary}</p>
      <span className={styles.meta}>
        <span className={styles.metaItem}>⏱ {service.processingTime}</span>
        {service.appointmentRequired && (
          <span className={styles.badge}>Afspraak nodig</span>
        )}
      </span>
      <span className={styles.link}>
        Meer informatie
        <span aria-hidden="true" className={styles.arrow}>
          →
        </span>
      </span>
    </Link>
  );
}
