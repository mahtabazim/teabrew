# TeaBrew

Find tea rooms, coffee shops and cafés around you, and brew them properly at home with timed, temperature-accurate recipes.

A Next.js app with three parts:

- **Nearby** (`/nearby`) — search any place name or share your location, and see every tea room, coffee shop and café mapped within walking distance.
- **Brew** (`/brew`) — six recipe guides, each with a ratio, a water temperature, and a countdown timer that runs while you steep.
- **Saved** (`/saved`) — a shelf of the shops and recipes worth returning to. Stored in `localStorage`; no account, nothing uploaded.

## Running it

```bash
npm install
npm run dev
```

The dev server comes up on http://localhost:3000.

Other scripts: `npm run build` (production build), `npm start` (serve the build), `npm run lint`.

## Configuration

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used for metadata, the sitemap, and `robots.txt`. It falls back to `http://localhost:3000`, which is fine for development but must be set to the real origin in any deployed environment — otherwise canonical URLs and Open Graph tags will point at localhost.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## How the map works

Nearby search runs entirely against public OpenStreetMap services from the browser — there are no API keys and no backend:

- [Nominatim](https://nominatim.openstreetmap.org) geocodes a typed place name, and reverse-geocodes coordinates when you share your location.
- [Overpass](https://overpass-api.de) returns the cafés, tea rooms and coffee shops near that point. Results are sorted by distance and capped at 60 (`MAX_RESULTS` in `lib/shops.ts`) — dense city centres return thousands of matches, which floods the map with overlapping pins.
- Tiles come from the OpenStreetMap tile server, rendered through Leaflet and `react-leaflet`.

These are free, shared, rate-limited services. If you deploy this somewhere with real traffic, expect to need your own Overpass instance or a commercial geocoder.

## Layout

```
app/          Routes: /, /nearby, /brew, /brew/[slug], /saved, plus sitemap, robots and OG images
components/   Header, footer, shop card, map, brew timer, saved shelf, search
lib/
  shops.ts    Nominatim + Overpass queries, distance maths, the Shop type
  recipes.ts  The six recipes, as data
  saved.ts    localStorage store, read via useSyncExternalStore
  site.ts     Site name, description, canonical URL
public/assets Recipe photography and icons
```

Recipes live in `lib/recipes.ts` as plain data — slug, temperature, steep seconds, ingredients, steps. Adding one there gives it a page at `/brew/<slug>`, a card on the index, and its own Open Graph image, with no other changes.

`next.config.ts` keeps redirects from the old static site (`/ingredients`, `/ingredient.html`, `/nearby.html`, `/index.html`) pointing at their current routes.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Leaflet.
