import { NextResponse } from "next/server";
import { siteName, siteUrl } from "@/lib/site";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

/**
 * Nominatim's usage policy requires a User-Agent identifying the application.
 * A browser can't set one — User-Agent is a forbidden header for fetch — so
 * the lookup runs here, for the same reason the Overpass call does.
 */
const USER_AGENT = `${siteName} (${siteUrl})`;

const CACHE = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

/** `?q=` geocodes a place name; `?lat=&lon=` reverse-geocodes coordinates. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const place = params.get("q")?.trim();
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const hasCoords =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180;

  if (!place && !hasCoords) {
    return NextResponse.json(
      { error: "Pass either q, or lat and lon." },
      { status: 400 },
    );
  }

  const url = place
    ? `${NOMINATIM_URL}/search?format=json&limit=1&q=${encodeURIComponent(place)}`
    : `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lon}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  } catch {
    return NextResponse.json({ error: "Geocoder unreachable." }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Nominatim returned ${upstream.status}.` },
      { status: 502 },
    );
  }

  if (place) {
    const data: { lat: string; lon: string; display_name: string }[] =
      await upstream.json();
    // A place that doesn't exist is a valid answer, not an error — the caller
    // tells it apart from a failure by the null.
    if (data.length === 0) return NextResponse.json(null, { headers: CACHE });

    return NextResponse.json(
      {
        label: data[0].display_name,
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      },
      { headers: CACHE },
    );
  }

  const data: { display_name?: string } = await upstream.json();
  return NextResponse.json(
    { label: data.display_name ?? "Your location" },
    { headers: CACHE },
  );
}
