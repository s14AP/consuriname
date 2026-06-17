"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { services } from "../lib/services";
import styles from "./afspraak.module.css";

const STEPS = ["Dienst", "Datum & tijd", "Uw gegevens", "Bevestiging"] as const;

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "13:30",
  "14:00",
  "14:30",
];

function makeReference() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `SR-2026-${n}`;
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value + "T00:00:00");
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AfspraakWizard() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("dienst") ?? "";

  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(
    services.some((s) => s.slug === preselected) ? preselected : ""
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [reference] = useState(makeReference);

  const service = useMemo(
    () => services.find((s) => s.slug === serviceSlug),
    [serviceSlug]
  );

  // Minimale datum = morgen
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const canContinue =
    (step === 0 && !!serviceSlug) ||
    (step === 1 && !!date && !!time) ||
    (step === 2 && naam.trim() !== "" && email.trim() !== "");

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canContinue) next(); // naar bevestiging
  }

  return (
    <div className={styles.wizard}>
      {/* Stappen-indicator */}
      <ol className={styles.stepper} aria-label="Voortgang">
        {STEPS.map((label, index) => {
          const state =
            index < step ? "done" : index === step ? "current" : "upcoming";
          return (
            <li
              key={label}
              className={`${styles.stepItem} ${styles[state]}`}
              aria-current={index === step ? "step" : undefined}
            >
              <span className={styles.stepDot}>
                {index < step ? "✓" : index + 1}
              </span>
              <span className={styles.stepLabel}>{label}</span>
            </li>
          );
        })}
      </ol>

      <div className={styles.panel}>
        {/* Stap 1: dienst kiezen */}
        {step === 0 && (
          <div className={styles.stepBody}>
            <h2 className={styles.stepTitle}>Voor welke dienst maakt u een afspraak?</h2>
            <p className={styles.stepIntro}>
              Kies de dienst waarvoor u langs wilt komen op het consulaat in Den
              Haag.
            </p>
            <div className={styles.serviceList} role="radiogroup" aria-label="Dienst">
              {services.map((s) => (
                <label
                  key={s.slug}
                  className={`${styles.serviceOption} ${
                    serviceSlug === s.slug ? styles.serviceOptionActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="dienst"
                    value={s.slug}
                    checked={serviceSlug === s.slug}
                    onChange={() => setServiceSlug(s.slug)}
                  />
                  <span className={styles.serviceIcon} aria-hidden="true">
                    {s.icon}
                  </span>
                  <span>
                    <span className={styles.serviceName}>{s.title}</span>
                    <span className={styles.serviceMeta}>{s.summary}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Stap 2: datum & tijd */}
        {step === 1 && (
          <div className={styles.stepBody}>
            <h2 className={styles.stepTitle}>Kies een datum en tijd</h2>
            <p className={styles.stepIntro}>
              Selecteer een beschikbaar moment. (Demo: alle tijden zijn fictief.)
            </p>
            <div className={styles.field}>
              <label htmlFor="datum">Datum</label>
              <input
                id="datum"
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <fieldset className={styles.slots}>
              <legend>Beschikbare tijden</legend>
              <div className={styles.slotGrid}>
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`${styles.slot} ${
                      time === slot ? styles.slotActive : ""
                    }`}
                    aria-pressed={time === slot}
                    onClick={() => setTime(slot)}
                    disabled={!date}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {!date && (
                <p className={styles.hint}>Kies eerst een datum.</p>
              )}
            </fieldset>
          </div>
        )}

        {/* Stap 3: gegevens */}
        {step === 2 && (
          <form className={styles.stepBody} onSubmit={handleSubmit} noValidate>
            <h2 className={styles.stepTitle}>Uw gegevens</h2>
            <p className={styles.stepIntro}>
              Wij gebruiken deze gegevens om uw afspraak te bevestigen.
            </p>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="naam">Volledige naam</label>
                <input
                  id="naam"
                  type="text"
                  required
                  autoComplete="name"
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">E-mailadres</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="telefoon">Telefoonnummer</label>
              <input
                id="telefoon"
                type="tel"
                autoComplete="tel"
                placeholder="+31 ..."
                value={telefoon}
                onChange={(e) => setTelefoon(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.hiddenSubmit} aria-hidden="true" tabIndex={-1} />
          </form>
        )}

        {/* Stap 4: bevestiging */}
        {step === 3 && (
          <div className={`${styles.stepBody} ${styles.confirm}`}>
            <span className={styles.confirmIcon} aria-hidden="true">
              ✓
            </span>
            <h2 className={styles.stepTitle}>Uw afspraak is aangevraagd</h2>
            <p className={styles.stepIntro}>
              Bedankt{naam ? `, ${naam}` : ""}. U ontvangt een bevestiging per
              e-mail{email ? ` op ${email}` : ""}.
            </p>

            <dl className={styles.summary}>
              <div>
                <dt>Referentienummer</dt>
                <dd className={styles.reference}>{reference}</dd>
              </div>
              <div>
                <dt>Dienst</dt>
                <dd>{service?.title}</dd>
              </div>
              <div>
                <dt>Datum &amp; tijd</dt>
                <dd>
                  {formatDate(date)}
                  {time ? ` om ${time}` : ""}
                </dd>
              </div>
              <div>
                <dt>Locatie</dt>
                <dd>Consulaat van Suriname, Surinamestraat 1, Den Haag</dd>
              </div>
            </dl>

            <p className={styles.demoNote}>
              Demo: er is geen echte afspraak ingepland of opgeslagen. Bewaar uw
              referentienummer om de status te volgen.
            </p>
            <div className={styles.confirmActions}>
              <Link href="/aanvraag-volgen" className={styles.btnPrimary}>
                Aanvraag volgen
              </Link>
              <Link href="/diensten" className={styles.btnSecondary}>
                Terug naar diensten
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigatieknoppen (niet op bevestiging) */}
      {step < 3 && (
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={back}
            disabled={step === 0}
          >
            Vorige
          </button>
          <span className={styles.stepCount}>
            Stap {step + 1} van {STEPS.length - 1}
          </span>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={next}
            disabled={!canContinue}
          >
            {step === 2 ? "Afspraak bevestigen" : "Volgende"}
          </button>
        </div>
      )}
    </div>
  );
}
