"use client";

import { toggleShop, useSaved } from "@/lib/saved";
import { directionsUrl, type Shop } from "@/lib/shops";

export default function ShopCard({ shop }: { shop: Shop }) {
  const saved = useSaved();
  const isSaved = saved.shops.some((entry) => entry.id === shop.id);

  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brew/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold" title={shop.name}>
            {shop.name}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-surface-alt px-2 py-0.5 font-medium">
              {shop.category}
            </span>
            <span className="tabular-nums">{shop.distance} km away</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => toggleShop(shop)}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${shop.name} from shelf` : `Save ${shop.name} to shelf`}
          className={`shrink-0 rounded-full p-2 transition-colors ${
            isSaved
              ? "text-brew"
              : "text-muted hover:bg-surface-alt hover:text-brew"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21s-7.5-4.9-9.5-9.3C1 8.4 2.8 5 6.2 5c2 0 3.3 1.1 4 2.1L12 9l1.8-1.9C14.5 6.1 15.8 5 17.8 5c3.4 0 5.2 3.4 3.7 6.7C19.5 16.1 12 21 12 21z"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {shop.address && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
          {shop.address}
        </p>
      )}

      <div className="mt-auto flex items-center gap-2 pt-5">
        <a
          href={directionsUrl(shop)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-brew px-4 py-2 text-sm font-semibold text-cream transition-transform hover:scale-[1.03] active:scale-95"
        >
          Directions
        </a>
        {shop.website && (
          <a
            href={shop.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-brew hover:text-brew"
          >
            Website
          </a>
        )}
      </div>
    </article>
  );
}
