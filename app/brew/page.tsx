import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatDuration, recipes } from "@/lib/recipes";

const description =
  "Six tea recipes with real ratios, water temperatures and a built-in steeping timer.";

export const metadata: Metadata = {
  title: "Brew guides",
  description,
  alternates: { canonical: "/brew" },
  openGraph: {
    type: "website",
    title: "Brew guides · TeaBrew",
    description,
    url: "/brew",
  },
};

export default function BrewPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-brew uppercase">
          Brew guides
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Good tea is mostly temperature and time
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
          Every guide below gives you the ratio, the water temperature that
          won&apos;t scorch it, and a timer that runs while you brew.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Link
            key={recipe.slug}
            href={`/brew/${recipe.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brew/40 hover:shadow-lg"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-surface-alt">
              <Image
                src={recipe.image}
                alt={recipe.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 right-3 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur-sm">
                {recipe.caffeine === "None" ? "Caffeine-free" : `${recipe.caffeine} caffeine`}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-display text-xl font-semibold transition-colors group-hover:text-brew">
                {recipe.name}
              </h2>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                {recipe.subtitle}
              </p>
              <dl className="mt-4 flex items-center gap-4 border-t border-line pt-4 text-xs text-muted">
                <div>
                  <dt className="sr-only">Water temperature</dt>
                  <dd className="font-medium text-ink">{recipe.tempC} °C</dd>
                </div>
                <div>
                  <dt className="sr-only">Steep time</dt>
                  <dd className="font-medium text-ink tabular-nums">
                    {formatDuration(recipe.steepSeconds)}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Strength</dt>
                  <dd>{recipe.strength}</dd>
                </div>
              </dl>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
