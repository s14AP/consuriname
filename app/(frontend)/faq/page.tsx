import type { Metadata } from "next";
import Link from "next/link";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden op veelgestelde vragen over paspoorten, visa, afspraken en legalisatie bij het consulaat van Suriname.",
};

type FaqCategory = {
  title: string;
  items: { question: string; answer: string }[];
};

const categories: FaqCategory[] = [
  {
    title: "Algemeen",
    items: [
      {
        question: "Waar bevindt het consulaat zich?",
        answer:
          "Het consulaat is gevestigd aan de Surinamestraat 1, 2585 GJ Den Haag. De openingstijden vindt u op de contactpagina.",
      },
      {
        question: "Moet ik altijd een afspraak maken?",
        answer:
          "Voor sommige diensten, zoals een paspoortaanvraag, is een afspraak verplicht. Voor andere diensten kunt u ook langskomen of per post indienen. Bij elke dienst staat aangegeven of een afspraak nodig is.",
      },
      {
        question: "In welke talen kan ik geholpen worden?",
        answer:
          "U kunt bij het consulaat in het Nederlands en het Engels terecht.",
      },
    ],
  },
  {
    title: "Paspoort & reisdocumenten",
    items: [
      {
        question: "Hoelang duurt een paspoortaanvraag?",
        answer:
          "Reken op 4 tot 6 weken. U ontvangt bericht zodra uw paspoort klaarligt om af te halen.",
      },
      {
        question: "Kan iemand anders mijn paspoort ophalen?",
        answer:
          "Ja, met een ondertekende machtiging en een kopie van uw identiteitsbewijs.",
      },
      {
        question: "Mijn paspoort is gestolen, wat moet ik doen?",
        answer:
          "Doe eerst aangifte bij de politie en neem het proces-verbaal mee naar uw afspraak op het consulaat.",
      },
    ],
  },
  {
    title: "Afspraken",
    items: [
      {
        question: "Hoe maak ik een afspraak?",
        answer:
          "Gebruik de knop ‘Afspraak maken’. U kiest een dienst, datum en tijd en vult uw gegevens in. U ontvangt een referentienummer ter bevestiging.",
      },
      {
        question: "Kan ik mijn afspraak wijzigen of annuleren?",
        answer:
          "Ja. Neem contact op via telefoon of e-mail met uw referentienummer, dan plannen wij uw afspraak om.",
      },
      {
        question: "Wat moet ik meenemen naar mijn afspraak?",
        answer:
          "Dat hangt af van de dienst. Op elke dienstpagina staat een overzicht van de benodigde documenten onder ‘Wat heeft u nodig?’.",
      },
    ],
  },
  {
    title: "Legalisatie & documenten",
    items: [
      {
        question: "Welke documenten kan ik laten legaliseren?",
        answer:
          "Onder meer diploma’s, geboorteakten, volmachten en handelsdocumenten. Sommige documenten moeten eerst door een notaris of ministerie bekrachtigd zijn.",
      },
      {
        question: "Legaliseren jullie ook vertalingen?",
        answer:
          "Ja, mits de vertaling door een beëdigd vertaler is opgesteld.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div>
      <section className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Kruimelpad">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Veelgestelde vragen</span>
          </nav>
          <h1 className={styles.title}>Veelgestelde vragen</h1>
          <p className={styles.intro}>
            Hieronder vindt u antwoorden op de vragen die wij het vaakst krijgen.
            Staat uw vraag er niet bij? Neem gerust contact met ons op.
          </p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        {categories.map((category) => (
          <section key={category.title} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category.title}</h2>
            <div className={styles.list}>
              {category.items.map((item) => (
                <details key={item.question} className={styles.item}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className={styles.contactCard}>
          <div>
            <h2>Staat uw vraag er niet bij?</h2>
            <p>Ons team helpt u graag verder.</p>
          </div>
          <Link href="/contact" className={styles.contactBtn}>
            Contact opnemen
          </Link>
        </div>
      </div>
    </div>
  );
}
