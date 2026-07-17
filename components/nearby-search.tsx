"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import ShopCard from "@/components/shop-card";
import {
  CATEGORIES,
  MAX_RESULTS,
  findShops,
  geocodePlace,
  getCurrentPosition,
  reverseGeocode,
  type Category,
  type Shop,
} from "@/lib/shops";

// Leaflet touches `window` on import, so it can never render on the server.
const ShopMap = dynamic(() => import("@/components/shop-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] w-full animate-pulse rounded-2xl bg-surface-alt" />
  ),
});

const RADII = [
  { label: "1 km", value: 1000 },
  { label: "2 km", value: 2000 },
  { label: "5 km", value: 5000 },
];

type Status = "idle" | "locating" | "loading" | "ready" | "error";

export default function NearbySearch() {
  const [query, setQuery] = useState("");
  const [centre, setCentre] = useState<[number, number] | null>(null);
  const [placeLabel, setPlaceLabel] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [total, setTotal] = useState(0);
  const [radius, setRadius] = useState(2000);
  const [filters, setFilters] = useState<Category[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const run = useCallback(
    async (lat: number, lon: number, label: string, metres: number) => {
      setStatus("loading");
      setError("");
      setCentre([lat, lon]);
      setPlaceLabel(label);
      try {
        const results = await findShops(lat, lon, metres);
        setShops(results.shops);
        setTotal(results.total);
        setStatus("ready");
      } catch (err) {
        setShops([]);
        setTotal(0);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    },
    [],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const place = query.trim();
    if (!place) {
      setStatus("error");
      setError("Type a place name to search around.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const match = await geocodePlace(place);
      if (!match) {
        setStatus("error");
        setError(`We couldn't find "${place}". Try a nearby town or postcode.`);
        return;
      }
      await run(match.lat, match.lon, match.label, radius);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  async function handleUseLocation() {
    setStatus("locating");
    setError("");
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const label = await reverseGeocode(latitude, longitude);
      setQuery("");
      await run(latitude, longitude, label, radius);
    } catch (err) {
      setStatus("error");
      const message =
        err instanceof GeolocationPositionError && err.code === err.PERMISSION_DENIED
          ? "Location permission was declined — search by name instead."
          : err instanceof Error
            ? err.message
            : "Couldn't get your location.";
      setError(message);
    }
  }

  // Re-running on radius change only makes sense once we have somewhere to look.
  async function handleRadius(metres: number) {
    setRadius(metres);
    if (centre) await run(centre[0], centre[1], placeLabel, metres);
  }

  function toggleFilter(category: Category) {
    setFilters((current) =>
      current.includes(category)
        ? current.filter((entry) => entry !== category)
        : [...current, category],
    );
  }

  const visible = useMemo(
    () =>
      filters.length === 0
        ? shops
        : shops.filter((shop) => filters.includes(shop.category)),
    [shops, filters],
  );

  const counts = useMemo(() => {
    const tally = {} as Record<Category, number>;
    for (const category of CATEGORIES) tally[category] = 0;
    for (const shop of shops) tally[shop.category] += 1;
    return tally;
  }, [shops]);

  const busy = status === "loading" || status === "locating";

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-brew uppercase">
          Nearby
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Find a good cup near you
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
          Search any place or use your location. Save the spots worth returning
          to — they&apos;ll be on your shelf next time.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <input
              type="search"
              id="place"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a city, area or postcode…"
              aria-label="Place to search around"
              className="w-full rounded-full border border-line bg-surface py-3 pr-4 pl-11 text-base transition-colors placeholder:text-muted focus:border-brew focus:outline-none"
            />
            <svg
              className="absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-brew px-6 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
          >
            {status === "loading" ? "Searching…" : "Search"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleUseLocation}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium transition-colors hover:border-brew hover:text-brew disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2v3M12 19v3M22 12h-3M5 12H2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          {status === "locating" ? "Locating…" : "Use my location"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs tracking-wide text-muted uppercase">Within</span>
        {RADII.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleRadius(option.value)}
            disabled={busy}
            aria-pressed={radius === option.value}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
              radius === option.value
                ? "bg-brew-soft text-brew"
                : "text-muted hover:bg-surface-alt hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-line bg-surface-alt px-4 py-3 text-sm text-ink"
        >
          {error}
        </p>
      )}

      {status === "idle" && !error && (
        <div className="mt-14 rounded-2xl border border-dashed border-line py-20 text-center">
          <p className="font-display text-xl font-semibold">Nothing to show yet</p>
          <p className="mx-auto mt-2 max-w-sm text-muted text-pretty">
            Search a place above, or let the browser share your location, and
            we&apos;ll map the tea within walking distance.
          </p>
        </div>
      )}

      {centre && (
        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl font-semibold">
              {status === "loading"
                ? "Looking around…"
                : status === "error"
                  ? "Couldn't load spots"
                  : `${visible.length} ${visible.length === 1 ? "spot" : "spots"} found`}
            </h2>
            {placeLabel && status !== "loading" && (
              <p className="max-w-md truncate text-sm text-muted" title={placeLabel}>
                {total > MAX_RESULTS
                  ? `nearest ${MAX_RESULTS} of ${total} near `
                  : "near "}
                {placeLabel}
              </p>
            )}
          </div>

          {shops.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.filter((category) => counts[category] > 0).map((category) => {
                const active = filters.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleFilter(category)}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-brew bg-brew-soft text-brew"
                        : "border-line text-muted hover:border-brew hover:text-brew"
                    }`}
                  >
                    {category}
                    <span className="ml-1.5 text-xs tabular-nums opacity-70">
                      {counts[category]}
                    </span>
                  </button>
                );
              })}
              {filters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters([])}
                  className="rounded-full px-3 py-1.5 text-sm text-muted underline underline-offset-4 hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-2xl border border-line">
            <ShopMap center={centre} shops={visible} />
          </div>

          {status === "loading" ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-2xl border border-line bg-surface-alt"
                />
              ))}
            </div>
          ) : visible.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          ) : (
            status === "ready" && (
              <div className="mt-8 rounded-2xl border border-dashed border-line py-16 text-center">
                <p className="font-display text-lg font-semibold">
                  {shops.length === 0
                    ? "No tea spots mapped here yet"
                    : "Nothing matches those filters"}
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted text-pretty">
                  {shops.length === 0
                    ? "OpenStreetMap has no cafés tagged within this radius. Try widening it to 5 km."
                    : "Clear a filter to see the rest of what's nearby."}
                </p>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
}
