"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./afspraak.module.css";

export type DienstOptie = {
  id: number;
  naam: string;
  slug: string;
  doorlooptijd?: string | null;
};

const STEPS = ["Dienst", "Datum & tijd", "Uw gegevens", "Bevestiging"] as const;

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

export default function AfspraakWizard({ diensten }: { diensten: DienstOptie[] }) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("dienst") ?? "";

  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(
    diensten.some((d) => d.slug === preselected) ? preselected : ""
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");

  // Beschikbare sloten voor de gekozen dag (live uit de backend)
  const [sloten, setSloten] = useState<string[]>([]);
  const [dagOpen, setDagOpen] = useState<boolean | null>(null);
  const [slotenLaden, setSlotenLaden] = useState(false);
  const [herlaad, setHerlaad] = useState(0);

  // Verzenden van de boeking
  const [verzenden, setVerzenden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [referentie, setReferentie] = useState("");

  const service = useMemo(
    () => diensten.find((d) => d.slug === serviceSlug),
    [diensten, serviceSlug]
  );

  // Minimale datum = morgen (het consulaat neemt geen boekingen voor vandaag aan)
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  // Haal de vrije sloten op zodra er een datum is (of na een herlaad-signaal)
  useEffect(() => {
    if (!date) {
      setSloten([]);
      setDagOpen(null);
      return;
    }
    let geannuleerd = false;
    setSlotenLaden(true);
    fetch(`/api/beschikbaarheid?datum=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (geannuleerd) return;
        setDagOpen(Boolean(data.open));
        const beschikbaar: string[] = Array.isArray(data.sloten) ? data.sloten : [];
        setSloten(beschikbaar);
        // Gekozen tijd wissen als die intussen niet meer vrij is
        setTime((huidig) => (beschikbaar.includes(huidig) ? huidig : ""));
      })
      .catch(() => {
        if (geannuleerd) return;
        setDagOpen(false);
        setSloten([]);
      })
      .finally(() => {
        if (!geannuleerd) setSlotenLaden(false);
      });
    return () => {
      geannuleerd = true;
    };
  }, [date, herlaad]);

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

  async function verstuur() {
    if (!service) return;
    setVerzenden(true);
    setFout(null);
    try {
      const res = await fetch("/api/afspraken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam,
          email,
          telefoon: telefoon || undefined,
          dienst: service.id,
          datum: date,
          tijdslot: time,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const top = data?.errors?.[0];
        const veldFout = top?.data?.errors?.[0];
        // slotSleutel = de database weigerde een gelijktijdige boeking van hetzelfde slot
        const slotBezet = veldFout?.path === "slotSleutel";
        const bericht: string = slotBezet
          ? "Dit tijdslot is zojuist geboekt. Kies een ander moment."
          : veldFout?.message ?? top?.message ?? "Er ging iets mis. Probeer het opnieuw.";

        // Slot net vergeven? Terug naar stap 2 (datum & tijd) met verse sloten.
        if (veldFout?.path === "tijdslot" || slotBezet) {
          setFout(bericht);
          setTime("");
          setHerlaad((n) => n + 1);
          setStep(1);
        } else {
          setFout(bericht);
        }
        return;
      }

      const data = await res.json();
      setReferentie(data.doc.referentie);
      setStep(3);
    } catch {
      setFout("Kon geen verbinding maken. Controleer uw internet en probeer het opnieuw.");
    } finally {
      setVerzenden(false);
    }
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
            {diensten.length === 0 ? (
              <p className={styles.hint}>
                Er zijn op dit moment geen diensten beschikbaar om online te
                boeken. Neem contact op met het consulaat.
              </p>
            ) : (
              <div className={styles.serviceList} role="radiogroup" aria-label="Dienst">
                {diensten.map((d) => (
                  <label
                    key={d.slug}
                    className={`${styles.serviceOption} ${
                      serviceSlug === d.slug ? styles.serviceOptionActive : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="dienst"
                      value={d.slug}
                      checked={serviceSlug === d.slug}
                      onChange={() => setServiceSlug(d.slug)}
                    />
                    <span>
                      <span className={styles.serviceName}>{d.naam}</span>
                      {d.doorlooptijd && (
                        <span className={styles.serviceMeta}>
                          Doorlooptijd: {d.doorlooptijd}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stap 2: datum & tijd */}
        {step === 1 && (
          <div className={styles.stepBody}>
            <h2 className={styles.stepTitle}>Kies een datum en tijd</h2>
            <p className={styles.stepIntro}>
              Selecteer een beschikbaar moment. Alleen vrije tijden worden
              getoond.
            </p>
            {fout && (
              <p className={styles.error} role="alert">
                {fout}
              </p>
            )}
            <div className={styles.field}>
              <label htmlFor="datum">Datum</label>
              <input
                id="datum"
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => {
                  setFout(null);
                  setDate(e.target.value);
                }}
              />
            </div>
            <fieldset className={styles.slots}>
              <legend>Beschikbare tijden</legend>
              {!date ? (
                <p className={styles.hint}>Kies eerst een datum.</p>
              ) : slotenLaden ? (
                <p className={styles.hint}>Beschikbaarheid laden…</p>
              ) : dagOpen === false ? (
                <p className={styles.hint}>
                  Het consulaat is op deze dag gesloten. Kies een andere datum.
                </p>
              ) : sloten.length === 0 ? (
                <p className={styles.hint}>
                  Alle tijden op deze dag zijn volgeboekt. Kies een andere datum.
                </p>
              ) : (
                <div className={styles.slotGrid}>
                  {sloten.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`${styles.slot} ${
                        time === slot ? styles.slotActive : ""
                      }`}
                      aria-pressed={time === slot}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </fieldset>
          </div>
        )}

        {/* Stap 3: gegevens */}
        {step === 2 && (
          <div className={styles.stepBody}>
            <h2 className={styles.stepTitle}>Uw gegevens</h2>
            <p className={styles.stepIntro}>
              Wij gebruiken deze gegevens om uw afspraak te bevestigen.
            </p>
            {fout && (
              <p className={styles.error} role="alert">
                {fout}
              </p>
            )}
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
              <label htmlFor="telefoon">Telefoonnummer (optioneel)</label>
              <input
                id="telefoon"
                type="tel"
                autoComplete="tel"
                placeholder="+31 ..."
                value={telefoon}
                onChange={(e) => setTelefoon(e.target.value)}
              />
            </div>
          </div>
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
                <dd className={styles.reference}>{referentie}</dd>
              </div>
              <div>
                <dt>Dienst</dt>
                <dd>{service?.naam}</dd>
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
              Bewaar uw referentienummer. Hiermee kunt u de status van uw
              aanvraag volgen.
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
            disabled={step === 0 || verzenden}
          >
            Vorige
          </button>
          <span className={styles.stepCount}>
            Stap {step + 1} van {STEPS.length - 1}
          </span>
          {step === 2 ? (
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={verstuur}
              disabled={!canContinue || verzenden}
            >
              {verzenden ? "Bezig…" : "Afspraak bevestigen"}
            </button>
          ) : (
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={next}
              disabled={!canContinue}
            >
              Volgende
            </button>
          )}
        </div>
      )}
    </div>
  );
}
