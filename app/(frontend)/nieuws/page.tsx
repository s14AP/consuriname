import type { Metadata } from "next";
import Link from "next/link";
import styles from "./nieuws.module.css";

export const metadata: Metadata = {
  title: "Nieuws & aankondigingen",
  description:
    "Actuele aankondigingen en mededelingen van het consulaat van Suriname.",
};

type NewsItem = {
  date: string;
  displayDate: string;
  category: string;
  title: string;
  excerpt: string;
  featured?: boolean;
};

const news: NewsItem[] = [
  {
    date: "2026-06-10",
    displayDate: "10 juni 2026",
    category: "Mededeling",
    title: "Aangepaste openingstijden tijdens de zomerperiode",
    excerpt:
      "Van 14 juli tot en met 15 augustus hanteert het consulaat aangepaste openingstijden. Maak tijdig een afspraak om wachttijden te voorkomen.",
    featured: true,
  },
  {
    date: "2026-05-28",
    displayDate: "28 mei 2026",
    category: "Diensten",
    title: "Nieuw: afspraken voor paspoorten nu volledig online te plannen",
    excerpt:
      "U kunt voortaan eenvoudig online een afspraak inplannen voor uw paspoortaanvraag. Zo bent u sneller geholpen aan de balie.",
  },
  {
    date: "2026-05-05",
    displayDate: "5 mei 2026",
    category: "Evenement",
    title: "Consulaat aanwezig op Surinaamse cultuurdag in Amsterdam",
    excerpt:
      "Bezoek onze stand tijdens de jaarlijkse cultuurdag voor informatie over consulaire diensten en de banden tussen Suriname en Nederland.",
  },
  {
    date: "2026-04-12",
    displayDate: "12 april 2026",
    category: "Mededeling",
    title: "Legalisatie van documenten: actuele verwerkingstijden",
    excerpt:
      "Door drukte kan de verwerking van legalisaties momenteel iets langer duren. Houd rekening met enkele extra werkdagen.",
  },
];

export default function NieuwsPage() {
  const [featured, ...rest] = news;

  return (
    <div>
      <section className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Kruimelpad">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Nieuws</span>
          </nav>
          <h1 className={styles.title}>Nieuws &amp; aankondigingen</h1>
          <p className={styles.intro}>
            Blijf op de hoogte van mededelingen, gewijzigde openingstijden en
            evenementen van het consulaat.
          </p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <article className={styles.featured}>
          <span className={styles.featuredBadge}>Uitgelicht</span>
          <div className={styles.metaRow}>
            <span className={styles.category}>{featured.category}</span>
            <time dateTime={featured.date}>{featured.displayDate}</time>
          </div>
          <h2 className={styles.featuredTitle}>{featured.title}</h2>
          <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
          <span className={styles.readMore}>Lees meer →</span>
        </article>

        <div className={styles.grid}>
          {rest.map((item) => (
            <article key={item.title} className={styles.card}>
              <div className={styles.metaRow}>
                <span className={styles.category}>{item.category}</span>
                <time dateTime={item.date}>{item.displayDate}</time>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardExcerpt}>{item.excerpt}</p>
              <span className={styles.readMore}>Lees meer →</span>
            </article>
          ))}
        </div>

        <p className={styles.demoNote}>
          Dit is voorbeeldinhoud voor de demo. Nieuwsberichten worden later
          beheerd via een contentsysteem.
        </p>
      </div>
    </div>
  );
}
