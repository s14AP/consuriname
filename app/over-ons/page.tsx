import type { Metadata } from "next";
import Link from "next/link";
import styles from "./over-ons.module.css";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Over het consulaat van Suriname: onze missie, taken en dienstverlening voor de Surinaamse gemeenschap in Nederland.",
};

const tasks = [
  {
    icon: "🛂",
    title: "Reisdocumenten",
    text: "Aanvraag en verlenging van paspoorten, visa en toeristenkaarten.",
  },
  {
    icon: "📋",
    title: "Burgerzaken",
    text: "Ondersteuning bij uittreksels, akten en officiële verklaringen.",
  },
  {
    icon: "📑",
    title: "Legalisatie",
    text: "Bekrachtiging van documenten voor rechtsgeldig gebruik in Suriname.",
  },
  {
    icon: "🤝",
    title: "Bijstand",
    text: "Hulp en advies aan Surinaamse burgers in nood in het buitenland.",
  },
];

export default function OverOnsPage() {
  return (
    <div>
      <section className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Kruimelpad">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Over ons</span>
          </nav>
          <h1 className={styles.title}>Over het consulaat</h1>
          <p className={styles.intro}>
            Het consulaat van Suriname vertegenwoordigt de Republiek Suriname in
            Nederland. Wij staan ten dienste van de Surinaamse
            gemeenschap en van iedereen die een band heeft met Suriname.
          </p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <section className={styles.missionBlock}>
          <h2 className={styles.blockTitle}>Onze missie</h2>
          <p className={styles.paragraph}>
            Wij bieden toegankelijke en betrouwbare consulaire diensten en
            versterken de band tussen Suriname en zijn burgers in het buitenland.
            Of u nu een paspoort nodig heeft, een document wilt laten legaliseren of
            een reis naar Suriname plant: wij helpen u graag verder met heldere
            informatie en persoonlijke begeleiding.
          </p>
          <p className={styles.paragraph}>
            Daarnaast bevorderen wij de culturele, economische en sociale banden
            tussen Suriname en de Lage Landen, en ondersteunen wij Surinaamse
            burgers die zich in een noodsituatie bevinden.
          </p>
        </section>

        <section className={styles.tasksBlock}>
          <h2 className={styles.blockTitle}>Wat wij doen</h2>
          <div className={styles.taskGrid}>
            {tasks.map((task) => (
              <div key={task.title} className={styles.taskCard}>
                <span className={styles.taskIcon} aria-hidden="true">
                  {task.icon}
                </span>
                <h3>{task.title}</h3>
                <p>{task.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.factsBlock}>
          <div className={styles.fact}>
            <span className={styles.factNumber}>6+</span>
            <span className={styles.factLabel}>consulaire diensten</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factNumber}>± 350.000</span>
            <span className={styles.factLabel}>Surinamers in Nederland</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factNumber}>5</span>
            <span className={styles.factLabel}>dagen per week open</span>
          </div>
        </section>

        <section className={styles.ctaBlock}>
          <div>
            <h2>Klaar om iets te regelen?</h2>
            <p>Bekijk onze diensten of plan direct een afspraak.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/diensten" className={styles.btnPrimary}>
              Bekijk diensten
            </Link>
            <Link href="/contact" className={styles.btnSecondary}>
              Contact
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
