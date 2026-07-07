import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact & openingstijden",
  description:
    "Contactgegevens, openingstijden en route van het consulaat van Suriname in Den Haag.",
};

const openingHours = [
  { day: "Maandag", hours: "09:00 – 15:00" },
  { day: "Dinsdag", hours: "09:00 – 15:00" },
  { day: "Woensdag", hours: "09:00 – 15:00" },
  { day: "Donderdag", hours: "09:00 – 15:00" },
  { day: "Vrijdag", hours: "09:00 – 12:00" },
  { day: "Zaterdag", hours: "Gesloten" },
  { day: "Zondag", hours: "Gesloten" },
];

export default function ContactPage() {
  return (
    <div>
      <section className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Kruimelpad">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Contact</span>
          </nav>
          <h1 className={styles.title}>Contact &amp; openingstijden</h1>
          <p className={styles.intro}>
            Heeft u een vraag of wilt u langskomen? Hieronder vindt u onze
            contactgegevens, openingstijden en een formulier om ons te bereiken.
          </p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <div className={styles.left}>
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">
                📍
              </span>
              <h3>Adres</h3>
              <p>
                Surinamestraat 1<br />
                2585 GJ Den Haag
              </p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">
                ✉️
              </span>
              <h3>E-mail</h3>
              <p>
                <a href="mailto:info@consulaatsuriname.nl">
                  info@consulaatsuriname.nl
                </a>
              </p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">
                ☎️
              </span>
              <h3>Telefoon</h3>
              <p>
                <a href="tel:+3170000000">+31 70 000 00 00</a>
              </p>
            </div>
          </div>

          <div className={styles.hoursCard}>
            <h2 className={styles.blockTitle}>Openingstijden</h2>
            <table className={styles.hoursTable}>
              <tbody>
                {openingHours.map((row) => (
                  <tr key={row.day}>
                    <th scope="row">{row.day}</th>
                    <td
                      className={
                        row.hours === "Gesloten" ? styles.closed : undefined
                      }
                    >
                      {row.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.mapPlaceholder} aria-hidden="true">
            <span>🗺️ Kaart (in de demo nog niet ingeladen)</span>
          </div>
        </div>

        <aside className={styles.right}>
          <div className={styles.formCard}>
            <h2 className={styles.blockTitle}>Stuur ons een bericht</h2>
            <ContactForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
