/*
  Hardcoded dienstendata voor de demo.
  Geen backend: dit is statische voorbeeldinhoud met nette placeholderteksten.
  Later kan dit vervangen worden door een CMS of API.
*/

export type ServiceStep = {
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  title: string;
  /** Korte samenvatting voor kaarten en overzichten */
  summary: string;
  /** Categorie voor groepering in het overzicht */
  category: "Reizen & documenten" | "Burgerzaken" | "Legalisatie" | "Zakelijk";
  /** Pad naar de icoon-afbeelding in /public (bijv. "/passport.png") */
  icon: string;
  /** Indicatie van doorlooptijd */
  processingTime: string;
  /** Indicatie van kosten */
  cost: string;
  /** Of er een afspraak voor nodig is */
  appointmentRequired: boolean;
  /** Langere intro op de detailpagina */
  intro: string;
  /** Benodigde documenten */
  requiredDocuments: string[];
  /** Stappenplan */
  steps: ServiceStep[];
  /** Veelgestelde vragen */
  faq: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "paspoort-aanvragen",
    title: "Paspoort aanvragen",
    summary:
      "Vraag een nieuw Surinaams paspoort aan of verleng een verlopen reisdocument.",
    category: "Reizen & documenten",
    icon: "/passport.png",
    processingTime: "4 tot 6 weken",
    cost: "€ 75 (volwassene) / € 55 (kind)",
    appointmentRequired: true,
    intro:
      "Een Surinaams paspoort vraagt u in persoon aan op het consulaat. Tijdens de afspraak worden uw vingerafdrukken en pasfoto gecontroleerd. Hieronder vindt u welke documenten u meeneemt en hoe de aanvraag verloopt.",
    requiredDocuments: [
      "Volledig ingevuld aanvraagformulier (ontvangt u bij de afspraak)",
      "Uw huidige of verlopen paspoort, of een geldig identiteitsbewijs",
      "Recente pasfoto die voldoet aan de paspoorteisen",
      "Bewijs van inschrijving in Suriname of nationaliteitsbewijs",
      "Bij kinderen: schriftelijke toestemming van beide ouders",
    ],
    steps: [
      {
        title: "Maak een afspraak",
        description:
          "Plan online een afspraak op het consulaat. Een paspoortaanvraag kan niet per post.",
      },
      {
        title: "Verzamel uw documenten",
        description:
          "Zorg dat u alle benodigde documenten compleet meeneemt naar de afspraak.",
      },
      {
        title: "Bezoek het consulaat",
        description:
          "Tijdens de afspraak controleren we uw gegevens en nemen we biometrische gegevens op.",
      },
      {
        title: "Betaal de leges",
        description:
          "U betaalt de kosten van de aanvraag aan de balie (pin of contant).",
      },
      {
        title: "Ontvang uw paspoort",
        description:
          "U krijgt bericht zodra uw paspoort klaarligt om af te halen of wordt verzonden.",
      },
    ],
    faq: [
      {
        question: "Kan iemand anders mijn paspoort ophalen?",
        answer:
          "Ja, met een ondertekende machtiging en een kopie van uw identiteitsbewijs.",
      },
      {
        question: "Mijn paspoort is gestolen, wat nu?",
        answer:
          "Doe eerst aangifte bij de lokale politie en neem het proces-verbaal mee naar uw afspraak.",
      },
    ],
  },
  {
    slug: "visum-aanvragen",
    title: "Visum aanvragen",
    summary:
      "Een visum voor toeristisch, zakelijk of familiebezoek aan Suriname.",
    category: "Reizen & documenten",
    icon: "/travel.png",
    processingTime: "5 tot 10 werkdagen",
    cost: "Vanaf € 45, afhankelijk van het type visum",
    appointmentRequired: false,
    intro:
      "Reizigers met de Nederlandse nationaliteit hebben voor een bezoek aan Suriname doorgaans een toeristenkaart of visum nodig. Het type hangt af van het doel en de duur van uw verblijf.",
    requiredDocuments: [
      "Geldig paspoort (minimaal 6 maanden geldig na vertrek)",
      "Ingevuld visumaanvraagformulier",
      "Eén recente pasfoto",
      "Bevestiging van verblijf (hotel of uitnodiging)",
      "Retourticket of reisschema",
    ],
    steps: [
      {
        title: "Kies het juiste visum",
        description:
          "Bepaal of u een toeristenkaart, toeristenvisum of zakenvisum nodig heeft.",
      },
      {
        title: "Vul het formulier in",
        description:
          "Vul het aanvraagformulier volledig in en voeg de gevraagde bijlagen toe.",
      },
      {
        title: "Dien uw aanvraag in",
        description:
          "Lever uw aanvraag in aan de balie of per post, samen met uw paspoort.",
      },
      {
        title: "Ontvang uw visum",
        description:
          "Na goedkeuring ontvangt u uw visum of toeristenkaart terug.",
      },
    ],
    faq: [
      {
        question: "Hoelang mag ik met een toeristenkaart blijven?",
        answer:
          "Een toeristenkaart is doorgaans geldig voor een verblijf van maximaal 90 dagen.",
      },
    ],
  },
  {
    slug: "legalisatie-documenten",
    title: "Legalisatie van documenten",
    summary: "Laat officiële documenten legaliseren voor gebruik in Suriname.",
    category: "Legalisatie",
    icon: "/stamp.png",
    processingTime: "3 tot 5 werkdagen",
    cost: "€ 25 per document",
    appointmentRequired: false,
    intro:
      "Documenten zoals diploma's, geboorteakten of volmachten moeten soms gelegaliseerd worden voordat ze in Suriname rechtsgeldig zijn. Het consulaat bevestigt de echtheid van de handtekening en het stempel.",
    requiredDocuments: [
      "Het originele document dat gelegaliseerd moet worden",
      "Een kopie van het document",
      "Geldig identiteitsbewijs van de aanvrager",
      "Indien van toepassing: voorafgaande legalisatie door de bevoegde instantie",
    ],
    steps: [
      {
        title: "Controleer de voorbereiding",
        description:
          "Sommige documenten moeten eerst door een notaris of ministerie zijn bekrachtigd.",
      },
      {
        title: "Lever het document in",
        description:
          "Breng het originele document en een kopie naar het consulaat.",
      },
      {
        title: "Betaal de leges",
        description: "U betaalt per te legaliseren document.",
      },
      {
        title: "Haal het document op",
        description:
          "Na verwerking haalt u het gelegaliseerde document weer op.",
      },
    ],
    faq: [
      {
        question: "Legaliseren jullie ook vertalingen?",
        answer: "Ja, mits de vertaling door een beëdigd vertaler is opgesteld.",
      },
    ],
  },
  {
    slug: "geboorteakte-uittreksel",
    title: "Uittreksel geboorteakte",
    summary:
      "Vraag een uittreksel of afschrift van een Surinaamse geboorteakte aan.",
    category: "Burgerzaken",
    icon: "/document.png",
    processingTime: "2 tot 4 weken",
    cost: "€ 20 per uittreksel",
    appointmentRequired: false,
    intro:
      "Heeft u een uittreksel uit de Surinaamse burgerlijke stand nodig, bijvoorbeeld voor een huwelijk, erkenning of pensioen? Het consulaat helpt u de aanvraag in te dienen bij het Centraal Bureau voor Burgerzaken in Suriname.",
    requiredDocuments: [
      "Ingevuld aanvraagformulier burgerzaken",
      "Kopie van een geldig identiteitsbewijs",
      "Bekende gegevens van de persoon op de akte (naam, geboortedatum, district)",
    ],
    steps: [
      {
        title: "Vul de aanvraag in",
        description:
          "Geef zo volledig mogelijk de gegevens van de persoon op de akte door.",
      },
      {
        title: "Dien de aanvraag in",
        description:
          "Lever het formulier in aan de balie of per post met de bijlagen.",
      },
      {
        title: "Wacht op verwerking",
        description:
          "De aanvraag wordt doorgestuurd naar Burgerzaken in Suriname.",
      },
      {
        title: "Ontvang het uittreksel",
        description: "U ontvangt bericht zodra het uittreksel beschikbaar is.",
      },
    ],
    faq: [
      {
        question: "Kan ik dit voor een familielid aanvragen?",
        answer:
          "Ja, met een machtiging en een kopie van het identiteitsbewijs van het familielid.",
      },
    ],
  },
  {
    slug: "rijbewijs-verklaring",
    title: "Verklaring rijbewijs",
    summary:
      "Een verklaring ter ondersteuning van het omwisselen van uw rijbewijs.",
    category: "Burgerzaken",
    icon: "/driver-license.png",
    processingTime: "3 tot 5 werkdagen",
    cost: "€ 30",
    appointmentRequired: false,
    intro:
      "Voor het omwisselen van een Surinaams rijbewijs in Nederland kan een ondersteunende verklaring van het consulaat gevraagd worden. Hiermee bevestigen wij de gegevens van uw rijbewijs.",
    requiredDocuments: [
      "Origineel Surinaams rijbewijs",
      "Kopie van uw rijbewijs",
      "Geldig identiteitsbewijs",
    ],
    steps: [
      {
        title: "Lever uw rijbewijs in",
        description: "Breng uw originele rijbewijs en een kopie mee.",
      },
      {
        title: "Betaal de leges",
        description: "U betaalt de kosten voor de verklaring aan de balie.",
      },
      {
        title: "Ontvang de verklaring",
        description: "U ontvangt de ondertekende verklaring na verwerking.",
      },
    ],
    faq: [],
  },
  {
    slug: "zakelijk-handelsdocumenten",
    title: "Handels- en exportdocumenten",
    summary:
      "Ondersteuning bij certificaten van oorsprong en handelsdocumenten.",
    category: "Zakelijk",
    icon: "/free-trade.png",
    processingTime: "5 werkdagen",
    cost: "Op aanvraag",
    appointmentRequired: false,
    intro:
      "Voor ondernemers die handel drijven met Suriname verzorgt het consulaat de legalisatie en bekrachtiging van handelsdocumenten, zoals certificaten van oorsprong en facturen.",
    requiredDocuments: [
      "Het originele handelsdocument",
      "Bedrijfsgegevens en uittreksel handelsregister",
      "Geldig identiteitsbewijs van de aanvrager",
    ],
    steps: [
      {
        title: "Neem contact op",
        description:
          "Stem vooraf af welke documenten u wilt laten bekrachtigen.",
      },
      {
        title: "Dien de documenten in",
        description: "Lever de originele documenten met de bijlagen in.",
      },
      {
        title: "Ontvang de bekrachtiging",
        description:
          "Na controle ontvangt u de gelegaliseerde handelsdocumenten.",
      },
    ],
    faq: [],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}
