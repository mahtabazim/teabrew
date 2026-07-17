import Image from "next/image";
import Link from "next/link";
import { formatDuration, recipes } from "@/lib/recipes";

const steps = [
  {
    title: "Find it",
    body: "Search any place or share your location, and see every tea room, coffee shop and café mapped within walking distance.",
    href: "/nearby",
    cta: "Search nearby",
  },
  {
    title: "Brew it",
    body: "Six guides with the ratio, the water temperature that won't scorch it, and a timer that runs while you steep.",
    href: "/brew",
    cta: "Open the guides",
  },
  {
    title: "Keep it",
    body: "Save the spots and recipes worth returning to. Your shelf lives on your device — no account, nothing uploaded.",
    href: "/saved",
    cta: "See your shelf",
  },
];

export default function Home() {
  const featured = recipes.slice(0, 3);

  return (
    <>
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-2 lg:pt-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-brew-soft px-3 py-1 text-xs font-medium tracking-wide text-brew uppercase">
            Find it · Brew it · Keep it
          </p>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            Find tea near you, brew it right at home.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted text-pretty">
            TeaBrew maps the tea rooms and cafés around you, then hands you the
            temperature, ratio and timer to make the same cup in your own
            kitchen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/nearby"
              className="rounded-full bg-brew px-6 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.03] active:scale-95"
            >
              Find tea spots
            </Link>
            <Link
              href="/brew"
              className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium transition-colors hover:border-brew hover:text-brew"
            >
              Browse brew guides
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-8 -z-10 rounded-full bg-brew-soft blur-3xl"
          />
          <Image
            src="/assets/teatable.png"
            alt="Two people sharing tea at a table"
            width={549}
            height={430}
            priority
            className="w-full"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="font-display text-sm font-semibold text-brew tabular-nums"
              >
                0{index + 1}
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {step.title}
              </h2>
              <p className="mt-3 flex-1 leading-relaxed text-muted text-pretty">
                {step.body}
              </p>
              <Link
                href={step.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brew transition-transform hover:gap-2.5"
              >
                {step.cta} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Start with these three
            </h2>
            <p className="mt-3 leading-relaxed text-muted text-pretty">
              No special equipment, nothing you can&apos;t find in a corner shop.
            </p>
          </div>
          <Link
            href="/brew"
            className="text-sm font-semibold text-brew transition-transform hover:translate-x-0.5"
          >
            All six guides <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/brew/${recipe.slug}`}
              className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brew/40 hover:shadow-lg"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-surface-alt">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-brew">
                  {recipe.name}
                </h3>
                <p className="mt-1 text-sm text-muted tabular-nums">
                  {recipe.tempC} °C · {formatDuration(recipe.steepSeconds)} steep
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
