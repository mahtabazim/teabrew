export const CATEGORIES = ["Tea", "Coffee", "Café"] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * Dense city centres return thousands of matches, which floods the map with
 * overlapping pins and janks the list. The nearest few are what's useful.
 */
export const MAX_RESULTS = 60;

export type Shop = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  /** Kilometres from the search centre, to two decimals. */
  distance: number;
  category: Category;
  address?: string;
  website?: string;
};

type OverpassTags = Record<string, string | undefined>;

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: OverpassTags;
};

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

function categorise(tags: OverpassTags): Category | null {
  if (tags.shop === "tea") return "Tea";
  if (tags.shop === "coffee") return "Coffee";
  if (tags.amenity === "cafe") return "Café";
  return null;
}

function formatAddress(tags: OverpassTags): string | undefined {
  const street = [tags["addr:housenumber"], tags["addr:street"]]
    .filter(Boolean)
    .join(" ");
  const parts = [street, tags["addr:city"]].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

export async function geocodePlace(
  place: string,
): Promise<{ label: string; lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not look up that place.");

  const data: { lat: string; lon: string; display_name: string }[] =
    await response.json();
  if (data.length === 0) return null;

  return {
    label: data[0].display_name,
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    if (!response.ok) return "Your location";
    const data: { display_name?: string } = await response.json();
    return data.display_name ?? "Your location";
  } catch {
    return "Your location";
  }
}

export type ShopResults = {
  shops: Shop[];
  /** Total matches before the nearest-N cap, so the UI can be honest about it. */
  total: number;
};

export async function findShops(
  lat: number,
  lon: number,
  radiusMetres: number,
): Promise<ShopResults> {
  // A union block is required: Overpass only outputs the final statement's
  // result set, so separate queries would silently discard all but the last.
  const query = `
    [out:json][timeout:25];
    (
      node["shop"~"^(tea|coffee)$"](around:${radiusMetres},${lat},${lon});
      way["shop"~"^(tea|coffee)$"](around:${radiusMetres},${lat},${lon});
      node["amenity"="cafe"](around:${radiusMetres},${lat},${lon});
      way["amenity"="cafe"](around:${radiusMetres},${lat},${lon});
    );
    out center tags;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (response.status === 429 || response.status === 504) {
    throw new Error(
      "The OpenStreetMap search is busy right now. Give it a moment and try again.",
    );
  }
  if (!response.ok) throw new Error("Could not load nearby shops.");

  const data: { elements: OverpassElement[] } = await response.json();

  const all = data.elements
    .map((element): Shop | null => {
      const tags = element.tags ?? {};
      const category = categorise(tags);
      const position = element.center ?? { lat: element.lat, lon: element.lon };
      if (!category || position.lat == null || position.lon == null) return null;
      // An unnamed OSM node can't be recognised on arrival, so it's noise here.
      if (!tags.name) return null;

      return {
        id: element.id,
        name: tags.name,
        lat: position.lat,
        lon: position.lon,
        distance: calculateDistance(lat, lon, position.lat, position.lon),
        category,
        address: formatAddress(tags),
        website: tags.website,
      };
    })
    .filter((shop): shop is Shop => shop !== null)
    .sort((a, b) => a.distance - b.distance);

  return { shops: all.slice(0, MAX_RESULTS), total: all.length };
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("This browser can't share your location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 60_000,
    });
  });
}

export function directionsUrl(shop: Shop): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lon}`;
}
