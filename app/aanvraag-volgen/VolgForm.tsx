"use client";

import { useState, type FormEvent } from "react";
import styles from "./volgen.module.css";

const STATUSES = [
  {
    title: "Aanvraag ontvangen",
    description: "Wij hebben uw aanvraag in goede orde ontvangen.",
  },
  {
    title: "In behandeling",
    description: "Uw aanvraag wordt momenteel beoordeeld door het consulaat.",
  },
  {
    title: "Documenten gecontroleerd",
    description: "Uw documenten zijn gecontroleerd en goedgekeurd.",
  },
  {
    title: "Klaar",
    description:
      "Uw document ligt klaar of uw afspraak is bevestigd. U ontvangt hierover bericht.",
  },
];

// Demo: leid een 'status' deterministisch af uit het referentienummer,
// zodat hetzelfde nummer steeds dezelfde status toont.
function deriveStep(reference: string) {
  const sum = reference
    .toUpperCase()
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return sum % STATUSES.length;
}

export default function VolgForm() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<{
    reference: string;
    step: number;
  } | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = reference.trim();
    if (trimmed.length < 4) {
      setError("Voer een geldig referentienummer in (bijv. SR-2026-12345).");
      setResult(null);
      return;
    }
    setError("");
    setResult({ reference: trimmed.toUpperCase(), step: deriveStep(trimmed) });
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="ref">Referentienummer</label>
          <input
            id="ref"
            type="text"
            placeholder="SR-2026-12345"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            aria-invalid={!!error}
          />
          <p className={styles.fieldHint}>
            Dit nummer vindt u in de bevestiging van uw afspraak of aanvraag.
          </p>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Status opzoeken
        </button>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className={styles.result} aria-live="polite">
          <div className={styles.resultHead}>
            <div>
              <span className={styles.resultLabel}>Referentie</span>
              <span className={styles.resultRef}>{result.reference}</span>
            </div>
            <span className={styles.statusBadge}>
              {STATUSES[result.step].title}
            </span>
          </div>

          <ol className={styles.timeline}>
            {STATUSES.map((status, index) => {
              const state =
                index < result.step
                  ? "done"
                  : index === result.step
                  ? "current"
                  : "upcoming";
              return (
                <li
                  key={status.title}
                  className={`${styles.tlItem} ${styles[state]}`}
                >
                  <span className={styles.tlDot} aria-hidden="true">
                    {index <= result.step ? "✓" : ""}
                  </span>
                  <div>
                    <h3 className={styles.tlTitle}>{status.title}</h3>
                    <p className={styles.tlText}>{status.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className={styles.demoNote}>
            Demo: dit is een fictieve status ter illustratie. Er wordt geen echte
            aanvraag opgezocht.
          </p>
        </div>
      )}
    </div>
  );
}
