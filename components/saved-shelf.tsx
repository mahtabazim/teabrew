"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ShopCard from "@/components/shop-card";
import { clearSaved, useSaved } from "@/lib/saved";
import { formatDuration, getRecipe } from "@/lib/recipes";

export default function SavedShelf() {
  const saved = useSaved();
  const [confirming, setConfirming] = useState(false);

  const savedRecipes = saved.recipes
    .map((slug) => getRecipe(slug))
    .filter((recipe) => recipe !== undefined);

  const total = saved.shops.length + savedRecipes.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-brew uppercase">
            Your shelf
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Everything you&apos;ve kept
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
            Saved on this device only — no account, nothing uploaded.
          </p>
        </div>

        {total > 0 &&
          (confirming ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearSaved();
                  setConfirming(false);
                }}
                className="rounded-full bg-brew px-4 py-2 text-sm font-semibold text-cream"
              >
                Clear everything
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:text-ink"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-brew hover:text-brew"
            >
              Clear shelf
            </button>
          ))}
      </header>

      {total === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-line py-20 text-center">
          <p className="font-display text-xl font-semibold">Your shelf is empty</p>
          <p className="mx-auto mt-2 max-w-sm text-muted text-pretty">
            Tap the heart on any tea spot or brew guide and it will show up here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/nearby"
              className="rounded-full bg-brew px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
            >
              Find tea nearby
            </Link>
            <Link
              href="/brew"
              className="rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-brew hover:text-brew"
            >
              Browse brew guides
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {saved.shops.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold">
                Tea spots
                <span className="ml-2 text-base font-normal text-muted tabular-nums">
                  {saved.shops.length}
                </span>
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {saved.shops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            </section>
          )}

          {savedRecipes.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold">
                Brew guides
                <span className="ml-2 text-base font-normal text-muted tabular-nums">
                  {savedRecipes.length}
                </span>
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedRecipes.map((recipe) => (
                  <Link
                    key={recipe.slug}
                    href={`/brew/${recipe.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brew/40 hover:shadow-md"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                      <Image
                        src={recipe.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold transition-colors group-hover:text-brew">
                        {recipe.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted tabular-nums">
                        {recipe.tempC} °C · {formatDuration(recipe.steepSeconds)} steep
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
