"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./SiteHeader.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/diensten", label: "Diensten" },
  { href: "/nieuws", label: "Nieuws" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className={styles.header}>
      <div className="flagBar" />
      <div className={`container ${styles.bar}`}>
        <Link
          href="/"
          className={styles.brand}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.crest} aria-hidden="true">
            <span className={styles.crestStar}>★</span>
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Consulaat van Suriname</span>
            <span className={styles.brandSub}>Nederland</span>
          </span>
        </Link>

        <nav className={styles.navDesktop} aria-label="Hoofdnavigatie">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                isActive(item.href) ? styles.navLinkActive : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/afspraak" className={styles.cta}>
            Afspraak maken
          </Link>
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobiel-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="srOnly">Menu</span>
          <span
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobiel-menu"
          className={styles.navMobile}
          aria-label="Mobiele navigatie"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navMobileLink} ${
                isActive(item.href) ? styles.navMobileLinkActive : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/afspraak"
            className={styles.ctaMobile}
            onClick={() => setMenuOpen(false)}
          >
            Afspraak maken
          </Link>
        </nav>
      )}
    </header>
  );
}
