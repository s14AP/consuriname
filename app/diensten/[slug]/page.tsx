import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServiceSlugs } from "../../lib/services";
import styles from "./detail.module.css";

// Genereer statische pagina's voor elke dienst (snel + geen backend nodig).
export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Dienst niet gevonden" };
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <div>
      {/* Koptekst */}
      <section className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Kruimelpad">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/diensten">Diensten</Link>
            <span aria-hidden="true">/</span>
            <span>{service.title}</span>
          </nav>

          <div className={styles.headerMain}>
            <span className={styles.icon} aria-hidden="true">
              {service.icon}
            </span>
            <div>
              <span className={styles.category}>{service.category}</span>
              <h1 className={styles.title}>{service.title}</h1>
              <p className={styles.summary}>{service.summary}</p>
            </div>
          </div>

          <dl className={styles.factGrid}>
            <div className={styles.fact}>
              <dt>Doorlooptijd</dt>
              <dd>{service.processingTime}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Kosten</dt>
              <dd>{service.cost}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Afspraak</dt>
              <dd>{service.appointmentRequired ? "Verplicht" : "Niet verplicht"}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Inhoud in twee kolommen */}
      <div className={`container ${styles.body}`}>
        <div className={styles.content}>
          <p className={styles.intro}>{service.intro}</p>

          {/* Stappenplan */}
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Hoe verloopt de aanvraag?</h2>
            <ol className={styles.steps}>
              {service.steps.map((step, index) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepNum} aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepText}>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Benodigde documenten */}
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Wat heeft u nodig?</h2>
            <ul className={styles.docs}>
              {service.requiredDocuments.map((doc) => (
                <li key={doc} className={styles.doc}>
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          {service.faq.length > 0 && (
            <section className={styles.block}>
              <h2 className={styles.blockTitle}>Veelgestelde vragen</h2>
              <div className={styles.faqList}>
                {service.faq.map((item) => (
                  <details key={item.question} className={styles.faqItem}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Afspraak-ingang in zijbalk */}
        <aside className={styles.sidebar}>
          <div className={styles.ctaCard} id="afspraak">
            <h2 className={styles.ctaTitle}>
              {service.appointmentRequired
                ? "Afspraak maken"
                : "Aanvraag starten"}
            </h2>
            <p className={styles.ctaText}>
              {service.appointmentRequired
                ? "Voor deze dienst plant u een persoonlijke afspraak op het consulaat in Den Haag."
                : "Start uw aanvraag online; wij nemen contact met u op over de volgende stap."}
            </p>
            <ul className={styles.ctaFacts}>
              <li>
                <span>Doorlooptijd</span>
                <strong>{service.processingTime}</strong>
              </li>
              <li>
                <span>Kosten</span>
                <strong>{service.cost}</strong>
              </li>
            </ul>
            <Link
              href={`/afspraak?dienst=${service.slug}`}
              className={styles.ctaBtn}
            >
              {service.appointmentRequired
                ? "Afspraak maken"
                : "Aanvraag starten"}
            </Link>
          </div>

          <div className={styles.helpCard}>
            <h3>Hulp nodig?</h3>
            <p>
              Twijfelt u over de juiste dienst of documenten? Neem gerust contact
              met ons op.
            </p>
            <Link href="/contact" className={styles.helpLink}>
              Naar contactpagina →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
