// Afspraken zijn dag-gebonden; alle datums worden bekeken door de bril van
// de tijdzone van het consulaat, ongeacht waar de server of bezoeker staat.
export const KALENDER_TIJDZONE = "Europe/Amsterdam";

// Kalenderdag (YYYY-MM-DD) van een tijdstip, in de consulaat-tijdzone.
// ("sv-SE" is een trucje: de Zweedse notatie is exact YYYY-MM-DD.)
export const kalenderdag = (waarde: string | Date): string =>
  new Date(waarde).toLocaleDateString("sv-SE", { timeZone: KALENDER_TIJDZONE });
