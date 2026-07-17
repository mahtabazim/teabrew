/**
 * Canonical origin for metadata, sitemap and robots.
 * Set NEXT_PUBLIC_SITE_URL in the deploy environment; localhost is only a
 * development fallback and must not ship as the canonical host.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "TeaBrew";

export const siteDescription =
  "Find tea rooms, coffee shops and cafés around you, and brew them properly at home with timed, temperature-accurate recipes.";

/** Seconds to an ISO-8601 duration, e.g. 600 -> "PT10M". Used by schema.org. */
export function toIsoDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `PT${minutes > 0 ? `${minutes}M` : ""}${seconds > 0 ? `${seconds}S` : ""}` || "PT0S";
}
