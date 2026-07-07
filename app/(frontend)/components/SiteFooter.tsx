import Link from "next/link";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="flagBar" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <div className={styles.brandRow}>
            <span className={styles.crest} aria-hidden="true">
              ★
            </span>
            <span className={styles.brandTitle}>Consulaat van Suriname</span>
          </div>
          <p className={styles.note}>
            Officiële consulaire diensten voor Surinaamse burgers en bezoekers
            in Nederland.
          </p>
        </div>

        <div className={styles.col}>
          <h3 className={styles.heading}>Diensten</h3>
          <ul className={styles.list}>
            <li>
              <Link href="/diensten/paspoort-aanvragen">
                Paspoort aanvragen
              </Link>
            </li>
            <li>
              <Link href="/diensten/visum-aanvragen">Visum aanvragen</Link>
            </li>
            <li>
              <Link href="/diensten/legalisatie-documenten">Legalisatie</Link>
            </li>
            <li>
              <Link href="/diensten">Alle diensten</Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.heading}>Contact</h3>
          <ul className={styles.list}>
            <li>Surinamestraat 1, 2585 GJ Den Haag</li>
            <li>
              <a href="tel:+3170000000">+31 70 000 00 00</a>
            </li>
            <li>
              <a href="mailto:info@consulaatsuriname.nl">
                info@consulaatsuriname.nl
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.heading}>Openingstijden</h3>
          <ul className={styles.list}>
            <li>Ma – Do: 09:00 – 15:00</li>
            <li>Vrijdag: 09:00 – 12:00</li>
            <li>Weekend: gesloten</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <span>© {year} Consulaat van Suriname demo-website</span>
          <span className={styles.demoTag}>Demo · geen officiële site</span>
        </div>
      </div>
    </footer>
  );
}
