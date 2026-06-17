import Link from "next/link";
import { services } from "./lib/services";
import ServiceCard from "./components/ServiceCard";
import styles from "./page.module.css";

const quickLinks = [
  { href: "/diensten/paspoort-aanvragen", label: "Paspoort", icon: "🛂" },
  { href: "/diensten/visum-aanvragen", label: "Visum", icon: "✈️" },
  { href: "/diensten/legalisatie-documenten", label: "Legalisatie", icon: "📑" },
  { href: "/diensten/geboorteakte-uittreksel", label: "Burgerzaken", icon: "📋" },
];

export default function Home() {
  const highlighted = services.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Officieel consulaat</span>
            <h1 className={styles.heroTitle}>
              Consulaire diensten van Suriname in Nederland
            </h1>
            <p className={styles.heroText}>
              Regel uw paspoort, visum of legalisatie van documenten. Vind snel de
              juiste dienst, de benodigde documenten en plan eenvoudig een afspraak.
            </p>
            <div className={styles.heroActions}>
              <Link href="/diensten" className={styles.btnPrimary}>
                Bekijk alle diensten
              </Link>
              <Link
                href="/diensten/paspoort-aanvragen"
                className={styles.btnSecondary}
              >
                Afspraak maken
              </Link>
            </div>
          </div>

          <aside className={styles.heroCard} aria-label="Snel contact">
            <div className={styles.heroCardHeader}>
              <span className={styles.heroCardStar} aria-hidden="true">
                ★
              </span>
              <span>Vandaag geopend</span>
            </div>
            <dl className={styles.heroCardList}>
              <div>
                <dt>Openingstijden</dt>
                <dd>Ma – Do 09:00 – 15:00</dd>
              </div>
              <div>
                <dt>Adres</dt>
                <dd>Surinamestraat 1, 2585 GJ Den Haag</dd>
              </div>
              <div>
                <dt>Telefoon</dt>
                <dd>
                  <a href="tel:+3170000000">+31 70 000 00 00</a>
                </dd>
              </div>
            </dl>
            <Link href="/contact" className={styles.heroCardLink}>
              Contact &amp; route →
            </Link>
          </aside>
        </div>
      </section>

      {/* Snelkoppelingen */}
      <section className={`container ${styles.section}`}>
        <div className={styles.quickGrid}>
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.quickLink}>
              <span className={styles.quickIcon} aria-hidden="true">
                {link.icon}
              </span>
              <span className={styles.quickLabel}>{link.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Diensten-highlights */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>Onze diensten</h2>
            <p className={styles.sectionSub}>
              De meest aangevraagde consulaire diensten in één overzicht.
            </p>
          </div>
          <Link href="/diensten" className={styles.sectionLink}>
            Alle diensten →
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {highlighted.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      {/* Doelgroep-info */}
      <section className={styles.infoBand}>
        <div className={`container ${styles.infoInner}`}>
          <div className={styles.infoItem}>
            <h3>Voor Surinaamse burgers</h3>
            <p>
              Woont u in Nederland? Regel uw reisdocumenten en
              burgerzaken zonder naar Suriname te reizen.
            </p>
          </div>
          <div className={styles.infoItem}>
            <h3>Voor bezoekers</h3>
            <p>
              Plant u een reis naar Suriname voor toerisme, familie of zaken? Vraag
              hier uw visum of toeristenkaart aan.
            </p>
          </div>
          <div className={styles.infoItem}>
            <h3>Voor ondernemers</h3>
            <p>
              Drijft u handel met Suriname? Wij verzorgen de legalisatie van uw
              handels- en exportdocumenten.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
