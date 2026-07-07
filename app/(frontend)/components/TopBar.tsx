"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./TopBar.module.css";

const languages = ["NL", "EN"] as const;
type Lang = (typeof languages)[number];

export default function TopBar() {
  const [lang, setLang] = useState<Lang>("NL");

  return (
    <div className={styles.topbar}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.note}>
          Officiële consulaire informatie voor Surinamers in Nederland
        </p>

        <div className={styles.right}>
          <Link href="/aanvraag-volgen" className={styles.link}>
            Aanvraag volgen
          </Link>
          <span className={styles.divider} aria-hidden="true" />
          <a href="tel:+3170000000" className={styles.link}>
            +31 70 000 00 00
          </a>
          <span className={styles.divider} aria-hidden="true" />
          <div
            className={styles.langSwitch}
            role="group"
            aria-label="Taalkeuze"
          >
            {languages.map((code) => (
              <button
                key={code}
                type="button"
                className={`${styles.langBtn} ${
                  lang === code ? styles.langBtnActive : ""
                }`}
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
