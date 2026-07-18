import { NextResponse } from "next/server";
import {
  buildOverpassQuery,
  parseOverpassElements,
  type OverpassElement,
} from "@/lib/shops";
import { siteName, siteUrl } from "@/lib/site";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const RETRY_STATUSES = new Set([406, 429, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

/** Bounds our exposure as an open proxy, and keeps queries cheap for Overpass. */
const MAX_RADIUS_METRES = 10_000;

/**
 * Overpass fails intermittently under load, and its Apache error pages carry no
 * CORS headers — so a browser calling it directly reads every hiccup as an
 * opaque CORS error. Proxying makes the real status visible and lets a
 * transient failure be retried before the user ever sees it.
 */
async function queryOverpass(query: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Overpass asks clients to identify themselves, and a browser can't:
        // User-Agent is a forbidden header for fetch.
        "User-Agent": `${siteName} (${siteUrl})`,
      },
      body: new URLSearchParams({ data: query }),
    });

    if (!RETRY_STATUSES.has(response.status)) return response;
    if (attempt === MAX_ATTEMPTS - 1) return response;
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const radius = Number(searchParams.get("radius"));

  // NaN fails every comparison, so missing and malformed params are caught here.
  const valid =
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180 &&
    radius > 0 &&
    radius <= MAX_RADIUS_METRES;

  if (!valid) {
    return NextResponse.json(
      { error: "lat, lon and radius (1–10000 m) are required." },
      { status: 400 },
    );
  }

  // Either way this is a 504, which the client renders as "busy, try again" —
  // the honest reading of an upstream that stayed broken across every retry.
  let upstream: Response;
  try {
    upstream = await queryOverpass(buildOverpassQuery(lat, lon, radius));
  } catch {
    return NextResponse.json({ error: "Overpass unreachable." }, { status: 504 });
  }
  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Overpass returned ${upstream.status}.` },
      { status: 504 },
    );
  }

  const { elements = [] }: { elements?: OverpassElement[] } =
    await upstream.json();

  return NextResponse.json(parseOverpassElements(elements, lat, lon), {
    // Cafés move on the order of months; caching keeps repeat searches off a
    // service that is visibly struggling.
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
