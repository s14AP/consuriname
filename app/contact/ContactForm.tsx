"use client";

import { useState, type FormEvent } from "react";
import styles from "./contact.module.css";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Demo: niets wordt verzonden of opgeslagen.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <h3>Bericht ontvangen</h3>
        <p>
          Bedankt voor uw bericht. Wij reageren doorgaans binnen twee werkdagen.
        </p>
        <p className={styles.demoHint}>
          Dit is een demo — er is niets daadwerkelijk verzonden.
        </p>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={() => setSubmitted(false)}
        >
          Nieuw bericht
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="c-naam">Naam</label>
        <input id="c-naam" name="naam" type="text" required autoComplete="name" />
      </div>
      <div className={styles.field}>
        <label htmlFor="c-email">E-mailadres</label>
        <input
          id="c-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="c-onderwerp">Onderwerp</label>
        <input id="c-onderwerp" name="onderwerp" type="text" />
      </div>
      <div className={styles.field}>
        <label htmlFor="c-bericht">Uw bericht</label>
        <textarea id="c-bericht" name="bericht" rows={5} required />
      </div>
      <button type="submit" className={styles.submitBtn}>
        Bericht versturen
      </button>
      <p className={styles.demoNote}>
        Demo: dit formulier verstuurt geen echte gegevens.
      </p>
    </form>
  );
}
