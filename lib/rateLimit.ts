// Eenvoudige rate limiter in het geheugen van het serverproces.
// Volstaat voor één server met SQLite; bij meerdere instanties is een
// gedeelde opslag (bv. Redis) nodig.
const pogingen = new Map<string, number[]>();

// true = toegestaan (en geteld), false = limiet bereikt
export function binnenLimiet(
  sleutel: string,
  max: number,
  vensterMs: number
): boolean {
  const nu = Date.now();
  const recent = (pogingen.get(sleutel) ?? []).filter((t) => nu - t < vensterMs);

  // Opruimen zodat de Map niet eindeloos groeit
  if (pogingen.size > 10_000) {
    for (const [k, tijden] of pogingen) {
      if (tijden.every((t) => nu - t >= vensterMs)) pogingen.delete(k);
    }
  }

  if (recent.length >= max) {
    pogingen.set(sleutel, recent);
    return false;
  }
  recent.push(nu);
  pogingen.set(sleutel, recent);
  return true;
}

// IP-adres van de bezoeker. Neemt het LAATSTE adres uit X-Forwarded-For:
// dat is het adres dat de dichtstbijzijnde proxy (Caddy/nginx) zelf heeft
// gezien. Eerdere adressen in de header kan de bezoeker zelf verzinnen.
export function clientIp(headers: Headers): string {
  const doorgestuurd = headers.get("x-forwarded-for");
  const laatste = doorgestuurd?.split(",").pop()?.trim();
  return laatste || headers.get("x-real-ip") || "onbekend";
}
